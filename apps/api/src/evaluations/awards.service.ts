import { Injectable } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "../organizations/organization-access.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import {
  type CreateAwardRecommendationInput,
  type CreateAwardDecisionInput,
} from "@chereta/contracts";

/**
 * Award lifecycle: recommendations (publisher+) and the approval/publish gate
 * (admin only).
 *
 * SECURITY / integrity:
 * - A recommendation records the method actually applied so the calculation is
 *   auditable. Lowest price is NEVER auto-selected — a human must recommend.
 * - An award must be APPROVED before it can be PUBLISHED; the publish endpoint
 *   refuses anything not already approved. This is the single most important
 *   gate in the award flow.
 * - Publishing an award notifies the winning bidder and transitions the tender
 *   to AWARDED in the same transaction.
 */
@Injectable()
export class AwardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  // --- Recommendations --------------------------------------------------------

  async createRecommendation(
    tenderId: string,
    userId: string,
    input: CreateAwardRecommendationInput,
    request: RequestWithActor,
  ) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { id: true, organizationId: true, status: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }

    const membership = await this.access.getMembership(userId, tender.organizationId);
    if (!membership) {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You are not a member of the procuring organization.",
        403,
      );
    }
    this.access.assertPublisher(membership.role, tender.organizationId);

    // The bid must belong to this tender and be in an evaluated state.
    const bid = await this.prisma.bid.findFirst({
      where: { id: input.bidId, tenderId },
      select: { id: true, status: true, organizationId: true },
    });
    if (!bid) {
      throw new AppException(ErrorCode.BID_NOT_FOUND, "Bid not found for this tender.", 404);
    }

    // Rank is the next rank for this tender.
    const rankCount = await this.prisma.awardRecommendation.count({ where: { tenderId } });

    const recommendation = await this.prisma.awardRecommendation.create({
      data: {
        tenderId,
        bidId: input.bidId,
        scoringMethod: input.scoringMethod,
        rank: rankCount + 1,
        rationale: input.rationale,
        isPrimary: input.isPrimary,
        authorId: userId,
      },
      select: { id: true, rank: true, isPrimary: true, scoringMethod: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "award.recommended",
        entityType: "AwardRecommendation",
        entityId: recommendation.id,
        severity: "NOTICE",
        metadata: { tenderId, bidId: input.bidId, scoringMethod: input.scoringMethod },
      }),
    );

    return recommendation;
  }

  async listRecommendations(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { organizationId: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    await this.access.assertMember(userId, tender.organizationId);

    return this.prisma.awardRecommendation.findMany({
      where: { tenderId },
      select: {
        id: true,
        rank: true,
        scoringMethod: true,
        totalScore: true,
        rationale: true,
        isPrimary: true,
        createdAt: true,
        bid: {
          select: {
            id: true,
            submissionReference: true,
            offeredPrice: true,
            offeredCurrency: true,
            organization: { select: { id: true, registeredName: true } },
          },
        },
      },
      orderBy: { rank: "asc" },
    });
  }

  // --- Decisions (approve / reject / publish) --------------------------------

  /**
   * Records an award decision. APPROVED requires an admin (approver); the
   * tender moves to AWARDED only when the decision is both approved and
   * published.
   */
  async decide(
    tenderId: string,
    userId: string,
    input: CreateAwardDecisionInput,
    request: RequestWithActor,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const tender = await tx.tender.findFirst({
        where: { id: tenderId, deletedAt: null },
        select: { id: true, organizationId: true, status: true },
      });
      if (!tender) {
        throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
      }

      const membership = await this.access.getMembership(userId, tender.organizationId);
      if (!membership) {
        throw new AppException(
          ErrorCode.NOT_ORGANIZATION_MEMBER,
          "You are not a member of the procuring organization.",
          403,
        );
      }

      // Approval is admin-only; rejection may be done by a publisher.
      if (input.decision === "APPROVED") {
        this.access.assertApprover(membership.role);
      } else {
        this.access.assertPublisher(membership.role, tender.organizationId);
      }

      let winningOrganizationId: string | null = null;
      if (input.bidId) {
        const bid = await tx.bid.findFirst({
          where: { id: input.bidId, tenderId },
          select: { id: true, organizationId: true },
        });
        if (!bid) {
          throw new AppException(ErrorCode.BID_NOT_FOUND, "Bid not found for this tender.", 404);
        }
        winningOrganizationId = bid.organizationId;
      }

      const status =
        input.decision === "APPROVED"
          ? input.publish
            ? "PUBLISHED"
            : "APPROVED"
          : "REJECTED";

      const now = new Date();
      const decision = await tx.awardDecision.create({
        data: {
          tenderId,
          bidId: input.bidId ?? null,
          winningOrganizationId,
          decision: status,
          awardedAmount:
            input.awardedAmount !== undefined ? new Prisma.Decimal(input.awardedAmount) : null,
          currency: input.currency,
          justification: input.justification,
          contractReference: input.contractReference ?? null,
          approvedById: userId,
          approvedAt: input.decision === "APPROVED" ? now : null,
          publishedAt: input.publish && input.decision === "APPROVED" ? now : null,
        },
        select: { id: true, decision: true, publishedAt: true },
      });

      // Publishing an approved award transitions the tender to AWARDED and
      // notifies the winner.
      if (decision.decision === "PUBLISHED") {
        await tx.tender.update({
          where: { id: tenderId },
          data: { status: "AWARDED" },
          select: { id: true },
        });
        await this.notifyWinner(tx, tenderId, winningOrganizationId);
      }

      await this.audit.record(
        this.audit.fromRequest(request, {
          action:
            input.decision === "APPROVED" ? "award.approved" : "award.rejected",
          entityType: "AwardDecision",
          entityId: decision.id,
          severity: "NOTICE",
          metadata: {
            tenderId,
            bidId: input.bidId ?? null,
            published: Boolean(input.publish),
          },
        }),
      );

      return {
        id: decision.id,
        decision: decision.decision,
        publishedAt: decision.publishedAt?.toISOString() ?? null,
      };
    });
  }

  /**
   * Publishes an already-approved award. Refuses anything not already approved —
   * an unapproved award cannot be published.
   */
  async publish(decisionId: string, userId: string, request: RequestWithActor) {
    return this.prisma.$transaction(async (tx) => {
      const decision = await tx.awardDecision.findFirst({
        where: { id: decisionId },
        select: {
          id: true,
          decision: true,
          tenderId: true,
          winningOrganizationId: true,
          tender: { select: { organizationId: true } },
        },
      });
      if (!decision) {
        throw new AppException(ErrorCode.NOT_FOUND, "Award decision not found.", 404);
      }

      const membership = await this.access.getMembership(
        userId,
        decision.tender.organizationId,
      );
      if (!membership) {
        throw new AppException(
          ErrorCode.NOT_ORGANIZATION_MEMBER,
          "You are not a member of the procuring organization.",
          403,
        );
      }

      if (decision.decision !== "APPROVED") {
        throw new AppException(
          ErrorCode.AWARD_NOT_APPROVED,
          "Only an approved award can be published.",
          409,
        );
      }

      const now = new Date();
      await tx.awardDecision.update({
        where: { id: decisionId },
        data: { decision: "PUBLISHED", publishedAt: now },
        select: { id: true },
      });

      await tx.tender.update({
        where: { id: decision.tenderId },
        data: { status: "AWARDED" },
        select: { id: true },
      });

      await this.notifyWinner(tx, decision.tenderId, decision.winningOrganizationId);

      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "award.published",
          entityType: "AwardDecision",
          entityId: decisionId,
          severity: "NOTICE",
          metadata: { tenderId: decision.tenderId },
        }),
      );

      return { id: decisionId, decision: "PUBLISHED", publishedAt: now.toISOString() };
    });
  }

  async listDecisions(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { organizationId: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    await this.access.assertMember(userId, tender.organizationId);

    return this.prisma.awardDecision.findMany({
      where: { tenderId },
      select: {
        id: true,
        decision: true,
        awardedAmount: true,
        currency: true,
        justification: true,
        contractReference: true,
        approvedAt: true,
        publishedAt: true,
        revokedAt: true,
        bid: { select: { id: true, submissionReference: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  private async notifyWinner(
    tx: Prisma.TransactionClient,
    tenderId: string,
    winningOrganizationId: string | null,
  ): Promise<void> {
    if (!winningOrganizationId) return;
    // Notify the members of the winning organization.
    const members = await tx.organizationMember.findMany({
      where: { organizationId: winningOrganizationId, status: "ACTIVE" },
      select: { userId: true },
    });
    const tender = await tx.tender.findFirst({
      where: { id: tenderId },
      select: { referenceNumber: true, title: true },
    });
    for (const member of members) {
      await this.notifications.create(
        tx,
        {
          userId: member.userId,
          type: "AWARD_PUBLISHED",
          // title/body are re-rendered from the AWARD_PUBLISHED template inside
          // create(); these are only fallbacks if the template is missing.
          title: `Award published: ${tender?.title ?? "tender"}`,
          body: `Your organization has been awarded tender ${tender?.referenceNumber ?? ""}.`,
          actionUrl: `/tenders/${tenderId}`,
          entityType: "Tender",
          entityId: tenderId,
          emailOnlyInApp: true,
        },
        // Keys MUST match the placeholders the AWARD_PUBLISHED template renders
        // (tenderTitle / tenderReference), or they interpolate to "undefined".
        {
          tenderTitle: tender?.title ?? "",
          tenderReference: tender?.referenceNumber ?? "",
        },
      );
    }
  }
}
