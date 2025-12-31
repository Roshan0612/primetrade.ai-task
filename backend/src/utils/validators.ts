import type { ValidationError } from '../types/index.js';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 4) {
    errors.push('Password must be at least 4 characters long');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): boolean => {
  return typeof username === 'string' && username.trim().length > 0;
};

export const validateRegisterInput = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];
  const input = data as Record<string, unknown>;

  if (typeof input.email !== 'string' || !validateEmail(input.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (typeof input.username !== 'string' || !validateUsername(input.username)) {
    errors.push({
      field: 'username',
      message: 'Username must be 3-30 characters, alphanumeric with hyphens/underscores',
    });
  }

  if (typeof input.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    const passwordValidation = validatePassword(input.password);
    if (!passwordValidation.valid) {
      errors.push({
        field: 'password',
        message: passwordValidation.errors.join('; '),
      });
    }
  }

  if (typeof input.firstName !== 'string' || input.firstName.trim().length === 0) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }

  if (typeof input.lastName !== 'string' || input.lastName.trim().length === 0) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }

  return errors;
};

export const validateLoginInput = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];
  const input = data as Record<string, unknown>;

  if (typeof input.email !== 'string' || !validateEmail(input.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (typeof input.password !== 'string' || input.password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return errors;
};

export const validateTaskInput = (data: unknown): ValidationError[] => {
  const errors: ValidationError[] = [];
  const input = data as Record<string, unknown>;

  if (typeof input.title !== 'string' || input.title.trim().length === 0) {
    errors.push({ field: 'title', message: 'Task title is required' });
  }

  if (input.status && !['todo', 'in_progress', 'completed'].includes(input.status as string)) {
    errors.push({ field: 'status', message: 'Invalid status value' });
  }

  if (input.priority && !['low', 'medium', 'high'].includes(input.priority as string)) {
    errors.push({ field: 'priority', message: 'Invalid priority value' });
  }

  return errors;
};
