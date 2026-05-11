/**
 * Types
 */

import { AppError } from '../../../core/errors/app-error';
import { toSignupResponse } from '../mapper/user.mapper';

import { createUser, findUserByEmailOrUsername } from '../repositories/auth.repository';
import type { SignupRequest, SignupResponse } from '../schemas/signup.schema';
import {
  createHash,
  generateVerificationTokenAndExpiry,
} from '../utils/generate-verification-token';

/**
 * Signup service
 *
 * - Receives validated signup input
 * - Creates user in database (TODO: implement DB write)
 * - Returns created user data
 */

export const signupService = async (signupData: SignupRequest): Promise<SignupResponse> => {
  /**
   * Find user by email or username
   */

  const existingUser = await findUserByEmailOrUsername(signupData.email, signupData.userName);

  if (existingUser) throw new AppError('Email or username already exists', 400);

  /**
   * Generate verification token and expiry
   */

  const { verificationToken, verificationTokenExpiry } = generateVerificationTokenAndExpiry(
    signupData.email
  );

  /**
   * Hash verification token
   */

  const hashedToken = createHash(verificationToken);

  /**
   * Create user
   */

  const newUser = await createUser({
    userName: signupData.userName,
    email: signupData.email,
    password: signupData.password,
    emailVerificationToken: hashedToken,
    emailVerificationTokenExpiresAt: verificationTokenExpiry,
  });

  /**
   * TODO:
   * Send verification email
   */

  /**
   * Return API-safe response
   */

  return toSignupResponse(newUser);
};
