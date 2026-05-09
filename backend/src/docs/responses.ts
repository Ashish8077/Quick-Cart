/**
 * Shared OpenAPI response schemas
 *
 * - All schemas named with .openapi() → clean $ref components in OpenAPI JSON
 * - Import and reuse in all module .docs.ts files
 * - Never copy-paste response shapes per-route
 */

import { z } from 'zod';

/**
 * Standard error response
 *
 * errorCode: machine-readable string for frontend error handling
 * message:   human-readable description
 */

export const errorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.string().openapi({ example: 'Internal server error' }),
    errorCode: z.string().optional().openapi({ example: 'AUTH_USER_ALREADY_EXISTS' }),
  })
  .openapi('ErrorResponse');

/**
 * Zod validation error response
 *
 * path uses union of string | number because Zod paths
 * can contain array indexes (numbers), not just field names.
 */

export const validationErrorResponseSchema = z
  .object({
    success: z.literal(false),
    message: z.literal('Validation failed').openapi({
      example: 'Validation failed',
    }),
    errors: z.array(
      z.object({
        code: z.string().openapi({ example: 'too_small' }),
        message: z.string().openapi({ example: 'Password must be at least 8 characters' }),
        path: z.array(z.union([z.string(), z.number()])).openapi({ example: ['password'] }),
      })
    ),
  })
  .openapi('ValidationErrorResponse');

/**
 * Generic success response wrapper
 *
 * Wraps any data schema in the standard API envelope.
 */

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string().openapi({ example: 'Operation completed successfully' }),
    data: dataSchema,
  });

/**
 * Pre-built response objects for common HTTP status codes.
 *
 * Usage in a .docs.ts file:
 *
 *   responses: {
 *     201: responses.created(signupResponseSchema),
 *     400: responses.badRequest,
 *     401: responses.unauthorized,
 *     500: responses.serverError,
 *   }
 */

export const responses = {
  ok: <T extends z.ZodTypeAny>(dataSchema: T) => ({
    description: 'Success',
    content: {
      'application/json': {
        schema: successResponseSchema(dataSchema),
      },
    },
  }),

  created: <T extends z.ZodTypeAny>(dataSchema: T) => ({
    description: 'Resource created successfully',
    content: {
      'application/json': {
        schema: successResponseSchema(dataSchema),
      },
    },
  }),

  badRequest: {
    description: 'Validation error — invalid or missing fields',
    content: {
      'application/json': {
        schema: validationErrorResponseSchema,
      },
    },
  },

  unauthorized: {
    description: 'Authentication required',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },

  forbidden: {
    description: 'Insufficient permissions',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },

  notFound: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },

  serverError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: errorResponseSchema,
      },
    },
  },
} as const;
