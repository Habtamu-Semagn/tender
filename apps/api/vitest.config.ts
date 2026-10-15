import { defineConfig } from "vitest/config";

/**
 * Vitest configuration.
 *
 * Unit tests run in isolation against plain TypeScript — no database, no Nest
 * DI container — so they stay fast and deterministic. Integration/e2e tests that
 * need Postgres live behind the separate `vitest.e2e.config.ts`.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.spec.ts"],
    exclude: ["node_modules", "dist", "src/**/*.e2e-spec.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.spec.ts",
        "src/**/*.module.ts",
        "src/main.ts",
        "src/generated/**",
      ],
    },
  },
});
