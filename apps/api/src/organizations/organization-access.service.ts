import { ForbiddenException, Injectable } from "@nestjs/common";
import { Prisma, type OrganizationRole } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Organization membership authorization.
 *
 * Organization membership is deliberately separate from global account roles: a
 * user may belong to several organizations with a different role in each, and
 * holding SUPPLIER globally grants no authority inside any organization.
 *
 * Every organization-scoped operation calls one of these methods, and each one
 * queries the database rather than trusting a value carried in the request.
 */
@Injectable()
export class OrganizationAccessService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the caller's ACTIVE membership in an organization, or null.
   * Suspended organizations grant no access.
   */
  async getMembership(
    userId: string,
    organizationId: string,
  ): Promise<{
    id: string;
    role: OrganizationRole;
    organizationId: string;
    organizationStatus: string;
    verificationStatus: string;
  } | null> {
    const membership = await this.prisma.organizationMember.findFirst({
      where: { userId, organizationId, status: "ACTIVE" },
      select: {
        id: true,
        role: true,
        organizationId: true,
        organization: { select: { verificationStatus: true, deletedAt: true } },
      },
    });

    if (!membership) return null;

    return {
      id: membership.id,
      role: membership.role,
      organizationId: membership.organizationId,
      organizationStatus: membership.organization.deletedAt ? "DELETED" : "ACTIVE",
      verificationStatus: membership.organization.verificationStatus,
    };
  }

  /** Throws unless the caller is an active member of the organization. */
  async assertMember(userId: string, organizationId: string): Promise<{ role: OrganizationRole }> {
    const membership = await this.getMembership(userId, organizationId);
    if (!membership || membership.organizationStatus !== "ACTIVE") {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You are not an active member of this organization.",
        403,
      );
    }
    return { role: membership.role };
  }

  /** Throws unless the caller holds one of the given roles in the organization. */
  async assertRole(
    userId: string,
    organizationId: string,
    allowed: OrganizationRole[],
    message = "Your role in this organization does not permit this action.",
  ): Promise<{ role: OrganizationRole }> {
    const membership = await this.getMembership(userId, organizationId);
    if (!membership || membership.organizationStatus !== "ACTIVE") {
      throw new AppException(
        ErrorCode.NOT_ORGANIZATION_MEMBER,
        "You are not an active member of this organization.",
        403,
      );
    }

    if (!allowed.includes(membership.role)) {
      throw new AppException(ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE, message, 403);
    }

    return { role: membership.role };
  }

  /**
   * Roles allowed to create, edit and publish tenders.
   * MEMBER is excluded: membership alone does not confer publishing rights.
   */
  static readonly PUBLISHER_ROLES: OrganizationRole[] = ["OWNER", "ADMIN", "PUBLISHER"];
  /** Roles allowed to manage membership and organization settings. */
  static readonly ADMIN_ROLES: OrganizationRole[] = ["OWNER", "ADMIN"];

  assertPublisher(role: OrganizationRole, organizationId: string): void {
    if (!OrganizationAccessService.PUBLISHER_ROLES.includes(role)) {
      throw new AppException(
        ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
        "Only owners, admins and publishers can manage tenders in this organization.",
        403,
      );
    }
    void organizationId;
  }

  /** Roles allowed to approve awards (separated from publishing). */
  assertApprover(role: OrganizationRole): void {
    if (!OrganizationAccessService.ADMIN_ROLES.includes(role)) {
      throw new AppException(
        ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE,
        "Only owners and admins can approve awards.",
        403,
      );
    }
  }

  /**
   * Enforces the configurable policy that publishing requires a verified
   * organization.
   */
  assertCanPublish(
    verificationStatus: string,
    requireVerified: boolean,
  ): void {
    if (requireVerified && verificationStatus !== "VERIFIED") {
      throw new AppException(
        ErrorCode.ORGANIZATION_NOT_VERIFIED,
        "Your organization must be verified before it can publish tenders. Submit verification documents from your organization page.",
        403,
      );
    }
  }

  /**
   * Enforces the configurable policy that bidding requires a verified
   * organization.
   */
  assertCanBid(verificationStatus: string, requireVerified: boolean): void {
    if (requireVerified && verificationStatus !== "VERIFIED") {
      throw new AppException(
        ErrorCode.ORGANIZATION_NOT_VERIFIED,
        "Your organization must be verified before it can submit bids. Submit verification documents from your organization page.",
        403,
      );
    }
  }

  /** Lists the organizations a user belongs to, with their role in each. */
  async listForUser(userId: string) {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId, status: "ACTIVE" },
      select: {
        id: true,
        role: true,
        status: true,
        organization: {
          select: {
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
            businessRegistrationNumber: true,
            verificationStatus: true,
            createdAt: true,
            updatedAt: true,
            _count: { select: { members: true, tenders: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return memberships;
  }

  /**
   * Atomically removes a member, refusing to remove the last OWNER so an
   * organization is never left without an owner.
   */
  async removeMember(actorUserId: string, organizationId: string, memberId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const member = await tx.organizationMember.findFirst({
        where: { id: memberId, organizationId },
        select: { id: true, role: true, userId: true },
      });

      if (!member) {
        throw new AppException(ErrorCode.NOT_FOUND, "Membership not found.", 404);
      }

      if (member.role === "OWNER") {
        const ownerCount = await tx.organizationMember.count({
          where: { organizationId, role: "OWNER", status: "ACTIVE" },
        });
        if (ownerCount <= 1) {
          throw new AppException(
            ErrorCode.CANNOT_REMOVE_LAST_OWNER,
            "An organization must always have at least one owner. Transfer ownership first.",
            400,
          );
        }
      }

      await tx.organizationMember.update({
        where: { id: member.id },
        data: { status: "REVOKED", revokedAt: new Date() },
      });
    });
  }

  /** True when the given Prisma error is a membership uniqueness violation. */
  static isDuplicateMemberError(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
    );
  }

  /** Re-exported so feature modules need only one import for authorization. */
  static readonly Forbidden = ForbiddenException;
}
