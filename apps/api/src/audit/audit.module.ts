import { Global, Module } from "@nestjs/common";
import { AuditService } from "./audit.service.js";

/** Global so any module can record audit events without re-importing. */
@Global()
@Module({
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
