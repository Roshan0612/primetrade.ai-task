import type { Response } from 'express';
import { Task } from '../models/Task.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { validateTaskInput } from '../utils/validators.js';
import { sanitizeString, sanitizeArray } from '../utils/sanitization.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import type { ApiResponse, TaskDocument } from '../types/index.js';

export const createTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const validationErrors = validateTaskInput(req.body);
  if (validationErrors.length > 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      JSON.stringify(validationErrors)
    );
  }

  const { title, description, priority, dueDate, tags, status } = req.body as Record<
    string,
    unknown
  >;

  const newTask = new Task({
    userId: req.user.userId,
    title: sanitizeString(title),
    description: sanitizeString(description) || '',
    priority: priority || 'medium',
    dueDate: dueDate || undefined,
    tags: sanitizeArray(tags as string[]),
    status: status || 'todo',
  });

  await newTask.save();

  const response: TaskDocument = {
    _id: newTask._id.toString(),
    userId: newTask.userId.toString(),
    title: newTask.title,
    description: newTask.description,
    status: newTask.status,
    priority: newTask.priority,
    dueDate: newTask.dueDate,
    tags: newTask.tags,
    createdAt: newTask.createdAt,
    updatedAt: newTask.updatedAt,
  };

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Task created successfully',
    data: response,
  } as ApiResponse<TaskDocument>);
};

export const getTasks = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 10));
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = { userId: req.user.userId };

  // Filter by status
  if (req.query.status && typeof req.query.status === 'string') {
    query.status = req.query.status;
  }

  // Filter by priority
  if (req.query.priority && typeof req.query.priority === 'string') {
    query.priority = req.query.priority;
  }

  // Search in title and description
  if (req.query.search && typeof req.query.search === 'string') {
    query.$text = { $search: req.query.search };
  }

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments(query);

  const tasksResponse: TaskDocument[] = tasks.map((task) => ({
    _id: task._id.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    tags: task.tags,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: tasksResponse,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  } as ApiResponse<TaskDocument[]>);
};

export const getTaskById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!task) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.TASK_NOT_FOUND, 'Task not found');
  }

  const response: TaskDocument = {
    _id: task._id.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    tags: task.tags,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: response,
  } as ApiResponse<TaskDocument>);
};

export const updateTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const validationErrors = validateTaskInput(req.body);
  if (validationErrors.length > 0) {
    throw new AppError(
      HTTP_STATUS.BAD_REQUEST,
      ERROR_CODES.VALIDATION_ERROR,
      JSON.stringify(validationErrors)
    );
  }

  const updateData: Record<string, unknown> = {};

  if ('title' in req.body && typeof req.body.title === 'string') {
    updateData.title = req.body.title;
  }
  if ('description' in req.body && typeof req.body.description === 'string') {
    updateData.description = req.body.description;
  }
  if ('status' in req.body && typeof req.body.status === 'string') {
    updateData.status = req.body.status;
  }
  if ('priority' in req.body && typeof req.body.priority === 'string') {
    updateData.priority = req.body.priority;
  }
  if ('dueDate' in req.body) {
    updateData.dueDate = req.body.dueDate || undefined;
  }
  if ('tags' in req.body && Array.isArray(req.body.tags)) {
    updateData.tags = req.body.tags;
  }

  const task = await Task.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.user.userId,
    },
    updateData,
    { new: true, runValidators: true }
  );

  if (!task) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.TASK_NOT_FOUND, 'Task not found');
  }

  const response: TaskDocument = {
    _id: task._id.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    tags: task.tags,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Task updated successfully',
    data: response,
  } as ApiResponse<TaskDocument>);
};

export const deleteTask = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED, 'User not authenticated');
  }

  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!task) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_CODES.TASK_NOT_FOUND, 'Task not found');
  }

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Task deleted successfully',
  } as ApiResponse);
};
