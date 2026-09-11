import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProblems,
  getProblemById,
  submitSolution,
  runCode,
  getSubmissions,
  getTopics
} from '../controllers/codingController.js';

const router = express.Router();

router.use(protect);

router.get('/', getProblems);
router.get('/topics', getTopics);
router.get('/:id', getProblemById);
router.post('/:id/submit', submitSolution);
router.post('/:id/run', runCode);
router.get('/:id/submissions', getSubmissions);

export default router;
