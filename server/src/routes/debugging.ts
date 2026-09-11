import express from 'express';
import { getProblems, getProblemById, submitFix, getTimedSet } from '../controllers/debuggingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getProblems);
router.get('/timed-set', getTimedSet);
router.get('/:id', getProblemById);
router.post('/:id/submit', submitFix);

export default router;
