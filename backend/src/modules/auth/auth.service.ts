/**
 * Types
 */

import type { SignupInput } from './auth.validation';

/**
 * Signup response payload
 *
 * Represents the data returned after a successful signup.
 * NOTE: Never expose the password in responses.
 */

export type SignupResponse = {
  id: string;
  email: string;
  userName: string;
};

/**
 * Signup service
 *
 * - Receives validated signup input
 * - Creates user in database (TODO: implement DB write)
 * - Returns created user data
 */

export const signupService = async (signupData: SignupInput): Promise<SignupResponse> => {
  

  return {
    id: '1234567890',
    email: signupData.email,
    userName: signupData.userName,
  };
};
