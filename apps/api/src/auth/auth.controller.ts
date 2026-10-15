import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { ConfigService } from "@nestjs/config";
import { type Request as ExpressRequest, type Response as ExpressResponse } from "express";
import {
  type AuthUser,
  forgotPasswordSchema,
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from "@chereta/contracts";
import { AuthService, type SessionTokens } from "./auth.service.js";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { Public } from "./roles.guard.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";
import { createHash, randomBytes } from "node:crypto";
import { type RequestWithActor } from "../audit/audit.service.js";

/**
 * Authentication endpoints.
 *
 * Sessions use HttpOnly cookies for browser clients (no tokens in localStorage),
 * with a double-submit CSRF token so cookie-based authentication cannot be abused
 * by another origin. Non-browser clients may use the Bearer token instead.
 */
@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  // --- Cookie helpers ---------------------------------------------------------

  private cookieOptions() {
    return {
      httpOnly: true,
      secure: this.config.getOrThrow<boolean>("app.cookies.secure"),
      sameSite: "lax" as const,
      domain: this.config.get<string>("app.cookies.domain"),
      path: "/",
    };
  }

  private setSessionCookies(response: ExpressResponse, session: SessionTokens): void {
    const opts = this.cookieOptions();

    response.cookie(JwtAuthGuard.AUTH_COOKIE_NAME, session.accessToken, {
      ...opts,
      maxAge: 15 * 60 * 1000, // matches the access token TTL
    });

    response.cookie(JwtAuthGuard.REFRESH_COOKIE_NAME, session.refreshToken, {
      ...opts,
      // Scoped to the auth endpoints so it is not sent with every request.
      path: "/api/v1/auth",
      maxAge: undefined,
    });

    // Double-submit CSRF token: readable by JS, sent back in a custom header.
    const csrf = randomBytes(32).toString("base64url");
    response.cookie(JwtAuthGuard.CSRF_COOKIE_NAME, csrf, {
      httpOnly: false,
      secure: opts.secure,
      sameSite: opts.sameSite,
      domain: opts.domain,
      path: "/",
    });
  }

  private clearSessionCookies(response: ExpressResponse): void {
    const opts = this.cookieOptions();
    response.clearCookie(JwtAuthGuard.AUTH_COOKIE_NAME, opts);
    response.clearCookie(JwtAuthGuard.REFRESH_COOKIE_NAME, { ...opts, path: "/api/v1/auth" });
    response.clearCookie(JwtAuthGuard.CSRF_COOKIE_NAME, opts);
  }

  /** Validates the double-submit CSRF token for cookie-based requests. */
  private assertCsrf(request: ExpressRequest): void {
    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies ?? {};
    const cookieToken = cookies[JwtAuthGuard.CSRF_COOKIE_NAME];
    const headerToken = request.headers[JwtAuthGuard.CSRF_HEADER_NAME];

    // Bearer-token clients are not cookie-authenticated, so CSRF does not apply.
    const authorization = request.headers.authorization;
    if (typeof authorization === "string" && authorization.startsWith("Bearer ")) return;

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      throw new AppException(
        ErrorCode.CSRF_FAILED,
        "Your session could not be verified. Refresh the page and try again.",
        403,
      );
    }
  }

  // --- Endpoints --------------------------------------------------------------

  @Post("register")
  @Public()
  @Throttle({ default: { limit: 5, ttl: 3600_000 } })
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new supplier account" })
  @ApiResponse({ status: 201, description: "Account created; verification email queued." })
  @ApiResponse({ status: 409, description: "Email already registered." })
  async register(@Body({ schema: registerSchema }) body: RegisterInput) {
    return this.auth.register(body);
  }

  @Post("login")
  @Public()
  @Throttle({ default: { limit: 10, ttl: 900_000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in with email and password" })
  @ApiResponse({ status: 200, description: "Authenticated; session cookies set." })
  @ApiResponse({ status: 401, description: "Incorrect email or password." })
  async login(
    @Body({ schema: loginSchema }) body: LoginInput,
    @Req() request: RequestWithActor,
  ) {
    const { auth, session } = await this.auth.login(body, request);

    const res = (request as unknown as { res: ExpressResponse }).res;
    this.setSessionCookies(res, session);

    // The refresh token is returned only through the HttpOnly cookie.
    return {
      user: auth.user,
      accessToken: auth.accessToken,
      expiresIn: auth.expiresIn,
    };
  }

  @Post("refresh")
  @Public()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 30, ttl: 900_000 } })
  @ApiOperation({ summary: "Rotate the refresh token and issue a new access token" })
  @ApiResponse({ status: 200, description: "New session issued." })
  @ApiResponse({ status: 401, description: "Invalid, expired or revoked refresh token." })
  async refresh(@Req() request: RequestWithActor) {
    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies ?? {};
    const raw = cookies[JwtAuthGuard.REFRESH_COOKIE_NAME];

    const { auth, session } = await this.auth.refresh(raw, request);
    const res = (request as unknown as { res: ExpressResponse }).res;
    this.setSessionCookies(res, session);

    return {
      user: auth.user,
      accessToken: auth.accessToken,
      expiresIn: auth.expiresIn,
    };
  }

  @Post("logout")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Revoke the current session" })
  async logout(@Req() request: RequestWithActor) {
    this.assertCsrf(request);

    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies ?? {};
    await this.auth.logout(cookies[JwtAuthGuard.REFRESH_COOKIE_NAME], request);

    const res = (request as unknown as { res: ExpressResponse }).res;
    this.clearSessionCookies(res);
    return { success: true };
  }

  @Post("verify-email")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Verify an email address with a single-use token" })
  async verifyEmail(@Body({ schema: verifyEmailSchema }) body: { token: string }) {
    const { user } = await this.auth.verifyEmail(body.token);
    return { user };
  }

  @Post("forgot-password")
  @Public()
  @HttpCode(HttpStatus.ACCEPTED)
  @Throttle({ default: { limit: 5, ttl: 3600_000 } })
  @ApiOperation({ summary: "Request a password reset link" })
  @ApiResponse({
    status: 202,
    description: "Always accepted, so the endpoint cannot enumerate accounts.",
  })
  async forgotPassword(@Body({ schema: forgotPasswordSchema }) body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Post("reset-password")
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Complete a password reset; all existing sessions are revoked" })
  async resetPassword(
    @Body({ schema: resetPasswordSchema }) body: { token: string; password: string },
  ) {
    const { user } = await this.auth.resetPassword(body.token, body.password);
    return { user };
  }

  @Get("me")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Return the authenticated user's profile" })
  @ApiResponse({ status: 200, description: "Current user." })
  @ApiResponse({ status: 401, description: "Authentication required." })
  async me(@Req() request: RequestWithActor): Promise<{ user: AuthUser }> {
    const actor = this.actorFrom(request);

    const user = await this.prisma.user.findFirst({
      where: { id: actor.userId, deletedAt: null },
      select: {
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
      },
    });

    if (!user) {
      throw new AppException(ErrorCode.USER_NOT_FOUND, "User not found.", 404);
    }

    return {
      user: {
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
      },
    };
  }

  @Post("profile")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update the authenticated user's profile" })
  async updateProfile(@Req() request: RequestWithActor, @Body({ schema: updateProfileSchema }) body: Record<string, unknown>) {
    const actor = this.actorFrom(request);

    const user = await this.prisma.user.update({
      where: { id: actor.userId },
      data: {
        ...(body.firstName !== undefined ? { firstName: String(body.firstName) } : {}),
        ...(body.lastName !== undefined ? { lastName: String(body.lastName) } : {}),
        ...(body.phone !== undefined ? { phone: body.phone as string } : {}),
        ...(body.preferredLanguage !== undefined
          ? { preferredLanguage: String(body.preferredLanguage) }
          : {}),
        ...(body.preferredTimezone !== undefined
          ? { preferredTimezone: String(body.preferredTimezone) }
          : {}),
      },
      select: {
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
      },
    });

    return {
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      },
    };
  }

  private actorFrom(request: RequestWithActor) {
    const actor = request.actor;
    if (!actor) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }
    return actor;
  }
}

/** Content hash helper exported for tests. */
export const sha256Hex = (value: string): string => createHash("sha256").update(value).digest("hex");
