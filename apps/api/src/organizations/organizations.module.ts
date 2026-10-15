import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuditModule } from "../audit/audit.module.js";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { DocumentsModule } from "../documents/documents.module.js";
import { OrganizationsController } from "./organizations.controller.js";
import { OrganizationsService } from "./organizations.service.js";
import { OrganizationAccessService } from "./organization-access.service.js";

/**
 * Organization profiles, membership and verification.
 *
 * `NotificationsModule` is imported because verification decisions notify the
 * organization, and `AuditModule` because verification and membership changes
 * are auditable administrative actions.
 */
@Module({
  imports: [PrismaModule, AuditModule, NotificationsModule, DocumentsModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationAccessService],
  exports: [OrganizationsService, OrganizationAccessService],
})
export class OrganizationsModule {}
