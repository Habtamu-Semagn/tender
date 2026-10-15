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
  type CreateEvaluationAssignmentInput,
  type UpsertScoreInput,
  type CreateEvaluationCommentInput,
  type DeclareConflictInput,
  type SubmitEvaluationInput,
  createEvaluationAssignmentSchema,
  upsertScoreSchema,
  createEvaluationCommentSchema,
  declareConflictSchema,
  submitEvaluationSchema,
} from "@chereta/contracts";
import { EvaluationsService } from "./evaluations.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Evaluation endpoints.
 *
 * Assignment authority lives with the procuring organization; evaluation
 * authority is assignment-based — an evaluator can only act on assignments where
 * they are the named evaluator. There is no standing evaluator role.
 */
@ApiTags("evaluations")
@ApiBearerAuth()
@Controller()
export class EvaluationsController {
  constructor(private readonly evaluations: EvaluationsService) {}

  private actor(request: RequestWithActor) {
    if (!request.actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return request.actor;
  }

  // --- Assignments (publisher side) ------------------------------------------

  @Post("tenders/:tenderId/evaluations")
  @ApiOperation({ summary: "Assign an evaluator to a tender (publisher+)" })
  @ApiResponse({ status: 201, description: "Assignment created or updated." })
  @ApiResponse({ status: 403, description: "Not a publisher of the procuring organization." })
  async assign(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
    @Body({ schema: createEvaluationAssignmentSchema }) body: CreateEvaluationAssignmentInput,
  ) {
    const actor = this.actor(request);
    return this.evaluations.assign(tenderId, actor.userId, body, request);
  }

  @Get("tenders/:tenderId/evaluations")
  @ApiOperation({ summary: "List a tender's evaluation assignments (members only)" })
  @ApiResponse({ status: 200, description: "Assignments." })
  async listForTender(
    @Req() request: RequestWithActor,
    @Param("tenderId", ParseUUIDPipe) tenderId: string,
  ) {
    const actor = this.actor(request);
    return this.evaluations.listAssignmentsForTender(tenderId, actor.userId);
  }

  // --- Evaluator side --------------------------------------------------------

  @Get("my-evaluations")
  @ApiOperation({ summary: "List my evaluation assignments" })
  @ApiResponse({ status: 200, description: "My assignments." })
  async listMine(@Req() request: RequestWithActor) {
    const actor = this.actor(request);
    return this.evaluations.listMyAssignments(actor.userId);
  }

  @Get("evaluations/:id")
  @ApiOperation({ summary: "Get one of my assignments with scores and comments" })
  @ApiResponse({ status: 200, description: "Assignment detail." })
  @ApiResponse({ status: 403, description: "Not the assigned evaluator." })
  async getOne(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
  ) {
    const actor = this.actor(request);
    return this.evaluations.getAssignment(id, actor.userId);
  }

  @Post("evaluations/:id/conflict")
  @ApiOperation({ summary: "Declare conflict of interest" })
  @ApiResponse({ status: 200, description: "Declaration recorded." })
  async declareConflict(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: declareConflictSchema }) body: DeclareConflictInput,
  ) {
    const actor = this.actor(request);
    return this.evaluations.declareConflict(id, actor.userId, body, request);
  }

  @Post("evaluations/:id/scores")
  @ApiOperation({
    summary: "Upsert a score",
    description:
      "The weighted contribution is computed server-side as (score/maxScore)*weight; the max and weight are snapshotted at entry.",
  })
  @ApiResponse({ status: 200, description: "Score recorded." })
  @ApiResponse({ status: 400, description: "Score exceeds the criterion maximum." })
  async upsertScore(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: upsertScoreSchema }) body: UpsertScoreInput,
  ) {
    const actor = this.actor(request);
    return this.evaluations.upsertScore(id, actor.userId, body, request);
  }

  @Post("evaluations/:id/comments")
  @ApiOperation({ summary: "Add an evaluation comment (draft by default)" })
  @ApiResponse({ status: 201, description: "Comment created." })
  async createComment(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: createEvaluationCommentSchema }) body: CreateEvaluationCommentInput,
  ) {
    const actor = this.actor(request);
    return this.evaluations.createComment(id, actor.userId, body, request);
  }

  @Post("evaluations/:id/submit")
  @ApiOperation({
    summary: "Submit an evaluation",
    description:
      "Recomputes the weighted total server-side; requires a conflict-of-interest declaration first.",
  })
  @ApiResponse({ status: 200, description: "Submitted." })
  @ApiResponse({ status: 409, description: "Already submitted or COI not declared." })
  async submit(
    @Req() request: RequestWithActor,
    @Param("id", ParseUUIDPipe) id: string,
    @Body({ schema: submitEvaluationSchema }) body: SubmitEvaluationInput,
  ) {
    const actor = this.actor(request);
    return this.evaluations.submit(id, actor.userId, body, request);
  }
}
