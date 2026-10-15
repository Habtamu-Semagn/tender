import "reflect-metadata";
import { registerAs } from "@nestjs/config";

/**
 * Environment validation and typed configuration.
 *
 * Every value the application depends on is declared here and validated at
 * startup: a missing or malformed variable fails fast during bootstrap instead
 * of surfacing later as a runtime error deep inside a request.
 */

const requiredInProduction = (value: string | undefined, name: string): string => {
  if (!value || value.length === 0) {
    throw new Error(
      `Configuration error: ${name} is required. Copy apps/api/.env.example to .env and set it.`,
    );
  }
  return value;
};

/** Values that must never ship with their development defaults in production. */
const DEV_PLACEHOLDER_PREFIX = "dev_only_";

const assertStrongSecret = (name: string, value: string, nodeEnv: string): string => {
  if (nodeEnv === "production") {
    if (value.startsWith(DEV_PLACEHOLDER_PREFIX)) {
      throw new Error(
        `Configuration error: ${name} still holds a development placeholder. Generate a real secret with: openssl rand -base64 48`,
      );
    }
    if (value.length < 32) {
      throw new Error(`Configuration error: ${name} must be at least 32 characters in production.`);
    }
  }
  return value;
};

export const configuration = registerAs("app", () => {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const isProduction = nodeEnv === "production";

  const jwtAccessSecret = assertStrongSecret(
    "JWT_ACCESS_SECRET",
    process.env.JWT_ACCESS_SECRET ?? "dev_only_access_secret_change_me_0000000000000000",
    nodeEnv,
  );
  const jwtRefreshSecret = assertStrongSecret(
    "JWT_REFRESH_SECRET",
    process.env.JWT_REFRESH_SECRET ?? "dev_only_refresh_secret_change_me_000000000000000",
    nodeEnv,
  );
  const csrfSecret = assertStrongSecret(
    "CSRF_SECRET",
    process.env.CSRF_SECRET ?? "dev_only_csrf_secret_change_me_000000000000000000",
    nodeEnv,
  );

  const databaseUrl = isProduction
    ? requiredInProduction(process.env.DATABASE_URL, "DATABASE_URL")
    : (process.env.DATABASE_URL ??
      "postgresql://chereta:chereta_dev_password@localhost:5541/chereta?schema=public");

  const storageDriver = (process.env.STORAGE_DRIVER ?? "local") as "local" | "s3";
  if (storageDriver === "s3" && isProduction) {
    requiredInProduction(process.env.S3_BUCKET, "S3_BUCKET");
    requiredInProduction(process.env.S3_ACCESS_KEY_ID, "S3_ACCESS_KEY_ID");
    requiredInProduction(process.env.S3_SECRET_ACCESS_KEY, "S3_SECRET_ACCESS_KEY");
  }

  const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3002")
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o.length > 0);

  if (isProduction && corsOrigins.includes("*")) {
    throw new Error("Configuration error: CORS_ORIGINS must not contain '*' in production.");
  }

  const num = (value: string | undefined, fallback: number): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };

  return {
    nodeEnv,
    isProduction,
    isTest: nodeEnv === "test",
    port: num(process.env.PORT, 4001),
    apiBaseUrl: process.env.API_BASE_URL ?? `http://localhost:${num(process.env.PORT, 4001)}`,
    webBaseUrl: process.env.WEB_BASE_URL ?? "http://localhost:3002",
    corsOrigins,

    databaseUrl,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,

    jwt: {
      accessSecret: jwtAccessSecret,
      refreshSecret: jwtRefreshSecret,
      accessTtl: process.env.JWT_ACCESS_TTL ?? "15m",
      refreshTtl: process.env.JWT_REFRESH_TTL ?? "7d",
    },
    csrfSecret,
    cookies: {
      secure: process.env.COOKIE_SECURE === "true",
      domain: process.env.COOKIE_DOMAIN || undefined,
    },

    rateLimit: {
      ttl: num(process.env.RATE_LIMIT_TTL, 60),
      max: num(process.env.RATE_LIMIT_MAX, 100),
      authTtl: num(process.env.AUTH_RATE_LIMIT_TTL, 900),
      authMax: num(process.env.AUTH_RATE_LIMIT_MAX, 10),
    },

    storage: {
      driver: storageDriver,
      localPath: process.env.STORAGE_LOCAL_PATH ?? ".storage",
      publicBaseUrl: process.env.STORAGE_PUBLIC_BASE_URL ?? "http://localhost:4001",
      s3: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION ?? "us-east-1",
        bucket: process.env.S3_BUCKET,
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== "false",
      },
    },

    email: {
      driver: (process.env.EMAIL_DRIVER ?? "log") as "log" | "smtp",
      from: process.env.EMAIL_FROM ?? "Chereta <no-reply@chereta.local>",
      smtp: {
        host: process.env.SMTP_HOST,
        port: num(process.env.SMTP_PORT, 587),
        secure: process.env.SMTP_SECURE === "true",
        user: process.env.SMTP_USER,
        password: process.env.SMTP_PASSWORD,
      },
    },

    jobs: {
      pollIntervalMs: num(process.env.JOB_POLL_INTERVAL_MS, 5000),
      maxAttempts: num(process.env.JOB_MAX_ATTEMPTS, 5),
      batchSize: num(process.env.JOB_BATCH_SIZE, 10),
    },

    /**
     * Platform policy. These are deliberately configurable rather than
     * hardcoded: Ethiopian procurement thresholds, retention rules and tax
     * requirements need local legal verification before production use.
     */
    policy: {
      defaultCurrency: process.env.DEFAULT_CURRENCY ?? "ETB",
      defaultTimezone: process.env.DEFAULT_TIMEZONE ?? "Africa/Addis_Ababa",
      defaultCountryCode: process.env.DEFAULT_COUNTRY_CODE ?? "ET",
      requireVerifiedOrgToPublish: process.env.REQUIRE_VERIFIED_ORG_TO_PUBLISH !== "false",
      requireVerifiedOrgToBid: process.env.REQUIRE_VERIFIED_ORG_TO_BID !== "false",
      bidOpeningRequiresTwoAuthorized: process.env.BID_OPENING_REQUIRES_TWO_AUTHORIZED !== "false",
    },

    logging: {
      level: process.env.LOG_LEVEL ?? (isProduction ? "info" : "debug"),
      enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== "false",
    },
  };
});

export type AppConfig = ReturnType<typeof configuration>;
