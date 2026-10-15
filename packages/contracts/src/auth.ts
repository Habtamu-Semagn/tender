/**
 * Authentication contracts: register, login, refresh, password reset,
 * email verification.
 */
import { z } from "zod";
import { emailSchema, ethiopianPhoneSchema, nonEmptyString, passwordSchema } from "./common.js";

// -----------------------------------------------------------------------------
// Register
// -----------------------------------------------------------------------------

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nonEmptyString(100, "First name"),
  lastName: nonEmptyString(100, "Last name"),
  phone: ethiopianPhoneSchema.optional(),
  /** Must match the platform terms. */
  acceptedTerms: z.literal(true, {
    message: "You must accept the terms of service",
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// -----------------------------------------------------------------------------
// Login
// -----------------------------------------------------------------------------

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

// -----------------------------------------------------------------------------
// Email verification / password reset
// -----------------------------------------------------------------------------

export const verifyEmailSchema = z.object({
  token: nonEmptyString(200, "Token"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: nonEmptyString(200, "Token"),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    newPassword: passwordSchema,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// -----------------------------------------------------------------------------
// Session / profile
// -----------------------------------------------------------------------------

export const updateProfileSchema = z.object({
  firstName: nonEmptyString(100, "First name").optional(),
  lastName: nonEmptyString(100, "Last name").optional(),
  phone: ethiopianPhoneSchema.optional(),
  preferredLanguage: z.enum(["en", "am"]).optional(),
  preferredTimezone: z.string().min(1).max(64).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// -----------------------------------------------------------------------------
// Response shapes
// -----------------------------------------------------------------------------

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().nullable(),
  role: z.enum(["SUPPLIER", "ADMIN"]),
  emailVerified: z.boolean(),
  status: z.enum(["ACTIVE", "SUSPENDED", "DEACTIVATED"]),
  preferredLanguage: z.string(),
  preferredTimezone: z.string(),
  createdAt: z.string(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const authResponseSchema = z.object({
  user: authUserSchema,
  /** Access token is also delivered as an HttpOnly cookie; this field exists
   * only for non-browser clients. */
  accessToken: z.string(),
  expiresIn: z.number(),
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
