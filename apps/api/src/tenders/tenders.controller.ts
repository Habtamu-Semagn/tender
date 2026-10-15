import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { z } from "zod";
import {
  type UpdateTenderInput,
  type ListTendersQuery,
  createTenderSchema,
  uuidSchema,
  updateTenderSchema,
  listTendersQuerySchema,
  createAmendmentSchema,
  cancelTenderSchema,
} from "@chereta/contracts";
import { TendersService } from "./tenders.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";
import { Public } from "../auth/roles.guard.js";

/**
 * The create schema plus the target organization.
 *
 * SECURITY: the organization is supplied explicitly rather than inferred, so
 * the request states which organization is publishing. The service still
 * verifies ACTIVE membership — this field selects the organization, it does not
 * grant rights over it.
 */
export const createTenderWithOrgSchema = createTenderSchema.extend({
  organizationId: uuidSchema,
});
export type CreateTenderWithOrgInput = z.infer<typeof createTenderWithOrgSchema>;

/**
 * Tender endpoints.
 *
 * Public routes are explicitly marked; everything else requires authentication,
 * and organization-scoped routes additionally require ACTIVE membership —
 * enforced in the service, never assumed from the URL.
 */
@ApiTags("tenders")
@ApiBearerAuth()
@Controller()
export class TendersController {
  constructor(private readonly tenders: TendersService) {}

  // --- Public discovery ------------------------------------------------------

  @Get("tenders")
  @Public()
  @ApiOperation({
    summary: "Search published tenders",
    description:
      "Returns only tenders cleared for public disclosure. Confidential bid data is never included.",
  })
  @ApiResponse({ status: 200, description: "Paginated tender list." })
  async list(
    @Req() request: RequestWithActor,
    @Query({ schema: listTendersQuerySchema }) query: ListTendersQuery,
  ) {
    // Authentication is optional here: the listing is public, but a signed-in
    // caller additionally sees which tenders they have saved.
    return this.tenders.listPublic(query, request.actor?.userId);
  }

  @Get("tenders/:id")
  @Public()
  @ApiOperation({ summary: "Get tender detail" })
  @ApiResponse({ status: 200, description: "Tender detail." })
  @ApiResponse({ status: 404, description: "Not published or not found." })
  async detail(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    // The tender may be publicly visible, in which case an unauthenticated
    // request is fine; the service decides what a non-member may see.
    return this.tenders.getDetail(id, request.actor?.userId);
  }

  // --- Organization management ----------------------------------------------

  @Get("organizations/:organizationId/tenders")
  @ApiOperation({ summary: "List an organization's tenders (members only)" })
  async listForOrganization(
    @Req() request: RequestWithActor,
    @Param("organizationId", ParseUUIDPipe) organizationId: string,
    @Query({ schema: listTendersQuerySchema }) query: ListTendersQuery,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.listForOrganization(organizationId, actor.userId, query);
  }

  @Post("tenders")
  @ApiOperation({ summary: "Create a tender draft" })
  @ApiResponse({ status: 201, description: "Draft created." })
  @ApiResponse({ status: 403, description: "Not a member, or organization not verified." })
  async create(
    @Req() request: RequestWithActor,
    @Body({ schema: createTenderWithOrgSchema }) body: CreateTenderWithOrgInput,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.create(actor.userId, body.organizationId, body, request);
  }

  @Patch("tenders/:id")
  @ApiOperation({
    summary: "Update a draft tender",
    description:
      "Published tenders cannot be edited directly; use an amendment so bidders always see a version history.",
  })
  async update(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: updateTenderSchema }) body: UpdateTenderInput,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.update(id, actor.userId, body, request);
  }

  // --- Lifecycle -------------------------------------------------------------

  @Post("tenders/:id/submit-for-approval")
  @ApiOperation({ summary: "Submit a draft for organizational approval" })
  async submitForApproval(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.submitForApproval(id, actor.userId, request);
  }

  @Post("tenders/:id/publish")
  @ApiOperation({
    summary: "Publish a tender",
    description:
      "Requires a verified organization, at least one evaluation criterion, coherent dates, and valid criterion weights.",
  })
  @ApiResponse({ status: 200, description: "Published." })
  @ApiResponse({ status: 409, description: "Validation failed; see the message." })
  async publish(@Req() request: RequestWithActor, @Param("id", ParseUUIDPipe) id: string) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.publish(id, actor.userId, request);
  }

  @Post("tenders/:id/close")
  @ApiOperation({ summary: "Close submissions at the deadline" })
  async close(@Req() request: RequestWithActor, @Param("id", ParseUUIDPipe) id: string) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.close(id, actor.userId, request);
  }

  @Post("tenders/:id/cancel")
  @ApiOperation({ summary: "Cancel a tender (a reason is required)" })
  async cancel(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: cancelTenderSchema }) body: { reason: string },
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.cancel(id, actor.userId, body.reason, request);
  }

  // --- Amendments ------------------------------------------------------------

  @Post("tenders/:id/amendments")
  @ApiOperation({
    summary: "Issue an amendment",
    description:
      "An amendment can extend a submission deadline but never shorten one. Material changes notify affected bidders.",
  })
  async createAmendment(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: createAmendmentSchema }) body: Parameters<TendersService["createAmendment"]>[2],
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.createAmendment(id, actor.userId, body, request);
  }

  @Get("tenders/:id/amendments")
  @ApiOperation({ summary: "List a tender's amendment history" })
  async listAmendments(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return this.tenders.listAmendments(id, actor.userId);
  }
}
