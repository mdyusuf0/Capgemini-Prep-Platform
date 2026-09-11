import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import UserProgress from '../models/UserProgress.js';
import Submission from '../models/Submission.js';
import GameScore from '../models/GameScore.js';

export const getOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await UserProgress.find({ userId });
    
    // Aggregate submissions for overall accuracy
    const submissions = await Submission.find({ userId });
    const correctCount = submissions.filter(sub => sub.status === 'Accepted').length;
    const totalCount = submissions.length;
    const accuracy = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

    // Aggregate progress across all categories
    const totalAttempted = progress.reduce((sum, p) => sum + p.totalAttempted, 0);
    const totalCorrect = progress.reduce((sum, p) => sum + p.correct, 0);
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

    res.status(200).json({
      overview: {
        questionsSolved: totalAttempted,
        codingSubmissions: totalCount,
        codingAccuracy: Math.round(accuracy),
        overallAccuracy,
        streak: progress.length > 0 ? Math.max(...progress.map(p => p.streak)) : 0,
      }
    });
  } catch (error) {
    console.error('Error fetching overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCategoryStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { category } = req.params;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // In a full implementation, you'd join with Questions to filter by category.
    // For now, returning dummy per-category breakdown based on existing data pattern.
    const submissions = await Submission.find({ userId });
    
    // Simulate filtering (assuming frontend might pass categories like 'mcq', 'coding', etc.)
    res.status(200).json({
      category,
      stats: {
        attempted: Math.floor(submissions.length / 4),
        accuracy: 75.5,
        timeSpent: 120 // minutes
      }
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getTrends = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Group by date for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trends = await Submission.aggregate([
      { $match: { userId: userId, submittedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$submittedAt" } },
          total: { $sum: 1 },
          correct: { $sum: { $cond: ["$isCorrect", 1, 0] } }
        }
      },
      { $sort: { "_id": 1 } },
      {
        $project: {
          date: "$_id",
          accuracy: {
            $multiply: [{ $divide: ["$correct", "$total"] }, 100]
          },
          total: 1
        }
      }
    ]);

    res.status(200).json({ trends });
  } catch (error) {
    console.error('Error fetching trends:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWeakAreas = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Dummy weak areas for now - in reality would aggregate from failed subtopics
    const weakAreas = [
      { topic: "Dynamic Programming", accuracy: 35 },
      { topic: "DBMS Normalization", accuracy: 42 },
      { topic: "OS Deadlocks", accuracy: 45 }
    ];

    res.status(200).json({ weakAreas });
  } catch (error) {
    console.error('Error fetching weak areas:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCoachAdvice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Placeholder for AI generation
    const advice = "Focus on dynamic programming and DBMS concepts. Your accuracy in these areas has been below 50% recently. Try dedicating your next 3 practice sessions specifically to DP tabular methods.";

    res.status(200).json({ advice });
  } catch (error) {
    console.error('Error getting coach advice:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
