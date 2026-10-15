import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 requires the datasource URL to live here rather than in the schema.
 * The schema's `datasource db { provider }` stays as-is.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // `prisma migrate dev` needs a separate shadow database.
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
