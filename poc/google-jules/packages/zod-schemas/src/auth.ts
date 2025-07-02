import { z } from 'zod';
import { PositiveIntStringSchema, NumericIdSchema } from './common'; // Assuming numeric IDs for users

export const UserRoleSchema = z.enum(['USER', 'ADMIN', 'MODERATOR']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserStatusSchema = z.enum(['ACTIVE', 'PENDING', 'SUSPENDED', 'DEACTIVATED']);
export type UserStatus = z.infer<typeof UserStatusSchema>;

// Basic user information, can be extended
export const BaseUserSchema = z.object({
  id: NumericIdSchema, // or PositiveIntStringSchema if using string IDs like UUIDs
  email: z.string().email({ message: "Invalid email address." }),
  username: z.string().min(3, "Username must be 3 to 30 characters.")
            .max(30, "Username must be 3 to 30 characters.")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  // displayName: z.string().min(1).max(50).optional(),
  // avatarUrl: z.string().url().optional().nullable(),
  role: UserRoleSchema.default('USER'),
  status: UserStatusSchema.default('PENDING'),
});
export type BaseUser = z.infer<typeof BaseUserSchema>;


export const LoginSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Valid email is required." }),
  username: z.string().min(3, "Username must be between 3 and 30 characters.")
            .max(30, "Username must be between 3 and 30 characters.")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
  confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long."),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"], // Path to field causing the error
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const AuthTokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;

export const AuthenticatedUserSchema = BaseUserSchema.extend({
  // Add any fields specific to an authenticated user session, if different from BaseUser
  // For example, session expiry, last login date, etc.
  // These are usually part of the JWT payload or session data.
  iat: z.number().optional(), // Issued at (standard JWT claim)
  exp: z.number().optional(), // Expiration time (standard JWT claim)
});
export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "New password must be at least 8 characters long."),
  confirmNewPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match.",
  path: ["confirmNewPassword"],
});
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Valid email is required."),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required."), // Usually a UUID or a long random string
  newPassword: z.string().min(8, "New password must be at least 8 characters long."),
  confirmNewPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords do not match.",
  path: ["confirmNewPassword"],
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
