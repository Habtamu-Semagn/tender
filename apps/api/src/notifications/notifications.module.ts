import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { EmailService } from "./email.service.js";
import { NotificationService } from "./notification.service.js";
import { NotificationsController } from "./notifications.controller.js";

@Module({
  imports: [PrismaModule],
  controllers: [NotificationsController],
  providers: [EmailService, NotificationService],
  exports: [EmailService, NotificationService],
})
export class NotificationsModule {}
