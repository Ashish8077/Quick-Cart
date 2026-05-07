/**
 * Node modules
 */

import { Router } from 'express';

/**
 * Custom modules
 */

import { signup } from './auth.controller';
import { validate } from '../../core/middleware/validate.middleware';
import { registerSchema } from './auth.validation';

/**
 * Router instance
 */

const router = Router();

/**
 * Auth routes
 *
 * POST /signup
 * - Registers a new user account
 * - Validates request body using Zod schema
 */

router.post('/signup', validate(registerSchema), signup);
// router.post('/login', login);
// router.post('/logout', logout);

export default router;
