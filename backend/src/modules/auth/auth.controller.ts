/**
 * Node modules
 */
import type { Request, Response, NextFunction } from 'express';

/**
 * Custom modules
 */
import { signupService } from './auth.service';
import { sendResponse } from '../../core/utils/send-response';
import { logger } from '../../lib/winston';

/**
 * Types
 */
import type { SignupInput } from './schemas/signup.schema';

/**
 * Signup controller
 *
 * - Receives validated request body
 * - Calls signup service
 * - Returns created user response
 * - Passes errors to centralized error middleware
 */

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    /**
     * Validated request body
     */

    const signupData = req.body as SignupInput;

    logger.info('User signup attempt', {
      email: signupData.email,
    });

    /**
     * Execute signup flow
     */

    const user = await signupService(signupData);

    /**
     * Send response
     */

    sendResponse({
      res,
      statusCode: 201,
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
