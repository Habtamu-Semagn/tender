/**
 * Shared primitives: pagination, identifiers, money, timestamps.
 * These schemas are consumed by both the API (via Standard Schema validation in
 * Nest 12) and the web app (via React Hook Form + zodResolver).
 */
import { z } from "zod";

// -----------------------------------------------------------------------------
// Identifiers
// -----------------------------------------------------------------------------

export const uuidSchema = z.uuid({ message: "Must be a valid UUID" });

// -----------------------------------------------------------------------------
// Primitives with Ethiopian conventions
// -----------------------------------------------------------------------------

/**
 * Ethiopian mobile numbers: +251 followed by 9 digits (leading zero optional),
 * or a local 10-digit form starting with 0 (e.g. 0911xxxxxxx).
 */
export const ethiopianPhoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .refine(
    (v) =>
      /^\+251[79]\d{8}$/.test(v) ||
      /^251[79]\d{8}$/.test(v) ||
      /^0[79]\d{8}$/.test(v),
    { message: "Enter a valid Ethiopian phone number, e.g. +251911223344 or 0911223344" },
  )
  .transform((v) => {
    if (v.startsWith("+251")) return v;
    if (v.startsWith("251")) return `+${v}`;
    if (v.startsWith("0")) return `+251${v.slice(1)}`;
    return v;
  });

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Enter a valid email address" })
  .max(254);

/** ISO 4217. ETB is the platform default. */
export const currencySchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/, { message: "Currency must be a 3-letter ISO 4217 code" });

/**
 * Money is carried as a decimal string in JSON to avoid float precision loss,
 * and validated as a non-negative amount with at most 2 decimal places.
 */
export const moneySchema = z
  .string()
  .trim()
  .regex(/^\d{1,16}(\.\d{1,2})?$/, {
    message: "Amount must be a positive number with at most 2 decimal places",
  })
  .transform((v) => v)
  .refine((v) => Number(v) >= 0, { message: "Amount cannot be negative" });

export const timestampSchema = z.iso.datetime({ message: "Must be an ISO 8601 timestamp" });

/** ISO date-time that also accepts a date-only value, normalized to start of day UTC. */
export const dateOnlySchema = z.iso.date();

export const countryCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{2}$/, { message: "Country code must be a 2-letter ISO code" })
  .default("ET");

export const nonEmptyString = (max = 500, label = "This field") =>
  z.string({ message: `${label} is required` }).trim().min(1, { message: `${label} is required` }).max(max, { message: `${label} must be at most ${max} characters` });

export const optionalString = (max = 2000) =>
  z.string().trim().max(max, { message: `Must be at most ${max} characters` }).optional();

export const urlSchema = z
  .string()
  .trim()
  .url({ message: "Enter a valid URL, including https://" })
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

// -----------------------------------------------------------------------------
// Password policy
// -----------------------------------------------------------------------------

export const passwordSchema = z
  .string()
  .min(10, { message: "Password must be at least 10 characters" })
  .max(128, { message: "Password must be at most 128 characters" })
  .refine((v) => /[a-z]/.test(v), { message: "Include at least one lowercase letter" })
  .refine((v) => /[A-Z]/.test(v), { message: "Include at least one uppercase letter" })
  .refine((v) => /\d/.test(v), { message: "Include at least one number" })
  .refine((v) => /[^A-Za-z0-9]/.test(v), { message: "Include at least one symbol" });

// -----------------------------------------------------------------------------
// Pagination
// -----------------------------------------------------------------------------

export const paginationSchema = z.object({
  /** Cursor for keyset pagination. */
  cursor: z.string().optional(),
  /** Page size. */
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

export interface PaginatedResponse<T> {
  items: T[];
  /** Cursor to pass to fetch the next page; null when there are no more pages. */
  nextCursor: string | null;
  /** Convenience count of items in this page. */
  count: number;
}

// -----------------------------------------------------------------------------
// Sort orders shared by the tender listing
// -----------------------------------------------------------------------------

export const tenderSortSchema = z.enum([
  "newest",
  "closing_soon",
  "deadline",
  "relevance",
  "budget_high",
  "budget_low",
]);

export type TenderSort = z.infer<typeof tenderSortSchema>;

export const sortDirectionSchema = z.enum(["asc", "desc"]);
