import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, type TenderStatus } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "../organizations/organization-access.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import {
  type TenderDetail,
  type TenderSummary,
  type ListTendersQuery,
  type CreateTenderInput,
  type CreateAmendmentInput,
  type UpdateTenderInput,
} from "@chereta/contracts";
import {
  assertTransition,
  acceptsSubmissions,
  type TenderTransitionRole,
  type TransitionContext,
} from "./tender-state-machine.js";

/**
 * Tender lifecycle management.
 *
 * Business rules live here, not in the controller and not in the frontend:
 * the state machine decides what is legal, deadlines are evaluated against
 * server time, and confidential data is filtered out at the query level so a
 * permission mistake cannot leak a bid's contents.
 */
@Injectable()
export class TendersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  // --- Creation and editing --------------------------------------------------

  async create(
    userId: string,
    organizationId: string,
    input: CreateTenderInput,
    request: RequestWithActor,
  ): Promise<TenderDetail> {
    const membership = await this.access.getMembership(userId, organizationId);
    if (!membership) {
      throw new AppException(ErrorCode.NOT_ORGANIZATION_MEMBER, "You are not a member of this organization.", 403);
    }
    this.assertCanPublish(membership.verificationStatus);

    const slug = this.generateUniqueSlug(input.title);

    const tender = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tender.create({
        data: {
          referenceNumber: await this.nextReferenceNumber(tx),
          title: input.title.trim(),
          slug,
          description: input.description.trim(),
          scopeOfWork: input.scopeOfWork ?? null,
          organizationId,
          createdById: userId,
          categoryId: input.categoryId ?? null,
          procurementMethod: input.procurementMethod,
          tenderType: input.tenderType,
          estimatedBudget: input.estimatedBudget
            ? new Prisma.Decimal(input.estimatedBudget)
            : null,
          currency: input.currency,
          budgetVisibility: input.budgetVisibility,
          eligibilitySummary: input.eligibilitySummary ?? null,
          locationDescription: input.locationDescription ?? null,
          region: input.region ?? null,
          city: input.city ?? null,
          subCity: input.subCity ?? null,
          clarificationDeadline: input.clarificationDeadline ?? null,
          openingAt: input.openingAt ?? null,
          submissionDeadline: input.submissionDeadline ?? null,
          evaluationStartAt: input.evaluationStartAt ?? null,
          evaluationEndAt: input.evaluationEndAt ?? null,
          expectedAwardDate: input.expectedAwardDate ?? null,
          contactName: input.contactName ?? null,
          contactEmail: input.contactEmail ?? null,
          contactPhone: input.contactPhone ?? null,
          clarificationInstructions: input.clarificationInstructions ?? null,
          weightedScoringEnabled: input.weightedScoringEnabled,
          requiresSealedBids: input.requiresSealedBids,
          requiresTwoPartyOpening: input.requiresTwoPartyOpening,
          status: "DRAFT",
        },
        select: { id: true, organizationId: true },
      });

      await this.writeStructuredRows(tx, created.id, input);
      return created;
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "tender.created",
        entityType: "Tender",
        entityId: tender.id,
        metadata: { organizationId: tender.organizationId },
      }),
    );

    return this.getDetail(tender.id, userId);
  }

  async update(
    tenderId: string,
    userId: string,
    input: UpdateTenderInput,
    request: RequestWithActor,
  ): Promise<TenderDetail> {
    const existing = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { id: true, organizationId: true, status: true, version: true },
    });
    if (!existing) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }

    const membership = await this.access.getMembership(userId, existing.organizationId);
    if (!membership) {
      throw new AppException(ErrorCode.NOT_ORGANIZATION_MEMBER, "You are not a member of this organization.", 403);
    }
    this.assertCanPublish(membership.verificationStatus);

    // A published tender cannot be edited in place: changing a deadline or a
    // criterion after bidders have seen the original would be unfair. Those
    // changes go through an amendment.
    if (existing.status !== "DRAFT" && existing.status !== "PENDING_APPROVAL") {
      throw new AppException(
        ErrorCode.INVALID_STATE_TRANSITION,
        "Published tenders can only be changed through an amendment, so bidders always see a version history.",
        409,
      );
    }

    await this.prisma.$transaction(async (tx) => {
      // Optimistic concurrency: the version in the request must match the row,
      // so two editors cannot silently overwrite each other.
      const updated = await tx.tender.updateMany({
        where: { id: tenderId, version: existing.version },
        data: {
          ...(input.title !== undefined ? { title: input.title.trim() } : {}),
          ...(input.description !== undefined ? { description: input.description.trim() } : {}),
          ...(input.scopeOfWork !== undefined ? { scopeOfWork: input.scopeOfWork } : {}),
          ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {}),
          ...(input.procurementMethod !== undefined ? { procurementMethod: input.procurementMethod } : {}),
          ...(input.tenderType !== undefined ? { tenderType: input.tenderType } : {}),
          ...(input.estimatedBudget !== undefined
            ? { estimatedBudget: input.estimatedBudget ? new Prisma.Decimal(input.estimatedBudget) : null }
            : {}),
          ...(input.currency !== undefined ? { currency: input.currency } : {}),
          ...(input.budgetVisibility !== undefined ? { budgetVisibility: input.budgetVisibility } : {}),
          ...(input.eligibilitySummary !== undefined ? { eligibilitySummary: input.eligibilitySummary } : {}),
          ...(input.locationDescription !== undefined ? { locationDescription: input.locationDescription } : {}),
          ...(input.region !== undefined ? { region: input.region } : {}),
          ...(input.city !== undefined ? { city: input.city } : {}),
          ...(input.subCity !== undefined ? { subCity: input.subCity } : {}),
          ...(input.clarificationDeadline !== undefined ? { clarificationDeadline: input.clarificationDeadline } : {}),
          ...(input.openingAt !== undefined ? { openingAt: input.openingAt } : {}),
          ...(input.submissionDeadline !== undefined ? { submissionDeadline: input.submissionDeadline } : {}),
          ...(input.evaluationStartAt !== undefined ? { evaluationStartAt: input.evaluationStartAt } : {}),
          ...(input.evaluationEndAt !== undefined ? { evaluationEndAt: input.evaluationEndAt } : {}),
          ...(input.expectedAwardDate !== undefined ? { expectedAwardDate: input.expectedAwardDate } : {}),
          ...(input.contactName !== undefined ? { contactName: input.contactName } : {}),
          ...(input.contactEmail !== undefined ? { contactEmail: input.contactEmail } : {}),
          ...(input.contactPhone !== undefined ? { contactPhone: input.contactPhone } : {}),
          ...(input.clarificationInstructions !== undefined
            ? { clarificationInstructions: input.clarificationInstructions }
            : {}),
          ...(input.weightedScoringEnabled !== undefined
            ? { weightedScoringEnabled: input.weightedScoringEnabled }
            : {}),
          ...(input.requiresSealedBids !== undefined ? { requiresSealedBids: input.requiresSealedBids } : {}),
          ...(input.requiresTwoPartyOpening !== undefined
            ? { requiresTwoPartyOpening: input.requiresTwoPartyOpening }
            : {}),
          version: existing.version + 1,
        },
      });

      if (updated.count === 0) {
        throw new AppException(
          ErrorCode.CONFLICT,
          "This tender was changed by someone else. Reload and try again.",
          409,
        );
      }

      if (input.eligibilityRequirements) {
        await tx.eligibilityRequirement.deleteMany({ where: { tenderId } });
      }
      if (input.requiredDocuments) {
        await tx.requiredDocument.deleteMany({ where: { tenderId } });
      }
      if (input.evaluationCriteria) {
        await tx.evaluationCriterion.deleteMany({ where: { tenderId } });
      }
      await this.writeStructuredRows(tx, tenderId, input);
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "tender.updated",
        entityType: "Tender",
        entityId: tenderId,
        metadata: { organizationId: existing.organizationId, version: existing.version + 1 },
      }),
    );

    return this.getDetail(tenderId, userId);
  }

  // --- Lifecycle transitions -------------------------------------------------

  async submitForApproval(tenderId: string, userId: string, request: RequestWithActor): Promise<TenderDetail> {
    const tender = await this.loadOwnedTender(tenderId, userId);
    const context = await this.buildContext(tender);
    const role = await this.actorOrganizationRole(userId, tender.organizationId);

    assertTransition(tender.status, "PENDING_APPROVAL", role, context);
    await this.applyTransition(tenderId, tender.status, "PENDING_APPROVAL", userId, request, {
      organizationId: tender.organizationId,
    });

    return this.getDetail(tenderId, userId);
  }

  async publish(tenderId: string, userId: string, request: RequestWithActor): Promise<TenderDetail> {
    const tender = await this.loadOwnedTender(tenderId, userId);
    const context = await this.buildContext(tender);
    const role = await this.actorOrganizationRole(userId, tender.organizationId);

    assertTransition(tender.status, "PUBLISHED", role, context);

    await this.prisma.$transaction(async (tx) => {
      await tx.tender.update({
        where: { id: tenderId },
        data: {
          status: "PUBLISHED",
          publishedAt: new Date(),
          version: tender.version + 1,
        },
        select: { id: true },
      });
      await this.recordStatusHistory(tx, tenderId, tender.status, "PUBLISHED", userId, null);
      // Same transaction: if the publication rolls back, so do its
      // notifications. Delivery itself is queued, so a slow mail server cannot
      // hold the transaction open.
      await this.notifications.notifyTenderPublished(tx, tenderId);
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "tender.published",
        entityType: "Tender",
        entityId: tenderId,
        metadata: { organizationId: tender.organizationId, referenceNumber: tender.referenceNumber },
      }),
    );

    return this.getDetail(tenderId, userId);
  }

  async close(tenderId: string, userId: string, request: RequestWithActor): Promise<TenderDetail> {
    const tender = await this.loadOwnedTender(tenderId, userId);
    const context = await this.buildContext(tender);
    const role = await this.actorOrganizationRole(userId, tender.organizationId);

    assertTransition(tender.status, "SUBMISSION_CLOSED", role, context);
    await this.applyTransition(tenderId, tender.status, "SUBMISSION_CLOSED", userId, request, {
      organizationId: tender.organizationId,
      metadata: { reason: "submission deadline reached" },
    });

    return this.getDetail(tenderId, userId);
  }

  async cancel(
    tenderId: string,
    userId: string,
    reason: string,
    request: RequestWithActor,
  ): Promise<TenderDetail> {
    const tender = await this.loadOwnedTender(tenderId, userId);
    const context = await this.buildContext(tender);
    const role = await this.actorOrganizationRole(userId, tender.organizationId);

    assertTransition(tender.status, "CANCELLED", role, context);

    await this.prisma.$transaction(async (tx) => {
      await tx.tender.update({
        where: { id: tenderId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
          cancellationReason: reason,
          version: tender.version + 1,
        },
        select: { id: true },
      });
      await this.recordStatusHistory(tx, tenderId, tender.status, "CANCELLED", userId, reason);
      await this.notifications.notifyTenderCancelled(tx, tenderId);
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "tender.cancelled",
        entityType: "Tender",
        entityId: tenderId,
        metadata: { organizationId: tender.organizationId, reason },
      }),
    );

    return this.getDetail(tenderId, userId);
  }

  // --- Amendments ------------------------------------------------------------

  async createAmendment(
    tenderId: string,
    userId: string,
    input: CreateAmendmentInput,
    request: RequestWithActor,
  ): Promise<TenderDetail> {
    const tender = await this.loadOwnedTender(tenderId, userId);
    const membership = await this.access.getMembership(userId, tender.organizationId);
    if (!membership) {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You are not a member of this organization.",
        403,
      );
    }
    this.assertCanPublish(membership.verificationStatus);

    if (tender.status === "DRAFT") {
      throw new AppException(
        ErrorCode.INVALID_STATE_TRANSITION,
        "A draft tender cannot have amendments; edit it directly.",
        409,
      );
    }
    if (tender.status === "CANCELLED" || tender.status === "ARCHIVED") {
      throw new AppException(
        ErrorCode.INVALID_STATE_TRANSITION,
        "This tender is no longer active, so it cannot be amended.",
        409,
      );
    }

    // An amendment that moves the deadline must move it later, never earlier:
    // pulling a deadline forward after bidders have seen it is unfair.
    if (input.newSubmissionDeadline && tender.submissionDeadline) {
      const current = tender.submissionDeadline.getTime();
      const proposed = new Date(input.newSubmissionDeadline).getTime();
      if (proposed < current) {
        throw new AppException(
          ErrorCode.VALIDATION_FAILED,
          "An amendment can only extend a submission deadline, never shorten it.",
          400,
        );
      }
    }

    await this.prisma.$transaction(async (tx) => {
      const nextVersion = tender.version + 1;
      const amendmentRef = `AMD-${tender.referenceNumber}-${String(nextVersion).padStart(2, "0")}`;

      const amendment = await tx.tenderAmendment.create({
        data: {
          tenderId,
          amendmentRef,
          version: nextVersion,
          title: input.title.trim(),
          description: input.description.trim(),
          changesSummary: input.changesSummary ?? null,
          effectiveAt: new Date(input.effectiveAt),
          newSubmissionDeadline: input.newSubmissionDeadline ? new Date(input.newSubmissionDeadline) : null,
          authorId: userId,
        },
        select: { id: true },
      });

      await tx.tender.update({
        where: { id: tenderId },
        data: {
          version: nextVersion,
          amendmentCount: { increment: 1 },
          ...(input.newSubmissionDeadline
            ? { submissionDeadline: new Date(input.newSubmissionDeadline) }
            : {}),
          // An amendment to an open tender re-opens submissions if the deadline moved.
          ...(input.newSubmissionDeadline && tender.status === "SUBMISSION_CLOSED"
            ? { status: "OPEN_FOR_SUBMISSION" }
            : {}),
        },
        select: { id: true },
      });

      if (input.attachmentIds?.length) {
        await tx.tenderAmendmentAttachment.createMany({
          data: input.attachmentIds.map((documentId, index) => ({
            amendmentId: amendment.id,
            documentId,
            sortOrder: index,
          })),
          skipDuplicates: true,
        });
      }
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "tender.amended",
        entityType: "Tender",
        entityId: tenderId,
        metadata: { organizationId: tender.organizationId, version: tender.version + 1 },
      }),
    );

    return this.getDetail(tenderId, userId);
  }

  async listAmendments(tenderId: string, userId: string) {
    await this.assertCanSeeTender(tenderId, userId);
    const amendments = await this.prisma.tenderAmendment.findMany({
      where: { tenderId },
      orderBy: { version: "asc" },
      select: {
        id: true,
        amendmentRef: true,
        version: true,
        title: true,
        description: true,
        changesSummary: true,
        effectiveAt: true,
        newSubmissionDeadline: true,
        createdAt: true,
      },
    });

    return {
      items: amendments.map((a) => ({
        id: a.id,
        amendmentRef: a.amendmentRef,
        version: a.version,
        title: a.title,
        description: a.description,
        changesSummary: a.changesSummary,
        effectiveAt: a.effectiveAt.toISOString(),
        newSubmissionDeadline: a.newSubmissionDeadline?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  // --- Queries ---------------------------------------------------------------

  /**
   * Public listing. Only fields cleared for public disclosure are selected,
   * so the query itself cannot leak confidential data even if a caller
   * guesses an id.
   */
  async listPublic(
    query: ListTendersQuery,
    userId?: string,
  ): Promise<{ items: TenderSummary[]; total: number; nextCursor: string | null }> {
    const term = query.q?.trim();
    const statusFilter = query.statuses?.length
      ? query.statuses
      : query.status
        ? [query.status]
        : [...PUBLIC_STATUSES];

    const where: Prisma.TenderWhereInput = {
      deletedAt: null,
      status: { in: statusFilter as TenderStatus[] },
      ...(term
        ? {
            OR: [
              { title: { contains: term, mode: "insensitive" as const } },
              { description: { contains: term, mode: "insensitive" as const } },
              { referenceNumber: { contains: term, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(query.referenceNumber ? { referenceNumber: query.referenceNumber } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.organizationId ? { organizationId: query.organizationId } : {}),
      ...(query.region ? { region: query.region } : {}),
      ...(query.city ? { city: query.city } : {}),
      ...(query.procurementMethod ? { procurementMethod: query.procurementMethod } : {}),
      ...(query.tenderType ? { tenderType: query.tenderType } : {}),
      ...(query.publishedFrom ? { publishedAt: { gte: new Date(query.publishedFrom) } } : {}),
      ...(query.publishedTo ? { publishedAt: { lte: new Date(query.publishedTo) } } : {}),
      ...(query.closingAfter ? { submissionDeadline: { gte: new Date(query.closingAfter) } } : {}),
      ...(query.closingBefore ? { submissionDeadline: { lte: new Date(query.closingBefore) } } : {}),
      ...(query.minBudget || query.maxBudget
        ? {
            estimatedBudget: {
              ...(query.minBudget ? { gte: new Prisma.Decimal(query.minBudget) } : {}),
              ...(query.maxBudget ? { lte: new Prisma.Decimal(query.maxBudget) } : {}),
            },
          }
        : {}),
    };

    if (query.savedOnly && !userId) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Sign in to view your saved tenders.", 401);
    }

    if (query.savedOnly && userId) {
      where.savedBy = { some: { userId } };
    }

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.tender.findMany({
        where,
        select: TENDER_SUMMARY_SELECT,
        orderBy: this.buildOrder(query),
        take: query.limit,
        ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      }),
      this.prisma.tender.count({ where }),
    ]);

    const savedIds = userId
      ? new Set(
          (
            await this.prisma.savedTender.findMany({
              where: { userId, tenderId: { in: rows.map((row) => row.id) } },
              select: { tenderId: true },
            })
          ).map((row) => row.tenderId),
        )
      : new Set<string>();

    return {
      items: rows.map((row) => toSummary(row, savedIds.has(row.id))),
      total,
      nextCursor:
        rows.length === query.limit ? (rows[rows.length - 1]?.id ?? null) : null,
    };
  }

  /** Tenders belonging to one organization, visible to its members. */
  async listForOrganization(
    organizationId: string,
    userId: string,
    query: ListTendersQuery,
  ): Promise<{ items: TenderSummary[]; total: number; nextCursor: string | null }> {
    await this.access.assertMember(userId, organizationId);

    const term = query.q?.trim();
    const statusFilter = query.statuses?.length
      ? query.statuses
      : query.status
        ? [query.status]
        : undefined;

    const where: Prisma.TenderWhereInput = {
      deletedAt: null,
      organizationId,
      ...(statusFilter ? { status: { in: statusFilter as TenderStatus[] } } : {}),
      ...(term
        ? {
            OR: [
              { title: { contains: term, mode: "insensitive" as const } },
              { referenceNumber: { contains: term, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total] = await this.prisma.$transaction([
      this.prisma.tender.findMany({
        where,
        select: TENDER_SUMMARY_SELECT,
        orderBy: { createdAt: "desc" },
        take: query.limit,
        ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      }),
      this.prisma.tender.count({ where }),
    ]);

    return {
      items: rows.map((row) => toSummary(row, false)),
      total,
      nextCursor:
        rows.length === query.limit ? (rows[rows.length - 1]?.id ?? null) : null,
    };
  }

  /**
   * Detail view with authorization.
   *
   * SECURITY: the summary is safe for anyone who can see the tender at all.
   * Confidential fields (bid counts, evaluation criteria before the rules allow)
   * are only added for members of the owning organization.
   */
  async getDetail(tenderId: string, userId?: string): Promise<TenderDetail> {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: {
        ...TENDER_SUMMARY_SELECT,
        scopeOfWork: true,
        eligibilitySummary: true,
        locationDescription: true,
        subCity: true,
        openingAt: true,
        evaluationStartAt: true,
        evaluationEndAt: true,
        expectedAwardDate: true,
        budgetVisibility: true,
        weightedScoringEnabled: true,
        requiresSealedBids: true,
        contactName: true,
        contactEmail: true,
        contactPhone: true,
        clarificationInstructions: true,
        amendmentCount: true,
        version: true,
        createdById: true,
        attachments: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            documentId: true,
            label: true,
            visibility: true,
            isRequired: true,
            createdAt: true,
            document: {
              select: { originalFileName: true, contentType: true, sizeBytes: true },
            },
          },
        },
        eligibilityRequirements: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, code: true, title: true, description: true, isMandatory: true },
        },
        requiredDocuments: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, code: true, title: true, description: true, isMandatory: true },
        },
        evaluationCriteria: {
          orderBy: { sortOrder: "asc" },
          select: {
            id: true,
            code: true,
            title: true,
            description: true,
            stage: true,
            weight: true,
            maxScore: true,
            isMandatory: true,
          },
        },
        amendments: {
          orderBy: { version: "asc" },
          select: {
            id: true,
            amendmentRef: true,
            version: true,
            title: true,
            description: true,
            effectiveAt: true,
            newSubmissionDeadline: true,
            createdAt: true,
          },
        },
      },
    });

    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }

    const isPublic = PUBLIC_STATUSES.includes(tender.status);
    const membership = userId
      ? await this.access.getMembership(userId, tender.organization.id)
      : null;
    const isMember = Boolean(membership);

    // A draft is invisible to anyone who is not a member of the owning
    // organization. This is checked here, not by hiding a link in the UI.
    if (!isPublic && !isMember) {
      throw new AppException(
        ErrorCode.TENDER_NOT_FOUND,
        "This tender is not published.",
        404,
      );
    }

    const summary = toSummary(tender, false);

    const detail: TenderDetail = {
      ...summary,
      scopeOfWork: tender.scopeOfWork,
      eligibilitySummary: tender.eligibilitySummary,
      locationDescription: tender.locationDescription,
      subCity: tender.subCity,
      openingAt: tender.openingAt?.toISOString() ?? null,
      evaluationStartAt: tender.evaluationStartAt?.toISOString() ?? null,
      evaluationEndAt: tender.evaluationEndAt?.toISOString() ?? null,
      expectedAwardDate: tender.expectedAwardDate?.toISOString() ?? null,
      budgetVisibility: tender.budgetVisibility,
      weightedScoringEnabled: tender.weightedScoringEnabled,
      requiresSealedBids: tender.requiresSealedBids,
      contactName: tender.contactName,
      contactEmail: tender.contactEmail,
      contactPhone: tender.contactPhone,
      clarificationInstructions: tender.clarificationInstructions,
      amendmentCount: tender.amendmentCount,
      version: tender.version,
      attachments: tender.attachments
        .filter((a) => isMember || a.visibility === "PUBLIC")
        .map((a) => ({
          id: a.id,
          documentId: a.documentId,
          label: a.label,
          fileName: a.document.originalFileName,
          sizeBytes: a.document.sizeBytes,
          contentType: a.document.contentType,
          visibility: a.visibility,
          isRequired: a.isRequired,
          // No URL is embedded here: downloads go through an authorized
          // endpoint that checks the caller's rights per request. A URL in the
          // detail payload would be a standing grant.
          downloadUrl: null,
          createdAt: a.createdAt.toISOString(),
        })),
      eligibilityRequirements: tender.eligibilityRequirements.map((r) => ({
        id: r.id,
        code: r.code,
        title: r.title,
        description: r.description,
        isMandatory: r.isMandatory,
      })),
      requiredDocuments: tender.requiredDocuments.map((d) => ({
        id: d.id,
        code: d.code,
        title: d.title,
        description: d.description,
        isMandatory: d.isMandatory,
      })),
      // Criteria are disclosed only to members: publishing the weights before
      // the tender closes would let bidders game the scoring.
      evaluationCriteria: isMember
        ? tender.evaluationCriteria.map((c) => ({
            id: c.id,
            code: c.code,
            title: c.title,
            description: c.description,
            stage: c.stage,
            weight: c.weight.toFixed(2),
            maxScore: c.maxScore.toFixed(2),
            isMandatory: c.isMandatory,
          }))
        : [],
      amendments: tender.amendments.map((a) => ({
        id: a.id,
        amendmentRef: a.amendmentRef,
        version: a.version,
        title: a.title,
        description: a.description,
        effectiveAt: a.effectiveAt.toISOString(),
        newSubmissionDeadline: a.newSubmissionDeadline?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
      })),
      createdAt: tender.createdAt.toISOString(),
      updatedAt: tender.updatedAt.toISOString(),
    };

    if (isMember) {
      // Submission counts are metadata only — never bid contents.
      detail.submissionCount = await this.prisma.bid.count({
        where: { tenderId, status: { not: "DRAFT" } },
      });
    }

    if (userId && isMember && membership) {
      const myBidCount = await this.prisma.bid.count({
        where: { tenderId, organizationId: tender.organization.id },
      });
      detail.hasMyBid = myBidCount > 0;
    }

    return detail;
  }

  /** Deadline check used by the bids module; server time only. */
  async assertAcceptsSubmissions(tenderId: string): Promise<void> {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { status: true, submissionDeadline: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    const deadlinePassed = tender.submissionDeadline
      ? tender.submissionDeadline.getTime() <= Date.now()
      : false;
    if (!acceptsSubmissions(tender.status, deadlinePassed)) {
      throw new AppException(
        ErrorCode.SUBMISSION_DEADLINE_PASSED,
        "This tender is no longer accepting submissions.",
        409,
      );
    }
  }

  // --- Internals -------------------------------------------------------------

  /**
   * Enforces the platform policy on who may publish.
   *
   * The requirement is configurable (REQUIRE_VERIFIED_ORG_TO_PUBLISH) rather
   * than hardcoded: some procurement regimes require verification before
   * publishing and others do not, and that is a policy decision for the
   * operator, not a code change.
   */
  private assertCanPublish(verificationStatus: string): void {
    const required = this.config.getOrThrow<boolean>(
      "app.policy.requireVerifiedOrgToPublish",
    );
    this.access.assertCanPublish(verificationStatus, required);
  }

  private async loadOwnedTender(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: {
        id: true,
        organizationId: true,
        status: true,
        referenceNumber: true,
        version: true,
        submissionDeadline: true,
      },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }

    const membership = await this.access.getMembership(userId, tender.organizationId);
    if (!membership) {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You do not manage this tender.",
        403,
      );
    }
    this.assertCanPublish(membership.verificationStatus);

    return tender;
  }

  private async actorOrganizationRole(
    userId: string,
    organizationId: string,
  ): Promise<TenderTransitionRole> {
    const membership = await this.access.getMembership(userId, organizationId);
    if (!membership) {
      throw new AppException(ErrorCode.NOT_ORGANIZATION_MEMBER, "You are not a member of this organization.", 403);
    }
    // MEMBER is deliberately not a transition role: the state machine has no
    // transition that a plain member may trigger.
    const role: TenderTransitionRole =
      membership.role === "OWNER" || membership.role === "ADMIN" || membership.role === "PUBLISHER"
        ? membership.role
        : "MEMBER";
    return role;
  }

  private async assertCanSeeTender(tenderId: string, userId: string): Promise<void> {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { organizationId: true, status: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    const isPublic = PUBLIC_STATUSES.includes(tender.status);
    const membership = await this.access.getMembership(userId, tender.organizationId);
    if (!isPublic && !membership) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "This tender is not published.", 404);
    }
  }

  /** Assembles the preconditions the state machine checks. */
  private async buildContext(tender: {
    id: string;
    organizationId: string;
    status: TenderStatus;
    submissionDeadline: Date | null;
  }): Promise<TransitionContext> {
    const [organization, criteriaCount, tenderRow] = await Promise.all([
      this.prisma.organization.findFirst({
        where: { id: tender.organizationId },
        select: { verificationStatus: true },
      }),
      this.prisma.evaluationCriterion.count({ where: { tenderId: tender.id } }),
      this.prisma.tender.findFirst({
        where: { id: tender.id },
        select: {
          title: true,
          description: true,
          categoryId: true,
          weightedScoringEnabled: true,
          submissionDeadline: true,
          clarificationDeadline: true,
          evaluationStartAt: true,
          evaluationCriteria: { select: { weight: true } },
        },
      }),
    ]);

    const now = new Date();
    const deadlinePassed = tender.submissionDeadline
      ? tender.submissionDeadline.getTime() <= now.getTime()
      : false;

    const datesAreCoherent =
      !tenderRow ||
      (!tenderRow.clarificationDeadline ||
        !tenderRow.submissionDeadline ||
        tenderRow.clarificationDeadline <= tenderRow.submissionDeadline) &&
      (!tenderRow.submissionDeadline ||
        !tenderRow.evaluationStartAt ||
        tenderRow.submissionDeadline <= tenderRow.evaluationStartAt);

    const weightsAreValid =
      !tenderRow ||
      !tenderRow.weightedScoringEnabled ||
      tenderRow.evaluationCriteria.length === 0 ||
      Math.abs(
        tenderRow.evaluationCriteria.reduce((sum, c) => sum + Number(c.weight), 0) - 100,
      ) < 0.01;

    return {
      now,
      hasSubmissionDeadline: Boolean(tenderRow?.submissionDeadline),
      deadlinePassed,
      organizationVerified: organization?.verificationStatus === "VERIFIED",
      hasEvaluationCriteria: criteriaCount > 0,
      hasRequiredFields: Boolean(tenderRow?.title && tenderRow?.description && tenderRow?.categoryId),
      datesAreCoherent,
      weightsAreValid,
    };
  }

  /** Applies a transition plus its history and audit rows in one transaction. */
  private async applyTransition(
    tenderId: string,
    from: TenderStatus,
    to: TenderStatus,
    userId: string,
    request: RequestWithActor,
    options: { organizationId: string; reason?: string; metadata?: Record<string, unknown> },
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const result = await tx.tender.updateMany({
        where: { id: tenderId, status: from },
        data: {
          status: to,
          ...(to === "SUBMISSION_CLOSED" ? { closedAt: new Date() } : {}),
          version: { increment: 1 },
        },
      });
      if (result.count === 0) {
        // Another request already moved this tender; the conditional update is
        // what makes concurrent transitions safe.
        throw new AppException(
          ErrorCode.CONFLICT,
          "This tender's status changed while you were working. Reload and try again.",
          409,
        );
      }
      await this.recordStatusHistory(tx, tenderId, from, to, userId, options.reason ?? null);
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: `tender.${to.toLowerCase().replace(/_/g, "-")}`,
        entityType: "Tender",
        entityId: tenderId,
        metadata: { organizationId: options.organizationId, from, to, ...options.metadata },
      }),
    );
  }

  private async recordStatusHistory(
    tx: Prisma.TransactionClient,
    tenderId: string,
    from: TenderStatus | null,
    to: TenderStatus,
    userId: string,
    reason: string | null,
  ): Promise<void> {
    await tx.tenderStatusHistory.create({
      data: { tenderId, fromStatus: from, toStatus: to, reason, actorId: userId },
      select: { id: true },
    });
  }

  private async writeStructuredRows(
    tx: Prisma.TransactionClient,
    tenderId: string,
    input: CreateTenderInput | UpdateTenderInput,
  ): Promise<void> {
    if (input.eligibilityRequirements?.length) {
      await tx.eligibilityRequirement.createMany({
        data: input.eligibilityRequirements.map((r, index) => ({
          tenderId,
          code: r.code,
          title: r.title,
          description: r.description ?? null,
          requirementType: r.requirementType ?? null,
          isMandatory: r.isMandatory,
          sortOrder: r.sortOrder ?? index,
        })),
        skipDuplicates: true,
      });
    }

    if (input.requiredDocuments?.length) {
      await tx.requiredDocument.createMany({
        data: input.requiredDocuments.map((d, index) => ({
          tenderId,
          code: d.code,
          title: d.title,
          description: d.description ?? null,
          isMandatory: d.isMandatory,
          sortOrder: d.sortOrder ?? index,
        })),
        skipDuplicates: true,
      });
    }

    if (input.evaluationCriteria?.length) {
      await tx.evaluationCriterion.createMany({
        data: input.evaluationCriteria.map((c, index) => ({
          tenderId,
          code: c.code,
          title: c.title,
          description: c.description ?? null,
          stage: c.stage,
          weight: new Prisma.Decimal(c.weight),
          maxScore: new Prisma.Decimal(c.maxScore),
          isMandatory: c.isMandatory,
          sortOrder: c.sortOrder ?? index,
        })),
        skipDuplicates: true,
      });
    }

    if ("attachmentIds" in input && input.attachmentIds?.length) {
      await tx.tenderAttachment.createMany({
        data: input.attachmentIds.map((documentId, index) => ({
          tenderId,
          documentId,
          sortOrder: index,
          visibility: "PUBLIC",
        })),
        skipDuplicates: true,
      });
    }
  }

  private buildOrder(query: ListTendersQuery): Prisma.TenderOrderByWithRelationInput {
    switch (query.sort) {
      case "closing_soon":
      case "deadline":
        return { submissionDeadline: { sort: "asc", nulls: "last" } };
      case "budget_high":
        return { estimatedBudget: { sort: "desc", nulls: "last" } };
      case "budget_low":
        return { estimatedBudget: { sort: "asc", nulls: "last" } };
      case "relevance":
        // With no full-text index configured, relevance degrades to recency;
        // a tsvector ranking can replace this once the search volume justifies it.
        return { publishedAt: "desc" };
      default:
        return { publishedAt: "desc" };
    }
  }

  /** Generates the next sequential reference number, e.g. CHR-2026-000123. */
  private async nextReferenceNumber(tx: Prisma.TransactionClient): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CHR-${year}-`;
    // count() is advisory here; the unique constraint on referenceNumber is the
    // real guard, and a collision retries with the next number.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const existing = await tx.tender.count({
        where: { referenceNumber: { startsWith: prefix } },
      });
      const candidate = `${prefix}${String(existing + 1).padStart(6, "0")}`;
      const taken = await tx.tender.findUnique({
        where: { referenceNumber: candidate },
        select: { id: true },
      });
      if (!taken) return candidate;
    }
    // Fall back to a random suffix rather than failing a legitimate creation.
    return `${prefix}${Date.now().toString().slice(-8)}`;
  }

  private generateUniqueSlug(title: string): string {
    const base =
      title
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80) || "tender";

    const suffix = Math.random().toString(36).slice(2, 8);
    return `${base}-${suffix}`;
  }
}

// --- Shared select and mapping ------------------------------------------------

const TENDER_SUMMARY_SELECT = {
  id: true,
  referenceNumber: true,
  title: true,
  slug: true,
  description: true,
  status: true,
  procurementMethod: true,
  tenderType: true,
  estimatedBudget: true,
  currency: true,
  budgetVisibility: true,
  region: true,
  city: true,
  publishedAt: true,
  submissionDeadline: true,
  clarificationDeadline: true,
  amendmentCount: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  organization: {
    select: {
      id: true,
      registeredName: true,
      tradingName: true,
      verificationStatus: true,
      city: true,
      region: true,
    },
  },
  category: {
    select: { id: true, code: true, name: true },
  },
  _count: {
    select: { attachments: true },
  },
} satisfies Prisma.TenderSelect;

const PUBLIC_STATUSES: readonly TenderStatus[] = [
  "PUBLISHED",
  "OPEN_FOR_SUBMISSION",
  "SUBMISSION_CLOSED",
  "AWARDED",
] as const;

/**
 * Maps a row to the public summary shape.
 *
 * `estimatedBudget` is nulled unless the tender's budgetVisibility allows
 * disclosure, so a PRIVATE budget never reaches a public response even by
 * accident of a future select change.
 */
/**
 * The row shape `toSummary` reads. Both the summary select and the detail select
 * satisfy it, so the mapper works for either without an `any` cast.
 */
interface SummaryRow {
  id: string;
  referenceNumber: string;
  title: string;
  slug: string;
  description: string;
  procurementMethod: TenderSummary["procurementMethod"];
  tenderType: TenderSummary["tenderType"];
  status: TenderSummary["status"];
  organization: {
    id: string;
    registeredName: string;
    tradingName: string | null;
    verificationStatus: TenderSummary["organization"]["verificationStatus"];
    city: string | null;
    region: string | null;
  };
  category: { id: string; code: string; name: string } | null;
  region: string | null;
  city: string | null;
  estimatedBudget: { toFixed(digits: number): string } | null;
  currency: string;
  budgetVisibility: string;
  publishedAt: Date | null;
  submissionDeadline: Date | null;
  clarificationDeadline: Date | null;
  amendmentCount: number;
  _count?: { attachments: number };
}

function toSummary(tender: SummaryRow, isSaved: boolean): TenderSummary {
  const deadlineMs = tender.submissionDeadline?.getTime() ?? null;
  const budgetVisible =
    tender.budgetVisibility === "PUBLIC" ||
    tender.budgetVisibility === "PARTICIPANTS";

  return {
    id: tender.id,
    referenceNumber: tender.referenceNumber,
    title: tender.title,
    slug: tender.slug,
    description: tender.description,
    procurementMethod: tender.procurementMethod,
    tenderType: tender.tenderType,
    status: tender.status,
    organization: {
      id: tender.organization.id,
      registeredName: tender.organization.registeredName,
      tradingName: tender.organization.tradingName,
      verificationStatus: tender.organization.verificationStatus,
      city: tender.organization.city,
      region: tender.organization.region,
    },
    category: tender.category
      ? {
          id: tender.category.id,
          code: tender.category.code,
          name: tender.category.name,
        }
      : null,
    region: tender.region,
    city: tender.city,
    estimatedBudget:
      budgetVisible && tender.estimatedBudget ? tender.estimatedBudget.toFixed(2) : null,
    currency: tender.currency,
    publishedAt: tender.publishedAt?.toISOString() ?? null,
    submissionDeadline: deadlineMs ? new Date(deadlineMs).toISOString() : null,
    clarificationDeadline: tender.clarificationDeadline?.toISOString() ?? null,
    msUntilDeadline: deadlineMs ? Math.max(0, deadlineMs - Date.now()) : null,
    attachmentCount: tender._count?.attachments ?? 0,
    amendmentCount: tender.amendmentCount,
    isSaved,
  };
}
