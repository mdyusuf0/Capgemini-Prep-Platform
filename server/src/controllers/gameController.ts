import { Request, Response } from 'express';
import GameScore from '../models/GameScore.js';
import CognitiveAttempt from '../models/CognitiveAttempt.js';
import UserProgress from '../models/UserProgress.js';
import { AuthRequest } from '../middleware/auth.js';

export const saveScore = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { gameType, level, score, accuracy, timeSpent } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const newScore = new GameScore({
      userId,
      gameType,
      level,
      score,
      accuracy,
      timeSpent
    });

    await newScore.save();

    // Also update UserProgress for games
    await UserProgress.findOneAndUpdate(
      { userId, category: 'games', topic: gameType },
      {
        $inc: {
          totalAttempted: 1,
          correct: 1
        },
        $set: { lastPracticed: new Date() }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Score saved successfully', score: newScore });
  } catch (error) {
    console.error('Error saving game score:', error);
    res.status(500).json({ message: 'Failed to save score' });
  }
};

/**
 * Save complete cognitive attempt with levelHistory, questionHistory, telemetry
 */
export const saveCognitiveAttempt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const {
      gameId,
      assessmentMode = 'practice',
      assessmentSessionId,
      startedAt,
      endedAt,
      duration,
      highestLevel,
      questionsAttempted,
      correctAnswers,
      incorrectAnswers,
      accuracy,
      totalScore,
      averageResponseTime,
      streakMax,
      levelHistory = [],
      questionHistory = [],
    } = req.body;

    if (!gameId) {
      res.status(400).json({ message: 'gameId is required' });
      return;
    }

    // Anti-tamper sanity checks
    const calcAccuracy = questionsAttempted > 0 
      ? Math.min(100, Math.max(0, Math.round((correctAnswers / questionsAttempted) * 100))) 
      : 100;

    const attempt = new CognitiveAttempt({
      userId,
      gameId,
      assessmentMode,
      assessmentSessionId: assessmentSessionId || `sess_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      startedAt: startedAt ? new Date(startedAt) : new Date(Date.now() - (duration || 0) * 1000),
      endedAt: endedAt ? new Date(endedAt) : new Date(),
      duration: duration || 0,
      highestLevel: highestLevel || 1,
      questionsAttempted: questionsAttempted || 0,
      correctAnswers: correctAnswers || 0,
      incorrectAnswers: incorrectAnswers || 0,
      accuracy: accuracy !== undefined ? accuracy : calcAccuracy,
      totalScore: totalScore || 0,
      averageResponseTime: averageResponseTime || 0,
      streakMax: streakMax || 0,
      levelHistory,
      questionHistory,
    });

    await attempt.save();

    // Also update legacy GameScore for existing leaderboard compatibility
    const legacyGameTypeMap: Record<string, string> = {
      'switch-challenge': 'switch',
      'switch': 'switch',
      'grid-challenge': 'grid',
      'grid': 'grid',
      'motion-challenge': 'motion',
      'motion': 'motion',
      'digit-challenge': 'digit',
      'digit': 'digit',
      'geo-sudo': 'deductive',
      'deductive': 'deductive',
      'inductive-reasoning': 'inductive',
      'spacio': 'inductive',
      'inductive': 'inductive',
      'color-the-grid': 'deductive'
    };

    const legacyType = legacyGameTypeMap[gameId] || 'grid';
    const legacyScore = new GameScore({
      userId,
      gameType: legacyType,
      level: highestLevel || 1,
      score: totalScore || 0,
      accuracy: calcAccuracy,
      timeSpent: duration || 0
    });
    await legacyScore.save().catch((err: any) => console.warn('Legacy score sync notice:', err.message));

    // Update user aggregate progress
    await UserProgress.findOneAndUpdate(
      { userId, category: 'cognitive-games', topic: gameId },
      {
        $inc: {
          totalAttempted: questionsAttempted || 1,
          correct: correctAnswers || 1
        },
        $set: { lastPracticed: new Date() }
      },
      { upsert: true, new: true }
    );

    // Check if this attempt set a personal record for this game
    const previousBest = await CognitiveAttempt.findOne({
      userId,
      gameId,
      _id: { $ne: attempt._id }
    }).sort({ totalScore: -1 });

    const isNewHighScore = !previousBest || (totalScore > previousBest.totalScore);
    const isNewHighestLevel = !previousBest || (highestLevel > previousBest.highestLevel);

    res.status(201).json({
      message: 'Cognitive attempt recorded successfully',
      attempt,
      isNewHighScore,
      isNewHighestLevel,
      previousBestScore: previousBest ? previousBest.totalScore : 0
    });
  } catch (error: any) {
    console.error('Error saving cognitive attempt:', error);
    res.status(500).json({ message: 'Failed to save cognitive attempt', error: error.message });
  }
};

/**
 * Get user personal best records per game
 */
export const getUserPersonalBests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Aggregate best score, max level, best accuracy, fastest response per gameId
    const records = await CognitiveAttempt.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$gameId",
          maxScore: { $max: "$totalScore" },
          highestLevel: { $max: "$highestLevel" },
          bestAccuracy: { $max: "$accuracy" },
          lowestAvgResponseTime: { $min: "$averageResponseTime" },
          totalAttempts: { $sum: 1 },
          lastPlayed: { $max: "$createdAt" }
        }
      },
      {
        $project: {
          gameId: "$_id",
          _id: 0,
          maxScore: 1,
          highestLevel: 1,
          bestAccuracy: 1,
          lowestAvgResponseTime: 1,
          totalAttempts: 1,
          lastPlayed: 1
        }
      }
    ]);

    // Calculate aggregate candidate profile metrics
    const totalScoreSum = records.reduce((acc, r) => acc + (r.maxScore || 0), 0);
    const totalSessions = records.reduce((acc, r) => acc + (r.totalAttempts || 0), 0);
    const avgAccuracy = records.length > 0
      ? Math.round(records.reduce((acc, r) => acc + (r.bestAccuracy || 0), 0) / records.length)
      : 0;

    res.status(200).json({
      records,
      summary: {
        totalGamesPlayed: records.length,
        totalSessions,
        aggregateScore: totalScoreSum,
        avgAccuracy
      }
    });
  } catch (error: any) {
    console.error('Error fetching personal bests:', error);
    res.status(500).json({ message: 'Failed to fetch personal bests', error: error.message });
  }
};

/**
 * Get user recent attempts
 */
export const getUserAttempts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { gameId, limit = 20 } = req.query;
    const filter: any = { userId };
    if (gameId) {
      filter.gameId = gameId;
    }

    const attempts = await CognitiveAttempt.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({ attempts });
  } catch (error: any) {
    console.error('Error fetching attempts:', error);
    res.status(500).json({ message: 'Failed to fetch attempts', error: error.message });
  }
};

export const getUserScores = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const scores = await GameScore.find({ userId }).sort({ playedAt: -1 });
    res.status(200).json({ scores });
  } catch (error) {
    console.error('Error fetching game scores:', error);
    res.status(500).json({ message: 'Failed to fetch scores' });
  }
};

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameType } = req.params;
    
    // Aggregate to get the max score per user for the given game type
    const leaderboard = await GameScore.aggregate([
      { $match: { gameType } },
      { $sort: { score: -1, timeSpent: 1 } },
      { 
        $group: {
          _id: "$userId",
          score: { $first: "$score" },
          accuracy: { $first: "$accuracy" },
          timeSpent: { $first: "$timeSpent" },
          level: { $first: "$level" },
          playedAt: { $first: "$playedAt" }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          score: 1,
          accuracy: 1,
          timeSpent: 1,
          level: 1,
          playedAt: 1,
          "user.name": 1,
          "user.email": 1
        }
      },
      { $sort: { score: -1, timeSpent: 1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};
