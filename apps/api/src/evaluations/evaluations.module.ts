import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuditModule } from "../audit/audit.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { OrganizationsModule } from "../organizations/organizations.module.js";
import { EvaluationsController } from "./evaluations.controller.js";
import { EvaluationsService } from "./evaluations.service.js";
import { AwardsController } from "./awards.controller.js";
import { AwardsService } from "./awards.service.js";

@Module({
  imports: [PrismaModule, AuditModule, NotificationsModule, OrganizationsModule],
  controllers: [EvaluationsController, AwardsController],
  providers: [EvaluationsService, AwardsService],
  exports: [EvaluationsService, AwardsService],
})
export class EvaluationsModule {}
