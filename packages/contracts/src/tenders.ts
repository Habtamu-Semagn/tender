/**
 * Tender contracts: lifecycle enums, creation/update, amendments,
 * discovery query parameters and response shapes.
 */
import { z } from "zod";
import {
  currencySchema,
  moneySchema,
  nonEmptyString,
  optionalString,
  paginationSchema,
  timestampSchema,
  uuidSchema,
} from "./common.js";

// -----------------------------------------------------------------------------
// Enum mirrors (kept in sync with the Prisma schema)
// -----------------------------------------------------------------------------

export const tenderStatusSchema = z.enum([
  "DRAFT",
  "PENDING_APPROVAL",
  "PUBLISHED",
  "OPEN_FOR_SUBMISSION",
  "SUBMISSION_CLOSED",
  "OPENING_IN_PROGRESS",
  "UNDER_EVALUATION",
  "AWARDED",
  "CANCELLED",
  "ARCHIVED",
]);

export type TenderStatus = z.infer<typeof tenderStatusSchema>;

export const procurementMethodSchema = z.enum([
  "OPEN_TENDER",
  "RESTRICTED_TENDER",
  "REQUEST_FOR_QUOTATION",
  "REQUEST_FOR_PROPOSAL",
  "DIRECT_PROCUREMENT",
  "TWO_STAGE_TENDER",
  "FRAMEWORK_AGREEMENT",
]);

export const tenderTypeSchema = z.enum([
  "GOODS",
  "CONSTRUCTION_WORKS",
  "CONSULTING_SERVICES",
  "NON_CONSULTING_SERVICES",
  "SUPPLIES",
  "GENERAL_SERVICES",
  "OTHER",
]);

export const budgetVisibilitySchema = z.enum(["PUBLIC", "PARTICIPANTS", "PRIVATE"]);

export const documentVisibilitySchema = z.enum(["PUBLIC", "PARTICIPANTS", "PRIVATE"]);

export const evaluationStageSchema = z.enum(["TECHNICAL", "FINANCIAL", "COMBINED"]);

// -----------------------------------------------------------------------------
// Evaluation criteria (used at create/update time)
// -----------------------------------------------------------------------------

export const evaluationCriterionInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { message: "Criterion code is required" })
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Use letters, numbers, hyphens and underscores" }),
  title: nonEmptyString(200, "Criterion title"),
  description: optionalString(1000),
  stage: evaluationStageSchema.default("TECHNICAL"),
  /** Weight in percentage points. */
  weight: z.coerce
    .number()
    .min(0, { message: "Weight cannot be negative" })
    .max(100, { message: "Weight cannot exceed 100" }),
  maxScore: z.coerce.number().positive({ message: "Maximum score must be greater than zero" }).max(1000000),
  isMandatory: z.boolean().default(false),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type EvaluationCriterionInput = z.infer<typeof evaluationCriterionInputSchema>;

export const eligibilityRequirementInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { message: "Requirement code is required" })
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Use letters, numbers, hyphens and underscores" }),
  title: nonEmptyString(200, "Requirement title"),
  description: optionalString(1000),
  requirementType: optionalString(60),
  isMandatory: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type EligibilityRequirementInput = z.infer<typeof eligibilityRequirementInputSchema>;

export const requiredDocumentInputSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, { message: "Document code is required" })
    .max(40)
    .regex(/^[A-Za-z0-9_-]+$/, { message: "Use letters, numbers, hyphens and underscores" }),
  title: nonEmptyString(200, "Document title"),
  description: optionalString(1000),
  isMandatory: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type RequiredDocumentInput = z.infer<typeof requiredDocumentInputSchema>;

// -----------------------------------------------------------------------------
// Create / update
// -----------------------------------------------------------------------------

/**
 * The unrefined field set. Kept separate from `createTenderSchema` so that
 * cross-field refinements (weights, date ordering) can be layered on top while
 * still allowing a `.partial()` update schema to be derived from it.
 */
const createTenderFields = {
  title: nonEmptyString(300, "Tender title"),
  description: nonEmptyString(2000, "Description"),
  scopeOfWork: optionalString(8000),
  categoryId: uuidSchema.optional(),
  procurementMethod: procurementMethodSchema.default("OPEN_TENDER"),
  tenderType: tenderTypeSchema.default("GOODS"),
  estimatedBudget: moneySchema.optional(),
  currency: currencySchema.default("ETB"),
  budgetVisibility: budgetVisibilitySchema.default("PUBLIC"),
  eligibilitySummary: optionalString(4000),
  eligibilityRequirements: z.array(eligibilityRequirementInputSchema).max(50).default([]),
  requiredDocuments: z.array(requiredDocumentInputSchema).max(50).default([]),
  evaluationCriteria: z.array(evaluationCriterionInputSchema).max(50).default([]),
  weightedScoringEnabled: z.boolean().default(true),
  requiresSealedBids: z.boolean().default(true),
  requiresTwoPartyOpening: z.boolean().default(true),

  // Location
  locationDescription: optionalString(500),
  region: optionalString(120),
  city: optionalString(120),
  subCity: optionalString(120),

  // Lifecycle timestamps
  clarificationDeadline: timestampSchema.optional(),
  openingAt: timestampSchema.optional(),
  submissionDeadline: timestampSchema.optional(),
  evaluationStartAt: timestampSchema.optional(),
  evaluationEndAt: timestampSchema.optional(),
  expectedAwardDate: timestampSchema.optional(),

  // Contact
  contactName: optionalString(200),
  contactEmail: z.string().trim().email().optional().or(z.literal("").transform(() => undefined)),
  contactPhone: optionalString(30),
  clarificationInstructions: optionalString(2000),

  /** Public attachment document IDs. */
  attachmentIds: z.array(uuidSchema).max(30).default([]),
};

