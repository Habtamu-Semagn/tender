import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "../generated/prisma/client.js";
import { createHash } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "../organizations/organization-access.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { DocumentsService } from "../documents/documents.service.js";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import {
  type BidDetail,
  type BidMetadata,
  type BidReceipt,
  type UpdateBidInput,
} from "@chereta/contracts";
import {
  assertBidTransition,
  type BidTransitionContext,
} from "./bid-state-machine.js";
import { acceptsSubmissions as tenderAcceptsSubmissions } from "../tenders/tender-state-machine.js";

/** Select for the tender fields a bid operation needs to reason about. */
const TENDER_FOR_BID_SELECT = {
  id: true,
  referenceNumber: true,
  title: true,
  status: true,
  submissionDeadline: true,
  organizationId: true,
  requiresSealedBids: true,
  organization: { select: { verificationStatus: true } },
} satisfies Prisma.TenderSelect;

type TenderForBid = Prisma.TenderGetPayload<{ select: typeof TENDER_FOR_BID_SELECT }>;

/**
 * Bid lifecycle: drafting, sealed submission, deadline enforcement, withdrawal,
 * and confidential access control.
 *
 * SECURITY is the dominant concern here:
 * - The submitting organization is always derived from the caller's ACTIVE
 *   membership, never from the request body.
 * - Submission is checked against SERVER time inside a transaction; the client
 *   clock is never trusted.
 * - Bid contents (proposals, price, attachments) are readable only by the
 *   bidder, and — after the authorized opening — by assigned evaluators. A
 *   tender publisher sees metadata only (count, status, timestamps) before
 *   opening, never contents.
 * - Every access to confidential data and every state change is audited.
 */
