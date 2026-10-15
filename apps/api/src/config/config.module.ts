import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuration } from "./configuration.js";

/**
 * Configuration module — global so any module can inject ConfigService without
 * importing it explicitly. Validation happens inside `configuration()` during
 * bootstrap, so an invalid environment aborts startup immediately.
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      // .env is loaded from the workspace root of the api package; Docker and
      // production inject real environment variables instead.
      envFilePath: [".env.local", ".env"],
      cache: true,
      // Unknown variables are ignored so the host environment can carry
      // unrelated keys safely.
      validate: undefined,
      validationSchema: undefined,
    }),
  ],
})
export class AppConfigModule {}
