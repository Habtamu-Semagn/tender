import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * ESLint 9 flat configuration.
 *
 * Type-aware linting is scoped to the project's own tsconfig so the generated
 * Prisma client and node_modules are never type-checked here (that would be both
 * slow and noisy). Decorators and Nest's DI patterns are intentionally left
 * permissive — the type system and the runtime guards already cover them.
 */
export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/generated/**",
      "coverage/**",
      "*.config.ts",
      "vitest*.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Unused vars are errors, but allow the conventional leading underscore
      // for intentionally-ignored bindings.
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // `any` is discouraged; escape hatches are reviewed, not banned outright.
      "@typescript-eslint/no-explicit-any": "warn",
      // Floating promises are a real bug source in an async-first codebase.
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      // The no-unsafe-* family misfires on Prisma's ESM custom-output client:
      // its query results are correctly typed at the Prisma layer but resolve as
      // `any` through the type-checker in this nodenext setup, producing hundreds
      // of false positives. Disabled rather than worked around; the compiler and
      // the runtime guards are the real safety net for those values.
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-enum-comparison": "off",
      // Prisma Decimal/Date values stringify via their own methods; the base
      // toString rule does not understand them.
      "@typescript-eslint/no-base-to-string": "off",
      // Consistency with the codebase's explicit return types on services.
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
);
