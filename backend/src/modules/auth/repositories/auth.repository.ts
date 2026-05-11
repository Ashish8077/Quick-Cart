import { promises } from 'node:dns';
import { User, UserDocument } from '../models/auth.model';
import { CreateUserPayload } from '../types/auth.types';

/**
 * Find user by email or username
 */

export const findUserByEmailOrUsername = async (email: string, userName: string) => {
  return User.findOne({
    $or: [{ email: email.toLowerCase() }, { userName: userName.toLowerCase() }],
  }).lean();
};

/**
 * Create new user
 */

export const createUser = async (payload: CreateUserPayload): Promise<UserDocument> => {
  return User.create(payload);
};
