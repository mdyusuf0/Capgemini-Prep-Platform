import { Request, Response } from 'express';
import GameScore from '../models/GameScore.js';
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
