import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma, type NotificationType } from "../generated/prisma/client.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { EmailService } from "./email.service.js";

/**
 * Notification creation and delivery.
 *
 * In-app notifications are always written synchronously inside the caller's
 * transaction so the record exists even if delivery later fails. The email leg is
 * enqueued as a durable job in the SAME transaction as the business change
 * (transactional outbox), so a failed email can be retried without ever undoing a
 * successful business write such as a submitted bid.
 */
export interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  actionUrl?: string;
  entityType?: string;
  entityId?: string;
  /** Skip the email leg (e.g. for in-app-only events). */
  emailOnlyInApp?: boolean;
  /** Overrides the default user email lookup, mainly for tests. */
  emailOverride?: string;
}

/** Notification catalogue: single place where copy lives. */
const TEMPLATES: Record<
  NotificationType,
  { subject: string; render: (data: Record<string, string>) => string }
> = {
  EMAIL_VERIFICATION: {
    subject: "Verify your Chereta email address",
    render: (d) =>
      `Welcome to Chereta, ${d.firstName ?? "there"}.\n\nVerify your email address to activate your account:\n${d.link}\n\nThis link expires in 24 hours. If you did not create a Chereta account, ignore this email.`,
  },
  PASSWORD_RESET: {
    subject: "Reset your Chereta password",
    render: (d) =>
      `We received a request to reset your Chereta password.\n\nReset it here:\n${d.link}\n\nThis link is single-use and expires in 1 hour. If you did not request a reset, ignore this email and your password stays unchanged.`,
  },
  ORGANIZATION_VERIFICATION_SUBMITTED: {
    subject: "Verification request received",
    render: (d) =>
      `We received the verification request for ${d.organizationName}.\n\nOur team reviews verification requests in order. You will be notified when a decision is recorded.`,
  },
  ORGANIZATION_VERIFICATION_APPROVED: {
    subject: "Your organization is verified",
    render: (d) =>
      `Good news: ${d.organizationName} has been verified on Chereta.\n\nYou can now publish tenders and participate in procurements according to your organization's permissions.\n\n${d.link}`,
  },
  ORGANIZATION_VERIFICATION_REJECTED: {
    subject: "Verification request decision",
    render: (d) =>
      `The verification request for ${d.organizationName} was not approved.\n\nReviewer notes: ${d.notes}\n\nYou may submit a new request with the required documents.\n\n${d.link}`,
  },
  ORGANIZATION_INVITATION: {
    subject: "You have been invited to an organization on Chereta",
    render: (d) =>
      `You have been invited to join ${d.organizationName} on Chereta as ${d.role}.\n\nAccept the invitation:\n${d.link}`,
  },
  TENDER_PUBLISHED: {
    subject: "New tender published: {{tenderReference}}",
    render: (d) =>
      `A new tender matching your saved interests has been published.\n\n${d.tenderTitle}\nReference: ${d.tenderReference}\nSubmission deadline: ${d.submissionDeadline}\n\nView the tender:\n${d.link}`,
  },
  TENDER_AMENDED: {
    subject: "Tender amended: {{tenderReference}}",
    render: (d) =>
      `A tender you are participating in has been amended.\n\n${d.tenderTitle}\nReference: ${d.tenderReference}\nAmendment: ${d.amendmentTitle}\n${d.deadlineChange}\n\nView the amendment:\n${d.link}`,
  },
  TENDER_CANCELLED: {
    subject: "Tender cancelled: {{tenderReference}}",
    render: (d) =>
      `The following tender has been cancelled.\n\n${d.tenderTitle}\nReference: ${d.tenderReference}\nReason: ${d.reason}\n\n${d.link}`,
  },
  TENDER_CLOSING_SOON: {
    subject: "Closing soon: {{tenderReference}}",
    render: (d) =>
      `A tender you saved closes soon.\n\n${d.tenderTitle}\nReference: ${d.tenderReference}\nSubmission deadline: ${d.submissionDeadline}\n\n${d.link}`,
  },
  CLARIFICATION_ANSWERED: {
    subject: "Your clarification question was answered",
    render: (d) =>
      `Your clarification question on ${d.tenderReference} has been answered.\n\nQuestion: ${d.question}\n\nAnswer: ${d.answer}\n\n${d.link}`,
  },
  BID_SUBMITTED: {
    subject: "Bid submitted: {{tenderReference}}",
    render: (d) =>
      `Your bid has been submitted successfully.\n\nTender: ${d.tenderTitle}\nReference: ${d.tenderReference}\nSubmission reference: ${d.submissionReference}\nSubmitted at: ${d.submittedAt}\n\nKeep this receipt. You can download it any time from your bids page:\n${d.link}`,
  },
  BID_WITHDRAWN: {
    subject: "Bid withdrawn: {{tenderReference}}",
    render: (d) =>
      `Your bid on ${d.tenderReference} has been withdrawn.\n\nSubmission reference: ${d.submissionReference}\n\n${d.link}`,
  },
  BID_OPENED: {
    subject: "Bids opened: {{tenderReference}}",
    render: (d) =>
      `The confidential bid opening for ${d.tenderReference} has been completed.\n\nYour submission was recorded and is now under evaluation.\n\n${d.link}`,
  },
  EVALUATION_ASSIGNED: {
    subject: "You have been assigned to evaluate a tender",
    render: (d) =>
      `You have been assigned as an evaluator.\n\nTender: ${d.tenderTitle}\nReference: ${d.tenderReference}\nStage: ${d.stage}\nDue: ${d.dueAt}\n\nReview the assignment:\n${d.link}`,
  },
  EVALUATION_SUBMITTED: {
    subject: "Evaluation submitted: {{tenderReference}}",
    render: (d) =>
      `An evaluation you submitted has been recorded.\n\nTender: ${d.tenderTitle}\nReference: ${d.tenderReference}\n\n${d.link}`,
  },
  AWARD_RECOMMENDED: {
    subject: "Award recommendation recorded: {{tenderReference}}",
    render: (d) =>
      `An award recommendation has been recorded and awaits approval.\n\nTender: ${d.tenderTitle}\nReference: ${d.tenderReference}\n\n${d.link}`,
  },
  AWARD_APPROVED: {
    subject: "Award decision recorded: {{tenderReference}}",
    render: (d) =>
      `An award decision has been recorded.\n\nTender: ${d.tenderTitle}\nReference: ${d.tenderReference}\n\n${d.link}`,
  },
  AWARD_PUBLISHED: {
    subject: "Award published: {{tenderReference}}",
    render: (d) =>
      `The award for ${d.tenderReference} has been published.\n\n${d.tenderTitle}\n\n${d.link}`,
  },
  ACCOUNT_SUSPENDED: {
    subject: "Your Chereta account has been suspended",
    render: (d) =>
      `Your Chereta account has been suspended.\n\nReason: ${d.reason}\n\nIf you believe this is a mistake, contact support and quote your account email.`,
  },
  SECURITY_ALERT: {
    subject: "Security alert on your Chereta account",
    render: (d) => `${d.message}\n\n${d.link}`,
  },
};

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly webBaseUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
    private readonly config: ConfigService,
  ) {
    this.webBaseUrl = this.config.getOrThrow<string>("app.webBaseUrl");
  }

  /**
   * Creates an in-app notification and, inside the SAME transaction, enqueues the
   * email leg as a durable background job.
   *
   * `tx` should be the transaction running the business change, so a rollback
   * removes the notification and its job together.
   */
  async create(
    tx: Prisma.TransactionClient,
    params: CreateNotificationParams,
    templateData: Record<string, string> = {},
  ): Promise<void> {
    const notification = await tx.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: this.renderTitle(params.type, templateData),
        body: this.renderBody(params.type, templateData),
        actionUrl: params.actionUrl,
        entityType: params.entityType,
        entityId: params.entityId,
      },
      select: { id: true },
    });

    if (params.emailOnlyInApp) return;

    await tx.backgroundJob.create({
      data: {
        type: "notification.email",
        payload: {
          notificationId: notification.id,
          userId: params.userId,
          email: params.emailOverride,
          notificationType: params.type,
          templateData,
          actionUrl: params.actionUrl,
        },
        maxAttempts: this.config.getOrThrow<number>("app.jobs.maxAttempts"),
      },
    });
  }

  /**
   * Notifies members of organizations whose tenders are in the same category,
   * plus anyone who saved this tender's organization.
   *
   * A failure here must never undo a successful publication, so the whole
   * notification sweep is best-effort: it logs and returns.
   */
  async notifyTenderPublished(tx: Prisma.TransactionClient, tenderId: string): Promise<void> {
    try {
      const tender = await tx.tender.findFirst({
        where: { id: tenderId },
        select: {
          id: true,
          title: true,
          referenceNumber: true,
          categoryId: true,
          submissionDeadline: true,
        },
      });
      if (!tender) return;

      const actionUrl = `/tenders/${tender.id}`;

      // Members of the publishing organization are told through the audit log;
      // this sweep targets interested outsiders.
      const savedBy = await tx.savedTender.findMany({
        where: { tender: { organizationId: tender.id } },
        select: { userId: true },
        take: 2000,
      });

      const recipients = new Set(savedBy.map((row) => row.userId));
      for (const userId of recipients) {
        await this.create(
          this.prisma,
          {
            userId,
            type: "TENDER_PUBLISHED",
            title: `New tender: ${tender.title}`,
            body: `A new tender matching your interests was published. Reference ${tender.referenceNumber}.`,
            actionUrl,
            entityType: "Tender",
            entityId: tender.id,
          },
          {
            tenderTitle: tender.title,
            tenderReference: tender.referenceNumber,
            submissionDeadline: tender.submissionDeadline
              ? tender.submissionDeadline.toISOString()
              : "",
          },
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send publication notifications for tender ${tenderId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /** Notifies every bidder on a cancelled tender. */
  async notifyTenderCancelled(tx: Prisma.TransactionClient, tenderId: string): Promise<void> {
    try {
      const tender = await tx.tender.findFirst({
        where: { id: tenderId },
        select: { id: true, title: true, referenceNumber: true },
      });
      if (!tender) return;

      const bidders = await tx.bid.findMany({
        where: { tenderId, status: { not: "DRAFT" } },
        select: { organization: { select: { members: { select: { userId: true } } } } },
        take: 2000,
      });

      const recipients = new Set<string>();
      for (const bid of bidders) {
        for (const member of bid.organization.members) {
          recipients.add(member.userId);
        }
      }

      for (const userId of recipients) {
        await this.create(
          this.prisma,
          {
            userId,
            type: "TENDER_CANCELLED",
            title: `Tender cancelled: ${tender.title}`,
            body: `Tender ${tender.referenceNumber} has been cancelled by the procuring organization.`,
            entityType: "Tender",
            entityId: tender.id,
          },
          { tenderTitle: tender.title, tenderReference: tender.referenceNumber },
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send cancellation notifications for tender ${tenderId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /** Notifies bidders when a tender is amended. */
  async notifyTenderAmended(tx: Prisma.TransactionClient, tenderId: string, amendmentTitle: string): Promise<void> {
    try {
      const tender = await tx.tender.findFirst({
        where: { id: tenderId },
        select: { id: true, title: true, referenceNumber: true },
      });
      if (!tender) return;

      const bidders = await tx.bid.findMany({
        where: { tenderId, status: { not: "DRAFT" } },
        select: { organization: { select: { members: { select: { userId: true } } } } },
        take: 2000,
      });

      const recipients = new Set<string>();
      for (const bid of bidders) {
        for (const member of bid.organization.members) {
          recipients.add(member.userId);
        }
      }

      const actionUrl = `/tenders/${tender.id}`;
      for (const userId of recipients) {
        await this.create(
          this.prisma,
          {
            userId,
            type: "TENDER_AMENDED",
            title: `Amendment issued: ${tender.title}`,
            body: `Tender ${tender.referenceNumber} was amended: ${amendmentTitle}. Review the changes before the deadline.`,
            actionUrl,
            entityType: "Tender",
            entityId: tender.id,
          },
          { tenderTitle: tender.title, tenderReference: tender.referenceNumber, amendmentTitle, deadlineChange: "" },
        );
      }
    } catch (error) {
      this.logger.error(
        `Failed to send amendment notifications for tender ${tenderId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /** Marks one notification as read, scoped to its owner. */
  async markRead(userId: string, notificationId: string): Promise<boolean> {
    const result = await this.prisma.notification.updateMany({
      where: { id: notificationId, userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count > 0;
  }

  async markAllRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
    return result.count;
  }

  async unreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, readAt: null } });
  }

  /**
   * Renders and sends the email leg of a queued job. Called by the job worker;
   * failures propagate so the queue retries with backoff.
   */
  async sendQueuedEmail(payload: {
    userId: string;
    email?: string;
    notificationType: NotificationType;
    templateData: Record<string, string>;
    actionUrl?: string;
  }): Promise<void> {
    const template = TEMPLATES[payload.notificationType];
    if (!template) {
      this.logger.warn(`No email template for notification type ${payload.notificationType}`);
      return;
    }

    const email =
      payload.email ??
      (await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: { email: true },
      }))?.email;

    if (!email) {
      this.logger.warn(`Cannot email notification for user ${payload.userId}: no email address`);
      return;
    }

    const data = {
      ...payload.templateData,
      link: payload.actionUrl
        ? payload.actionUrl.startsWith("http")
          ? payload.actionUrl
          : `${this.webBaseUrl}${payload.actionUrl}`
        : this.webBaseUrl,
    };

    await this.email.send({
      to: email,
      subject: this.renderTitle(payload.notificationType, data),
      text: template.render(data),
      html: this.toHtml(template.render(data)),
    });

    await this.prisma.notification.updateMany({
      where: { userId: payload.userId, type: payload.notificationType },
      data: { emailSentAt: new Date() },
    });
  }

  private renderTitle(type: NotificationType, data: Record<string, string>): string {
    const template = TEMPLATES[type];
    if (!template) return "Notification from Chereta";
    return this.interpolate(template.subject, data);
  }

  private renderBody(type: NotificationType, data: Record<string, string>): string {
    const template = TEMPLATES[type];
    return template ? template.render(data) : "";
  }

  private interpolate(template: string, data: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => data[key] ?? "");
  }

  /** Minimal text-to-HTML so emails render acceptably without a template engine. */
  private toHtml(text: string): string {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const linked = escaped.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" style="color:#0f766e">$1</a>',
    );
    return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;line-height:1.6;color:#1f2937;max-width:600px;margin:0 auto;padding:24px"><pre style="font-family:inherit;white-space:pre-wrap;margin:0">${linked}</pre><hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/><p style="font-size:12px;color:#6b7280">Chereta — Ethiopian tender and bidding platform. This is an automated message.</p></div>`;
  }
}
