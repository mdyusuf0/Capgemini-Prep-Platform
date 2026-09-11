import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  startConversation,
  sendMessage,
  getConversation,
  getUsageStats
} from '../controllers/aiController.js';

const router = express.Router();

router.use(protect); // All AI routes protected

router.post('/conversation', startConversation);
router.post('/message', sendMessage);
router.get('/usage', getUsageStats);
router.get('/conversation/:id', getConversation);

export default router;
