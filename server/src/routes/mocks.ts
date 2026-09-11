import express from 'express';
import { 
  getMockTests, generateMock, startMock, submitAnswer, completeMock, 
  getMockResult, getAttemptHistory 
} from '../controllers/mockController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getMockTests);
router.post('/generate', generateMock);
router.post('/start', startMock);
router.post('/answer', submitAnswer);
router.post('/complete', completeMock);
router.get('/history', getAttemptHistory);
router.get('/:id', getMockResult);

export default router;
