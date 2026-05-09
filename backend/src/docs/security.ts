/**
 * OpenAPI security schemes
 *
 * Registers authentication schemes globally.
 * Import this in docs/index.ts to activate.
 *
 * Usage on protected routes in .docs.ts files:
 *
 *   security: [{ bearerAuth: [] }]
 */

import { registry } from './registry';

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'JWT access token. Obtain from POST /api/v1/auth/login.',
});
