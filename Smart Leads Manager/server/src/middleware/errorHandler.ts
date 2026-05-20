import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

import mongoose from 'mongoose';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  // Handle specific Mongoose errors
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Resource not found. Invalid: ${err.path}`;
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    const messages = Object.values(err.errors).map((val: any) => val.message);
    message = `Validation failed: ${messages.join(', ')}`;
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else if (!(err instanceof ApiError)) {
    statusCode = statusCode || 500;
    message = env.NODE_ENV === 'development' ? err.message : 'Internal Server Error';
  }

  res.status(statusCode || 500).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
