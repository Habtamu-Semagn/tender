import { Injectable, Logger, type OnApplicationBootstrap, type OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NotificationService } from "../notifications/notification.service.js";
import { PrismaService } from "../prisma/prisma.service.js";

/**
 * Durable background-job worker.
 *
 * Jobs live in PostgreSQL (the transactional outbox), so a job enqueued inside a
 * business transaction is committed or rolled back with it. This avoids a second
 * piece of infrastructure (Redis/BullMQ) for what is, in practice, reliable
 * notification delivery.
 *
 * Claiming uses `UPDATE ... WHERE id IN (SELECT ... FOR UPDATE SKIP LOCKED)`, so
 * multiple workers can run concurrently without double-processing.
 */
interface JobPayload {
  notificationId?: string;
  userId?: string;
  email?: string;
  notificationType?: string;
  templateData?: Record<string, string>;
  actionUrl?: string;
}

@Injectable()
export class JobWorkerService implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(JobWorkerService.name);
  private timer: NodeJS.Timeout | null = null;
  private running = false;
  private stopping = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
    private readonly config: ConfigService,
  ) {}

  onApplicationBootstrap(): void {
    const intervalMs = this.config.getOrThrow<number>("app.jobs.pollIntervalMs");
    this.logger.log(`Background job worker started (polling every ${intervalMs}ms)`);
    this.timer = setInterval(() => {
      void this.tick();
    }, intervalMs);
    // Do not hold the process open solely for the job timer.
    this.timer.unref?.();
  }

  onModuleDestroy(): void {
    this.stopping = true;
    if (this.timer) clearInterval(this.timer);
  }

  /** Runs one poll cycle. Exposed for tests. */
  async tick(): Promise<number> {
    if (this.running || this.stopping) return 0;
    this.running = true;

    try {
      const batchSize = this.config.getOrThrow<number>("app.jobs.batchSize");
      const claimed = await this.claimBatch(batchSize);

      for (const job of claimed) {
        if (this.stopping) break;
        await this.process(job);
      }

      return claimed.length;
    } finally {
      this.running = false;
    }
  }

  private async claimBatch(limit: number): Promise<
    { id: string; type: string; payload: unknown; attempts: number; maxAttempts: number }[]
  > {
    const rows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM background_jobs
      WHERE status = 'PENDING' AND "runAfter" <= NOW()
      ORDER BY "runAfter" ASC
      LIMIT ${limit}
      FOR UPDATE SKIP LOCKED
    `;

    if (rows.length === 0) return [];

    const ids = rows.map((r) => r.id);
    const updated = await this.prisma.backgroundJob.updateMany({
      where: { id: { in: ids }, status: "PENDING" },
      data: { status: "RUNNING", startedAt: new Date(), attempts: { increment: 1 } },
    });

    if (updated.count === 0) return [];

    return this.prisma.backgroundJob.findMany({
      where: { id: { in: ids }, status: "RUNNING" },
      select: { id: true, type: true, payload: true, attempts: true, maxAttempts: true },
    });
  }

  private async process(job: {
    id: string;
    type: string;
    payload: unknown;
    attempts: number;
    maxAttempts: number;
  }): Promise<void> {
    try {
      switch (job.type) {
        case "notification.email": {
          const payload = job.payload as JobPayload;
          if (!payload.userId || !payload.notificationType) {
            this.logger.warn(`Malformed notification job ${job.id} — dropping`);
            break;
          }
          await this.notifications.sendQueuedEmail({
            ...payload,
            userId: payload.userId,
            notificationType: payload.notificationType as never,
            templateData: payload.templateData ?? {},
          });
          break;
        }
        default:
          this.logger.warn(`Unknown job type "${job.type}" (job ${job.id}) — marking complete`);
          break;
      }

      await this.prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: "COMPLETED", completedAt: new Date(), lastError: null },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const exhausted = job.attempts >= job.maxAttempts;

      if (exhausted) {
        this.logger.error(
          `Job ${job.id} (${job.type}) failed permanently after ${job.attempts} attempts: ${message}`,
        );
        await this.prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: "DEAD", completedAt: new Date(), lastError: message },
        });
      } else {
        // Exponential backoff: 30s, 60s, 120s, ... capped at 30 minutes.
        const backoffMs = Math.min(30_000 * 2 ** (job.attempts - 1), 1_800_000);
        this.logger.warn(
          `Job ${job.id} (${job.type}) failed on attempt ${job.attempts}/${job.maxAttempts}, retrying in ${backoffMs}ms: ${message}`,
        );
        await this.prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: "PENDING",
            runAfter: new Date(Date.now() + backoffMs),
            lastError: message,
          },
        });
      }
    }
  }

  /** Queue depth, surfaced by the health endpoint. */
  async pendingCount(): Promise<number> {
    return this.prisma.backgroundJob.count({ where: { status: "PENDING" } });
  }

  async deadCount(): Promise<number> {
    return this.prisma.backgroundJob.count({ where: { status: "DEAD" } });
  }
}
