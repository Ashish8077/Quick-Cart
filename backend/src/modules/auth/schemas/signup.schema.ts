/**
 * Signup schemas
 *
 * Contains both request and response schemas for the signup operation.
 * Transport-agnostic — no route or Swagger logic here.
 *
 * NOTE: Never include sensitive fields (password, tokens) in responses.
 */

import { z } from 'zod';

/**
 * Request — POST /auth/signup
 */

export const signupSchema = z
  .object({
    userName: z
      .string()
      .trim()
      .min(3, 'Name must be at least 3 characters')
      .max(50, 'Name cannot exceed 50 characters')
      .openapi({ example: 'JohnDoe' }),

    email: z
      .string()
      .email('Invalid email format')
      .trim()
      .toLowerCase()
      .openapi({ example: 'john.doe@example.com' }),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number, and special character'
      )
      .openapi({ example: 'Secure@123' }),

    confirmPassword: z.string().openapi({ example: 'Secure@123' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password and confirm password do not match',
    path: ['confirmPassword'],
  })
  .openapi('SignupRequest');

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Response — POST /auth/signup
 */

export const signupResponseSchema = z
  .object({
    id: z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }),
    email: z.string().email().openapi({ example: 'john.doe@example.com' }),
    userName: z.string().openapi({ example: 'JohnDoe' }),
  })
  .openapi('SignupResponse');

export type SignupResponse = z.infer<typeof signupResponseSchema>;