export const createTenderSchema = z
  .object(createTenderFields)
  .refine(
    (data) => {
      // Weighted scoring requires weights summing to 100 (within 0.01 tolerance).
      if (!data.weightedScoringEnabled) return true;
      if (data.evaluationCriteria.length === 0) return true;
      const total = data.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0);
      return Math.abs(total - 100) < 0.01;
    },
    {
      message: "Evaluation criterion weights must sum to 100 when weighted scoring is enabled",
      path: ["evaluationCriteria"],
    },
  )
  .refine(
    (data) => {
      // Deadline ordering sanity: clarification before submission deadline.
      if (data.clarificationDeadline && data.submissionDeadline) {
        return new Date(data.clarificationDeadline) <= new Date(data.submissionDeadline);
      }
      return true;
    },
    {
      message: "Clarification deadline must not be after the submission deadline",
      path: ["clarificationDeadline"],
    },
  )
  .refine(
    (data) => {
      if (data.submissionDeadline && data.evaluationStartAt) {
        return new Date(data.submissionDeadline) <= new Date(data.evaluationStartAt);
      }
      return true;
    },
    {
      message: "Evaluation start must not be before the submission deadline",
      path: ["evaluationStartAt"],
    },
  );

export type CreateTenderInput = z.infer<typeof createTenderSchema>;

/**
 * Update schema. Derived from the unrefined field set so `.partial()` is
 * allowed, then the same cross-field refinements are re-applied — but only for
 * the fields the request actually sends, since a PATCH may legitimately change
 * one date at a time.
 */
export const updateTenderSchema = z
  .object(createTenderFields)
  .partial()
  .refine(
    (data) => {
      // Weights are validated on the whole set only when both are present in
      // this request; the service re-checks the merged record before publishing.
      if (data.weightedScoringEnabled !== true) return true;
      if (!data.evaluationCriteria || data.evaluationCriteria.length === 0) return true;
      const total = data.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0);
      return Math.abs(total - 100) < 0.01;
    },
    {
      message: "Evaluation criterion weights must sum to 100 when weighted scoring is enabled",
      path: ["evaluationCriteria"],
    },
  )
  .refine(
    (data) => {
      if (data.clarificationDeadline && data.submissionDeadline) {
        return new Date(data.clarificationDeadline) <= new Date(data.submissionDeadline);
      }
      return true;
    },
    {
      message: "Clarification deadline must not be after the submission deadline",
      path: ["clarificationDeadline"],
    },
  )
  .refine(
    (data) => {
      if (data.submissionDeadline && data.evaluationStartAt) {
        return new Date(data.submissionDeadline) <= new Date(data.evaluationStartAt);
      }
      return true;
    },
    {
      message: "Evaluation start must not be before the submission deadline",
      path: ["evaluationStartAt"],
    },
  );

export type UpdateTenderInput = z.infer<typeof updateTenderSchema>;

/** Publish-time validation is stricter: dates, documents and criteria are required. */
export const publishTenderSchema = z
  .object({
    /** Publisher confirms the tender is ready for disclosure. */
    confirmPublication: z.literal(true, {
      message: "Confirm that this tender is ready to publish",
    }),
    publishedAt: timestampSchema.optional(),
  })
  .optional();

export type PublishTenderInput = z.infer<typeof publishTenderSchema>;

export const submitForApprovalSchema = z
  .object({
    notes: optionalString(2000),
  })
  .optional();

export const cancelTenderSchema = z.object({
  reason: nonEmptyString(500, "Cancellation reason"),
});

export type CancelTenderInput = z.infer<typeof cancelTenderSchema>;

// -----------------------------------------------------------------------------
// Amendments
// -----------------------------------------------------------------------------

export const createAmendmentSchema = z.object({
  title: nonEmptyString(300, "Amendment title"),
  description: nonEmptyString(2000, "Describe what changed"),
  changesSummary: optionalString(2000),
  effectiveAt: timestampSchema,
  newSubmissionDeadline: timestampSchema.optional(),
  newClarificationDeadline: timestampSchema.optional(),
  /** Replacement or additional document IDs. */
  attachmentIds: z.array(uuidSchema).max(30).default([]),
});

export type CreateAmendmentInput = z.infer<typeof createAmendmentSchema>;

// -----------------------------------------------------------------------------
// Discovery / listing
// -----------------------------------------------------------------------------

