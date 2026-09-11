import express from 'express';
import { login, logout, refreshToken, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;
