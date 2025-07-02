import { z } from 'zod';

// Common reusable schemas

// Schema for positive integer strings (e.g., for IDs from path params)
export const PositiveIntStringSchema = z.string().regex(/^[1-9]\d*$/, {
  message: "ID must be a positive integer string",
});

// Schema for numeric IDs (e.g., from database)
export const NumericIdSchema = z.coerce.number().int().positive({
  message: "ID must be a positive integer",
});

// Generic ID schema - can be adapted based on whether IDs are strings or numbers
export const IdSchema = z.object({
  // id: PositiveIntStringSchema, // Use this if IDs are typically string UUIDs or string numbers
  id: NumericIdSchema, // Use this if IDs are numeric
});
export type IdInput = z.infer<typeof IdSchema>;


export const SlugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
  message: "Slug must be in kebab-case and contain only lowercase letters, numbers, and hyphens",
});

export const AuditDatesSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  // Example: sortOrder and sortBy
  // sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  // sortBy: z.string().optional().default('createdAt'), // Default sort field
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const SuccessResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string().optional(),
});
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

// Generic error response structure
export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.object({
    code: z.string().optional(), // Internal error code
    details: z.any().optional(), // More detailed error information, can be an object or array
  }).optional(),
  statusCode: z.number().int().optional(), // HTTP status code
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// For API responses that might return a single entity or null (e.g., findById)
export function createNullableSchema<T extends z.ZodTypeAny>(schema: T) {
  return z.union([schema, z.null()]);
}
