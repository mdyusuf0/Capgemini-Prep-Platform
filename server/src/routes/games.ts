import express, { Request, Response } from 'express';
import { saveScore, getUserScores, getLeaderboard } from '../controllers/gameController.js';
import { protect } from '../middleware/auth.js';
import { CognitiveGenerator } from '../services/cognitiveGenerator.js';

const router = express.Router();

router.post('/score', protect, saveScore);
router.get('/scores', protect, getUserScores);
router.get('/leaderboard/:gameType', getLeaderboard);

// Procedural cognitive puzzle generation endpoint
router.get('/generate/:gameType', (req: Request, res: Response) => {
  const { gameType } = req.params;
  const level = parseInt(req.query.level as string, 10) || 1;

  try {
    let puzzle: any;
    switch (gameType.toLowerCase()) {
      case 'geosudo':
      case 'deductive':
        puzzle = CognitiveGenerator.generateGeoSudo(level >= 3 ? 5 : 4);
        break;
      case 'spacio':
      case 'inductive':
        puzzle = CognitiveGenerator.generateSpacio();
        break;
      case 'grid':
        puzzle = CognitiveGenerator.generateGridChallenge(level);
        break;
      case 'motion':
        puzzle = CognitiveGenerator.generateMotionChallenge();
        break;
      case 'switch':
        puzzle = CognitiveGenerator.generateSwitchChallenge();
        break;
      case 'digit':
        puzzle = CognitiveGenerator.generateDigitChallenge();
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
