import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module.js";
import { EmailService } from "./email.service.js";
import { NotificationService } from "./notification.service.js";

@Module({
  imports: [PrismaModule],
  providers: [EmailService, NotificationService],
  exports: [EmailService, NotificationService],
})
export class NotificationsModule {}
