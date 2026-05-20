import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { ApiError } from './utils/ApiError';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import leadsRoutes from './routes/leads.routes';
import { generalLimiter, authLimiter } from './middleware/rateLimiter';

const app = express();

// Trust proxy for Render reverse proxy (required for express-rate-limit)
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL ? env.CLIENT_URL.trim() : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);
app.use(express.json());
app.use(cookieParser());

if (env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Rate Limiting
app.use(generalLimiter);

// Routes
app.get('/api/v1/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'OK', timestamp: new Date() });
});

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/leads', leadsRoutes);

// 404 Handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Not found'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
