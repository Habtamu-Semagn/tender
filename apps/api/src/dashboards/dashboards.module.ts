import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { OrganizationsModule } from "../organizations/organizations.module.js";
import { DashboardsController } from "./dashboards.controller.js";
import { DashboardsService } from "./dashboards.service.js";

@Module({
  imports: [PrismaModule, OrganizationsModule],
  controllers: [DashboardsController],
  providers: [DashboardsService],
  exports: [DashboardsService],
})
export class DashboardsModule {}
