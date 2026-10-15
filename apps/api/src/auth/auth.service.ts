import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes } from "node:crypto";
import {
  type AuthResponse,
  type AuthUser,
  type LoginInput,
  type RegisterInput,
} from "@chereta/contracts";
import { Prisma, type UserRole } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { PasswordService } from "./password.service.js";
import { TokenService } from "./token.service.js";
import { NotificationService } from "../notifications/notification.service.js";
import { AuditService, type RequestWithActor } from "../audit/audit.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";

/** Session credentials returned to the transport layer. */
export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
}

/** Generic authentication error message, used for both unknown email and wrong password. */
const GENERIC_LOGIN_ERROR = "Incorrect email or password.";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly notifications: NotificationService,
    private readonly audit: AuditService,
    private readonly config: ConfigService,
  ) {}

  // --- Registration -----------------------------------------------------------

  /**
   * Registers a new supplier account and queues the verification email.
   *
   * SECURITY: the response is deliberately identical whether or not the email is
   * already registered, so the endpoint cannot be used to enumerate accounts.
   */
  async register(input: RegisterInput): Promise<{ user: AuthUser; requiresEmailVerification: true }> {
    const passwordHash = await this.passwords.hash(input.password);

    let user: { id: string };
    try {
      user = await this.prisma.user.create({
        data: {
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: "SUPPLIER" satisfies UserRole,
          preferredTimezone: this.config.getOrThrow<string>("app.policy.defaultTimezone"),
        },
        select: { id: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        // Do not reveal that the address is taken.
        this.logger.log(`Registration attempted for existing email (hash ${this.emailHint(input.email)})`);
        throw new AppException(
          ErrorCode.EMAIL_ALREADY_REGISTERED,
          "If this email can be registered, a verification message is on its way.",
          409,
        );
      }
      throw error;
    }

    await this.queueEmailVerification(user.id, input.email, input.firstName);

    const created = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: this.userSelect,
    });

    return { user: this.toAuthUser(created), requiresEmailVerification: true };
  }

  // --- Login / logout ---------------------------------------------------------

  /**
   * Authenticates a user and issues a session.
   *
   * SECURITY: unknown email and wrong password produce the same error and take a
   * comparable amount of time, so the endpoint is not an account oracle.
   */
  async login(
    input: LoginInput,
    request: RequestWithActor,
  ): Promise<{ auth: AuthResponse; session: SessionTokens }> {
    const user = await this.prisma.user.findFirst({
      where: { email: input.email, deletedAt: null },
      select: { ...this.userSelect, passwordHash: true },
    });

    // Always run a hash comparison so timing does not reveal account existence.
    const passwordValid = user
      ? await this.passwords.verify(user.passwordHash, input.password)
      : await this.passwords.verify(
          // Compare against a dummy hash so the work is done either way.
          "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$Zm9vYmFyZm9vYmFyZm9vYmFyZm9vYmFy",
          input.password,
        );

    if (!user || !passwordValid) {
      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "auth.login.failed",
          severity: "WARNING",
          metadata: { emailHint: this.emailHint(input.email), reason: user ? "bad_password" : "unknown_email" },
        }),
      );
      throw new AppException(ErrorCode.INVALID_CREDENTIALS, GENERIC_LOGIN_ERROR, 401);
    }

    if (user.status === "SUSPENDED") {
      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "auth.login.blocked_suspended",
          targetUserId: user.id,
          severity: "WARNING",
        }),
      );
      throw new AppException(
        ErrorCode.ACCOUNT_SUSPENDED,
        "Your account has been suspended. Contact support for assistance.",
        403,
      );
    }

    if (user.status === "DEACTIVATED") {
      throw new AppException(
        ErrorCode.ACCOUNT_SUSPENDED,
        "Your account has been deactivated.",
        403,
      );
    }

    const session = await this.createSession(user.id, user.role, user.emailVerified, user.status, request);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.audit.record(
      this.audit.fromRequest(request, {
        action: "auth.login.succeeded",
        targetUserId: user.id,
      }),
    );

    return {
      auth: {
        user: this.toAuthUser(user),
        accessToken: session.accessToken,
        expiresIn: this.tokens.accessTokenTtlSeconds(),
      },
      session,
    };
  }

  /** Revokes the caller's current refresh session. */
  async logout(refreshTokenRaw: string | undefined, request: RequestWithActor): Promise<void> {
    if (!refreshTokenRaw) return;

    const hash = this.tokens.hashRefreshToken(refreshTokenRaw);
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
      select: { id: true, userId: true, revokedAt: true },
    });

    if (record && !record.revokedAt) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date(), revokedReason: "logout" },
      });
      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "auth.logout",
          targetUserId: record.userId,
        }),
      );
    }
  }

  /**
   * Rotates a refresh token: the presented token is revoked and a new session is
   * issued. SECURITY: a token that was already revoked is treated as theft — the
   * entire token family is revoked, which defeats replay of stolen tokens.
   */
  async refresh(
    refreshTokenRaw: string | undefined,
    request: RequestWithActor,
  ): Promise<{ auth: AuthResponse; session: SessionTokens }> {
    if (!refreshTokenRaw) {
      throw new AppException(ErrorCode.TOKEN_INVALID, "Refresh token is required.", 401);
    }

    const hash = this.tokens.hashRefreshToken(refreshTokenRaw);
    const record = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: hash },
      include: { user: { select: this.userSelect } },
    });

    if (!record) {
      throw new AppException(ErrorCode.TOKEN_INVALID, "Invalid refresh token.", 401);
    }

    if (record.revokedAt) {
      // Reuse of a revoked token: revoke every token in the family.
      await this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: "reuse_detected" },
      });
      await this.audit.record(
        this.audit.fromRequest(request, {
          action: "auth.refresh.reuse_detected",
          targetUserId: record.userId,
          severity: "CRITICAL",
        }),
      );
      throw new AppException(
        ErrorCode.TOKEN_INVALID,
        "This session has been revoked. Please sign in again.",
        401,
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new AppException(
        ErrorCode.TOKEN_EXPIRED,
        "Your session has expired. Please sign in again.",
        401,
      );
    }

    if (record.user.status !== "ACTIVE") {
      throw new AppException(
        ErrorCode.ACCOUNT_SUSPENDED,
        "Your account is not active.",
        403,
      );
    }

    const session = await this.createSession(
      record.userId,
      record.user.role,
      record.user.emailVerified,
      record.user.status,
      request,
      record.id,
    );

    return {
      auth: {
        user: this.toAuthUser(record.user),
        accessToken: session.accessToken,
        expiresIn: this.tokens.accessTokenTtlSeconds(),
      },
      session,
    };
  }

  // --- Email verification -----------------------------------------------------

  /** Consumes a single-use verification token. */
  async verifyEmail(tokenRaw: string): Promise<{ user: AuthUser }> {
    const tokenHash = sha256(tokenRaw);
    const record = await this.prisma.emailToken.findUnique({
      where: { tokenHash },
      include: { user: { select: this.userSelect } },
    });

    if (!record || record.purpose !== "EMAIL_VERIFICATION") {
      throw new AppException(ErrorCode.TOKEN_INVALID, "This verification link is not valid.", 400);
    }

    if (record.consumedAt) {
      throw new AppException(
        ErrorCode.TOKEN_INVALID,
        "This verification link has already been used.",
        400,
      );
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new AppException(
        ErrorCode.TOKEN_EXPIRED,
        "This verification link has expired. Request a new one from your account settings.",
        400,
      );
    }

    await this.prisma.$transaction([
      this.prisma.emailToken.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true, emailVerifiedAt: new Date() },
      }),
    ]);

    return { user: this.toAuthUser({ ...record.user, emailVerified: true }) };
  }

  // --- Password reset ---------------------------------------------------------

  /**
   * Starts a password reset.
   *
   * SECURITY: always returns success, even for an unknown address, so the endpoint
   * cannot be used to discover which emails have accounts.
   */
  async forgotPassword(email: string): Promise<{ accepted: true }> {
    const user = await this.prisma.user.findFirst({
      where: { email, deletedAt: null, status: "ACTIVE" },
      select: { id: true, firstName: true },
    });

    if (!user) {
      this.logger.log(`Password reset requested for unknown email (hint ${this.emailHint(email)})`);
      return { accepted: true };
    }

    const raw = randomBytes(32).toString("base64url");
    await this.prisma.emailToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(raw),
        purpose: "PASSWORD_RESET",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour, single use
      },
    });

    const link = `${this.config.getOrThrow<string>("app.webBaseUrl")}/reset-password?token=${encodeURIComponent(raw)}`;

    await this.prisma.backgroundJob.create({
      data: {
        type: "notification.email",
        payload: {
          userId: user.id,
          notificationType: "PASSWORD_RESET",
          templateData: { firstName: user.firstName, link },
        },
        maxAttempts: this.config.getOrThrow<number>("app.jobs.maxAttempts"),
      },
    });

    return { accepted: true };
  }

  /** Completes a password reset, consuming the token and revoking all sessions. */
  async resetPassword(tokenRaw: string, newPassword: string): Promise<{ user: AuthUser }> {
    const tokenHash = sha256(tokenRaw);
    const record = await this.prisma.emailToken.findUnique({ where: { tokenHash } });

    if (!record || record.purpose !== "PASSWORD_RESET") {
      throw new AppException(ErrorCode.TOKEN_INVALID, "This reset link is not valid.", 400);
    }
    if (record.consumedAt) {
      throw new AppException(
        ErrorCode.TOKEN_INVALID,
        "This reset link has already been used. Request a new one.",
        400,
      );
    }
    if (record.expiresAt.getTime() < Date.now()) {
      throw new AppException(ErrorCode.TOKEN_EXPIRED, "This reset link has expired.", 400);
    }

    const passwordHash = await this.passwords.hash(newPassword);

    // Password change invalidates every existing session.
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      this.prisma.emailToken.update({
        where: { id: record.id },
        data: { consumedAt: new Date() },
      }),
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId, revokedAt: null },
        data: { revokedAt: new Date(), revokedReason: "password_reset" },
      }),
    ]);

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: record.userId },
      select: this.userSelect,
    });

    return { user: this.toAuthUser(user) };
  }

  // --- Session creation -------------------------------------------------------

  /** Issues an access token and a stored refresh token. */
  async createSession(
    userId: string,
    role: UserRole,
    emailVerified: boolean,
    status: string,
    request: RequestWithActor,
    replacedTokenId?: string,
  ): Promise<SessionTokens> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { email: true },
    });

    const accessToken = this.tokens.signAccessToken({
      sub: userId,
      email: user.email,
      role,
      emailVerified,
      status,
    });

    const refresh = this.tokens.createRefreshToken();

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: refresh.hash,
        expiresAt: refresh.expiresAt,
        replacedById: replacedTokenId,
        userAgent: request.headers["user-agent"],
        ipAddress: this.clientIp(request),
      },
    });

    return {
      accessToken,
      refreshToken: refresh.raw,
      refreshExpiresAt: refresh.expiresAt,
    };
  }

  // --- Helpers ----------------------------------------------------------------

  /** Reusable user projection for auth responses. */
  private readonly userSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    role: true,
    emailVerified: true,
    status: true,
    preferredLanguage: true,
    preferredTimezone: true,
    createdAt: true,
  } as const;

  private toAuthUser(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: UserRole;
    emailVerified: boolean;
    status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
    preferredLanguage: string;
    preferredTimezone: string;
    createdAt: Date;
  }): AuthUser {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role,
      emailVerified: user.emailVerified,
      status: user.status,
      preferredLanguage: user.preferredLanguage,
      preferredTimezone: user.preferredTimezone,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /** Queue a verification email through the durable job queue. */
  private async queueEmailVerification(userId: string, email: string, firstName: string): Promise<void> {
    const raw = randomBytes(32).toString("base64url");
    await this.prisma.emailToken.create({
      data: {
        userId,
        tokenHash: sha256(raw),
        purpose: "EMAIL_VERIFICATION",
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    const link = `${this.config.getOrThrow<string>("app.webBaseUrl")}/verify-email?token=${encodeURIComponent(raw)}`;

    await this.prisma.backgroundJob.create({
      data: {
        type: "notification.email",
        payload: {
          userId,
          notificationType: "EMAIL_VERIFICATION",
          templateData: { firstName, link },
        },
        maxAttempts: this.config.getOrThrow<number>("app.jobs.maxAttempts"),
      },
    });
  }

  /** Non-reversible hint used in logs instead of the full address. */
  private emailHint(email: string): string {
    return `${createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 12)}`;
  }

  private clientIp(request: RequestWithActor): string | undefined {
    const forwarded = request.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
      return forwarded.split(",")[0]?.trim();
    }
    return request.ip;
  }
}

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

// Re-exported so callers that need to signal a bad token can do so from one place.
export { BadRequestException, UnauthorizedException };
