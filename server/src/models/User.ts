import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  displayName: string;
  role: 'admin' | 'user';
  college?: string;
  branch?: string;
  graduationYear?: string;
  targetRole?: string;
  phoneNumber?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  avatarUrl?: string;
  preferences: {
    defaultLanguage: string;
    theme: string;
  };
  createdAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  college: {
    type: String,
    default: '',
    trim: true,
  },
  branch: {
    type: String,
    default: '',
    trim: true,
  },
  graduationYear: {
    type: String,
    default: '2026',
    trim: true,
  },
  targetRole: {
    type: String,
    default: 'Senior Analyst (Exceller)',
    trim: true,
  },
  phoneNumber: {
    type: String,
    default: '',
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  githubUrl: {
    type: String,
    default: '',
    trim: true,
  },
  linkedinUrl: {
    type: String,
    default: '',
    trim: true,
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  preferences: {
    defaultLanguage: {
      type: String,
      default: 'java',
    },
    theme: {
      type: String,
      default: 'paper',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export const User = mongoose.model<IUser>('User', userSchema);
