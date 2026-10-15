/**
 * Organization contracts: creation, membership, verification, admin decisions.
 */
import { z } from "zod";
import { countryCodeSchema, emailSchema, nonEmptyString, optionalString, urlSchema, uuidSchema } from "./common.js";

// -----------------------------------------------------------------------------
// Enum mirrors (kept in sync with the Prisma schema)
// -----------------------------------------------------------------------------

export const organizationTypeSchema = z.enum([
  "SOLE_PROPRIETORSHIP",
  "PRIVATE_LIMITED_COMPANY",
  "SHARE_COMPANY",
  "PARTNERSHIP",
  "COOPERATIVE",
  "NGO_ASSOCIATION",
  "GOVERNMENT_AGENCY",
  "INTERNATIONAL_ORGANIZATION",
  "OTHER",
]);

export const organizationRoleSchema = z.enum(["OWNER", "ADMIN", "PUBLISHER", "MEMBER"]);

export const organizationVerificationStatusSchema = z.enum([
  "UNVERIFIED",
  "PENDING",
  "UNDER_REVIEW",
  "VERIFIED",
  "REJECTED",
  "SUSPENDED",
]);

export type OrganizationType = z.infer<typeof organizationTypeSchema>;
export type OrganizationRole = z.infer<typeof organizationRoleSchema>;
export type OrganizationVerificationStatus = z.infer<typeof organizationVerificationStatusSchema>;

// -----------------------------------------------------------------------------
// Create / update
// -----------------------------------------------------------------------------

export const createOrganizationSchema = z.object({
  registeredName: nonEmptyString(300, "Registered business name"),
  tradingName: optionalString(300),
  organizationType: organizationTypeSchema,
  businessRegistrationNumber: optionalString(100),
  taxIdentificationNumber: optionalString(100),
  licenseNumber: optionalString(100),
  procurementClassification: optionalString(200),
  description: optionalString(4000),
  email: emailSchema,
  phone: z.string().trim().min(5, { message: "Phone number is required" }).max(30),
  website: urlSchema,
  addressLine: optionalString(300),
  subCity: optionalString(120),
  city: optionalString(120),
  region: optionalString(120),
  countryCode: countryCodeSchema,
  postalCode: optionalString(20),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

// -----------------------------------------------------------------------------
// Membership
// -----------------------------------------------------------------------------

export const inviteMemberSchema = z.object({
  email: emailSchema,
  role: organizationRoleSchema.default("MEMBER"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;

export const updateMemberSchema = z.object({
  role: organizationRoleSchema.optional(),
  status: z.enum(["ACTIVE", "REVOKED"]).optional(),
});

export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

export const submitVerificationSchema = z.object({
  /** Document IDs previously uploaded through the documents endpoint. */
  documentIds: z.array(uuidSchema).min(1, { message: "Attach at least one verification document" }),
  notes: optionalString(2000),
});

export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;

export const verificationDecisionSchema = z
  .object({
    decision: z.enum(["UNDER_REVIEW", "VERIFIED", "REJECTED", "SUSPENDED"]),
    notes: optionalString(2000),
    reason: optionalString(1000),
  })
  .refine((data) => data.decision === "UNDER_REVIEW" || (data.notes ?? "").length >= 10, {
    message: "Provide reviewer notes when recording a decision",
    path: ["notes"],
  });

export type VerificationDecisionInput = z.infer<typeof verificationDecisionSchema>;

// -----------------------------------------------------------------------------
// Response shapes
// -----------------------------------------------------------------------------

export const organizationSchema = z.object({
  id: z.string(),
  registeredName: z.string(),
  tradingName: z.string().nullable(),
  organizationType: organizationTypeSchema,
  businessRegistrationNumber: z.string().nullable(),
  description: z.string().nullable(),
  email: z.string(),
  phone: z.string(),
  website: z.string().nullable(),
  addressLine: z.string().nullable(),
  subCity: z.string().nullable(),
  city: z.string().nullable(),
  region: z.string().nullable(),
  countryCode: z.string(),
  postalCode: z.string().nullable(),
  verificationStatus: organizationVerificationStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Organization = z.infer<typeof organizationSchema>;

/** The caller's membership in an organization, included in membership listings. */
export const organizationMemberSchema = z.object({
  id: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  role: organizationRoleSchema,
  status: z.enum(["INVITED", "ACTIVE", "REVOKED"]),
  user: z.object({
    id: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  invitedAt: z.string(),
  acceptedAt: z.string().nullable(),
});

export type OrganizationMember = z.infer<typeof organizationMemberSchema>;

/** Organization plus the current user's role, for "my organizations" views. */
export const organizationSummarySchema = organizationSchema.extend({
  myRole: organizationRoleSchema,
  myStatus: z.enum(["INVITED", "ACTIVE", "REVOKED"]),
  memberCount: z.number().int(),
  tenderCount: z.number().int(),
});

export type OrganizationSummary = z.infer<typeof organizationSummarySchema>;
