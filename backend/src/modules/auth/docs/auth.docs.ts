/**
 * Auth module — OpenAPI route registration
 *
 * This file ONLY contains OpenAPI registration logic and route metadata.
 * Business schemas live in schemas/ — not here.
 *
 * Add a new registry.registerPath() block for each new auth route.
 */

import { registry } from '../../../docs/registry';

import { responses } from '../../../docs/responses';

import { AUTH_PATHS } from '../../../constants/routes';

import { signupSchema, signupResponseSchema } from '../schemas/signup.schema';

/**
 * POST /api/v1/auth/signup
 *
 * Public route — no auth required.
 */

registry.registerPath({
  method: 'post',
  path: AUTH_PATHS.SIGNUP,
  tags: ['Auth'],
  summary: 'Register a new user account',
  description: 'Creates a new user account. Request body is validated using Zod before processing.',
  request: {
    body: {
      description: 'User registration payload',
      required: true,
      content: {
        'application/json': {
          schema: signupSchema,
        },
      },
    },
  },
  responses: {
    201: responses.created(signupResponseSchema),
    400: responses.badRequest,
    500: responses.serverError,
  },
});

/**
 * POST /api/v1/auth/login  (uncomment when implemented)
 *
 * Public route — no auth required.
 */

// registry.registerPath({
//   method: 'post',
//   path: AUTH_PATHS.LOGIN,
//   tags: ['Auth'],
//   summary: 'Login with email and password',
//   request: { ... },
//   responses: {
//     200: responses.ok(loginResponseSchema),
//     400: responses.badRequest,
//     401: responses.unauthorized,
//   },
// });

/**
 * GET /api/v1/auth/me  (example protected route)
 *
 * Protected route — requires bearerAuth.
 */

// registry.registerPath({
//   method: 'get',
//   path: AUTH_PATHS.ME,
//   tags: ['Auth'],
//   summary: 'Get current authenticated user',
//   security: [{ bearerAuth: [] }],
//   responses: {
//     200: responses.ok(meResponseSchema),
//     401: responses.unauthorized,
//   },
// });
