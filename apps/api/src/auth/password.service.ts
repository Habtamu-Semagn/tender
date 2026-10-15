import { hash, verify } from "@node-rs/argon2";
import { Injectable } from "@nestjs/common";

/**
 * Password hashing with Argon2id, the algorithm recommended by OWASP for
 * password storage. Plaintext passwords are never stored or logged.
 *
 * @node-rs/argon2 is used rather than the reference `argon2` package because it
 * ships prebuilt native binaries, avoiding a node-gyp compile at install time.
 */
@Injectable()
export class PasswordService {
  /** OWASP-recommended parameters: 19 MiB memory, 2 iterations, 1 lane. */
  private static readonly OPTIONS = {
    memoryCost: 19 * 1024,
    timeCost: 2,
    parallelism: 1,
    // Argon2id — resistant to both GPU and side-channel attacks.
    algorithm: 2 as const,
  };

  async hash(plaintext: string): Promise<string> {
    return hash(plaintext, PasswordService.OPTIONS);
  }

  async verify(hashed: string, plaintext: string): Promise<boolean> {
    try {
      return await verify(hashed, plaintext);
    } catch {
      // A malformed stored hash must not crash the login path.
      return false;
    }
  }
}
