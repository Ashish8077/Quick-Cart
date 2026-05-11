import type { UserDocument } from '../models/auth.model';

import type { SignupResponse } from '../schemas/signup.schema';

export const toSignupResponse = (user: UserDocument): SignupResponse => {
  return {
    id: user._id.toString(),

    userName: user.userName,

    email: user.email,
  };
};
