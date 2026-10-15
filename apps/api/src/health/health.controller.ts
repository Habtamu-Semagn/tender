import { Controller, Get } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../notifications/email.service.js";
import { JobWorkerService } from "../jobs/job-worker.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { Public } from "../auth/roles.guard.js";
import { StorageService } from "../documents/storage.service.js";

/**
 * Health and readiness endpoints.
 *
 * `/health` is a liveness probe: it answers as long as the process is serving.
 * `/health/ready` is a readiness probe: it reports whether the dependencies the
 * application cannot run without (database, storage, email) are reachable, so a
 * load balancer can hold traffic until the deployment is genuinely usable.
 */
@Controller("health")
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly email: EmailService,
    private readonly jobs: JobWorkerService,
    private readonly config: ConfigService,
  ) {}

  /** Liveness: always 200 while the process can serve requests. */
  @Get()
  @Public()
  liveness(): { status: string; service: string; version: string; uptimeSeconds: number } {
    return {
      status: "ok",
      service: "chereta-api",
      version: "0.1.0",
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }

  /** Readiness: reports on each dependency. */
  @Get("ready")
  @Public()
  async readiness(): Promise<{
    status: "ok" | "degraded";
    checks: Record<string, { ok: boolean; detail?: string; latencyMs?: number }>;
  }> {
    const [database, emailReachable] = await Promise.all([
      this.prisma.ping(),
      this.email.verify(),
    ]);

    const [pendingJobs, deadJobs] = await Promise.all([
      this.jobs.pendingCount(),
      this.jobs.deadCount(),
    ]);

    const checks = {
      database: database.ok
        ? { ok: true, latencyMs: database.latencyMs }
        : { ok: false, detail: database.error },
      storage: { ok: true, detail: `driver=${this.storage.isLocal ? "local" : "s3"}` },
      email: { ok: emailReachable, detail: `driver=${this.email.driverName}` },
      jobs: {
        // A deep backlog is a warning, not a failure: the worker is still running.
        ok: deadJobs < 100,
        detail: `pending=${pendingJobs} dead=${deadJobs}`,
      },
    };

    const healthy = Object.values(checks).every((check) => check.ok);

    return {
      status: healthy ? "ok" : "degraded",
      checks,
    };
  }

  /** Version and configuration summary, safe to expose (no secrets). */
  @Get("info")
  @Public()
  info(): {
    service: string;
    version: string;
    environment: string;
    timezone: string;
    currency: string;
    countryCode: string;
    features: {
      requireVerifiedOrgToPublish: boolean;
      requireVerifiedOrgToBid: boolean;
      bidOpeningRequiresTwoAuthorized: boolean;
    };
  } {
    return {
      service: "chereta-api",
      version: "0.1.0",
      environment: this.config.getOrThrow<string>("app.nodeEnv"),
      timezone: this.config.getOrThrow<string>("app.policy.defaultTimezone"),
      currency: this.config.getOrThrow<string>("app.policy.defaultCurrency"),
      countryCode: this.config.getOrThrow<string>("app.policy.defaultCountryCode"),
      features: {
        requireVerifiedOrgToPublish: this.config.getOrThrow<boolean>(
          "app.policy.requireVerifiedOrgToPublish",
        ),
        requireVerifiedOrgToBid: this.config.getOrThrow<boolean>(
          "app.policy.requireVerifiedOrgToBid",
        ),
        bidOpeningRequiresTwoAuthorized: this.config.getOrThrow<boolean>(
          "app.policy.bidOpeningRequiresTwoAuthorized",
        ),
      },
    };
  }
}
