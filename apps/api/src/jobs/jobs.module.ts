import { Module } from "@nestjs/common";
import { NotificationsModule } from "../notifications/notifications.module.js";
import { JobWorkerService } from "./job-worker.service.js";

/**
 * Background job delivery.
 *
 * The worker is driven by the durable Postgres job table rather than Redis:
 * the only asynchronous work Chereta needs is reliable email delivery after a
 * transaction has committed, and a database queue makes that atomic.
 */
@Module({
  imports: [NotificationsModule],
  providers: [JobWorkerService],
  exports: [JobWorkerService],
})
export class JobsModule {}
