/**
 * Centralized API route constants
 *
 * Structure:
 * - API_VERSION / API_PREFIX  → version in one place
 * - ROUTES.*_BASE             → mount paths used in server.ts
 * - *_PATHS                   → full paths used in Swagger docs and tests
 *
 * Rule:
 * - server.ts  uses *_BASE  to mount routers
 * - *.routes.ts uses relative paths ('/signup', '/login')
 * - *.docs.ts  uses *_PATHS for OpenAPI registration
 */

export const API_VERSION = 'v1';

export const API_PREFIX = `/api/${API_VERSION}`;

/**
 * Module base mount paths
 *
 * Used in server.ts: app.use(ROUTES.AUTH_BASE, authRoutes)
 */

export const ROUTES = {
  AUTH_BASE: `${API_PREFIX}/auth`,
  USERS_BASE: `${API_PREFIX}/users`,
  PRODUCTS_BASE: `${API_PREFIX}/products`,
  ORDERS_BASE: `${API_PREFIX}/orders`,
} as const;

/**
 * Auth full paths
 *
 * Used in auth.docs.ts for OpenAPI registration and tests.
 * Derived from ROUTES.AUTH_BASE — change the base, all paths update.
 */

export const AUTH_PATHS = {
  SIGNUP: `${ROUTES.AUTH_BASE}/signup`,
  LOGIN: `${ROUTES.AUTH_BASE}/login`,
  LOGOUT: `${ROUTES.AUTH_BASE}/logout`,
  REFRESH: `${ROUTES.AUTH_BASE}/refresh`,
  FORGOT_PASSWORD: `${ROUTES.AUTH_BASE}/forgot-password`,
  RESET_PASSWORD: `${ROUTES.AUTH_BASE}/reset-password`,
  ME: `${ROUTES.AUTH_BASE}/me`,
} as const;
