/**
 * Evaluation, award, clarification, notification and document contracts.
 */
import { z } from "zod";
import { moneySchema, nonEmptyString, optionalString, uuidSchema } from "./common.js";

// -----------------------------------------------------------------------------
// Evaluations
// -----------------------------------------------------------------------------

export const evaluationStatusSchema = z.enum([
  "ASSIGNED",
  "IN_PROGRESS",
  "SUBMITTED",
  "RECALLED",
  "EXPIRED",
]);

export const createEvaluationAssignmentSchema = z.object({
  evaluatorId: uuidSchema,
  stage: z.enum(["TECHNICAL", "FINANCIAL", "COMBINED"]).default("TECHNICAL"),
  evaluatorOrganizationId: uuidSchema.optional(),
  dueAt: z.iso.datetime().optional(),
});

export type CreateEvaluationAssignmentInput = z.infer<typeof createEvaluationAssignmentSchema>;

export const upsertScoreSchema = z.object({
  criterionId: uuidSchema,
  bidId: uuidSchema,
  /** Server validates against the criterion's maxScore and range. */
  score: z.coerce
    .number()
    .min(0, { message: "Score cannot be negative" })
    .max(1000000, { message: "Score is out of range" }),
  rationale: optionalString(2000),
});

export type UpsertScoreInput = z.infer<typeof upsertScoreSchema>;

export const createEvaluationCommentSchema = z.object({
  bidId: uuidSchema,
  criterionId: uuidSchema.optional(),
  body: nonEmptyString(4000, "Comment"),
  isDraft: z.boolean().default(true),
});

export type CreateEvaluationCommentInput = z.infer<typeof createEvaluationCommentSchema>;

export const declareConflictSchema = z.object({
  hasConflict: z.boolean(),
  statement: nonEmptyString(2000, "Statement"),
});

export type DeclareConflictInput = z.infer<typeof declareConflictSchema>;

export const submitEvaluationSchema = z.object({
  /** Server recomputes the weighted total; this is a summary only. */
  summary: optionalString(4000),
  /** Evaluator confirms no undeclared conflict of interest remains. */
  conflictDeclared: z.literal(true, {
    message: "Declare your conflict-of-interest status before submitting",
  }),
});

export type SubmitEvaluationInput = z.infer<typeof submitEvaluationSchema>;

// -----------------------------------------------------------------------------
// Awards
// -----------------------------------------------------------------------------

export const createAwardRecommendationSchema = z.object({
  bidId: uuidSchema,
  rationale: nonEmptyString(2000, "Rationale"),
  /** Method actually applied, e.g. "WEIGHTED_SCORE" or "LOWEST_COMPLIANT_PRICE". */
  scoringMethod: z.enum(["WEIGHTED_SCORE", "LOWEST_COMPLIANT_PRICE", "BEST_VALUE", "OTHER"]),
  isPrimary: z.boolean().default(false),
});

export type CreateAwardRecommendationInput = z.infer<typeof createAwardRecommendationSchema>;

export const createAwardDecisionSchema = z.object({
  bidId: uuidSchema.optional(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  awardedAmount: moneySchema.optional(),
  currency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).default("ETB"),
  justification: nonEmptyString(2000, "Justification"),
  contractReference: optionalString(200),
  /** Publish to the public awards feed immediately. */
  publish: z.boolean().default(false),
});

export type CreateAwardDecisionInput = z.infer<typeof createAwardDecisionSchema>;

// -----------------------------------------------------------------------------
// Clarifications
// -----------------------------------------------------------------------------

export const createClarificationSchema = z.object({
  question: nonEmptyString(4000, "Question"),
  isPublic: z.boolean().default(true),
});

export type CreateClarificationInput = z.infer<typeof createClarificationSchema>;

export const respondToClarificationSchema = z.object({
  answer: nonEmptyString(6000, "Answer"),
  /** Change visibility of the thread when answering. */
  isPublic: z.boolean().optional(),
});

export type RespondToClarificationInput = z.infer<typeof respondToClarificationSchema>;

// -----------------------------------------------------------------------------
// Documents
// -----------------------------------------------------------------------------

/** Purpose of an upload; drives validation, size caps and visibility defaults. */
export const documentPurposeSchema = z.enum([
  "ORGANIZATION_VERIFICATION",
  "TENDER_ATTACHMENT",
  "TENDER_AMENDMENT",
  "BID_ATTACHMENT",
  "CLARIFICATION_ATTACHMENT",
  "EVALUATION_EVIDENCE",
]);

export type DocumentPurpose = z.infer<typeof documentPurposeSchema>;

export const documentResponseSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  contentType: z.string(),
  sizeBytes: z.number().int(),
  checksumSha256: z.string(),
  purpose: documentPurposeSchema.nullable(),
  /** Short-lived signed URL, present only for the uploader or an authorized viewer. */
  downloadUrl: z.string().nullable(),
  createdAt: z.string(),
});

export type DocumentResponse = z.infer<typeof documentResponseSchema>;

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  body: z.string(),
  actionUrl: z.string().nullable(),
  entityType: z.string().nullable(),
  entityId: z.string().nullable(),
  readAt: z.string().nullable(),
  createdAt: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const listNotificationsQuerySchema = z.object({
  unreadOnly: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === "true")),
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().optional(),
});

export type ListNotificationsQuery = z.infer<typeof listNotificationsQuerySchema>;

export const unreadCountSchema = z.object({
  unread: z.number().int(),
});

export type UnreadCount = z.infer<typeof unreadCountSchema>;
