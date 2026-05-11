import crypto from 'node:crypto';
import config from '../../../config';

type GenerateVerificationTokenResult = {
  verificationToken: string;
  verificationTokenExpiry: Date;
  verificationUrl: string;
};

export const generateVerificationTokenAndExpiry = (
  email: string
): GenerateVerificationTokenResult => {
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60);

  const verificationUrl = `${config.FRONTEND_URL}/verify-email?email=${email}&token=${verificationToken}`;

  return { verificationToken, verificationTokenExpiry, verificationUrl };
};

export const createHash = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
