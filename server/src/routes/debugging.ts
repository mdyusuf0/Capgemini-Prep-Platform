import express from 'express';
import { getProblems, getProblemById, submitFix, getTimedSet, runDebuggingCode } from '../controllers/debuggingController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getProblems);
router.get('/timed-set', optionalAuth, getTimedSet);
router.get('/:id', optionalAuth, getProblemById);
router.post('/:id/run', optionalAuth, runDebuggingCode);
router.post('/:id/submit', optionalAuth, submitFix);

export default router;
