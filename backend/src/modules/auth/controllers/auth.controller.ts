/**
 * Node modules
 */
import type { Request, Response } from 'express';

/**
 * Custom modules
 */
import { signupService } from '../services/auth.service';
import { sendResponse } from '../../../core/utils/send-response';
import { logger } from '../../../lib/winston';

/**
 * Types
 */
import type { SignupRequest } from '../schemas/signup.schema';
import { catchAsync } from '../../../core/utils/catch-async';

/**
 * Signup controller
 *
 * - Receives validated request body
 * - Calls signup service
 * - Returns created user response
 * - Passes errors to centralized error middleware
 */

export const signup = catchAsync(async (req: Request, res: Response) => {
  const signupData = req.body as SignupRequest;

  const user = await signupService(signupData);

  logger.info('User signup attempt', {
    email: signupData.email,
  });

  sendResponse({
    res,
    statusCode: 201,
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});
