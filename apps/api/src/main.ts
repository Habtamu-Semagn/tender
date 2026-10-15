import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger, type INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger as PinoLogger } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import { AppModule } from "./app.module.js";
import { AllExceptionsFilter } from "./common/filters/all-exceptions.filter.js";
import { assertProductionSecurityConfig } from "./config/security-assertions.js";

/**
 * Application entry point.
 *
 * Startup order matters: configuration is validated before any network listener
 * opens, so a misconfigured deployment fails fast with a readable message
 * instead of serving traffic with unsafe defaults.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // nestjs-pino replaces Nest's default logger and buffers startup logs until
    // the logger is ready.
    bufferLogs: true,
    bodyParser: true,
  });

  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  // Fail before listening if production secrets are weak or missing.
  assertProductionSecurityConfig(config);

  app.useLogger(app.get(PinoLogger));

  app.use(cookieParser());

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
      crossOriginResourcePolicy: { policy: "same-site" },
      hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
    }),
  );

  // Compress responses except uploads, which are already large and can be huge.
  app.use(compression({ threshold: 1024 }));

  const corsOrigins = config.getOrThrow<string[]>("app.corsOrigins");
  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "x-request-id"],
    exposedHeaders: ["x-request-id", "x-ratelimit-limit", "x-ratelimit-remaining"],
    maxAge: 600,
  });

  app.setGlobalPrefix("api/v1", {
    exclude: ["health", "health/ready", "health/info", "documents/local-download"],
  });

  // A global exception filter needs no injected dependencies: it decides how
  // much detail to expose from NODE_ENV alone.
  app.useGlobalFilters(new AllExceptionsFilter());

  configureSwagger(app, config);

  const port = config.getOrThrow<number>("app.port");
  await app.listen(port, "0.0.0.0");

  logger.log(`Chereta API listening on http://localhost:${port}/api/v1`);
  logger.log(`Swagger UI at http://localhost:${port}/docs`);
}

/**
 * Generates OpenAPI documentation from the actual controller definitions.
 *
 * `createDocument` walks the registered routes, so the published spec cannot
 * drift from the implementation: an undocumented endpoint shows up here and an
 * obsolete one disappears.
 */
function configureSwagger(app: INestApplication, config: ConfigService): void {
  const document = new DocumentBuilder()
    .setTitle("Chereta API")
    .setDescription(
      "Ethiopian tender and bidding platform API. Authentication uses an HttpOnly session cookie " +
        "for browser clients or a Bearer access token for API clients; CSRF protection applies to " +
        "cookie-authenticated state-changing requests.",
    )
    .setVersion("1.0.0")
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "access-token")
    .addCookieAuth("chereta_refresh", { type: "apiKey" }, "refresh-cookie")
    .addCookieAuth("chereta_csrf", { type: "apiKey" }, "csrf-cookie")
    .addServer(config.getOrThrow<string>("app.apiBaseUrl"), "This deployment")
    .addServer("http://localhost:4001", "Local development")
    .addTag("auth", "Registration, login, tokens, password management")
    .addTag("users", "Current user profile")
    .addTag("organizations", "Organization profiles, membership, verification")
    .addTag("documents", "Private document upload and signed download")
    .addTag("tenders", "Tender lifecycle, discovery, amendments")
    .addTag("bids", "Bid preparation, submission, confidential opening")
    .addTag("evaluations", "Evaluator assignments and scoring")
    .addTag("clarifications", "Bidder questions and authorized answers")
    .addTag("notifications", "In-app notification centre")
    .addTag("health", "Liveness and readiness probes")
    .build();

  // createDocument walks the registered controllers, so the spec always matches
  // the implementation.
  const swaggerDocument = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup("docs", app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: "alpha",
      operationsSorter: "alpha",
    },
    customSiteTitle: "Chereta API — Reference",
    jsonDocumentUrl: "docs/json",
  });
}

void bootstrap().catch((error: unknown) => {
  // A startup failure must be loud and non-zero: the process manager restarts,
  // and the operator sees the real cause.
  //
  // This writes with console.error, not the Nest logger: at this point the
  // pino logger may not be ready to flush, and losing the reason for a failed
  // startup is the one diagnostic we cannot afford to drop.
  const detail = error instanceof Error ? (error.stack ?? error.message) : String(error);
  console.error(`[FATAL] Chereta API failed to start:\n${detail}`);
  process.exit(1);
});
