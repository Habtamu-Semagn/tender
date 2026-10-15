import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  SetMetadata,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorCode } from "../common/errors/error-codes.js";
import { AppException } from "../common/errors/app.exception.js";
import { type RequestActor, type RequestWithActor } from "../audit/audit.service.js";

/**
 * Server-side authorization.
 *
 * A hidden route or disabled button is never treated as authorization: every
 * protected endpoint passes through one of these guards, and every guard
 * re-derives permissions from the authenticated principal.
 */
export const ROLES_KEY = "chereta:roles";

/** Restricts a route to specific global roles. */
export const RequireRoles = (...roles: RequestActor["role"][]) =>
  SetMetadata(ROLES_KEY, roles);

/** Marks a route as requiring an authenticated (non-suspended) principal. */
export const IS_PUBLIC_KEY = "chereta:is-public";

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Extracts the actor attached by JwtAuthGuard. */
export const currentActor = (context: ExecutionContext): RequestActor => {
  const request = context.switchToHttp().getRequest<RequestWithActor>();
  const actor = request.actor;
  if (!actor) {
    throw new AppException(
      ErrorCode.UNAUTHENTICATED,
      "Authentication required.",
      401,
    );
  }
  return actor;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Route-level roles take precedence over controller-level roles.
    const roles =
      this.reflector.getAllAndOverride<RequestActor["role"][]>(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) ?? [];

    if (roles.length === 0) return true;

    const actor = currentActor(context);
    if (!roles.includes(actor.role)) {
      throw new AppException(
        ErrorCode.FORBIDDEN,
        "Your account does not have permission to perform this action.",
        403,
      );
    }
    return true;
  }
}
