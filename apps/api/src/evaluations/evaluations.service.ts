import { Injectable } from "@nestjs/common";
import { Prisma } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "../organizations/organization-access.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { AppException } from "../common/errors/app.exception.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import {
  type CreateEvaluationAssignmentInput,
  type UpsertScoreInput,
  type CreateEvaluationCommentInput,
  type DeclareConflictInput,
  type SubmitEvaluationInput,
} from "@chereta/contracts";

/** Select for a tender's evaluation criteria. */
const CRITERIA_SELECT = {
  id: true,
  code: true,
  title: true,
  stage: true,
  weight: true,
  maxScore: true,
  isMandatory: true,
  sortOrder: true,
} satisfies Prisma.EvaluationCriterionSelect;

/**
 * Evaluation lifecycle: assignments, conflict-of-interest, scoring with
 * server-computed weighted totals, and submission.
 *
 * SECURITY:
 * - An evaluator can only act on assignments where they are the named
 *   evaluator. Assignment is the only source of evaluation authority — there is
 *   no standing "evaluator" role that grants access to every tender.
 * - The weighted total is always recomputed server-side from the scores; a
 *   client-supplied total is never trusted.
 * - A score is validated against the criterion's maxScore at entry time, and
 *   the max/weight are snapshotted so a later criterion edit cannot silently
 *   change a past score's contribution.
 * - Draft comments stay private until the assignment is submitted.
 */
