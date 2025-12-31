import type { Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { HTTP_STATUS, ERROR_CODES } from '../config/constants.js';
import type { JwtPayload, ApiResponse } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Missing authorization token',
          statusCode: HTTP_STATUS.UNAUTHORIZED,
        },
      } as ApiResponse);
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    let code = ERROR_CODES.INVALID_TOKEN;
    let message = 'Invalid token';

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        code = ERROR_CODES.TOKEN_EXPIRED;
        message = 'Token has expired. Please log in again.';
      } else if (error.message.includes('malformed') || error.message.includes('invalid')) {
        message = 'Invalid or malformed token';
      }
    }

    res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      error: {
        code,
        message,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
      },
    } as ApiResponse);
  }
};
