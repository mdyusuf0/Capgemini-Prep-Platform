import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AuthRequest } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRE as any,
  });

  const refreshToken = jwt.sign({ userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRE as any,
  });

  return { accessToken, refreshToken };
};

const setTokenCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProd = env.NODE_ENV === 'production';
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+passwordHash');

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(String(user._id));
    setTokenCookies(res, accessToken, refreshToken);

    const userResponse = {
      _id: user._id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      preferences: user.preferences,
    };

    res.status(200).json({ user: userResponse, accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const isProd = env.NODE_ENV === 'production';
  
  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const rfToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!rfToken) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
    }

    const decoded = jwt.verify(rfToken, env.JWT_REFRESH_SECRET) as { userId: string };
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(String(user._id));
    setTokenCookies(res, accessToken, newRefreshToken);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).select('+passwordHash');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      res.status(401).json({ message: 'Incorrect old password' });
      return;
    }

    user.passwordHash = newPassword; // Pre-save hook will hash it
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
