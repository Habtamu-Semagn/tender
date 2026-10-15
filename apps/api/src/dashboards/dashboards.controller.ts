import { Controller, Get, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { DashboardsService } from "./dashboards.service.js";
import { type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/**
 * Dashboard endpoints.
 *
 * Every figure is computed by a live query scoped to the caller — a dashboard
 * count always equals what a direct SQL count on the same filter would return.
 */
@ApiTags("dashboards")
@ApiBearerAuth()
@Controller("dashboard")
export class DashboardsController {
  constructor(private readonly dashboards: DashboardsService) {}

  private actor(request: RequestWithActor) {
    if (!request.actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return request.actor;
  }

  @Get("supplier")
  @ApiOperation({ summary: "Supplier dashboard: my bidding activity" })
  @ApiResponse({ status: 200, description: "Dashboard counts and upcoming deadlines." })
  async supplier(@Req() request: RequestWithActor) {
    const actor = this.actor(request);
    return this.dashboards.supplierDashboard(actor.userId);
  }

  @Get("publisher")
  @ApiOperation({ summary: "Publisher dashboard: my organizations' procurement activity" })
  @ApiResponse({ status: 200, description: "Dashboard counts." })
  async publisher(@Req() request: RequestWithActor) {
    const actor = this.actor(request);
    return this.dashboards.publisherDashboard(actor.userId);
  }

  @Get("evaluator")
  @ApiOperation({ summary: "Evaluator dashboard: my assignment workload" })
  @ApiResponse({ status: 200, description: "Dashboard counts." })
  async evaluator(@Req() request: RequestWithActor) {
    const actor = this.actor(request);
    return this.dashboards.evaluatorDashboard(actor.userId);
  }
}
