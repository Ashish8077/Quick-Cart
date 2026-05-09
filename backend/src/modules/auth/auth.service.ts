/**
 * Types
 */

import type { SignupInput, SignupResponse } from './schemas/signup.schema';

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
