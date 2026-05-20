import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(201).json(ApiResponse(201, 'User registered successfully', result));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body);
    
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json(ApiResponse(200, 'Login successful', result));
  } catch (error) {
    next(error);
  }
};
