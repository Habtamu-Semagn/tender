import { type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";
import { IS_PUBLIC_KEY } from "./roles.guard.js";
import { TokenService, type AccessTokenPayload } from "./token.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { type RequestActor, type RequestWithActor } from "../audit/audit.service.js";

/**
 * Authenticates requests from either an HttpOnly session cookie or a Bearer
 * token, and attaches the caller's principal to the request.
 *
 * SECURITY: the user record is re-read from the database on every request, so a
 * suspension or role change takes effect immediately rather than when the token
 * expires. Tokens alone are never trusted as proof of current standing.
 */
@Injectable()
export class JwtAuthGuard {
  static AUTH_COOKIE_NAME = "chereta_access";
  static REFRESH_COOKIE_NAME = "chereta_refresh";
  static CSRF_COOKIE_NAME = "chereta_csrf";
  static CSRF_HEADER_NAME = "x-csrf-token";

  constructor(
    private readonly tokens: TokenService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest<RequestWithActor>();
    const token = this.extractToken(request);

    if (!token) {
      throw new AppException(ErrorCode.UNAUTHENTICATED, "Authentication required.", 401);
    }

    const payload: AccessTokenPayload = this.tokens.verifyAccessToken(token);

    const user = await this.prisma.user.findFirst({
      where: { id: payload.sub, deletedAt: null },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
      },
    });

    if (!user) {
      throw new AppException(
        ErrorCode.UNAUTHENTICATED,
        "Your account no longer exists.",
        401,
      );
    }

    if (user.status === "SUSPENDED") {
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

    request.actor = {
      userId: user.id,
      role: user.role,
      emailVerified: user.emailVerified,
      status: user.status,
    };

    return true;
  }

  /** Accepts a Bearer header first, then the HttpOnly session cookie. */
  private extractToken(request: RequestWithActor): string | null {
    const header = request.headers.authorization;
    if (typeof header === "string" && header.startsWith("Bearer ")) {
      return header.slice("Bearer ".length).trim();
    }

    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies;
    return cookies?.[JwtAuthGuard.AUTH_COOKIE_NAME] ?? null;
  }
}
