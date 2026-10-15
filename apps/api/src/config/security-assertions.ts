import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

/**
 * Refuses to start with unsafe settings in production.
 *
 * These are the misconfigurations that would quietly turn a secure
 * implementation into an insecure deployment: a short signing key, a
 * placeholder secret left over from development, a permissive CORS list, or a
 * wildcard cookie domain. Failing fast is cheaper than a breach.
 */
export function assertProductionSecurityConfig(config: ConfigService): void {
  const isProduction = config.getOrThrow<string>("app.nodeEnv") === "production";
  if (!isProduction) return;

  const problems: string[] = [];

  const jwtSecret = config.getOrThrow<string>("app.jwt.accessSecret");
  if (jwtSecret.length < 32) {
    problems.push("JWT_ACCESS_SECRET must be at least 32 characters");
  }
  if (jwtSecret.startsWith("dev_only_") || jwtSecret.includes("change-me")) {
    problems.push("JWT_ACCESS_SECRET still uses a development placeholder value");
  }

  const refreshSecret = config.getOrThrow<string>("app.jwt.refreshSecret");
  if (refreshSecret.length < 32) {
    problems.push("JWT_REFRESH_SECRET must be at least 32 characters");
  }
  if (refreshSecret.startsWith("dev_only_") || refreshSecret.includes("change-me")) {
    problems.push("JWT_REFRESH_SECRET still uses a development placeholder value");
  }

  if (jwtSecret === refreshSecret) {
    problems.push("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different values");
  }

  const storageKey = config.getOrThrow<string>("app.storage.localSigningKey");
  if (storageKey.startsWith("dev_only_") || storageKey.includes("change-me")) {
    problems.push("STORAGE_LOCAL_SIGNING_KEY still uses a development placeholder value");
  }

  const origins = config.getOrThrow<string[]>("app.corsOrigins");
  if (origins.includes("*")) {
    problems.push("CORS_ORIGINS must not include '*' when credentials are enabled");
  }
  if (origins.length === 0) {
    problems.push("CORS_ORIGINS must list at least the production web origin");
  }

  const emailDriver = config.getOrThrow<string>("app.email.driver");
  if (emailDriver === "log") {
    problems.push("EMAIL_DRIVER=log would silently discard all email in production");
  }

  if (config.getOrThrow<boolean>("app.cookies.secure") === false) {
    problems.push("COOKIE_SECURE must be true in production so cookies are TLS-only");
  }

  if (problems.length > 0) {
    const logger = new Logger("SecurityAssertions");
    logger.error(
      `Refusing to start: ${problems.length} unsafe production setting(s):\n` +
        problems.map((problem) => `  - ${problem}`).join("\n"),
    );
    throw new Error(
      `Production configuration is unsafe (${problems.length} problem(s)); see logs for detail.`,
    );
  }
}
