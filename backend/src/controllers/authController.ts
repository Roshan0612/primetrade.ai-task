import type { Request, Response } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { User } from '../models/User.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../utils/validators.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import type { UserPayload, ApiResponse } from '../types/index.js';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const validationErrors = validateRegisterInput(req.body);
  if (validationErrors.length > 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, JSON.stringify(validationErrors));
  }

  const { email, username, password, firstName, lastName } = req.body as Record<
    string,
    string
  >;

  // Check if user already exists
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const field = existingUser.email === email ? 'email' : 'username';
    throw new AppError(
      HTTP_STATUS.CONFLICT,
      field === 'email' ? ERROR_CODES.EMAIL_EXISTS : ERROR_CODES.USERNAME_EXISTS,
      `User with this ${field} already exists`
    );
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const newUser = new User({
    email: email.toLowerCase(),
    username,
    password: hashedPassword,
    firstName,
    lastName,
  });

  await newUser.save();

  const userPayload: UserPayload = {
    id: newUser._id.toString(),
    email: newUser.email,
    username: newUser.username,
  };

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'User registered successfully',
    data: userPayload,
  } as ApiResponse<UserPayload>);
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const validationErrors = validateLoginInput(req.body);
  if (validationErrors.length > 0) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR, JSON.stringify(validationErrors));
  }

  const { email, password } = req.body as Record<string, string>;

  // Find user
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.INVALID_CREDENTIALS, 'Invalid email or password');
  }

  // Generate token
  const accessToken = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  const userPayload: UserPayload = {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Login successful',
    data: {
      accessToken,
      user: userPayload,
    },
  } as ApiResponse<{ accessToken: string; user: UserPayload }>);
};

export const logoutUser = async (_req: Request, res: Response): Promise<void> => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully',
  } as ApiResponse);
};
