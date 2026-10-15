import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

/**
 * Central Prisma access point.
 *
 * Prisma 7 requires a driver adapter, and the generated client is ESM-only, so
 * it is created once here and shared through dependency injection. Every module
 * that touches the database goes through this service.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService) {
    const connectionString = config.getOrThrow<string>("app.databaseUrl");

    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      log:
        config.get<string>("app.nodeEnv") === "production"
          ? [{ emit: "event", level: "warn" }, { emit: "event", level: "error" }]
          : [
              { emit: "event", level: "query" },
              { emit: "event", level: "warn" },
              { emit: "event", level: "error" },
            ],
    });
  }

  async onModuleInit(): Promise<void> {
    // Surface Prisma's own warnings/errors through the structured logger.
    this.$on("warn" as never, (event: { message: string }) => {
      this.logger.warn(event.message);
    });
    this.$on("error" as never, (event: { message: string }) => {
      this.logger.error(event.message);
    });

    await this.$connect();
    this.logger.log("Database connection established");
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Database connection closed");
  }

  /** Used by the health endpoint to distinguish "up" from "slow". */
  async ping(): Promise<{ ok: boolean; latencyMs: number; error?: string }> {
    const started = Date.now();
    try {
      await this.$queryRaw`SELECT 1`;
      return { ok: true, latencyMs: Date.now() - started };
    } catch (error) {
      return {
        ok: false,
        latencyMs: Date.now() - started,
        error: error instanceof Error ? error.message : "Unknown database error",
      };
    }
  }

  /**
   * Truncates every table. TEST ONLY — guarded by an explicit assertion so it
   * can never run against a development or production database by accident.
   */
  async truncateAllForTests(): Promise<void> {
    if (process.env.NODE_ENV !== "test" && process.env.ALLOW_TEST_TRUNCATE !== "true") {
      throw new Error(
        "Refusing to truncate: NODE_ENV must be 'test' or ALLOW_TEST_TRUNCATE must be 'true'.",
      );
    }

    const tables = await this.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public' AND tablename NOT LIKE '_prisma%'
    `;

    for (const { tablename } of tables) {
      await this.$executeRawUnsafe(`TRUNCATE TABLE "public"."${tablename}" CASCADE`);
    }
  }
}
