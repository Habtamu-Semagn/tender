import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  type CreateOrganizationInput,
  type InviteMemberInput,
  type Organization,
  type OrganizationMember,
  type OrganizationSummary,
  type SubmitVerificationInput,
  type UpdateMemberInput,
  type UpdateOrganizationInput,
  type VerificationDecisionInput,
} from "@chereta/contracts";
import { type OrganizationRole } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { OrganizationAccessService } from "./organization-access.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Organization management: creation, membership, verification submission and
 * admin decisions.
 *
 * SECURITY: every mutating operation re-derives the caller's membership and role
 * from the database. A caller cannot grant themselves a role, act on an
 * organization they do not belong to, or escalate by editing a request body —
 * the organization ID always comes from the route, never from user input.
 */
@Injectable()
export class OrganizationsService {
  private readonly logger = new Logger(OrganizationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly access: OrganizationAccessService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  /** Creates an organization; the creator becomes its first OWNER. */
  async create(
    userId: string,
    input: CreateOrganizationInput,
    request: RequestWithActor,
  ): Promise<Organization> {
    const organization = await this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          ...input,
          verificationStatus: "UNVERIFIED",
        },
        select: this.organizationSelect,
      });

      await tx.organizationMember.create({
        data: {
          organizationId: org.id,
          userId,
          role: "OWNER" satisfies OrganizationRole,
          status: "ACTIVE",
          acceptedAt: new Date(),
        },
      });

      return org;
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "organization.created",
        entityType: "Organization",
        entityId: organization.id,
        metadata: { registeredName: organization.registeredName },
      }),
    );

    return this.toOrganization(organization);
  }

  /** Updates an organization. Requires ADMIN or OWNER. */
  async update(
    userId: string,
    organizationId: string,
    input: UpdateOrganizationInput,
    request: RequestWithActor,
  ): Promise<Organization> {
    const { role } = await this.access.assertRole(
      userId,
      organizationId,
      OrganizationAccessService.ADMIN_ROLES,
    );

    const updated = await this.prisma.organization.update({
      where: { id: organizationId },
      data: input,
      select: this.organizationSelect,
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "organization.updated",
        entityType: "Organization",
        entityId: organizationId,
        metadata: { role, fields: Object.keys(input) },
      }),
    );

    return this.toOrganization(updated);
  }

  /** Public detail view: no tax ID, registration number or private contact data. */
  async getPublicDetail(organizationId: string): Promise<Organization> {
    const org = await this.prisma.organization.findFirst({
      where: { id: organizationId, deletedAt: null },
      select: this.organizationSelect,
    });
    if (!org) {
      throw new AppException(ErrorCode.ORGANIZATION_NOT_FOUND, "Organization not found.", 404);
    }
    return this.toOrganization(org);
  }

  /** Private detail view for a member: includes registration and tax details. */
  async getMemberDetail(
    userId: string,
    organizationId: string,
  ): Promise<Organization & {
    businessRegistrationNumber: string | null;
    taxIdentificationNumber: string | null;
    licenseNumber: string | null;
  }> {
    await this.access.assertMember(userId, organizationId);

    const org = await this.prisma.organization.findFirstOrThrow({
      where: { id: organizationId, deletedAt: null },
      select: {
        ...this.organizationSelect,
        businessRegistrationNumber: true,
        taxIdentificationNumber: true,
        licenseNumber: true,
        procurementClassification: true,
      },
    });

    return {
      ...this.toOrganization(org),
      taxIdentificationNumber: org.taxIdentificationNumber,
      licenseNumber: org.licenseNumber,
    };
  }

  /** Lists the organizations the caller belongs to. */
  async listMine(userId: string): Promise<OrganizationSummary[]> {
    const memberships = await this.access.listForUser(userId);

    return memberships.map((m) => {
      const org = m.organization;
      return {
        ...this.toOrganization(org),
        myRole: m.role,
        myStatus: m.status,
        memberCount: org._count.members,
        tenderCount: org._count.tenders,
      };
    });
  }

  // --- Membership -------------------------------------------------------------

  async listMembers(userId: string, organizationId: string): Promise<OrganizationMember[]> {
    await this.access.assertMember(userId, organizationId);

    const members = await this.prisma.organizationMember.findMany({
      where: { organizationId, status: { not: "REVOKED" } },
      select: {
        id: true,
        organizationId: true,
        userId: true,
        role: true,
        status: true,
        invitedAt: true,
        acceptedAt: true,
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    });

    return members.map((m) => ({
      id: m.id,
      organizationId: m.organizationId,
      userId: m.userId,
      role: m.role,
      status: m.status,
      user: m.user,
      invitedAt: m.invitedAt.toISOString(),
      acceptedAt: m.acceptedAt?.toISOString() ?? null,
    }));
  }

  /**
   * Invites a member by email.
   *
   * SECURITY: the invited role is taken from the validated request, but a caller
   * can never invite someone with a role above their own, and only OWNER/ADMIN may
   * invite at all.
   */
  async inviteMember(
    actorUserId: string,
    organizationId: string,
    input: InviteMemberInput,
    request: RequestWithActor,
  ): Promise<OrganizationMember> {
    const { role: actorRole } = await this.access.assertRole(
      actorUserId,
      organizationId,
      OrganizationAccessService.ADMIN_ROLES,
    );

    // A non-OWNER cannot mint another OWNER.
    if (input.role === "OWNER" && actorRole !== "OWNER") {
      throw new AppException(
        ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
        "Only an owner can invite another owner.",
        403,
      );
    }

    const invitee = await this.prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
      select: { id: true, firstName: true },
    });

    if (!invitee) {
      throw new AppException(
        ErrorCode.USER_NOT_FOUND,
        "No Chereta account uses that email address. Ask them to register first.",
        404,
      );
    }

    const organization = await this.prisma.organization.findUniqueOrThrow({
      where: { id: organizationId },
      select: { registeredName: true },
    });

    try {
      const member = await this.prisma.organizationMember.create({
        data: {
          organizationId,
          userId: invitee.id,
          role: input.role,
          status: "INVITED",
          invitedById: actorUserId,
        },
        select: {
          id: true,
          organizationId: true,
          userId: true,
          role: true,
          status: true,
          invitedAt: true,
          acceptedAt: true,
          user: { select: { id: true, email: true, firstName: true, lastName: true } },
        },
      });

      // Notify the invitee through the durable queue.
      await this.prisma.$transaction(async (tx) => {
        await this.notifications.create(
          tx,
          {
            userId: invitee.id,
            type: "ORGANIZATION_INVITATION",
            title: `Invitation to ${organization.registeredName}`,
            body: `You have been invited to join ${organization.registeredName} as ${input.role}.`,
            actionUrl: `/dashboard/organizations`,
            entityType: "Organization",
            entityId: organizationId,
          },
          {
            organizationName: organization.registeredName,
            role: input.role,
            link: `${this.config.getOrThrow<string>("app.webBaseUrl")}/organizations/memberships`,
          },
        );
      });

      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "organization.member.invited",
          entityType: "Organization",
          entityId: organizationId,
          targetUserId: invitee.id,
          metadata: { role: input.role },
        }),
      );

      return {
        id: member.id,
        organizationId: member.organizationId,
        userId: member.userId,
        role: member.role,
        status: member.status,
        user: member.user,
        invitedAt: member.invitedAt.toISOString(),
        acceptedAt: member.acceptedAt?.toISOString() ?? null,
      };
    } catch (error) {
      if (OrganizationAccessService.isDuplicateMemberError(error)) {
        throw new AppException(
          ErrorCode.MEMBER_ALREADY_EXISTS,
          "That person is already a member of this organization.",
          409,
        );
      }
      throw error;
    }
  }

  /** Updates a member's role or revokes their access. */
  async updateMember(
    actorUserId: string,
    organizationId: string,
    memberId: string,
    input: UpdateMemberInput,
    request: RequestWithActor,
  ): Promise<OrganizationMember> {
    const { role: actorRole } = await this.access.assertRole(
      actorUserId,
      organizationId,
      OrganizationAccessService.ADMIN_ROLES,
    );

    const target = await this.prisma.organizationMember.findFirst({
      where: { id: memberId, organizationId },
      select: { id: true, role: true, userId: true },
    });

    if (!target) {
      throw new AppException(ErrorCode.NOT_FOUND, "Membership not found.", 404);
    }

    // Nobody may modify their own role: this prevents self-escalation.
    if (target.userId === actorUserId) {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        "You cannot change your own role. Ask another owner or admin.",
        403,
      );
    }

    // Only an OWNER may change another OWNER.
    if (target.role === "OWNER" && actorRole !== "OWNER") {
      throw new AppException(
        ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
        "Only an owner can change another owner's membership.",
        403,
      );
    }

    if (input.role === "OWNER" && actorRole !== "OWNER") {
      throw new AppException(
        ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
        "Only an owner can grant the owner role.",
        403,
      );
    }

    if (input.status === "REVOKED") {
      await this.access.removeMember(actorUserId, organizationId, memberId);
      const revoked = await this.prisma.organizationMember.findUniqueOrThrow({
        where: { id: memberId },
        select: this.memberSelect,
      });
      return this.toMember(revoked);
    }

    const updated = await this.prisma.organizationMember.update({
      where: { id: memberId },
      data: {
        ...(input.role ? { role: input.role } : {}),
        ...(input.status === "ACTIVE" ? { status: "ACTIVE", acceptedAt: new Date() } : {}),
      },
      select: this.memberSelect,
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "organization.member.updated",
        entityType: "Organization",
        entityId: organizationId,
        targetUserId: target.userId,
        metadata: { changes: Object.keys(input) },
      }),
    );

    return this.toMember(updated);
  }

  // --- Verification -----------------------------------------------------------

  /** Submits an organization for verification review. */
  async submitVerification(
    userId: string,
    organizationId: string,
    input: SubmitVerificationInput,
    request: RequestWithActor,
  ): Promise<{ id: string; status: string }> {
    await this.access.assertRole(userId, organizationId, OrganizationAccessService.ADMIN_ROLES);

    const existing = await this.prisma.organizationVerificationRequest.findFirst({
      where: {
        organizationId,
        status: { in: ["PENDING", "UNDER_REVIEW"] },
      },
      select: { id: true },
    });

    if (existing) {
      throw new AppException(
        ErrorCode.VERIFICATION_ALREADY_PENDING,
        "A verification request is already under review for this organization.",
        409,
      );
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const verificationRequest = await tx.organizationVerificationRequest.create({
        data: {
          organizationId,
          status: "PENDING",
          submittedNotes: input.notes,
        },
        select: { id: true, status: true },
      });

      // Attach the supporting documents to this verification request.
      await tx.document.updateMany({
        where: { id: { in: input.documentIds } },
        data: { verificationRequestId: verificationRequest.id },
      });

      await tx.organization.update({
        where: { id: organizationId },
        data: { verificationStatus: "PENDING" },
      });

      return verificationRequest;
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "organization.verification.submitted",
        entityType: "Organization",
        entityId: organizationId,
        metadata: { documentCount: input.documentIds.length },
      }),
    );

    return result;
  }

  /**
   * Records an administrator's verification decision.
   *
   * ADMIN only. The decision, notes and reviewer identity are all stored, and the
   * organization owner is notified.
   */
  async decideVerification(
    adminUserId: string,
    organizationId: string,
    input: VerificationDecisionInput,
    request: RequestWithActor,
  ): Promise<{ id: string; status: string }> {
    const request_ = await this.prisma.organizationVerificationRequest.findFirst({
      where: { organizationId, status: { in: ["PENDING", "UNDER_REVIEW"] } },
      include: {
        organization: {
          select: {
            registeredName: true,
            members: {
              where: { role: "OWNER", status: "ACTIVE" },
              select: { userId: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    if (!request_) {
      throw new AppException(
        ErrorCode.NOT_FOUND,
        "No pending verification request for this organization.",
        404,
      );
    }

    const decision = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.organizationVerificationRequest.update({
        where: { id: request_.id },
        data: {
          status: input.decision,
          reviewNotes: input.notes,
          decisionReason: input.reason,
          reviewedById: adminUserId,
          reviewedAt: new Date(),
        },
        select: { id: true, status: true },
      });

      await tx.organization.update({
        where: { id: organizationId },
        data: {
          verificationStatus: input.decision,
          verificationNotes: input.notes,
          verifiedAt: input.decision === "VERIFIED" ? new Date() : null,
          verifiedById: input.decision === "VERIFIED" ? adminUserId : null,
          suspendedAt: input.decision === "SUSPENDED" ? new Date() : null,
          suspensionReason: input.decision === "SUSPENDED" ? input.reason : null,
        },
      });

      return updated;
    });

    // Notify the organization owner.
    const owner = request_.organization.members[0];
    if (owner) {
      const type =
        input.decision === "VERIFIED"
          ? "ORGANIZATION_VERIFICATION_APPROVED"
          : input.decision === "REJECTED"
            ? "ORGANIZATION_VERIFICATION_REJECTED"
            : null;

      if (type) {
        await this.prisma.$transaction((tx) =>
          this.notifications.create(
            tx,
            {
              userId: owner.userId,
              type,
              title:
                type === "ORGANIZATION_VERIFICATION_APPROVED"
                  ? `${request_.organization.registeredName} is verified`
                  : `Verification decision for ${request_.organization.registeredName}`,
              body: input.notes ?? "",
              actionUrl: `/dashboard/organizations/${organizationId}`,
              entityType: "Organization",
              entityId: organizationId,
            },
            {
              organizationName: request_.organization.registeredName,
              notes: input.notes ?? "No additional notes.",
              link: `${this.config.getOrThrow<string>("app.webBaseUrl")}/dashboard/organizations/${organizationId}`,
            },
          ),
        );
      }
    }

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "organization.verification.decided",
        entityType: "Organization",
        entityId: organizationId,
        severity: input.decision === "VERIFIED" ? "NOTICE" : "WARNING",
        metadata: { decision: input.decision },
      }),
    );

    await this.prisma.adminAction.create({
      data: {
        adminId: adminUserId,
        action: "organization.verification.decided",
        targetType: "Organization",
        targetId: organizationId,
        reason: input.reason,
      },
    });

    return decision;
  }

  /**
   * Lists organizations awaiting verification, with their supporting document
   * metadata so a reviewer can inspect what was submitted.
   */
  async listPendingVerification(limit: number): Promise<{
    items: {
      id: string;
      organizationId: string;
      status: string;
      submittedAt: string;
      organization: {
        id: string;
        registeredName: string;
        organizationType: string;
        city: string | null;
        region: string | null;
        businessRegistrationNumber: string | null;
        email: string;
        phone: string;
      };
      documents: {
        id: string;
        fileName: string;
        contentType: string;
        sizeBytes: number;
        createdAt: string;
      }[];
    }[];
  }> {
    const requests = await this.prisma.organizationVerificationRequest.findMany({
      where: { status: { in: ["PENDING", "UNDER_REVIEW"] } },
      select: {
        id: true,
        organizationId: true,
        status: true,
        submittedAt: true,
        organization: {
          select: {
            id: true,
            registeredName: true,
            organizationType: true,
            city: true,
            region: true,
            businessRegistrationNumber: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: { submittedAt: "asc" },
      take: limit,
    });

    // Documents are linked through Document.verificationRequestId.
    const requestIds = requests.map((r) => r.id);
    const documents = await this.prisma.document.findMany({
      where: { verificationRequestId: { in: requestIds }, deletedAt: null },
      select: {
        id: true,
        verificationRequestId: true,
        originalFileName: true,
        contentType: true,
        sizeBytes: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const documentsByRequest = new Map<string, typeof documents>();
    for (const document of documents) {
      if (!document.verificationRequestId) continue;
      const list = documentsByRequest.get(document.verificationRequestId) ?? [];
      list.push(document);
      documentsByRequest.set(document.verificationRequestId, list);
    }

    return {
      items: requests.map((r) => ({
        id: r.id,
        organizationId: r.organizationId,
        status: r.status,
        submittedAt: r.submittedAt.toISOString(),
        organization: r.organization,
        documents: (documentsByRequest.get(r.id) ?? []).map((d) => ({
          id: d.id,
          fileName: d.originalFileName,
          contentType: d.contentType,
          sizeBytes: d.sizeBytes,
          createdAt: d.createdAt.toISOString(),
        })),
      })),
    };
  }

  // --- Helpers ----------------------------------------------------------------

  private readonly organizationSelect = {
    id: true,
    registeredName: true,
    tradingName: true,
    organizationType: true,
    description: true,
    email: true,
    phone: true,
    website: true,
    addressLine: true,
    subCity: true,
    city: true,
    region: true,
    countryCode: true,
    postalCode: true,
    verificationStatus: true,
    createdAt: true,
    updatedAt: true,
  } as const;

  private readonly memberSelect = {
    id: true,
    organizationId: true,
    userId: true,
    role: true,
    status: true,
    invitedAt: true,
    acceptedAt: true,
    user: { select: { id: true, email: true, firstName: true, lastName: true } },
  } as const;

  private toOrganization(org: {
    id: string;
    registeredName: string;
    tradingName: string | null;
    organizationType: string;
    description: string | null;
    email: string;
    phone: string;
    website: string | null;
    addressLine: string | null;
    subCity: string | null;
    city: string | null;
    region: string | null;
    countryCode: string;
    postalCode: string | null;
    verificationStatus: string;
    createdAt: Date;
    updatedAt: Date;
    businessRegistrationNumber?: string | null;
  }): Organization {
    return {
      id: org.id,
      registeredName: org.registeredName,
      tradingName: org.tradingName,
      organizationType: org.organizationType as Organization["organizationType"],
      description: org.description,
      email: org.email,
      phone: org.phone,
      website: org.website,
      addressLine: org.addressLine,
      subCity: org.subCity,
      city: org.city,
      region: org.region,
      countryCode: org.countryCode,
      postalCode: org.postalCode,
      verificationStatus: org.verificationStatus as Organization["verificationStatus"],
      businessRegistrationNumber: org.businessRegistrationNumber ?? null,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
    };
  }

  private toMember(member: {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    status: string;
    invitedAt: Date;
    acceptedAt: Date | null;
    user: { id: string; email: string; firstName: string; lastName: string };
  }): OrganizationMember {
    return {
      id: member.id,
      organizationId: member.organizationId,
      userId: member.userId,
      role: member.role as OrganizationMember["role"],
      status: member.status as OrganizationMember["status"],
      user: member.user,
      invitedAt: member.invitedAt.toISOString(),
      acceptedAt: member.acceptedAt?.toISOString() ?? null,
    };
  }
}

export { BadRequestException, ForbiddenException, NotFoundException };
