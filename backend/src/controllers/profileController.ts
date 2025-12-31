import type { Response } from 'express';
import { User } from '../models/User.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import type { ApiResponse, UserDocument } from '../types/index.js';

export const getUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const user = await User.findById(req.user.userId).select('-password');
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, 'User not found');
  }

  const response: Omit<UserDocument, 'password'> = {
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: response,
  } as ApiResponse<Omit<UserDocument, 'password'>>);
};

export const updateUserProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const { firstName, lastName, profileImage } = req.body as Record<string, unknown>;

  const updateData: Record<string, unknown> = {};
  if (typeof firstName === 'string' && firstName.trim()) {
    updateData.firstName = firstName.trim();
  }
  if (typeof lastName === 'string' && lastName.trim()) {
    updateData.lastName = lastName.trim();
  }
  if (typeof profileImage === 'string') {
    updateData.profileImage = profileImage;
  }

  if (Object.keys(updateData).length === 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      'No valid fields to update'
    );
  }

  const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.USER_NOT_FOUND, 'User not found');
  }

  const response: Omit<UserDocument, 'password'> = {
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Profile updated successfully',
    data: response,
  } as ApiResponse<Omit<UserDocument, 'password'>>);
};
