import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import questionRoutes from './routes/questions.js';
import bookmarkRoutes from './routes/bookmarks.js';
import mistakeRoutes from './routes/mistakes.js';
import pseudocodeRoutes from './routes/pseudocode.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import codingRoutes from './routes/coding.js';
import debuggingRoutes from './routes/debugging.js';
import mockRoutes from './routes/mocks.js';
import aiRoutes from './routes/ai.js';
import gameRoutes from './routes/games.js';
import analyticsRoutes from './routes/analytics.js';

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(mongoSanitize());

// Standard Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate Limiter
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/mistakes', mistakeRoutes);
app.use('/api/pseudocode', pseudocodeRoutes);
app.use('/api/coding', codingRoutes);
app.use('/api/debugging', debuggingRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/analytics', analyticsRoutes);
// Base route
app.get('/', (req: Request, res: Response) => {
  res.send('Capgemini Prep API is running');
});

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
    ...(env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
