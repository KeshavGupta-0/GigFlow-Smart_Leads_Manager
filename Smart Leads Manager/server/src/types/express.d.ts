import { Request } from 'express';
import { IJwtPayload } from './auth.types';

export interface AuthenticatedRequest extends Request {
  user?: IJwtPayload;
}
