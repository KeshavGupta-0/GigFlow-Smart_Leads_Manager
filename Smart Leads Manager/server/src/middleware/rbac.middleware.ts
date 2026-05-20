import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { ApiError } from '../utils/ApiError';

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Not authorized to access this route'));
    }
    next();
  };
};