@Injectable()
export class BidsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
    private readonly documents: DocumentsService,
    private readonly config: ConfigService,
  ) {}

  // --- Drafting ---------------------------------------------------------------

  /**
   * Returns the caller's bid for a tender, creating an empty DRAFT on first
   * access. One active bid per organization per tender.
   */
  async getOrCreateDraft(
    userId: string,
    tenderId: string,
    request: RequestWithActor,
  ): Promise<BidDetail> {
    const tender = await this.loadTender(tenderId);
    const organizationId = await this.resolveBiddingOrganization(userId, tender);

    const existing = await this.prisma.bid.findFirst({
      where: { tenderId, organizationId, status: { not: "WITHDRAWN" } },
      select: { id: true },
    });

    if (existing) {
      return this.getBidDetail(existing.id, userId);
    }

    const submissionReference = await this.nextSubmissionReference(tender.referenceNumber);

    const bid = await this.prisma.bid.create({
      data: {
        tenderId,
        organizationId,
        submittedById: userId,
        submissionReference,
        status: "DRAFT",
      },
      select: { id: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "bid.draft_created",
        entityType: "Bid",
        entityId: bid.id,
        metadata: { tenderId, organizationId },
      }),
    );

    return this.getBidDetail(bid.id, userId);
  }

  /** Updates the draft contents. Only the owning organization may edit, and only while in DRAFT. */
  async updateDraft(
    bidId: string,
    userId: string,
    input: UpdateBidInput,
    request: RequestWithActor,
  ): Promise<BidDetail> {
    const bid = await this.loadBidForBidder(bidId, userId);

    if (bid.status !== "DRAFT") {
      throw new AppException(
        ErrorCode.BID_ALREADY_SUBMITTED,
        "This bid has already been submitted and can no longer be edited. Withdraw it before the deadline to start over.",
        409,
      );
    }

    // Verify the caller owns every referenced attachment before linking it.
    if (input.attachmentIds) {
      await this.assertAttachmentsOwned(userId, input.attachmentIds);
    }

    await this.prisma.bid.update({
      where: { id: bidId },
      data: {
        ...(input.technicalProposal !== undefined
          ? { technicalProposal: input.technicalProposal }
          : {}),
        ...(input.financialProposal !== undefined
          ? { financialProposal: input.financialProposal }
          : {}),
        ...(input.offeredPrice !== undefined
          ? { offeredPrice: new Prisma.Decimal(input.offeredPrice) }
          : {}),
        ...(input.offeredCurrency !== undefined
          ? { offeredCurrency: input.offeredCurrency }
          : {}),
        ...(input.priceValidityDays !== undefined
          ? { priceValidityDays: input.priceValidityDays }
          : {}),
        ...(input.attachmentIds !== undefined
          ? { attachments: this.buildAttachmentSync(input.attachmentIds) }
          : {}),
      },
      select: { id: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "bid.draft_updated",
        entityType: "Bid",
        entityId: bidId,
      }),
    );

    return this.getBidDetail(bidId, userId);
  }

  // --- Submission -------------------------------------------------------------

  /**
   * Seals a draft bid. Enforced inside a transaction against server time so a
   * late submission can never be recorded even under a race with the deadline.
   */
  async submit(
    bidId: string,
    userId: string,
    request: RequestWithActor,
  ): Promise<BidReceipt> {
    return this.prisma.$transaction(async (tx) => {
      const bid = await tx.bid.findFirst({
        where: { id: bidId },
        select: {
          id: true,
          status: true,
          tenderId: true,
          organizationId: true,
          submittedById: true,
          technicalProposal: true,
          financialProposal: true,
          offeredPrice: true,
          offeredCurrency: true,
          attachments: { select: { documentId: true } },
          tender: {
            select: {
              referenceNumber: true,
              status: true,
              submissionDeadline: true,
              requiredDocuments: {
                select: { id: true, code: true, title: true, isMandatory: true },
              },
            },
          },
        },
      });

      if (!bid) {
        throw new AppException(ErrorCode.BID_NOT_FOUND, "Bid not found.", 404);
      }

      if (bid.submittedById !== userId) {
        throw new AppException(
          ErrorCode.BID_ACCESS_DENIED,
          "You can only submit your own organization's bid.",
          403,
        );
      }

      const now = new Date();
      const deadlinePassed = bid.tender.submissionDeadline
        ? bid.tender.submissionDeadline.getTime() <= now.getTime()
        : false;
      const accepts = tenderAcceptsSubmissions(bid.tender.status, deadlinePassed);

      const context: BidTransitionContext = {
        acceptsSubmissions: accepts,
        deadlinePassed,
        hasBeenSubmitted: false,
      };
      assertBidTransition(bid.status, "SUBMITTED", "BIDDER", context);

      // A submission must carry substance: at least a proposal or a price.
      const hasContent =
        Boolean(bid.technicalProposal?.trim()) ||
        Boolean(bid.financialProposal?.trim()) ||
        bid.offeredPrice !== null ||
        bid.attachments.length > 0;
      if (!hasContent) {
        throw new AppException(
          ErrorCode.VALIDATION_FAILED,
          "A bid must include a proposal, a price, or at least one attachment before it can be submitted.",
          400,
        );
      }

      const integrityHash = this.computeIntegrityHash({
        technicalProposal: bid.technicalProposal,
        financialProposal: bid.financialProposal,
        offeredPrice: bid.offeredPrice?.toString() ?? null,
        attachmentIds: bid.attachments.map((a) => a.documentId),
      });

      const submitted = await tx.bid.update({
        where: { id: bidId },
        data: {
          status: "SUBMITTED",
          submittedAt: now,
          revisionNumber: { increment: 1 },
          integrityHash,
        },
        select: {
          id: true,
          submissionReference: true,
          status: true,
          revisionNumber: true,
          integrityHash: true,
          submittedAt: true,
          tender: { select: { id: true, referenceNumber: true } },
        },
      });

      // Record the required-document compliance snapshot at submission time.
      if (bid.tender.requiredDocuments.length > 0) {
        await tx.bidDocumentCompliance.createMany({
          data: bid.tender.requiredDocuments.map((doc) => ({
            bidId: bidId,
            requiredDocumentId: doc.id,
            isProvided: false,
          })),
          skipDuplicates: true,
        });
      }

      // Persist an immutable revision record for the audit trail.
      await tx.bidRevision.create({
        data: {
          bidId,
          revisionNumber: submitted.revisionNumber,
          technicalProposal: bid.technicalProposal,
          financialProposal: bid.financialProposal,
          offeredPrice: bid.offeredPrice,
          offeredCurrency: bid.offeredCurrency,
          attachmentManifest: {
            documentIds: bid.attachments.map((a) => a.documentId),
          },
          integrityHash,
          authorId: userId,
          submittedAt: now,
        },
        select: { id: true },
      });

      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "bid.submitted",
          entityType: "Bid",
          entityId: bidId,
          severity: "NOTICE",
          metadata: {
            tenderId: bid.tenderId,
            organizationId: bid.organizationId,
            revisionNumber: submitted.revisionNumber,
          },
        }),
      );

      return {
        bidId: submitted.id,
        submissionReference: submitted.submissionReference,
        tenderId: submitted.tender.id,
        tenderReference: submitted.tender.referenceNumber,
        submittedAt: submitted.submittedAt?.toISOString() ?? now.toISOString(),
        revisionNumber: submitted.revisionNumber,
        integrityHash: submitted.integrityHash ?? integrityHash,
        status: submitted.status,
        attachmentCount: bid.attachments.length,
      };
    });
  }

  // --- Withdrawal -------------------------------------------------------------

  async withdraw(
    bidId: string,
    userId: string,
    reason: string,
    request: RequestWithActor,
  ): Promise<BidDetail> {
    const bid = await this.loadBidForBidder(bidId, userId);

    const now = new Date();
    const deadlinePassed = bid.tender.submissionDeadline
      ? bid.tender.submissionDeadline.getTime() <= now.getTime()
      : false;

    const context: BidTransitionContext = {
      acceptsSubmissions: !deadlinePassed,
      deadlinePassed,
      hasBeenSubmitted: bid.status === "SUBMITTED",
    };
    assertBidTransition(bid.status, "WITHDRAWN", "BIDDER", context);

    await this.prisma.bid.update({
      where: { id: bidId },
      data: { status: "WITHDRAWN", withdrawnAt: now, withdrawalReason: reason },
      select: { id: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "bid.withdrawn",
        entityType: "Bid",
        entityId: bidId,
        severity: "NOTICE",
        metadata: { tenderId: bid.tenderId, organizationId: bid.organizationId },
      }),
    );

    return this.getBidDetail(bidId, userId);
  }

  // --- Reads ------------------------------------------------------------------

  /** The bidder's own full view of a bid. */
  async getBidDetail(bidId: string, userId: string): Promise<BidDetail> {
    const bid = await this.loadBidForBidder(bidId, userId);
    return this.toBidDetail(bid, true);
  }

  /** The bidder's bids for one tender (usually the single active one). */
  async listMyBidsForTender(tenderId: string, userId: string): Promise<BidDetail[]> {
    const memberships = await this.access.listForUser(userId);
    const orgIds = memberships.map((m) => m.organization.id);
    if (orgIds.length === 0) return [];

    const bids = await this.prisma.bid.findMany({
      where: { tenderId, organizationId: { in: orgIds } },
      select: BID_DETAIL_SELECT,
      orderBy: { createdAt: "desc" },
    });
    return bids.map((b) => this.toBidDetail(b, true));
  }

  /** The bidder's bids across all tenders, for a dashboard. */
  async listMyBids(userId: string): Promise<BidDetail[]> {
    const memberships = await this.access.listForUser(userId);
    const orgIds = memberships.map((m) => m.organization.id);
    if (orgIds.length === 0) return [];

    const bids = await this.prisma.bid.findMany({
      where: { organizationId: { in: orgIds } },
      select: BID_DETAIL_SELECT,
      orderBy: { updatedAt: "desc" },
      take: 100,
    });
    return bids.map((b) => this.toBidDetail(b, true));
  }

  /**
   * Metadata-only listing for a tender publisher. Deliberately contains NO
   * proposal contents, prices or attachments — only what a publisher needs to
   * see how many bids arrived and their status before opening.
   */
  async listBidMetadataForTender(
    tenderId: string,
    userId: string,
  ): Promise<{ items: BidMetadata[]; total: number }> {
    const tender = await this.loadTender(tenderId);
    // Only a member of the procuring organization may see bid metadata.
    await this.access.assertMember(userId, tender.organizationId);

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.bid.findMany({
        where: { tenderId },
        select: {
          id: true,
          submissionReference: true,
          status: true,
          revisionNumber: true,
          submittedAt: true,
          openedAt: true,
          _count: { select: { attachments: true } },
          organization: {
            select: { id: true, registeredName: true, verificationStatus: true },
          },
          documentCompliance: { select: { isProvided: true } },
        },
        orderBy: { submittedAt: "asc" },
      }),
      this.prisma.bid.count({ where: { tenderId } }),
    ]);

    const items: BidMetadata[] = rows.map((row) => ({
      id: row.id,
      submissionReference: row.submissionReference,
      status: row.status,
      revisionNumber: row.revisionNumber,
      organization: {
        id: row.organization.id,
        registeredName: row.organization.registeredName,
        verificationStatus: row.organization.verificationStatus,
      },
      submittedAt: row.submittedAt?.toISOString() ?? null,
      attachmentCount: row._count.attachments,
      requiredDocumentsComplete:
        row.documentCompliance.length > 0 &&
        row.documentCompliance.every((d) => d.isProvided),
      openedAt: row.openedAt?.toISOString() ?? null,
    }));

    return { items, total };
  }

  // --- Private helpers --------------------------------------------------------

  private async loadTender(tenderId: string): Promise<TenderForBid> {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: TENDER_FOR_BID_SELECT,
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    return tender;
  }

  /**
   * Resolves which of the caller's organizations is bidding, enforcing that the
   * organization is verified when the tender requires it. The organization is
   * never taken from the request body.
   */
  private async resolveBiddingOrganization(
    userId: string,
    tender: TenderForBid,
  ): Promise<string> {
    const memberships = await this.access.listForUser(userId);
    const active = memberships.filter((m) => m.status === "ACTIVE");
    if (active.length === 0) {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You must belong to an organization before you can bid. Create or join one first.",
        403,
      );
    }

    // Prefer an existing bid's organization so a returning bidder keeps theirs.
    const existing = await this.prisma.bid.findFirst({
      where: { tenderId: tender.id, organizationId: { in: active.map((m) => m.organization.id) } },
      select: { organizationId: true },
      orderBy: { createdAt: "desc" },
    });
    if (existing) return existing.organizationId;

    // Otherwise use the caller's first active organization, verifying it.
    const chosen = active[0];
    this.access.assertCanBid(chosen.organization.verificationStatus, true);
    return chosen.organization.id;
  }

  private async loadBidForBidder(bidId: string, userId: string) {
    const bid = await this.prisma.bid.findFirst({
      where: { id: bidId },
      select: {
        ...BID_DETAIL_SELECT,
        organizationId: true,
        submittedById: true,
      },
    });
    if (!bid) {
      throw new AppException(ErrorCode.BID_NOT_FOUND, "Bid not found.", 404);
    }

    // The bidder must belong to the bidding organization.
    const memberships = await this.access.listForUser(userId);
    const isMember = memberships.some(
      (m) => m.organization.id === bid.organizationId && m.status === "ACTIVE",
    );
    if (!isMember) {
      throw new AppException(
        ErrorCode.BID_ACCESS_DENIED,
        "You do not have access to this bid.",
        403,
      );
    }
    return bid;
  }

  private buildAttachmentSync(documentIds: string[]): Prisma.BidAttachmentUpdateManyWithoutBidNestedInput {
    return {
      deleteMany: {},
      create: documentIds.map((documentId) => ({ documentId })),
    };
  }

  private async assertAttachmentsOwned(userId: string, documentIds: string[]): Promise<void> {
    if (documentIds.length === 0) return;
    const owned = await this.prisma.document.findMany({
      where: { id: { in: documentIds }, uploadedById: userId, deletedAt: null },
      select: { id: true },
    });
    const ownedSet = new Set(owned.map((d) => d.id));
    const missing = documentIds.filter((id) => !ownedSet.has(id));
    if (missing.length > 0) {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        "You can only attach documents you have uploaded.",
        403,
      );
    }
  }

  private async nextSubmissionReference(tenderRef: string): Promise<string> {
    const count = await this.prisma.bid.count({
      where: { tender: { referenceNumber: tenderRef } },
    });
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `${tenderRef}-B${String(count + 1).padStart(4, "0")}-${suffix}`;
  }

  private computeIntegrityHash(payload: {
    technicalProposal: string | null;
    financialProposal: string | null;
    offeredPrice: string | null;
    attachmentIds: string[];
  }): string {
    const canonical = JSON.stringify({
      t: payload.technicalProposal ?? "",
      f: payload.financialProposal ?? "",
      p: payload.offeredPrice ?? "",
      a: [...payload.attachmentIds].sort(),
    });
    return createHash("sha256").update(canonical).digest("hex");
  }

  private toBidDetail(
    bid: Prisma.BidGetPayload<{ select: typeof BID_DETAIL_SELECT }>,
    _isOwner: boolean,
  ): BidDetail {
    const now = new Date();
    const deadlinePassed = bid.tender.submissionDeadline
      ? bid.tender.submissionDeadline.getTime() <= now.getTime()
      : false;
    const accepts = tenderAcceptsSubmissions(bid.tender.status, deadlinePassed);

    return {
      id: bid.id,
      tenderId: bid.tenderId,
      tenderReference: bid.tender.referenceNumber,
      tenderTitle: bid.tender.title,
      tenderStatus: bid.tender.status,
      submissionReference: bid.submissionReference,
      status: bid.status,
      revisionNumber: bid.revisionNumber,
      technicalProposal: bid.technicalProposal,
      financialProposal: bid.financialProposal,
      offeredPrice: bid.offeredPrice?.toString() ?? null,
      offeredCurrency: bid.offeredCurrency,
      priceValidityDays: bid.priceValidityDays,
      integrityHash: bid.integrityHash,
      submittedAt: bid.submittedAt?.toISOString() ?? null,
      withdrawnAt: bid.withdrawnAt?.toISOString() ?? null,
      withdrawalReason: bid.withdrawalReason,
      serverTime: now.toISOString(),
      submissionDeadline: bid.tender.submissionDeadline?.toISOString() ?? null,
      acceptsSubmissions: accepts,
      attachments: bid.attachments.map((a) => ({
        id: a.id,
        documentId: a.documentId,
        label: a.label,
        fileName: a.document.originalFileName,
        sizeBytes: a.document.sizeBytes,
        contentType: a.document.contentType,
        isMandatory: a.isMandatory,
        // No standing URL: downloads go through an authorized endpoint. The
        // owner fetches a short-lived signed URL on demand.
        downloadUrl: null,
        createdAt: a.createdAt.toISOString(),
      })),
      requiredDocuments: bid.tender.requiredDocuments.map((doc) => {
        const compliance = bid.documentCompliance.find(
          (c) => c.requiredDocumentId === doc.id,
        );
        return {
          id: doc.id,
          code: doc.code,
          title: doc.title,
          isMandatory: doc.isMandatory,
          isProvided: compliance?.isProvided ?? false,
          isCompliant: compliance?.isCompliant ?? null,
        };
      }),
      createdAt: bid.createdAt.toISOString(),
      updatedAt: bid.updatedAt.toISOString(),
    };
  }
}

/** Select shared by every bid-detail read. Confidential fields are included
 *  here because callers of these reads have already been authorized as the
 *  bidder; the publisher metadata path uses its own narrower select. */
const BID_DETAIL_SELECT = {
  id: true,
  tenderId: true,
  submissionReference: true,
  status: true,
  revisionNumber: true,
  technicalProposal: true,
  financialProposal: true,
  offeredPrice: true,
  offeredCurrency: true,
  priceValidityDays: true,
  integrityHash: true,
  submittedAt: true,
  withdrawnAt: true,
  withdrawalReason: true,
  createdAt: true,
  updatedAt: true,
  tender: {
    select: {
      id: true,
      referenceNumber: true,
      title: true,
      status: true,
      submissionDeadline: true,
      requiredDocuments: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, code: true, title: true, isMandatory: true },
      },
    },
  },
  attachments: {
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      documentId: true,
      label: true,
      isMandatory: true,
      createdAt: true,
      document: { select: { originalFileName: true, contentType: true, sizeBytes: true } },
    },
  },
  documentCompliance: {
    select: { requiredDocumentId: true, isProvided: true, isCompliant: true },
  },
} satisfies Prisma.BidSelect;
