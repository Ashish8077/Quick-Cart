import mongoose, { type Document, Schema } from 'mongoose';

import bcrypt from 'bcryptjs';

/**
 * Represents a single user document from MongoDB.
 */

export interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerificationToken: string;
  emailVerificationTokenExpiresAt: Date;
  isEmailVerified: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpiresAt?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isPasswordChangedAfter(jwtIssuedAt: number): boolean;
}

const userSchema = new Schema<UserDocument>(
  {
    userName: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [50, 'Username cannot exceed 50 characters'],
      lowercase: true,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [128, 'Password cannot exceed 128 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Role must be either user or admin',
      },
      default: 'user',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationTokenExpiresAt: {
      type: Date,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpiresAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      /**
       * Remove sensitive fields when serializing to JSON.
       * _id → id and __v removal are handled by the global plugin in mongoose.ts.
       */
      transform(_doc, ret: Record<string, unknown>) {
        delete ret['password'];
        delete ret['passwordResetToken'];
        delete ret['passwordResetExpiresAt'];
        delete ret['passwordChangedAt'];
        return ret;
      },
    },
  }
);

/**
 * Hash password before saving.
 *
 * Keeping this in the hook (not the service) is intentional —
 * it makes hashing automatic and impossible to forget.
 * The service MUST use .save() for password changes, never updateOne().
 */

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = new Date(Date.now() - 1000);
  }
});

/**
 * Compares a plain-text password against the stored bcrypt hash.
 * Used in the login service.
 */

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password as string);
};

/**
 * Returns true if the password was changed after the JWT was issued.
 * Used in auth guard middleware to invalidate old tokens after password changes.
 */

userSchema.methods.isPasswordChangedAfter = function (jwtIssuedAt: number): boolean {
  if (!this.passwordChangedAt) return false;

  const changedAtTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);

  return changedAtTimestamp > jwtIssuedAt;
};

export const User = mongoose.model('User', userSchema);
