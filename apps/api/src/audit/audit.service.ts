import { Injectable, Logger } from "@nestjs/common";
import { type Request } from "express";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Audit logging.
 *
 * SECURITY: entries must never contain passwords, tokens, private document
 * contents or unnecessary personal data. Callers pass only the metadata needed to
 * reconstruct the event, and `redact()` additionally strips keys whose names
 * suggest sensitive content as a second line of defence.
 */
const REDACTED_KEY_PATTERN =
  /(password|token|secret|hash|authorization|cookie|mfaSecret|taxIdentification|documentContent|fileContent|proposal|body|answer|question)/i;

const MAX_REDACT_DEPTH = 4;

const redact = (value: unknown, depth = 0): unknown => {
  if (depth > MAX_REDACT_DEPTH || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => redact(item, depth + 1));

  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    result[key] = REDACTED_KEY_PATTERN.test(key) ? "[REDACTED]" : redact(val, depth + 1);
  }
  return result;
};

export type AuditSeverity = "INFO" | "NOTICE" | "WARNING" | "CRITICAL";

export interface AuditEntry {
  /** Null for unauthenticated or system events. */
  actorId?: string | null;
  actorRole?: string | null;
  /** Dotted action name, e.g. "bid.submit", "admin.user.suspend". */
  action: string;
  entityType?: string;
  entityId?: string;
  /** Whose data was affected, when it differs from the actor. */
  targetUserId?: string;
  severity?: AuditSeverity;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
}

/** The actor shape attached to the request by the authentication guard. */
export interface RequestActor {
  userId: string;
  role: "SUPPLIER" | "ADMIN";
  emailVerified: boolean;
  status: string;
}

export interface RequestWithActor extends Request {
  actor?: RequestActor;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Writes an audit entry. Never throws: an audit failure must not break the
   * business operation it is recording.
   */
  async record(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          actorId: entry.actorId ?? null,
          actorRole: entry.actorRole ?? null,
          action: entry.action,
          entityType: entry.entityType ?? null,
          entityId: entry.entityId ?? null,
          targetUserId: entry.targetUserId,
          severity: entry.severity ?? "INFO",
          metadata: entry.metadata ? (redact(entry.metadata) as Record<string, never>) : undefined,
          ipAddress: entry.ipAddress,
          userAgent: entry.userAgent,
          requestId: entry.requestId,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to write audit entry for action=${entry.action}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Builds an AuditEntry from the current request, filling in the actor, client
   * IP, user agent and request id automatically.
   */
  fromRequest(
    request: RequestWithActor,
    entry: Omit<AuditEntry, "ipAddress" | "userAgent" | "requestId" | "actorId" | "actorRole">,
  ): AuditEntry {
    return {
      ...entry,
      actorId: request.actor?.userId ?? null,
      actorRole: request.actor?.role ?? null,
      ipAddress: this.clientIp(request),
      userAgent: request.headers["user-agent"],
      requestId: (request.headers["x-request-id"] as string | undefined) ?? undefined,
    };
  }

  /** Audit an event that is not tied to an HTTP request (e.g. a background job). */
  async recordSystem(
    action: string,
    entry: Omit<AuditEntry, "action"> = {},
  ): Promise<void> {
    await this.record({ ...entry, action });
  }

  private clientIp(request: Request): string | undefined {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
      return forwarded.split(",")[0]?.trim();
    }
    return request.ip;
  }
}

/** Exported for tests. */
export const __testing = { redact, REDACTED_KEY_PATTERN };
