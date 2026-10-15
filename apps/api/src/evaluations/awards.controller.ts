import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
  type CreateAwardRecommendationInput,
  type CreateAwardDecisionInput,
  createAwardRecommendationSchema,
  createAwardDecisionSchema,
} from "@chereta/contracts";
import { AwardsService } from "./awards.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Award endpoints.
 *
 * Recommendations are made by a publisher; approval is admin-only; and an award
 * must be APPROVED before it can be PUBLISHED. The publish path refuses anything
 * not already approved — an unapproved award can never reach the public feed.
 */
@ApiTags("awards")
@ApiBearerAuth()
@Controller()
export class AwardsController {
  constructor(private readonly awards: AwardsService) {}

  private actor(request: RequestWithActor) {
    if (!request.actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return request.actor;
  }

  @Post("tenders/:tenderId/recommendations")
  @ApiOperation({ summary: "Recommend a bid for award (publisher+)" })
  @ApiResponse({ status: 201, description: "Recommendation recorded." })
  async recommend(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
    @Body({ schema: createAwardRecommendationSchema }) body: CreateAwardRecommendationInput,
  ) {
    const actor = this.actor(request);
    return this.awards.createRecommendation(tenderId, actor.userId, body, request);
  }

  @Get("tenders/:tenderId/recommendations")
  @ApiOperation({ summary: "List a tender's award recommendations (members only)" })
  @ApiResponse({ status: 200, description: "Recommendations." })
  async listRecommendations(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ) {
    const actor = this.actor(request);
    return this.awards.listRecommendations(tenderId, actor.userId);
  }

  @Post("tenders/:tenderId/award-decisions")
  @ApiOperation({
    summary: "Approve or reject an award",
    description:
      "Approval requires an admin (approver). Setting publish=true on an approval publishes immediately and moves the tender to AWARDED.",
  })
  @ApiResponse({ status: 201, description: "Decision recorded." })
  @ApiResponse({ status: 403, description: "Not authorized to approve." })
  async decide(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
    @Body({ schema: createAwardDecisionSchema }) body: CreateAwardDecisionInput,
  ) {
    const actor = this.actor(request);
    return this.awards.decide(tenderId, actor.userId, body, request);
  }

  @Post("award-decisions/:id/publish")
  @ApiOperation({
    summary: "Publish an approved award",
    description: "Refuses anything not already approved — an unapproved award cannot be published.",
  })
  @ApiResponse({ status: 200, description: "Published." })
  @ApiResponse({ status: 409, description: "Award is not approved." })
  async publish(@Req() request: RequestWithActor, @Param("id", ParseUUIDPipe) id: string) {
    const actor = this.actor(request);
    return this.awards.publish(id, actor.userId, request);
  }

  @Get("tenders/:tenderId/award-decisions")
  @ApiOperation({ summary: "List a tender's award decisions (members only)" })
  @ApiResponse({ status: 200, description: "Decisions." })
  async listDecisions(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ) {
    const actor = this.actor(request);
    return this.awards.listDecisions(tenderId, actor.userId);
  }
}
