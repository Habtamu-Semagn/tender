import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  type BidDetail,
  type BidMetadata,
  type BidReceipt,
  type UpdateBidInput,
  updateBidSchema,
  withdrawBidSchema,
} from "@chereta/contracts";
import { BidsService } from "./bids.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Bid endpoints.
 *
 * The tender id is the only path parameter a bidder supplies; the bidding
 * organization is derived server-side from the caller's ACTIVE membership, so
 * there is no way to submit on behalf of an organization you do not belong to.
 * Publisher-facing metadata routes are member-gated in the service.
 */
@ApiTags("bids")
@ApiBearerAuth()
@Controller()
export class BidsController {
  constructor(private readonly bids: BidsService) {}

  private actor(request: RequestWithActor) {
    if (!request.actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return request.actor;
  }

  // --- Bidder: my bid for a tender -------------------------------------------

  @Get("tenders/:tenderId/my-bid")
  @ApiOperation({
    summary: "Get or create my bid draft for a tender",
    description:
      "Returns the caller's active bid, creating an empty draft on first access. The bidding organization is derived from the caller's membership.",
  })
  @ApiResponse({ status: 200, description: "The bid detail." })
  async getMyBid(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ): Promise<BidDetail> {
    const actor = this.actor(request);
    return this.bids.getOrCreateDraft(actor.userId, tenderId, request);
  }

  @Get("tenders/:tenderId/my-bids")
  @ApiOperation({ summary: "List my organization's bids for a tender" })
  @ApiResponse({ status: 200, description: "The bids." })
  async listMyBidsForTender(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ): Promise<BidDetail[]> {
    const actor = this.actor(request);
    return this.bids.listMyBidsForTender(tenderId, actor.userId);
  }

  @Patch("bids/:id")
  @ApiOperation({
    summary: "Update a bid draft",
    description: "Only the owning organization may edit, and only while the bid is in DRAFT.",
  })
  @ApiResponse({ status: 200, description: "Updated bid." })
  @ApiResponse({ status: 409, description: "Bid already submitted." })
  async update(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: updateBidSchema }) body: UpdateBidInput,
  ): Promise<BidDetail> {
    const actor = this.actor(request);
    return this.bids.updateDraft(id, actor.userId, body, request);
  }

  @Post("bids/:id/submit")
  @ApiOperation({
    summary: "Submit (seal) a bid",
    description:
      "Enforced against server time inside a transaction; a late submission is always rejected. Returns a receipt with an integrity hash.",
  })
  @ApiResponse({ status: 201, description: "Submission receipt." })
  @ApiResponse({ status: 409, description: "Deadline passed or tender not open." })
  async submit(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BidReceipt> {
    const actor = this.actor(request);
    return this.bids.submit(id, actor.userId, request);
  }

  @Post("bids/:id/withdraw")
  @ApiOperation({
    summary: "Withdraw a bid",
    description: "A submitted bid may be withdrawn only before the submission deadline.",
  })
  @ApiResponse({ status: 200, description: "Withdrawn bid." })
  @ApiResponse({ status: 409, description: "Deadline passed." })
  async withdraw(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: withdrawBidSchema }) body: { reason: string },
  ): Promise<BidDetail> {
    const actor = this.actor(request);
    return this.bids.withdraw(id, actor.userId, body.reason, request);
  }

  // --- Bidder: my bids across tenders ----------------------------------------

  @Get("my-bids")
  @ApiOperation({ summary: "List my organization's bids across all tenders" })
  @ApiResponse({ status: 200, description: "The bids." })
  async listMyBids(@Req() request: RequestWithActor): Promise<BidDetail[]> {
    const actor = this.actor(request);
    return this.bids.listMyBids(actor.userId);
  }

  // --- Publisher: metadata only ----------------------------------------------

  @Get("tenders/:tenderId/bids")
  @ApiOperation({
    summary: "List bids for a tender (metadata only)",
    description:
      "For members of the procuring organization. Contains no proposal contents, prices or attachments — only submission metadata before opening.",
  })
  @ApiResponse({ status: 200, description: "Bid metadata list." })
  @ApiResponse({ status: 403, description: "Not a member of the procuring organization." })
  async listBidMetadata(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ): Promise<{ items: BidMetadata[]; total: number }> {
    const actor = this.actor(request);
    return this.bids.listBidMetadataForTender(tenderId, actor.userId);
  }
}
