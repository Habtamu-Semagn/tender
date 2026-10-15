-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPPLIER', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'ADMIN', 'PUBLISHER', 'MEMBER');

-- CreateEnum
CREATE TYPE "OrganizationVerificationStatus" AS ENUM ('UNVERIFIED', 'PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('SOLE_PROPRIETORSHIP', 'PRIVATE_LIMITED_COMPANY', 'SHARE_COMPANY', 'PARTNERSHIP', 'COOPERATIVE', 'NGO_ASSOCIATION', 'GOVERNMENT_AGENCY', 'INTERNATIONAL_ORGANIZATION', 'OTHER');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('INVITED', 'ACTIVE', 'REVOKED');

-- CreateEnum
CREATE TYPE "TenderStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'PUBLISHED', 'OPEN_FOR_SUBMISSION', 'SUBMISSION_CLOSED', 'OPENING_IN_PROGRESS', 'UNDER_EVALUATION', 'AWARDED', 'CANCELLED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProcurementMethod" AS ENUM ('OPEN_TENDER', 'RESTRICTED_TENDER', 'REQUEST_FOR_QUOTATION', 'REQUEST_FOR_PROPOSAL', 'DIRECT_PROCUREMENT', 'TWO_STAGE_TENDER', 'FRAMEWORK_AGREEMENT');

-- CreateEnum
CREATE TYPE "TenderType" AS ENUM ('GOODS', 'CONSTRUCTION_WORKS', 'CONSULTING_SERVICES', 'NON_CONSULTING_SERVICES', 'SUPPLIES', 'GENERAL_SERVICES', 'OTHER');

-- CreateEnum
CREATE TYPE "BudgetVisibility" AS ENUM ('PUBLIC', 'PARTICIPANTS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('PUBLIC', 'PARTICIPANTS', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'WITHDRAWN', 'OPENED', 'UNDER_EVALUATION', 'EVALUATED', 'RECOMMENDED', 'ACCEPTED', 'REJECTED', 'AWARDED', 'UNSUCCESSFUL');

-- CreateEnum
CREATE TYPE "EvaluationStage" AS ENUM ('TECHNICAL', 'FINANCIAL', 'COMBINED');

-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'RECALLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AwardDecisionStatus" AS ENUM ('RECOMMENDED', 'APPROVED', 'REJECTED', 'PUBLISHED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ClarificationStatus" AS ENUM ('OPEN', 'ANSWERED', 'CLOSED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'ORGANIZATION_VERIFICATION_SUBMITTED', 'ORGANIZATION_VERIFICATION_APPROVED', 'ORGANIZATION_VERIFICATION_REJECTED', 'ORGANIZATION_INVITATION', 'TENDER_PUBLISHED', 'TENDER_AMENDED', 'TENDER_CANCELLED', 'TENDER_CLOSING_SOON', 'CLARIFICATION_ANSWERED', 'BID_SUBMITTED', 'BID_WITHDRAWN', 'BID_OPENED', 'EVALUATION_ASSIGNED', 'EVALUATION_SUBMITTED', 'AWARD_RECOMMENDED', 'AWARD_APPROVED', 'AWARD_PUBLISHED', 'ACCOUNT_SUSPENDED', 'SECURITY_ALERT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'DEAD');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'NOTICE', 'WARNING', 'CRITICAL');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMPTZ(6),
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'SUPPLIER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "mfaSecret" TEXT,
    "preferredLanguage" TEXT NOT NULL DEFAULT 'en',
    "preferredTimezone" TEXT NOT NULL DEFAULT 'Africa/Addis_Ababa',
    "lastLoginAt" TIMESTAMPTZ(6),
    "suspendedAt" TIMESTAMPTZ(6),
    "suspendedReason" TEXT,
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "revokedAt" TIMESTAMPTZ(6),
    "revokedReason" TEXT,
    "replacedById" UUID,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_tokens" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ(6) NOT NULL,
    "consumedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "registeredName" TEXT NOT NULL,
    "tradingName" TEXT,
    "organizationType" "OrganizationType" NOT NULL DEFAULT 'PRIVATE_LIMITED_COMPANY',
    "businessRegistrationNumber" TEXT,
    "taxIdentificationNumber" TEXT,
    "licenseNumber" TEXT,
    "procurementClassification" TEXT,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "website" TEXT,
    "addressLine" TEXT,
    "subCity" TEXT,
    "city" TEXT,
    "region" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'ET',
    "postalCode" TEXT,
    "verificationStatus" "OrganizationVerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationNotes" TEXT,
    "verifiedAt" TIMESTAMPTZ(6),
    "verifiedById" UUID,
    "suspendedAt" TIMESTAMPTZ(6),
    "suspensionReason" TEXT,
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'MEMBER',
    "status" "MemberStatus" NOT NULL DEFAULT 'INVITED',
    "invitedById" UUID,
    "invitedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" TIMESTAMPTZ(6),
    "revokedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_verification_requests" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "status" "OrganizationVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "submittedNotes" TEXT,
    "reviewNotes" TEXT,
    "decisionReason" TEXT,
    "reviewedById" UUID,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organization_verification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" UUID NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "checksumSha256" TEXT NOT NULL,
    "uploadedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),
    "verificationRequestId" UUID,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_categories" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAmharic" TEXT,
    "description" TEXT,
    "parentId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tender_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenders" (
    "id" UUID NOT NULL,
    "referenceNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scopeOfWork" TEXT,
    "organizationId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "categoryId" UUID,
    "procurementMethod" "ProcurementMethod" NOT NULL DEFAULT 'OPEN_TENDER',
    "tenderType" "TenderType" NOT NULL DEFAULT 'GOODS',
    "status" "TenderStatus" NOT NULL DEFAULT 'DRAFT',
    "locationDescription" TEXT,
    "region" TEXT,
    "city" TEXT,
    "subCity" TEXT,
    "estimatedBudget" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "budgetVisibility" "BudgetVisibility" NOT NULL DEFAULT 'PUBLIC',
    "eligibilitySummary" TEXT,
    "publishedAt" TIMESTAMPTZ(6),
    "clarificationDeadline" TIMESTAMPTZ(6),
    "openingAt" TIMESTAMPTZ(6),
    "submissionDeadline" TIMESTAMPTZ(6),
    "evaluationStartAt" TIMESTAMPTZ(6),
    "evaluationEndAt" TIMESTAMPTZ(6),
    "expectedAwardDate" TIMESTAMPTZ(6),
    "cancelledAt" TIMESTAMPTZ(6),
    "archivedAt" TIMESTAMPTZ(6),
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "clarificationInstructions" TEXT,
    "weightedScoringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "requiresSealedBids" BOOLEAN NOT NULL DEFAULT true,
    "requiresTwoPartyOpening" BOOLEAN NOT NULL DEFAULT true,
    "amendmentCount" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "cancellationReason" TEXT,
    "submissionOpenedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "tenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_status_history" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "fromStatus" "TenderStatus",
    "toStatus" "TenderStatus" NOT NULL,
    "reason" TEXT,
    "actorId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tender_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_attachments" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "label" TEXT,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'PUBLIC',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tender_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eligibility_requirements" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requirementType" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "eligibility_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "required_documents" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "required_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_criteria" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "stage" "EvaluationStage" NOT NULL DEFAULT 'TECHNICAL',
    "weight" DECIMAL(6,2) NOT NULL,
    "maxScore" DECIMAL(8,2) NOT NULL,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "evaluation_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_amendments" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "amendmentRef" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "changesSummary" TEXT,
    "effectiveAt" TIMESTAMPTZ(6) NOT NULL,
    "newSubmissionDeadline" TIMESTAMPTZ(6),
    "newClarificationDeadline" TIMESTAMPTZ(6),
    "authorId" UUID NOT NULL,
    "notificationsSentAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tender_amendments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tender_amendment_attachments" (
    "id" UUID NOT NULL,
    "amendmentId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "label" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tender_amendment_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bids" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "submittedById" UUID NOT NULL,
    "submissionReference" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'DRAFT',
    "technicalProposal" TEXT,
    "financialProposal" TEXT,
    "offeredPrice" DECIMAL(18,2),
    "offeredCurrency" VARCHAR(3),
    "priceValidityDays" INTEGER,
    "submittedAt" TIMESTAMPTZ(6),
    "withdrawnAt" TIMESTAMPTZ(6),
    "withdrawalReason" TEXT,
    "revisionNumber" INTEGER NOT NULL DEFAULT 0,
    "integrityHash" TEXT,
    "openedAt" TIMESTAMPTZ(6),
    "evaluatedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "bids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_revisions" (
    "id" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "technicalProposal" TEXT,
    "financialProposal" TEXT,
    "offeredPrice" DECIMAL(18,2),
    "offeredCurrency" VARCHAR(3),
    "attachmentManifest" JSONB,
    "integrityHash" TEXT,
    "authorId" UUID NOT NULL,
    "submittedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_attachments" (
    "id" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "label" TEXT,
    "visibility" "DocumentVisibility" NOT NULL DEFAULT 'PRIVATE',
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_document_compliance" (
    "id" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "requiredDocumentId" UUID NOT NULL,
    "documentId" UUID,
    "isProvided" BOOLEAN NOT NULL DEFAULT false,
    "isCompliant" BOOLEAN,
    "screeningNote" TEXT,
    "screenedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_document_compliance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bid_opening_records" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "bidId" UUID,
    "operatorId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "authorization" TEXT NOT NULL,
    "policySnapshot" JSONB,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bid_opening_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_assignments" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "evaluatorId" UUID NOT NULL,
    "evaluatorOrganizationId" UUID,
    "stage" "EvaluationStage" NOT NULL DEFAULT 'TECHNICAL',
    "status" "EvaluationStatus" NOT NULL DEFAULT 'ASSIGNED',
    "assignedById" UUID NOT NULL,
    "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMPTZ(6),
    "submittedAt" TIMESTAMPTZ(6),
    "totalScore" DECIMAL(10,2),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "evaluation_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_scores" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "criterionId" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "score" DECIMAL(8,2) NOT NULL,
    "maxScoreAtEntry" DECIMAL(8,2) NOT NULL,
    "weightAtEntry" DECIMAL(6,2) NOT NULL,
    "weightedScore" DECIMAL(10,4) NOT NULL,
    "rationale" TEXT,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "evaluation_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_comments" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "criterionId" UUID,
    "body" TEXT NOT NULL,
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "evaluation_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_evidence" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "criterionId" UUID,
    "label" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conflict_of_interests" (
    "id" UUID NOT NULL,
    "assignmentId" UUID NOT NULL,
    "declarantId" UUID NOT NULL,
    "statement" TEXT NOT NULL,
    "hasConflict" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "conflict_of_interests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_recommendations" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "bidId" UUID NOT NULL,
    "scoringMethod" TEXT NOT NULL,
    "totalScore" DECIMAL(10,2),
    "rank" INTEGER NOT NULL,
    "rationale" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "award_recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award_decisions" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "bidId" UUID,
    "winningOrganizationId" UUID,
    "decision" "AwardDecisionStatus" NOT NULL DEFAULT 'RECOMMENDED',
    "awardedAmount" DECIMAL(18,2),
    "currency" TEXT NOT NULL DEFAULT 'ETB',
    "justification" TEXT NOT NULL,
    "contractReference" TEXT,
    "approvedById" UUID NOT NULL,
    "approvedAt" TIMESTAMPTZ(6),
    "publishedAt" TIMESTAMPTZ(6),
    "revokedAt" TIMESTAMPTZ(6),
    "revocationReason" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "award_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarification_requests" (
    "id" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "askedById" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "status" "ClarificationStatus" NOT NULL DEFAULT 'OPEN',
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "responseDeadline" TIMESTAMPTZ(6),
    "answeredAt" TIMESTAMPTZ(6),
    "closedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "clarification_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarification_responses" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "responderId" UUID NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clarification_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clarification_attachments" (
    "id" UUID NOT NULL,
    "requestId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clarification_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionUrl" TEXT,
    "entityType" TEXT,
    "entityId" UUID,
    "readAt" TIMESTAMPTZ(6),
    "emailSentAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_tenders" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tenderId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_tenders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "actorRole" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" UUID,
    "targetUserId" UUID,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "background_jobs" (
    "id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "runAfter" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "lastError" TEXT,
    "correlationId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "background_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "id" UUID NOT NULL,
    "adminId" UUID NOT NULL,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" UUID NOT NULL,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_role_idx" ON "users"("status", "role");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_revokedAt_idx" ON "refresh_tokens"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "email_tokens_tokenHash_key" ON "email_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "email_tokens_userId_purpose_idx" ON "email_tokens"("userId", "purpose");

-- CreateIndex
CREATE INDEX "email_tokens_expiresAt_idx" ON "email_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "organizations_verificationStatus_idx" ON "organizations"("verificationStatus");

-- CreateIndex
CREATE INDEX "organizations_city_region_idx" ON "organizations"("city", "region");

-- CreateIndex
CREATE INDEX "organizations_deletedAt_idx" ON "organizations"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_registeredName_countryCode_key" ON "organizations"("registeredName", "countryCode");

-- CreateIndex
CREATE INDEX "organization_members_userId_status_idx" ON "organization_members"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organizationId_userId_key" ON "organization_members"("organizationId", "userId");

-- CreateIndex
CREATE INDEX "organization_verification_requests_organizationId_status_idx" ON "organization_verification_requests"("organizationId", "status");

-- CreateIndex
CREATE INDEX "organization_verification_requests_status_submittedAt_idx" ON "organization_verification_requests"("status", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storageKey_key" ON "documents"("storageKey");

-- CreateIndex
CREATE INDEX "documents_uploadedById_idx" ON "documents"("uploadedById");

-- CreateIndex
CREATE INDEX "documents_verificationRequestId_idx" ON "documents"("verificationRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "tender_categories_code_key" ON "tender_categories"("code");

-- CreateIndex
CREATE INDEX "tender_categories_isActive_sortOrder_idx" ON "tender_categories"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "tenders_referenceNumber_key" ON "tenders"("referenceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "tenders_slug_key" ON "tenders"("slug");

-- CreateIndex
CREATE INDEX "tenders_status_publishedAt_idx" ON "tenders"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "tenders_status_submissionDeadline_idx" ON "tenders"("status", "submissionDeadline");

-- CreateIndex
CREATE INDEX "tenders_organizationId_status_idx" ON "tenders"("organizationId", "status");

-- CreateIndex
CREATE INDEX "tenders_categoryId_status_idx" ON "tenders"("categoryId", "status");

-- CreateIndex
CREATE INDEX "tenders_region_city_idx" ON "tenders"("region", "city");

-- CreateIndex
CREATE INDEX "tenders_slug_idx" ON "tenders"("slug");

-- CreateIndex
CREATE INDEX "tenders_publishedAt_idx" ON "tenders"("publishedAt");

-- CreateIndex
CREATE INDEX "tender_status_history_tenderId_createdAt_idx" ON "tender_status_history"("tenderId", "createdAt");

-- CreateIndex
CREATE INDEX "tender_attachments_tenderId_sortOrder_idx" ON "tender_attachments"("tenderId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "tender_attachments_tenderId_documentId_key" ON "tender_attachments"("tenderId", "documentId");

-- CreateIndex
CREATE INDEX "eligibility_requirements_tenderId_sortOrder_idx" ON "eligibility_requirements"("tenderId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "eligibility_requirements_tenderId_code_key" ON "eligibility_requirements"("tenderId", "code");

-- CreateIndex
CREATE INDEX "required_documents_tenderId_sortOrder_idx" ON "required_documents"("tenderId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "required_documents_tenderId_code_key" ON "required_documents"("tenderId", "code");

-- CreateIndex
CREATE INDEX "evaluation_criteria_tenderId_stage_sortOrder_idx" ON "evaluation_criteria"("tenderId", "stage", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_criteria_tenderId_code_key" ON "evaluation_criteria"("tenderId", "code");

-- CreateIndex
CREATE INDEX "tender_amendments_tenderId_version_idx" ON "tender_amendments"("tenderId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "tender_amendments_tenderId_amendmentRef_key" ON "tender_amendments"("tenderId", "amendmentRef");

-- CreateIndex
CREATE UNIQUE INDEX "tender_amendment_attachments_amendmentId_documentId_key" ON "tender_amendment_attachments"("amendmentId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "bids_submissionReference_key" ON "bids"("submissionReference");

-- CreateIndex
CREATE INDEX "bids_tenderId_status_idx" ON "bids"("tenderId", "status");

-- CreateIndex
CREATE INDEX "bids_organizationId_status_idx" ON "bids"("organizationId", "status");

-- CreateIndex
CREATE INDEX "bids_submittedById_idx" ON "bids"("submittedById");

-- CreateIndex
CREATE INDEX "bids_submittedAt_idx" ON "bids"("submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "bids_tenderId_organizationId_revisionNumber_key" ON "bids"("tenderId", "organizationId", "revisionNumber");

-- CreateIndex
CREATE INDEX "bid_revisions_bidId_submittedAt_idx" ON "bid_revisions"("bidId", "submittedAt");

-- CreateIndex
CREATE UNIQUE INDEX "bid_revisions_bidId_revisionNumber_key" ON "bid_revisions"("bidId", "revisionNumber");

-- CreateIndex
CREATE INDEX "bid_attachments_bidId_idx" ON "bid_attachments"("bidId");

-- CreateIndex
CREATE UNIQUE INDEX "bid_attachments_bidId_documentId_key" ON "bid_attachments"("bidId", "documentId");

-- CreateIndex
CREATE INDEX "bid_document_compliance_bidId_isCompliant_idx" ON "bid_document_compliance"("bidId", "isCompliant");

-- CreateIndex
CREATE UNIQUE INDEX "bid_document_compliance_bidId_requiredDocumentId_key" ON "bid_document_compliance"("bidId", "requiredDocumentId");

-- CreateIndex
CREATE INDEX "bid_opening_records_tenderId_createdAt_idx" ON "bid_opening_records"("tenderId", "createdAt");

-- CreateIndex
CREATE INDEX "bid_opening_records_bidId_idx" ON "bid_opening_records"("bidId");

-- CreateIndex
CREATE INDEX "bid_opening_records_operatorId_idx" ON "bid_opening_records"("operatorId");

-- CreateIndex
CREATE INDEX "evaluation_assignments_evaluatorId_status_idx" ON "evaluation_assignments"("evaluatorId", "status");

-- CreateIndex
CREATE INDEX "evaluation_assignments_tenderId_stage_idx" ON "evaluation_assignments"("tenderId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_assignments_tenderId_evaluatorId_stage_key" ON "evaluation_assignments"("tenderId", "evaluatorId", "stage");

-- CreateIndex
CREATE INDEX "evaluation_scores_bidId_idx" ON "evaluation_scores"("bidId");

-- CreateIndex
CREATE INDEX "evaluation_scores_criterionId_idx" ON "evaluation_scores"("criterionId");

-- CreateIndex
CREATE UNIQUE INDEX "evaluation_scores_assignmentId_criterionId_bidId_key" ON "evaluation_scores"("assignmentId", "criterionId", "bidId");

-- CreateIndex
CREATE INDEX "evaluation_comments_assignmentId_bidId_idx" ON "evaluation_comments"("assignmentId", "bidId");

-- CreateIndex
CREATE INDEX "evaluation_comments_bidId_idx" ON "evaluation_comments"("bidId");

-- CreateIndex
CREATE INDEX "evaluation_evidence_assignmentId_bidId_idx" ON "evaluation_evidence"("assignmentId", "bidId");

-- CreateIndex
CREATE UNIQUE INDEX "conflict_of_interests_assignmentId_declarantId_key" ON "conflict_of_interests"("assignmentId", "declarantId");

-- CreateIndex
CREATE INDEX "award_recommendations_tenderId_isPrimary_idx" ON "award_recommendations"("tenderId", "isPrimary");

-- CreateIndex
CREATE INDEX "award_recommendations_bidId_idx" ON "award_recommendations"("bidId");

-- CreateIndex
CREATE INDEX "award_decisions_tenderId_decision_idx" ON "award_decisions"("tenderId", "decision");

-- CreateIndex
CREATE INDEX "award_decisions_winningOrganizationId_idx" ON "award_decisions"("winningOrganizationId");

-- CreateIndex
CREATE INDEX "clarification_requests_tenderId_status_idx" ON "clarification_requests"("tenderId", "status");

-- CreateIndex
CREATE INDEX "clarification_requests_askedById_idx" ON "clarification_requests"("askedById");

-- CreateIndex
CREATE INDEX "clarification_responses_requestId_createdAt_idx" ON "clarification_responses"("requestId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "clarification_attachments_requestId_documentId_key" ON "clarification_attachments"("requestId", "documentId");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_createdAt_idx" ON "notifications"("userId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- CreateIndex
CREATE INDEX "saved_tenders_userId_createdAt_idx" ON "saved_tenders"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "saved_tenders_userId_tenderId_key" ON "saved_tenders"("userId", "tenderId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "background_jobs_status_runAfter_idx" ON "background_jobs"("status", "runAfter");

-- CreateIndex
CREATE INDEX "background_jobs_type_status_idx" ON "background_jobs"("type", "status");

-- CreateIndex
CREATE INDEX "background_jobs_correlationId_idx" ON "background_jobs"("correlationId");

-- CreateIndex
CREATE INDEX "admin_actions_adminId_createdAt_idx" ON "admin_actions"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "admin_actions_targetType_targetId_idx" ON "admin_actions"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_replacedById_fkey" FOREIGN KEY ("replacedById") REFERENCES "refresh_tokens"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_verification_requests" ADD CONSTRAINT "organization_verification_requests_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_verification_requests" ADD CONSTRAINT "organization_verification_requests_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_verificationRequestId_fkey" FOREIGN KEY ("verificationRequestId") REFERENCES "organization_verification_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_categories" ADD CONSTRAINT "tender_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "tender_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenders" ADD CONSTRAINT "tenders_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "tender_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_status_history" ADD CONSTRAINT "tender_status_history_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_attachments" ADD CONSTRAINT "tender_attachments_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_attachments" ADD CONSTRAINT "tender_attachments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eligibility_requirements" ADD CONSTRAINT "eligibility_requirements_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "required_documents" ADD CONSTRAINT "required_documents_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_criteria" ADD CONSTRAINT "evaluation_criteria_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_amendments" ADD CONSTRAINT "tender_amendments_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_amendments" ADD CONSTRAINT "tender_amendments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_amendment_attachments" ADD CONSTRAINT "tender_amendment_attachments_amendmentId_fkey" FOREIGN KEY ("amendmentId") REFERENCES "tender_amendments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tender_amendment_attachments" ADD CONSTRAINT "tender_amendment_attachments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bids" ADD CONSTRAINT "bids_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_revisions" ADD CONSTRAINT "bid_revisions_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_revisions" ADD CONSTRAINT "bid_revisions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_attachments" ADD CONSTRAINT "bid_attachments_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_attachments" ADD CONSTRAINT "bid_attachments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_document_compliance" ADD CONSTRAINT "bid_document_compliance_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_document_compliance" ADD CONSTRAINT "bid_document_compliance_requiredDocumentId_fkey" FOREIGN KEY ("requiredDocumentId") REFERENCES "required_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_document_compliance" ADD CONSTRAINT "bid_document_compliance_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_opening_records" ADD CONSTRAINT "bid_opening_records_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_opening_records" ADD CONSTRAINT "bid_opening_records_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bid_opening_records" ADD CONSTRAINT "bid_opening_records_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_assignments" ADD CONSTRAINT "evaluation_assignments_evaluatorOrganizationId_fkey" FOREIGN KEY ("evaluatorOrganizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_scores" ADD CONSTRAINT "evaluation_scores_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "evaluation_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_scores" ADD CONSTRAINT "evaluation_scores_criterionId_fkey" FOREIGN KEY ("criterionId") REFERENCES "evaluation_criteria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_scores" ADD CONSTRAINT "evaluation_scores_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_scores" ADD CONSTRAINT "evaluation_scores_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_comments" ADD CONSTRAINT "evaluation_comments_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "evaluation_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_comments" ADD CONSTRAINT "evaluation_comments_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_comments" ADD CONSTRAINT "evaluation_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_evidence" ADD CONSTRAINT "evaluation_evidence_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "evaluation_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_evidence" ADD CONSTRAINT "evaluation_evidence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conflict_of_interests" ADD CONSTRAINT "conflict_of_interests_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "evaluation_assignments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conflict_of_interests" ADD CONSTRAINT "conflict_of_interests_declarantId_fkey" FOREIGN KEY ("declarantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_recommendations" ADD CONSTRAINT "award_recommendations_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_recommendations" ADD CONSTRAINT "award_recommendations_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_recommendations" ADD CONSTRAINT "award_recommendations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_decisions" ADD CONSTRAINT "award_decisions_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_decisions" ADD CONSTRAINT "award_decisions_bidId_fkey" FOREIGN KEY ("bidId") REFERENCES "bids"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_decisions" ADD CONSTRAINT "award_decisions_winningOrganizationId_fkey" FOREIGN KEY ("winningOrganizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award_decisions" ADD CONSTRAINT "award_decisions_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_requests" ADD CONSTRAINT "clarification_requests_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_requests" ADD CONSTRAINT "clarification_requests_askedById_fkey" FOREIGN KEY ("askedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_responses" ADD CONSTRAINT "clarification_responses_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "clarification_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_responses" ADD CONSTRAINT "clarification_responses_responderId_fkey" FOREIGN KEY ("responderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_attachments" ADD CONSTRAINT "clarification_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "clarification_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clarification_attachments" ADD CONSTRAINT "clarification_attachments_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_tenders" ADD CONSTRAINT "saved_tenders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_tenders" ADD CONSTRAINT "saved_tenders_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "tenders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
