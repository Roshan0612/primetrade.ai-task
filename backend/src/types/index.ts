export interface UserDocument {
  _id?: string;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}

export interface TaskDocument {
  _id?: string;
  userId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export type ErrorCode =
  | 'INVALID_TOKEN'
  | 'TOKEN_EXPIRED'
  | 'UNAUTHORIZED'
  | 'EMAIL_EXISTS'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: ErrorCode;
    message: string;
    statusCode: number;
  };
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
}
