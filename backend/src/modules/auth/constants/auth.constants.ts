export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',

  ACCOUNT_CREATED: 'Account created successfully',
} as const;

export const AUTH_COOKIE_NAMES = {
  REFRESH_TOKEN: 'refreshToken',
} as const;

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '15m',
  REFRESH_TOKEN: '7d',
} as const;
