import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuditModule } from "../audit/audit.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { OrganizationsModule } from "../organizations/organizations.module.js";
import { TendersController } from "./tenders.controller.js";
import { TendersService } from "./tenders.service.js";

@Module({
  imports: [PrismaModule, AuditModule, NotificationsModule, OrganizationsModule],
  controllers: [TendersController],
  providers: [TendersService],
  exports: [TendersService],
})
export class TendersModule {}
