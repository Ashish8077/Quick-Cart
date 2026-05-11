export type CreateUserPayload = {
  userName: string;
  email: string;
  password: string;
  emailVerificationToken?: string;
  emailVerificationTokenExpiresAt?: Date;
};
