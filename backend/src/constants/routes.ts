/**
 * Centralized route path constants
 *
 * Single source of truth for all API route strings.
 * Used in: routes files, docs files, tests, SDK generation.
 *
 * Never hardcode route strings in multiple places.
 */

export const API_PREFIX = '/api/v1';

export const AUTH_ROUTES = {
  AUTH: {
    SIGNUP: `${API_PREFIX}/auth`,
    LOGIN: `${API_PREFIX}/login`,
    LOGOUT: `${API_PREFIX}/logout`,
    REFRESH: `${API_PREFIX}/refresh`,
    FORGOT_PASSWORD: `${API_PREFIX}/forgot-password`,
    RESET_PASSWORD: `${API_PREFIX}/reset-password`,
    ME: '/me',
  },

  USERS: {
    GET_BY_ID: `${API_PREFIX}/users`,
  },
} as const;
