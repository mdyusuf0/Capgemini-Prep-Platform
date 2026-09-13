import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import {
  getPseudocodeQuestions,
  getPseudocodeById,
  getPseudocodeTopics,
  submitPseudocodeAnswer,
  getPseudocodeSpeedSet,
} from '../controllers/pseudocodeController.js';

const router = express.Router();

router.get('/', optionalAuth, getPseudocodeQuestions);
router.get('/topics', optionalAuth, getPseudocodeTopics);
router.get('/speed-set', optionalAuth, getPseudocodeSpeedSet);
router.get('/:id', optionalAuth, getPseudocodeById);
router.post('/submit', optionalAuth, submitPseudocodeAnswer);

export default router;
