import express, { Request, Response } from 'express';
import { 
  saveScore, 
  getUserScores, 
  getLeaderboard,
  saveCognitiveAttempt,
  getUserPersonalBests,
  getUserAttempts
} from '../controllers/gameController.js';
import { protect } from '../middleware/auth.js';
import { CognitiveGenerator } from '../services/cognitiveGenerator.js';

const router = express.Router();

// Cognitive Attempt & Telemetry Endpoints
router.post('/attempt', protect, saveCognitiveAttempt);
router.get('/records', protect, getUserPersonalBests);
router.get('/attempts', protect, getUserAttempts);

// Legacy Score & Leaderboard Endpoints
router.post('/score', protect, saveScore);
router.get('/scores', protect, getUserScores);
router.get('/leaderboard/:gameType', getLeaderboard);

// Procedural cognitive puzzle generation endpoint
router.get('/generate/:gameType', (req: Request, res: Response) => {
  const { gameType } = req.params;
  const level = parseInt(req.query.level as string, 10) || 1;

  try {
    let puzzle: any;
    const normalized = gameType.toLowerCase().replace(/-/g, '');

    switch (normalized) {
      case 'geosudo':
      case 'deductive':
        puzzle = CognitiveGenerator.generateGeoSudo(level);
        break;
      case 'spacio':
      case 'inductivereasoning':
      case 'inductive':
        puzzle = CognitiveGenerator.generateSpacio(level);
        break;
      case 'grid':
      case 'gridchallenge':
        puzzle = CognitiveGenerator.generateGridChallenge(level);
        break;
      case 'motion':
      case 'motionchallenge':
        puzzle = CognitiveGenerator.generateMotionChallenge(level);
        break;
      case 'switch':
      case 'switchchallenge':
        puzzle = CognitiveGenerator.generateSwitchChallenge(level);
        break;
      case 'digit':
      case 'digitchallenge':
        puzzle = CognitiveGenerator.generateDigitChallenge(level);
        break;
      case 'colorthegrid':
      case 'colorgrid':
        puzzle = CognitiveGenerator.generateColorTheGrid(level);
        break;
      default:
        return res.status(400).json({ message: `Unknown game type '${gameType}'` });
    }
    return res.status(200).json(puzzle);
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to generate puzzle', error: error.message });
  }
});

export default router;
