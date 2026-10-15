import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service.js";
import { AppConfigModule } from "../config/config.module.js";

/**
 * Global so feature modules can inject PrismaService without re-importing it.
 *
 * `AppConfigModule` is imported explicitly: PrismaService reads the database
 * URL from configuration in its constructor, so the config module must be
 * resolved before this module's providers are instantiated.
 */
@Global()
@Module({
  imports: [AppConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
