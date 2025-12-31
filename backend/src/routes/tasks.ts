import type { Router, Request, Response, NextFunction } from 'express';
import { Router as expressRouter } from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';

const router = expressRouter();

// Wrapper for async route handlers
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Protected routes
router.post('/', authMiddleware, asyncHandler(createTask));
router.get('/', authMiddleware, asyncHandler(getTasks));
router.get('/:id', authMiddleware, asyncHandler(getTaskById));
router.patch('/:id', authMiddleware, asyncHandler(updateTask));
router.delete('/:id', authMiddleware, asyncHandler(deleteTask));

export default router;
