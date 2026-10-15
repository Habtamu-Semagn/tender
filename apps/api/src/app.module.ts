import { Module } from "@nestjs/common";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { randomUUID } from "node:crypto";

import { AppConfigModule } from "./config/config.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";
import { AuditModule } from "./audit/audit.module.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";
import { AuthModule } from "./auth/auth.module.js";
import { JwtAuthGuard } from "./auth/jwt-auth.guard.js";
import { RolesGuard } from "./auth/roles.guard.js";
import { OrganizationsModule } from "./organizations/organizations.module.js";
import { TendersModule } from "./tenders/tenders.module.js";
import { DocumentsModule } from "./documents/documents.module.js";
import { NotificationsModule } from "./notifications/notifications.module.js";
import { JobsModule } from "./jobs/jobs.module.js";
import { HealthController } from "./health/health.controller.js";
import { RequestIdInterceptor } from "./common/interceptors/request-id.interceptor.js";

/**
 * Root application module.
 *
 * The application is a modular monolith: one deployable process, with domain
 * modules that could be extracted into services later without touching their
 * internals.
 */
@Module({
  imports: [
    // Configuration first: everything else depends on validated settings.
    AppConfigModule,

    // Structured logging with a correlation id on every request.
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.getOrThrow<string>("app.logging.level"),
          // Never log cookies, authorization headers or request bodies: they
          // carry tokens and passwords.
          redact: {
            paths: [
              "req.headers.cookie",
              "req.headers.authorization",
              "req.headers['x-csrf-token']",
              "res.headers['set-cookie']",
              "req.body.password",
              "req.body.newPassword",
              "req.body.confirmPassword",
              "req.body.currentPassword",
              "req.body.token",
            ],
            censor: "[REDACTED]",
          },
          genReqId: (req, res) => {
            const existing = req.headers["x-request-id"];
            const id = typeof existing === "string" && existing.length > 0
              ? existing
              : randomUUID();
            res.setHeader("x-request-id", id);
            return id;
          },
          autoLogging: config.getOrThrow<boolean>("app.logging.enableRequestLogging")
            ? { ignore: (req) => req.url === "/health" || req.url === "/health/ready" }
            : false,
          customProps: (req) => ({
            context: "http",
            requestId: (req as { id?: string }).id,
          }),
        },
      }),
    }),

    // Rate limiting: a global ceiling, with tighter limits on auth routes.
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.getOrThrow<number>("app.rateLimit.ttl") * 1000,
            limit: config.getOrThrow<number>("app.rateLimit.max"),
          },
        ],
      }),
    }),

    PrismaModule,
    AuditModule,

    AuthModule,
    OrganizationsModule,
    TendersModule,
    DocumentsModule,
    NotificationsModule,
    JobsModule,
  ],
  controllers: [HealthController],
  providers: [
    // Guards are global: every route is authenticated unless marked @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },

    // One exception filter for every error, expected or not.
    { provide: APP_FILTER, useClass: AllExceptionsFilter },

    { provide: APP_INTERCEPTOR, useClass: RequestIdInterceptor },
  ],
})
export class AppModule {}