export const listTendersQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(200).optional(),
  referenceNumber: z.string().trim().max(60).optional(),
  categoryId: uuidSchema.optional(),
  /** Filter by category and its descendants. */
  categoryCode: z.string().trim().max(40).optional(),
  organizationId: uuidSchema.optional(),
  region: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  procurementMethod: procurementMethodSchema.optional(),
  tenderType: tenderTypeSchema.optional(),
  status: tenderStatusSchema.optional(),
  /** Multiple statuses for "open + closing soon" style views. */
  statuses: z
    .union([tenderStatusSchema, z.array(tenderStatusSchema)])
    .optional()
    .transform((v) => (v === undefined ? undefined : Array.isArray(v) ? v : [v])),
  publishedFrom: timestampSchema.optional(),
  publishedTo: timestampSchema.optional(),
  closingBefore: timestampSchema.optional(),
  closingAfter: timestampSchema.optional(),
  minBudget: moneySchema.optional(),
  maxBudget: moneySchema.optional(),
  sort: z
    .enum(["newest", "closing_soon", "deadline", "relevance", "budget_high", "budget_low"])
    .default("newest"),
  /** Only tenders the caller has saved. */
  savedOnly: z
    .union([z.boolean(), z.enum(["true", "false"])])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === true || v === "true")),
});

export type ListTendersQuery = z.infer<typeof listTendersQuerySchema>;

// -----------------------------------------------------------------------------
// Response shapes
// -----------------------------------------------------------------------------

export const tenderSummarySchema = z.object({
  id: z.string(),
  referenceNumber: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  procurementMethod: procurementMethodSchema,
  tenderType: tenderTypeSchema,
  status: tenderStatusSchema,
  organization: z.object({
    id: z.string(),
    registeredName: z.string(),
    tradingName: z.string().nullable(),
    verificationStatus: z.string(),
    city: z.string().nullable(),
    region: z.string().nullable(),
  }),
  category: z
    .object({
      id: z.string(),
      code: z.string(),
      name: z.string(),
    })
    .nullable(),
  region: z.string().nullable(),
  city: z.string().nullable(),
  /** Null when the budget is not publicly visible. */
  estimatedBudget: z.string().nullable(),
  currency: z.string(),
  publishedAt: z.string().nullable(),
  submissionDeadline: z.string().nullable(),
  clarificationDeadline: z.string().nullable(),
  /** Milliseconds until the deadline, or null when no deadline is set. */
  msUntilDeadline: z.number().nullable(),
  attachmentCount: z.number().int(),
  amendmentCount: z.number().int(),
  isSaved: z.boolean(),
});

export type TenderSummary = z.infer<typeof tenderSummarySchema>;

export const tenderAttachmentSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  label: z.string().nullable(),
  fileName: z.string(),
  sizeBytes: z.number().int(),
  contentType: z.string(),
  visibility: documentVisibilitySchema,
  isRequired: z.boolean(),
  /** Short-lived signed URL, only present when the caller may download it. */
  downloadUrl: z.string().nullable(),
  createdAt: z.string(),
});

export type TenderAttachment = z.infer<typeof tenderAttachmentSchema>;

export const tenderDetailSchema = tenderSummarySchema.extend({
  scopeOfWork: z.string().nullable(),
  eligibilitySummary: z.string().nullable(),
  locationDescription: z.string().nullable(),
  subCity: z.string().nullable(),
  openingAt: z.string().nullable(),
  evaluationStartAt: z.string().nullable(),
  evaluationEndAt: z.string().nullable(),
  expectedAwardDate: z.string().nullable(),
  budgetVisibility: budgetVisibilitySchema,
  weightedScoringEnabled: z.boolean(),
  requiresSealedBids: z.boolean(),
  contactName: z.string().nullable(),
  contactEmail: z.string().nullable(),
  contactPhone: z.string().nullable(),
  clarificationInstructions: z.string().nullable(),
  amendmentCount: z.number().int(),
  version: z.number().int(),
  attachments: z.array(tenderAttachmentSchema),
  eligibilityRequirements: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      isMandatory: z.boolean(),
    }),
  ),
  requiredDocuments: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      isMandatory: z.boolean(),
    }),
  ),
  /** Criteria are only disclosed when the tender's rules allow it. */
  evaluationCriteria: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      title: z.string(),
      description: z.string().nullable(),
      stage: evaluationStageSchema,
      weight: z.string(),
      maxScore: z.string(),
      isMandatory: z.boolean(),
    }),
  ),
  amendments: z.array(
    z.object({
      id: z.string(),
      amendmentRef: z.string(),
      version: z.number().int(),
      title: z.string(),
      description: z.string(),
      effectiveAt: z.string(),
      newSubmissionDeadline: z.string().nullable(),
      createdAt: z.string(),
    }),
  ),
  /** Submission count is only included for authorized organization members. */
  submissionCount: z.number().int().optional(),
  /** True when the caller's organization has an active bid on this tender. */
  hasMyBid: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TenderDetail = z.infer<typeof tenderDetailSchema>;
