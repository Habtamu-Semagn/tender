import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  ParseUUIDPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  createOrganizationSchema,
  inviteMemberSchema,
  submitVerificationSchema,
  type UpdateMemberInput,
  updateMemberSchema,
  updateOrganizationSchema,
  type VerificationDecisionInput,
  verificationDecisionSchema,
} from "@chereta/contracts";
import { OrganizationsService } from "./organizations.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Organization endpoints.
 *
 * Every route is authenticated (the global JwtAuthGuard applies). Authorization
 * is enforced inside the service against the caller's ACTIVE membership and role,
 * so the route path itself is never the only control.
 */
@ApiTags("organizations")
@ApiBearerAuth()
@Controller("organizations")
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  /** The caller's own organizations, with their role in each. */
  @Get("me")
  @ApiOperation({ summary: "List the organizations the authenticated user belongs to" })
  async me(@Req() request: RequestWithActor) {
    const actor = this.actorFrom(request);
    const items = await this.organizations.listMine(actor.userId);
    return { items };
  }

  @Get(":id")
  @ApiOperation({
    summary: "Get an organization",
    description:
      "Members receive private details (registration and tax numbers). Non-members receive the public profile only.",
  })
  async getOne(@Req() request: RequestWithActor, @Param("id", ParseUUIDPipe) id: string) {
    const actor = this.actorFrom(request);

    try {
      return await this.organizations.getMemberDetail(actor.userId, id);
    } catch (error) {
      // A non-member gets the public projection rather than a 403, so the
      // existence of an organization is not itself privileged information.
      if (
        error instanceof AppException &&
        (error.code === ErrorCode.NOT_ORGANIZATION_MEMBER ||
          error.code === ErrorCode.INSUFFICIENT_ORGANIZATION_ROLE)
      ) {
        return this.organizations.getPublicDetail(id);
      }
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create an organization; the creator becomes its first owner" })
  @ApiResponse({ status: 201, description: "Organization created." })
  async create(@Req() request: RequestWithActor, @Body({ schema: createOrganizationSchema }) body: never) {
    const actor = this.actorFrom(request);
    return this.organizations.create(actor.userId, body, request);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update an organization (owner or admin only)" })
  async update(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: updateOrganizationSchema }) body: never,
  ) {
    const actor = this.actorFrom(request);
    return this.organizations.update(actor.userId, id, body, request);
  }

  // --- Membership -------------------------------------------------------------

  @Get(":id/members")
  @ApiOperation({ summary: "List organization members (members only)" })
  async listMembers(@Req() request: RequestWithActor, @Param("id", ParseUUIDPipe) id: string) {
    const actor = this.actorFrom(request);
    const items = await this.organizations.listMembers(actor.userId, id);
    return { items };
  }

  @Post(":id/members")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Invite a member (owner or admin only)" })
  async inviteMember(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: inviteMemberSchema }) body: never,
  ) {
    const actor = this.actorFrom(request);
    return this.organizations.inviteMember(actor.userId, id, body, request);
  }

  @Patch(":id/members/:memberId")
  @ApiOperation({ summary: "Update a member's role or revoke access (owner or admin only)" })
  async updateMember(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Param("memberId", ParseUUIDPipe) memberId: string,
    @Body({ schema: updateMemberSchema }) body: UpdateMemberInput,
  ) {
    const actor = this.actorFrom(request);
    return this.organizations.updateMember(actor.userId, id, memberId, body, request);
  }

  // --- Verification -----------------------------------------------------------

  @Post(":id/verification")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: "Submit the organization for verification (owner or admin only)" })
  async submitVerification(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: submitVerificationSchema }) body: never,
  ) {
    const actor = this.actorFrom(request);
    return this.organizations.submitVerification(actor.userId, id, body, request);
  }

  // --- Admin: verification queue ----------------------------------------------

  @Get("admin/pending-verification")
  @ApiBearerAuth()
  @ApiOperation({ summary: "List organizations awaiting verification (admin only)" })
  async pendingVerification(@Req() request: RequestWithActor, @Query("limit") limit = "50") {
    const actor = this.actorFrom(request);

    // Platform administrators only: organization roles do not confer this.
    if (actor.role !== "ADMIN") {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        "Only platform administrators can review verification requests.",
        403,
      );
    }

    const take = Math.min(Math.max(Number(limit) || 50, 1), 200);
    return this.organizations.listPendingVerification(take);
  }

  @Post("admin/:id/verification-decision")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Record a verification decision (admin only)" })
  async decideVerification(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: verificationDecisionSchema }) body: VerificationDecisionInput,
  ) {
    const actor = this.actorFrom(request);

    // Platform administrators only. Organization roles do not confer this.
    if (actor.role !== "ADMIN") {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        "Only platform administrators can record verification decisions.",
        403,
      );
    }

    return this.organizations.decideVerification(actor.userId, id, body, request);
  }

  private actorFrom(request: RequestWithActor) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return actor;
  }
}
