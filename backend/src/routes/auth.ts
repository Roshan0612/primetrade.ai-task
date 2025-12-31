import type { Request, Response, NextFunction } from 'express';
import { Router as expressRouter } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  registerUser,
  loginUser,
  logoutUser,
} from '../controllers/authController.js';

const router = expressRouter();

// Wrapper for async route handlers to catch errors
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Public routes
router.post('/register', asyncHandler(registerUser));
router.post('/login', asyncHandler(loginUser));

// Protected routes
router.post('/logout', authMiddleware, asyncHandler(logoutUser));

export default router;
