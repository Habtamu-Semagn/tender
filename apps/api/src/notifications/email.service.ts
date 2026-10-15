import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, type Transporter } from "nodemailer";

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body. */
  text: string;
  /** Optional HTML body. */
  html?: string;
}

/**
 * Provider-independent email delivery.
 *
 * SECURITY: emails are never allowed to carry tender or bid document contents,
 * and links always point back at the platform rather than embedding secrets in
 * the body beyond the single-use token required by the flow.
 */
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly driver: "log" | "smtp";
  private readonly from: string;
  private transporter: Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    this.driver = this.config.getOrThrow<"log" | "smtp">("app.email.driver");
    this.from = this.config.getOrThrow<string>("app.email.from");

    if (this.driver === "smtp") {
      const smtp = this.config.get("app.email.smtp");
      this.transporter = createTransport({
        host: smtp?.host,
        port: smtp?.port ?? 587,
        secure: smtp?.secure ?? false,
        auth: smtp?.user ? { user: smtp.user, pass: smtp?.password } : undefined,
      });
    }
  }

  /**
   * Sends an email. Failures are logged and swallowed by the caller (the job
   * queue retries), because a failed email must never invalidate the business
   * operation that triggered it.
   */
  async send(message: EmailMessage): Promise<void> {
    if (this.driver === "log") {
      this.logger.log(
        `[EMAIL:log] to=${message.to} subject="${message.subject}"\n---\n${message.text}\n---`,
      );
      return;
    }

    try {
      const info = await this.transporter!.sendMail({
        from: this.from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
      this.logger.log(`Email sent to ${message.to} (messageId=${info.messageId})`);
    } catch (error) {
      // Rethrow so the job queue can retry with backoff.
      this.logger.error(
        `Email delivery failed to ${message.to}: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /** True when the SMTP transport is reachable. Used by the health endpoint. */
  async verify(): Promise<boolean> {
    if (this.driver === "log") return true;
    try {
      await this.transporter!.verify();
      return true;
    } catch {
      return false;
    }
  }

  get driverName(): string {
    return this.driver;
  }
}
