import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Prisma } from "../../generated/prisma/client.js";
import { type Request, type Response } from "express";
import { ErrorCode } from "../errors/error-codes.js";

interface ErrorResponseBody {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
  /** Correlation ID echoed back so a client report can be traced in the logs. */
  requestId: string;
  timestamp: string;
  path: string;
}

/**
 * Centralized exception handling. Every error response — expected or not — uses
 * the same shape, and internal details (stack traces, driver messages) are never
 * exposed to clients in production.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger("ExceptionFilter");

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId =
      (request.headers["x-request-id"] as string | undefined) ??
      `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;

    const { status, code, message, details } = this.normalize(exception);

    const body: ErrorResponseBody = {
      statusCode: status,
      code,
      message,
      ...(details ? { details } : {}),
      requestId,
      timestamp: new Date().toISOString(),
      path: request.originalUrl ?? request.url,
    };

    // 5xx: log with full detail server-side, return a generic message.
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${request.method} ${request.originalUrl} -> ${status} [${code}] ${this.describe(exception)}`,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      // 4xx: expected client errors are logged at debug level without a stack.
      this.logger.debug(
        `${request.method} ${request.originalUrl} -> ${status} [${code}] ${message}`,
      );
    }

    response.status(status).json(body);
  }

  private normalize(exception: unknown): {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } {
    // --- Our own typed exceptions ---
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();

      if (typeof raw === "object" && raw !== null && "code" in raw) {
        const body = raw as { code?: string; message?: string; details?: Record<string, unknown> };
        const messageValue = body.message ?? exception.message;
        return {
          status,
          code: body.code ?? this.defaultCodeFor(status),
          message: typeof messageValue === "string" ? messageValue : String(messageValue),
          details: body.details,
        };
      }

      // Nest's own ValidationPipe emits an array of messages.
      if (Array.isArray(raw)) {
        return {
          status,
          code: ErrorCode.VALIDATION_FAILED,
          message: "Validation failed",
          details: { errors: raw },
        };
      }

      if (typeof raw === "string") {
        return { status, code: this.defaultCodeFor(status), message: raw };
      }

      return { status, code: this.defaultCodeFor(status), message: exception.message };
    }

    // --- Prisma errors mapped to stable codes ---
    if (this.isPrismaKnownError(exception)) {
      return this.mapPrismaError(exception);
    }

    // --- Anything else: never leak internals ---
    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: "An unexpected error occurred. Please try again.",
    };
  }

  private isPrismaKnownError(exception: unknown): exception is Prisma.PrismaClientKnownRequestError {
    return (
      typeof exception === "object" &&
      exception !== null &&
      (exception as { code?: string }).code !== undefined &&
      (exception as { clientVersion?: string }).clientVersion !== undefined
    );
  }

  private mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
    status: number;
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } {
    switch (exception.code) {
      case "P2002": {
        // Unique constraint violation.
        const target = (exception.meta?.target as string[] | string | undefined) ?? [];
        const fields = Array.isArray(target) ? target.join(", ") : String(target);
        return {
          status: HttpStatus.CONFLICT,
          code: ErrorCode.CONFLICT,
          message: fields
            ? `A record with this ${fields} already exists.`
            : "A record with these details already exists.",
          details: { fields },
        };
      }
      case "P2003":
        return {
          status: HttpStatus.BAD_REQUEST,
          code: ErrorCode.VALIDATION_FAILED,
          message: "A referenced record does not exist.",
        };
      case "P2025":
        return {
          status: HttpStatus.NOT_FOUND,
          code: ErrorCode.NOT_FOUND,
          message: "The requested record was not found.",
        };
      default:
        return {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          code: ErrorCode.INTERNAL_ERROR,
          message: "A database error occurred. Please try again.",
        };
    }
  }

  private defaultCodeFor(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_FAILED;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHENTICATED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.RATE_LIMITED;
      default:
        return ErrorCode.INTERNAL_ERROR;
    }
  }

  private describe(exception: unknown): string {
    if (exception instanceof Error) return `${exception.name}: ${exception.message}`;
    return String(exception);
  }
}
