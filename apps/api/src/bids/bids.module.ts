import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuditModule } from "../audit/audit.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { OrganizationsModule } from "../organizations/organizations.module.js";
import { DocumentsModule } from "../documents/documents.module.js";
import { BidsController } from "./bids.controller.js";
import { BidsService } from "./bids.service.js";

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    NotificationsModule,
    OrganizationsModule,
    DocumentsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService],
  exports: [BidsService],
})
export class BidsModule {}
