import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  type HttpExceptionBody,
} from "@nestjs/common";
import { ErrorCode, type ErrorCodeValue } from "./error-codes.js";

/**
 * Typed application exceptions. Every failure that a client can act on carries a
 * stable `code` and, where useful, machine-readable `details`.
 */
@Injectable()
export class AppException extends HttpException {
  constructor(
    public readonly code: ErrorCodeValue,
    message: string,
    status: HttpStatus,
    public readonly details?: Record<string, unknown>,
  ) {
    // Nest's HttpExceptionBody does not model custom fields, so the response
    // object is cast: the body still serializes as
    // { statusCode, code, message, details } for clients.
    super(
      {
        statusCode: status,
        code,
        message,
        ...(details ? { details } : {}),
      } as unknown as HttpExceptionBody,
      status,
    );
  }
}

// --- Convenience constructors -------------------------------------------------

export const validationError = (message: string, details?: Record<string, unknown>): AppException =>
  new AppException(ErrorCode.VALIDATION_FAILED, message, HttpStatus.BAD_REQUEST, details);

export const notFoundError = (
  code: ErrorCodeValue,
  message: string,
  details?: Record<string, unknown>,
): AppException => new AppException(code, message, HttpStatus.NOT_FOUND, details);

export const forbiddenError = (
  code: ErrorCodeValue = ErrorCode.FORBIDDEN,
  message = "You do not have permission to perform this action.",
  details?: Record<string, unknown>,
): AppException => new AppException(code, message, HttpStatus.FORBIDDEN, details);

export const unauthenticatedError = (
  code: ErrorCodeValue = ErrorCode.UNAUTHENTICATED,
  message = "Authentication required.",
): AppException => new AppException(code, message, HttpStatus.UNAUTHORIZED);

export const conflictError = (
  code: ErrorCodeValue = ErrorCode.CONFLICT,
  message: string,
  details?: Record<string, unknown>,
): AppException => new AppException(code, message, HttpStatus.CONFLICT, details);

export const tooManyRequestsError = (
  message = "Too many requests. Please try again later.",
  retryAfterSeconds?: number,
): AppException =>
  new AppException(
    ErrorCode.RATE_LIMITED,
    message,
    HttpStatus.TOO_MANY_REQUESTS,
    retryAfterSeconds ? { retryAfterSeconds } : undefined,
  );

/**
 * Logs the exception and rethrows it as an internal error. Used at the edges of
 * services where an unexpected failure must not leak internals to the client.
 */
export const internalError = (
  error: unknown,
  context: string,
  logger?: Logger,
): AppException => {
  (logger ?? new Logger(context)).error(
    `Unexpected error in ${context}: ${error instanceof Error ? error.stack : String(error)}`,
  );
  return new AppException(
    ErrorCode.INTERNAL_ERROR,
    "An unexpected error occurred. Please try again.",
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
};

// Re-export the Nest primitives so feature modules import from one place.
export { BadRequestException, ConflictException, ForbiddenException, NotFoundException };
