/**
 * Chereta shared contracts — the single source of truth for request validation,
 * response shapes and TypeScript types across the API and the web app.
 *
 * The API validates incoming requests with these schemas through Nest 12's
 * Standard Schema validation pipe; the web app validates forms with the same
 * schemas via zodResolver, and types both sides from the inferred types.
 */

// Common primitives
export {
  paginationSchema,
  tenderSortSchema,
  sortDirectionSchema,
  uuidSchema,
  emailSchema,
  passwordSchema,
  ethiopianPhoneSchema,
  currencySchema,
  moneySchema,
  timestampSchema,
  dateOnlySchema,
  countryCodeSchema,
  nonEmptyString,
  optionalString,
  urlSchema,
} from "./common.js";
export type { PaginationInput, PaginatedResponse, TenderSort } from "./common.js";

// Auth
export {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateProfileSchema,
  authUserSchema,
  authResponseSchema,
} from "./auth.js";
export type {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
  AuthUser,
  AuthResponse,
} from "./auth.js";

// Organizations
export {
  organizationTypeSchema,
  organizationRoleSchema,
  organizationVerificationStatusSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  inviteMemberSchema,
  updateMemberSchema,
  submitVerificationSchema,
  verificationDecisionSchema,
  organizationSchema,
  organizationMemberSchema,
  organizationSummarySchema,
} from "./organizations.js";
export type {
  OrganizationType,
  OrganizationRole,
  OrganizationVerificationStatus,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  InviteMemberInput,
  UpdateMemberInput,
  SubmitVerificationInput,
  VerificationDecisionInput,
  Organization,
  OrganizationMember,
  OrganizationSummary,
} from "./organizations.js";

// Tenders
export {
  tenderStatusSchema,
  procurementMethodSchema,
  tenderTypeSchema,
  budgetVisibilitySchema,
  documentVisibilitySchema,
  evaluationStageSchema,
  evaluationCriterionInputSchema,
  eligibilityRequirementInputSchema,
  requiredDocumentInputSchema,
  createTenderSchema,
  updateTenderSchema,
  publishTenderSchema,
  submitForApprovalSchema,
  cancelTenderSchema,
  createAmendmentSchema,
  listTendersQuerySchema,
  tenderSummarySchema,
  tenderAttachmentSchema,
  tenderDetailSchema,
} from "./tenders.js";
export type {
  TenderStatus,
  CreateTenderInput,
  UpdateTenderInput,
  PublishTenderInput,
  CancelTenderInput,
  CreateAmendmentInput,
  ListTendersQuery,
  TenderSummary,
  TenderAttachment,
  TenderDetail,
} from "./tenders.js";

// Bids
export {
  bidStatusSchema,
  createBidSchema,
  updateBidSchema,
  withdrawBidSchema,
  bidAttachmentSchema,
  bidDetailSchema,
  bidMetadataSchema,
  bidReceiptSchema,
  bidRevisionSchema,
} from "./bids.js";
export type {
  BidStatus,
  CreateBidInput,
  UpdateBidInput,
  WithdrawBidInput,
  BidAttachment,
  BidDetail,
  BidMetadata,
  BidReceipt,
  BidRevision,
} from "./bids.js";

// Evaluations, awards, clarifications, documents, notifications
export {
  evaluationStatusSchema,
  createEvaluationAssignmentSchema,
  upsertScoreSchema,
  createEvaluationCommentSchema,
  declareConflictSchema,
  submitEvaluationSchema,
  createAwardRecommendationSchema,
  createAwardDecisionSchema,
  createClarificationSchema,
  respondToClarificationSchema,
  documentPurposeSchema,
  documentResponseSchema,
  notificationSchema,
  listNotificationsQuerySchema,
  unreadCountSchema,
} from "./evaluations.js";
export type {
  CreateEvaluationAssignmentInput,
  UpsertScoreInput,
  CreateEvaluationCommentInput,
  DeclareConflictInput,
  SubmitEvaluationInput,
  CreateAwardRecommendationInput,
  CreateAwardDecisionInput,
  CreateClarificationInput,
  RespondToClarificationInput,
  DocumentPurpose,
  DocumentResponse,
  Notification,
  ListNotificationsQuery,
  UnreadCount,
} from "./evaluations.js";
