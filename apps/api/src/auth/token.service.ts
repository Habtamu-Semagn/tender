import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { createRequire } from "node:module";

/**
 * Token minting and verification.
 *
 * Access tokens are short-lived JWTs. Refresh tokens are opaque random strings
 * whose SHA-256 hash is what gets stored, so a database leak does not yield
 * usable session tokens.
 */

interface JsonWebTokenModule {
  sign(payload: object, secret: string, options?: object): string;
  verify(token: string, secret: string): unknown;
}

/** Loads the JSON Web Token implementation lazily and ESM-safely. */
function loadJwt(): JsonWebTokenModule {
  const require = createRequire(import.meta.url);
  // @nestjs/jwt re-exports jsonwebtoken, which is CommonJS; require() works from
  // this ESM package via createRequire.
  const mod = require("jsonwebtoken") as JsonWebTokenModule & { default?: JsonWebTokenModule };
  return (mod as unknown as { default?: JsonWebTokenModule }).default ?? mod;
}

export interface AccessTokenPayload {
  /** Subject: the user id. */
  sub: string;
  email: string;
  role: "SUPPLIER" | "ADMIN";
  emailVerified: boolean;
  status: string;
  /** Distinguishes access tokens from refresh tokens if both were ever passed. */
  typ: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  /** Unique per token, so a rotated token cannot be replayed. */
  jti: string;
  typ: "refresh";
}

const sha256 = (value: string): string => createHash("sha256").update(value).digest("hex");

@Injectable()
export class TokenService {
  private readonly jwt: JsonWebTokenModule;

  constructor(private readonly config: ConfigService) {
    this.jwt = loadJwt();
  }

  /** Signs a short-lived access token. */
  signAccessToken(payload: Omit<AccessTokenPayload, "typ">): string {
    return this.jwt.sign(
      { ...payload, typ: "access" },
      this.config.getOrThrow<string>("app.jwt.accessSecret"),
      { expiresIn: this.config.getOrThrow<string>("app.jwt.accessTtl") },
    );
  }

  /** Verifies an access token; throws UnauthorizedException when invalid. */
  verifyAccessToken(token: string): AccessTokenPayload {
    try {
      const decoded = this.jwt.verify(
        token,
        this.config.getOrThrow<string>("app.jwt.accessSecret"),
      ) as AccessTokenPayload;
      if (decoded.typ !== "access") {
        throw new UnauthorizedException("Invalid token type");
      }
      return decoded;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  /**
   * Creates a fresh opaque refresh token and returns both the raw value (given
   * to the client once) and its hash (stored in the database).
   */
  createRefreshToken(): { raw: string; hash: string; expiresAt: Date } {
    const raw = randomBytes(48).toString("base64url");
    const ttl = this.parseTtlToMs(this.config.getOrThrow<string>("app.jwt.refreshTtl"));
    return {
      raw,
      hash: sha256(raw),
      expiresAt: new Date(Date.now() + ttl),
    };
  }

  /** Hash of a raw refresh token, for lookup and comparison. */
  hashRefreshToken(raw: string): string {
    return sha256(raw);
  }

  /** Constant-time comparison of two token hashes. */
  safeCompare(a: string, b: string): boolean {
    const bufA = Buffer.from(a, "utf8");
    const bufB = Buffer.from(b, "utf8");
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  /** Access token lifetime in seconds, reported to clients. */
  accessTokenTtlSeconds(): number {
    return Math.floor(this.parseTtlToMs(this.config.getOrThrow<string>("app.jwt.accessTtl")) / 1000);
  }

  private parseTtlToMs(ttl: string): number {
    const match = /^(\d+)(s|m|h|d)$/.exec(ttl.trim());
    if (!match) throw new Error(`Unsupported JWT TTL format: ${ttl}`);
    const value = Number(match[1]);
    const unit = match[2];
    const multipliers: Record<string, number> = {
      s: 1_000,
      m: 60_000,
      h: 3_600_000,
      d: 86_400_000,
    };
    return value * multipliers[unit];
  }
}
