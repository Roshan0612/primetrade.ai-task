import type { Request, Response, NextFunction } from 'express';
import { Router as expressRouter } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getUserProfile, updateUserProfile } from '../controllers/profileController.js';

const router = expressRouter();

// Wrapper for async route handlers
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Protected routes
router.get('/', authMiddleware, asyncHandler(getUserProfile));
router.patch('/', authMiddleware, asyncHandler(updateUserProfile));

export default router;
