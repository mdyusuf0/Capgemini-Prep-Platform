import express from 'express';
import { 
  getOverview, 
  getCategoryStats, 
  getTrends, 
  getWeakAreas, 
  getCoachAdvice,
  getDashboardOverview,
  getRoadmapProgress,
  getCohortBenchmark
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardOverview);
router.get('/roadmap', protect, getRoadmapProgress);
router.get('/cohort', protect, getCohortBenchmark);
router.get('/overview', protect, getOverview);
router.get('/category/:category', protect, getCategoryStats);
router.get('/trends', protect, getTrends);
router.get('/weak-areas', protect, getWeakAreas);
router.get('/coach-advice', protect, getCoachAdvice);

export default router;
