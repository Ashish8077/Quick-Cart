/**
 * Types / DTOs for Auth module
 */

/**
 * Signup request payload
 *
 * This represents the expected body for:
 * POST /api/v1/auth/signup
 */
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * Signup response payload
 *
 * This represents the data returned after a successful signup.
 * Note: Never expose the password in responses.
 */
export interface SignupResponse {
  id: string;
  email: string;
  name: string;
}
