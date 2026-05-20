import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { verifyToken as verifyJwtToken } from '../utils/jwt.utils';
import { ApiError } from '../utils/ApiError';

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token provided'));
    }

    const decoded = verifyJwtToken(token);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized, invalid token'));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden: insufficient permissions'));
    }
    next();
  };
};
