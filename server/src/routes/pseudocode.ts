import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getPseudocodeQuestions,
  getPseudocodeById,
  getPseudocodeTopics,
  submitPseudocodeAnswer,
  getPseudocodeSpeedSet,
} from '../controllers/pseudocodeController.js';

const router = express.Router();

router.use(protect);

router.get('/', getPseudocodeQuestions);
router.get('/topics', getPseudocodeTopics);
router.get('/speed-set', getPseudocodeSpeedSet);
router.get('/:id', getPseudocodeById);
router.post('/submit', submitPseudocodeAnswer);

export default router;
