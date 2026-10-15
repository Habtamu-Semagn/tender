/**
 * Bid contracts: submission, revision, withdrawal and the confidential
 * response shapes.
 *
 * SECURITY: `organizationId` is never accepted from a request body. The API
 * derives the submitting organization from the caller's ACTIVE membership, so a
 * user cannot submit on behalf of an organization they do not belong to.
 */
import { z } from "zod";
import { moneySchema, nonEmptyString, optionalString, uuidSchema } from "./common.js";

// -----------------------------------------------------------------------------
// Enum mirrors (kept in sync with the Prisma schema)
// -----------------------------------------------------------------------------

export const bidStatusSchema = z.enum([
  "DRAFT",
  "SUBMITTED",
  "WITHDRAWN",
  "OPENED",
  "UNDER_EVALUATION",
  "EVALUATED",
  "RECOMMENDED",
  "ACCEPTED",
  "REJECTED",
  "AWARDED",
  "UNSUCCESSFUL",
]);

export type BidStatus = z.infer<typeof bidStatusSchema>;

// -----------------------------------------------------------------------------
// Draft create / update
// -----------------------------------------------------------------------------

export const createBidSchema = z.object({
  technicalProposal: optionalString(20000),
  financialProposal: optionalString(20000),
  offeredPrice: moneySchema.optional(),
  offeredCurrency: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/).optional(),
  priceValidityDays: z.coerce.number().int().min(1).max(730).optional(),
  /** Document IDs uploaded through the documents endpoint. */
  attachmentIds: z.array(uuidSchema).max(30).default([]),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;

export const updateBidSchema = createBidSchema.partial();
export type UpdateBidInput = z.infer<typeof updateBidSchema>;

export const withdrawBidSchema = z.object({
  reason: nonEmptyString(500, "Withdrawal reason"),
});

export type WithdrawBidInput = z.infer<typeof withdrawBidSchema>;

// -----------------------------------------------------------------------------
// Response shapes
// -----------------------------------------------------------------------------

export const bidAttachmentSchema = z.object({
  id: z.string(),
  documentId: z.string(),
  label: z.string().nullable(),
  fileName: z.string(),
  sizeBytes: z.number().int(),
  contentType: z.string(),
  isMandatory: z.boolean(),
  /** Short-lived signed URL. Only the owner (or an authorized evaluator after
   * the opening stage) ever receives this. */
  downloadUrl: z.string().nullable(),
  createdAt: z.string(),
});

export type BidAttachment = z.infer<typeof bidAttachmentSchema>;

/** The bidder's own view of a bid — full contents are included. */
export const bidDetailSchema = z.object({
  id: z.string(),
  tenderId: z.string(),
  tenderReference: z.string(),
  tenderTitle: z.string(),
  tenderStatus: z.string(),
  submissionReference: z.string(),
  status: bidStatusSchema,
  revisionNumber: z.number().int(),
  technicalProposal: z.string().nullable(),
  financialProposal: z.string().nullable(),
  offeredPrice: z.string().nullable(),
  offeredCurrency: z.string().nullable(),
  priceValidityDays: z.number().int().nullable(),
  integrityHash: z.string().nullable(),
  submittedAt: z.string().nullable(),
  withdrawnAt: z.string().nullable(),
  withdrawalReason: z.string().nullable(),
  /** Server time at response generation, so the UI can compute countdowns
   * without trusting the browser clock. */
  serverTime: z.string(),
  /** Deadline echoed from the tender for client-side display only. */
  submissionDeadline: z.string().nullable(),
  /** Whether the tender still accepts submissions per server-side rules. */
  acceptsSubmissions: z.boolean(),
  attachments: z.array(bidAttachmentSchema),
  requiredDocuments: z.array(
    z.object({
      id: z.string(),
      code: z.string(),
      title: z.string(),
      isMandatory: z.boolean(),
      isProvided: z.boolean(),
      isCompliant: z.boolean().nullable(),
    }),
  ),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type BidDetail = z.infer<typeof bidDetailSchema>;

/**
 * Metadata-only view. This is what a tender publisher sees before the opening
 * stage: it deliberately contains NO proposal contents, prices or attachments.
 */
export const bidMetadataSchema = z.object({
  id: z.string(),
  submissionReference: z.string(),
  status: bidStatusSchema,
  revisionNumber: z.number().int(),
  organization: z.object({
    id: z.string(),
    registeredName: z.string(),
    verificationStatus: z.string(),
  }),
  submittedAt: z.string().nullable(),
  attachmentCount: z.number().int(),
  /** True when the tender's required documents were all supplied. */
  requiredDocumentsComplete: z.boolean(),
  /** Set after the opening stage. */
  openedAt: z.string().nullable(),
});

export type BidMetadata = z.infer<typeof bidMetadataSchema>;

/** Receipt returned immediately after a successful submission. */
export const bidReceiptSchema = z.object({
  bidId: z.string(),
  submissionReference: z.string(),
  tenderId: z.string(),
  tenderReference: z.string(),
  submittedAt: z.string(),
  revisionNumber: z.number().int(),
  integrityHash: z.string(),
  status: bidStatusSchema,
  attachmentCount: z.number().int(),
});

export type BidReceipt = z.infer<typeof bidReceiptSchema>;

/** A historical revision of a submitted bid. */
export const bidRevisionSchema = z.object({
  id: z.string(),
  revisionNumber: z.number().int(),
  offeredPrice: z.string().nullable(),
  offeredCurrency: z.string().nullable(),
  integrityHash: z.string().nullable(),
  attachmentCount: z.number().int(),
  submittedAt: z.string(),
  author: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
});

export type BidRevision = z.infer<typeof bidRevisionSchema>;
