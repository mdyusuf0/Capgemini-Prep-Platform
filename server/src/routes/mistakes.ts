import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getMistakes
} from '../controllers/questionController.js';

const router = express.Router();

router.use(protect);

router.get('/', getMistakes);

export default router;
