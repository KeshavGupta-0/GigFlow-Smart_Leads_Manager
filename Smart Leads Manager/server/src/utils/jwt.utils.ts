import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IJwtPayload } from '../types/auth.types';

export const signToken = (payload: IJwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

export const verifyToken = (token: string): IJwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as IJwtPayload;
};