@Injectable()
export class EvaluationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
  ) {}

  // --- Assignments ------------------------------------------------------------

  /**
   * Assigns an evaluator to a tender. Only a member of the procuring
   * organization (publisher+) may assign.
   */
  async assign(
    tenderId: string,
    userId: string,
    input: CreateEvaluationAssignmentInput,
    request: RequestWithActor,
  ) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { id: true, organizationId: true, title: true, referenceNumber: true },
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

    // The evaluator must exist and be an active user.
    const evaluator = await this.prisma.user.findFirst({
      where: { id: input.evaluatorId, deletedAt: null, status: "ACTIVE" },
      select: { id: true },
    });
    if (!evaluator) {
      throw new AppException(ErrorCode.NOT_FOUND, "Evaluator not found.", 404);
    }

    const assignment = await this.prisma.evaluationAssignment.upsert({
      where: {
        tenderId_evaluatorId_stage: {
          tenderId,
          evaluatorId: input.evaluatorId,
          stage: input.stage,
        },
      },
      update: {
        status: "ASSIGNED",
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
        evaluatorOrganizationId: input.evaluatorOrganizationId ?? null,
      },
      create: {
        tenderId,
        evaluatorId: input.evaluatorId,
        stage: input.stage,
        assignedById: userId,
        evaluatorOrganizationId: input.evaluatorOrganizationId ?? null,
        dueAt: input.dueAt ? new Date(input.dueAt) : null,
      },
      select: { id: true, evaluatorId: true, stage: true, status: true, dueAt: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "evaluation.assigned",
        entityType: "EvaluationAssignment",
        entityId: assignment.id,
        metadata: { tenderId, evaluatorId: input.evaluatorId, stage: input.stage },
      }),
    );

    return assignment;
  }

  /** Lists assignments for a tender (publisher view). */
  async listAssignmentsForTender(tenderId: string, userId: string) {
    const tender = await this.prisma.tender.findFirst({
      where: { id: tenderId, deletedAt: null },
      select: { organizationId: true },
    });
    if (!tender) {
      throw new AppException(ErrorCode.TENDER_NOT_FOUND, "Tender not found.", 404);
    }
    await this.access.assertMember(userId, tender.organizationId);

    return this.prisma.evaluationAssignment.findMany({
      where: { tenderId },
      select: {
        id: true,
        stage: true,
        status: true,
        assignedAt: true,
        dueAt: true,
        submittedAt: true,
        totalScore: true,
        evaluator: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
      orderBy: { assignedAt: "asc" },
    });
  }

  /** The evaluator's own assignments across tenders. */
  async listMyAssignments(userId: string) {
    return this.prisma.evaluationAssignment.findMany({
      where: { evaluatorId: userId },
      select: {
        id: true,
        stage: true,
        status: true,
        assignedAt: true,
        dueAt: true,
        submittedAt: true,
        totalScore: true,
        tender: { select: { id: true, referenceNumber: true, title: true, status: true } },
      },
      orderBy: { assignedAt: "desc" },
    });
  }

  // --- Conflict of interest ---------------------------------------------------

  async declareConflict(
    assignmentId: string,
    userId: string,
    input: DeclareConflictInput,
    request: RequestWithActor,
  ) {
    // Loading the assignment verifies the caller is the assigned evaluator.
    await this.loadAssignmentForEvaluator(assignmentId, userId);

    await this.prisma.conflictOfInterest.upsert({
      where: { assignmentId_declarantId: { assignmentId, declarantId: userId } },
      update: { statement: input.statement, hasConflict: input.hasConflict },
      create: {
        assignmentId,
        declarantId: userId,
        statement: input.statement,
        hasConflict: input.hasConflict,
      },
      select: { id: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "evaluation.conflict_declared",
        entityType: "EvaluationAssignment",
        entityId: assignmentId,
        metadata: { hasConflict: input.hasConflict },
      }),
    );

    return { declared: true, hasConflict: input.hasConflict };
  }

  // --- Scoring ----------------------------------------------------------------

  /**
   * Upserts a score. The weighted contribution is computed server-side as
   * (score / maxScore) * weight, and max/weight are snapshotted at entry.
   */
  async upsertScore(
    assignmentId: string,
    userId: string,
    input: UpsertScoreInput,
    request: RequestWithActor,
  ) {
    const assignment = await this.loadAssignmentForEvaluator(assignmentId, userId);
    if (assignment.status === "SUBMITTED") {
      throw new AppException(
        ErrorCode.EVALUATION_ALREADY_SUBMITTED,
        "This evaluation has been submitted and can no longer be scored.",
        409,
      );
    }

    const criterion = await this.prisma.evaluationCriterion.findFirst({
      where: { id: input.criterionId, tenderId: assignment.tenderId },
      select: { id: true, maxScore: true, weight: true },
    });
    if (!criterion) {
      throw new AppException(
        ErrorCode.NOT_FOUND,
        "Criterion not found for this tender.",
        404,
      );
    }

    // Validate the score against the criterion's maximum (server-side).
    const maxScore = Number(criterion.maxScore);
    if (input.score > maxScore) {
      throw new AppException(
        ErrorCode.SCORE_OUT_OF_RANGE,
        `Score cannot exceed the criterion maximum of ${maxScore}.`,
        400,
      );
    }

    const weight = Number(criterion.weight);
    const weightedScore = maxScore > 0 ? (input.score / maxScore) * weight : 0;

    const score = await this.prisma.evaluationScore.upsert({
      where: {
        assignmentId_criterionId_bidId: {
          assignmentId,
          criterionId: input.criterionId,
          bidId: input.bidId,
        },
      },
      update: {
        score: new Prisma.Decimal(input.score),
        maxScoreAtEntry: criterion.maxScore,
        weightAtEntry: criterion.weight,
        weightedScore: new Prisma.Decimal(weightedScore.toFixed(4)),
        rationale: input.rationale ?? null,
      },
      create: {
        assignmentId,
        criterionId: input.criterionId,
        bidId: input.bidId,
        score: new Prisma.Decimal(input.score),
        maxScoreAtEntry: criterion.maxScore,
        weightAtEntry: criterion.weight,
        weightedScore: new Prisma.Decimal(weightedScore.toFixed(4)),
        rationale: input.rationale ?? null,
        authorId: userId,
      },
      select: { id: true, score: true, weightedScore: true },
    });

    // Moving out of ASSIGNED on first scoring activity.
    if (assignment.status === "ASSIGNED") {
      await this.prisma.evaluationAssignment.update({
        where: { id: assignmentId },
        data: { status: "IN_PROGRESS" },
        select: { id: true },
      });
    }

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "evaluation.scored",
        entityType: "EvaluationScore",
        entityId: score.id,
        metadata: {
          assignmentId,
          bidId: input.bidId,
          criterionId: input.criterionId,
          score: input.score,
          weightedScore,
        },
      }),
    );

    return {
      id: score.id,
      score: Number(score.score),
      weightedScore: Number(score.weightedScore),
    };
  }

  async createComment(
    assignmentId: string,
    userId: string,
    input: CreateEvaluationCommentInput,
    request: RequestWithActor,
  ) {
    const assignment = await this.loadAssignmentForEvaluator(assignmentId, userId);
    if (assignment.status === "SUBMITTED") {
      throw new AppException(
        ErrorCode.EVALUATION_ALREADY_SUBMITTED,
        "This evaluation has been submitted; comments are now read-only.",
        409,
      );
    }

    const comment = await this.prisma.evaluationComment.create({
      data: {
        assignmentId,
        bidId: input.bidId,
        criterionId: input.criterionId ?? null,
        body: input.body,
        isDraft: input.isDraft,
        authorId: userId,
      },
      select: { id: true, isDraft: true },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "evaluation.comment_created",
        entityType: "EvaluationComment",
        entityId: comment.id,
      }),
    );

    return comment;
  }

  // --- Submission -------------------------------------------------------------

  /**
   * Submits an evaluation. Recomputes the weighted total server-side and
   * requires a conflict-of-interest declaration first.
   */
  async submit(
    assignmentId: string,
    userId: string,
    input: SubmitEvaluationInput,
    request: RequestWithActor,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const assignment = await tx.evaluationAssignment.findFirst({
        where: { id: assignmentId, evaluatorId: userId },
        select: {
          id: true,
          status: true,
          tenderId: true,
          conflictDeclarations: {
            where: { declarantId: userId },
            select: { hasConflict: true },
            take: 1,
          },
        },
      });
      if (!assignment) {
        throw new AppException(
          ErrorCode.NOT_ASSIGNED_EVALUATOR,
          "You are not assigned to evaluate this tender.",
          403,
        );
      }
      if (assignment.status === "SUBMITTED") {
        throw new AppException(
          ErrorCode.EVALUATION_ALREADY_SUBMITTED,
          "This evaluation has already been submitted.",
          409,
        );
      }

      // COI must be declared before submission (the contract enforces the
      // literal `true`, but we double-check a record actually exists).
      const declaration = assignment.conflictDeclarations[0];
      if (!declaration) {
        throw new AppException(
          ErrorCode.CONFLICT_NOT_DECLARED,
          "Declare your conflict-of-interest status before submitting.",
          409,
        );
      }

      // Recompute the weighted total from the scores — never trust a client value.
      const scores = await tx.evaluationScore.findMany({
        where: { assignmentId },
        select: { weightedScore: true },
      });
      const totalScore = scores.reduce((sum, s) => sum + Number(s.weightedScore), 0);

      const submitted = await tx.evaluationAssignment.update({
        where: { id: assignmentId },
        data: {
          status: "SUBMITTED",
          submittedAt: new Date(),
          totalScore: new Prisma.Decimal(totalScore.toFixed(2)),
        },
        select: { id: true, status: true, totalScore: true, submittedAt: true },
      });

      // Promote draft comments to final on submission.
      await tx.evaluationComment.updateMany({
        where: { assignmentId, isDraft: true },
        data: { isDraft: false },
      });

      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "evaluation.submitted",
          entityType: "EvaluationAssignment",
          entityId: assignmentId,
          severity: "NOTICE",
          metadata: { tenderId: assignment.tenderId, totalScore },
        }),
      );

      return {
        id: submitted.id,
        status: submitted.status,
        totalScore: Number(submitted.totalScore),
        submittedAt: submitted.submittedAt?.toISOString() ?? null,
        summary: input.summary ?? null,
      };
    });
  }

  /** The evaluator's full view of one assignment: scores, comments, criteria. */
  async getAssignment(assignmentId: string, userId: string) {
    const assignment = await this.prisma.evaluationAssignment.findFirst({
      where: { id: assignmentId, evaluatorId: userId },
      select: {
        id: true,
        stage: true,
        status: true,
        assignedAt: true,
        dueAt: true,
        submittedAt: true,
        totalScore: true,
        tender: {
          select: {
            id: true,
            referenceNumber: true,
            title: true,
            status: true,
            weightedScoringEnabled: true,
          },
        },
        conflictDeclarations: {
          where: { declarantId: userId },
          select: { hasConflict: true, statement: true },
        },
        scores: {
          select: {
            id: true,
            bidId: true,
            criterionId: true,
            score: true,
            weightedScore: true,
            rationale: true,
          },
        },
        comments: {
          where: { authorId: userId },
          select: { id: true, bidId: true, criterionId: true, body: true, isDraft: true },
        },
      },
    });
    if (!assignment) {
      throw new AppException(
        ErrorCode.NOT_ASSIGNED_EVALUATOR,
        "You are not assigned to this evaluation.",
        403,
      );
    }

    const criteria = await this.prisma.evaluationCriterion.findMany({
      where: { tenderId: assignment.tender.id },
      select: CRITERIA_SELECT,
      orderBy: { sortOrder: "asc" },
    });

    return {
      ...assignment,
      totalScore: assignment.totalScore ? Number(assignment.totalScore) : null,
      criteria,
    };
  }

  // --- Private helpers --------------------------------------------------------

  private async loadAssignmentForEvaluator(assignmentId: string, userId: string) {
    const assignment = await this.prisma.evaluationAssignment.findFirst({
      where: { id: assignmentId, evaluatorId: userId },
      select: { id: true, tenderId: true, status: true },
    });
    if (!assignment) {
      throw new AppException(
        ErrorCode.NOT_ASSIGNED_EVALUATOR,
        "You are not assigned to this evaluation.",
        403,
      );
    }
    return assignment;
  }
}
