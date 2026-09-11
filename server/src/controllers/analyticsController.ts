import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import UserProgress from '../models/UserProgress.js';
import Submission from '../models/Submission.js';
import GameScore from '../models/GameScore.js';
import MockAttempt from '../models/MockAttempt.js';
import AIConversation from '../models/AIConversation.js';

export const getDashboardOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await UserProgress.find({ userId });
    const submissions = await Submission.find({ userId });
    const games = await GameScore.find({ userId });
    const mockAttempts = await MockAttempt.find({ userId });
    const aiConversations = await AIConversation.find({ userId });

    // Unique accepted coding problems
    const acceptedCodingSubmissions = submissions.filter(s => s.status === 'Accepted' && s.problemId);
    const uniqueAcceptedCodingIds = new Set(acceptedCodingSubmissions.map(s => s.problemId.toString()));
    const codingSolvedCount = uniqueAcceptedCodingIds.size;

    // Completed mock tests
    const completedMockCount = mockAttempts.filter(m => m.status === 'completed').length;

    // Helper to sum totalAttempted / correct for a category
    const getCategoryTotals = (cat: string) => {
      const items = progress.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
      const attempted = items.reduce((sum, p) => sum + (p.totalAttempted || 0), 0);
      const correct = items.reduce((sum, p) => sum + (p.correct || 0), 0);
      return { attempted, correct };
    };

    // 1. Technical MCQ (Target: 40 questions - Round 1.1)
    const mcqData = getCategoryTotals('technical');
    const technicalItems = progress.filter(p => !['pseudocode', 'coding', 'debugging', 'games', 'cognitive', 'behavioral', 'communication', 'ai-coding', 'ai-literacy'].includes(p.category?.toLowerCase() || ''));
    const technicalAttempted = mcqData.attempted || technicalItems.reduce((sum, p) => sum + (p.totalAttempted || 0), 0);
    const technicalCorrect = mcqData.correct || technicalItems.reduce((sum, p) => sum + (p.correct || 0), 0);
    const technicalProgress = Math.min(100, Math.round((technicalCorrect / 40) * 100));

    // 2. Pseudocode (Target: 25 questions)
    const pseudoData = getCategoryTotals('pseudocode');
    const pseudoProgress = Math.min(100, Math.round((pseudoData.correct / 25) * 100));

    // 3. Coding (Target: 10 problems)
    const codingProgress = Math.min(100, Math.round((codingSolvedCount / 10) * 100));

    // 4. Debugging (Target: 10 problems)
    const debugData = getCategoryTotals('debugging');
    const debugProgress = Math.min(100, Math.round((debugData.correct / 10) * 100));

    // 5. AI Coding / Literacy (Target: 5 tasks)
    const aiData = getCategoryTotals('ai-coding');
    const aiLitData = getCategoryTotals('ai-literacy');
    const aiTotalCompleted = (aiData.correct || 0) + (aiLitData.correct || 0) + aiConversations.length;
    const aiProgress = Math.min(100, Math.round((aiTotalCompleted / 5) * 100));

    // 6. Communication (Target: 30 questions - Round 1.2)
    const commData = getCategoryTotals('communication');
    const commProgress = Math.min(100, Math.round((commData.correct / 30) * 100));

    // 7. Cognitive Games (Target: 8 played games - Round 1.3)
    const gamesPlayedCount = games.length;
    const gameProgress = Math.min(100, Math.round((gamesPlayedCount / 8) * 100));

    // 8. Behavioral (Target: 10 scenarios - Round 1.4)
    const behData = getCategoryTotals('behavioral');
    const behProgress = Math.min(100, Math.round((behData.correct / 10) * 100));

    const sections = [
      { id: 'technical', title: 'Technical MCQ', progress: technicalProgress, solved: technicalCorrect, target: 40, path: '/practice/mcq' },
      { id: 'pseudocode', title: 'Pseudocode', progress: pseudoProgress, solved: pseudoData.correct, target: 25, path: '/practice/pseudocode' },
      { id: 'coding', title: 'Coding', progress: codingProgress, solved: codingSolvedCount, target: 10, path: '/coding' },
      { id: 'debugging', title: 'Debugging', progress: debugProgress, solved: debugData.correct, target: 10, path: '/debugging' },
      { id: 'ai-coding', title: 'AI Coding', progress: aiProgress, solved: aiTotalCompleted, target: 5, path: '/ai-coding' },
      { id: 'communication', title: 'Communication', progress: commProgress, solved: commData.correct, target: 30, path: '/communication' },
      { id: 'cognitive', title: 'Cognitive Games', progress: gameProgress, solved: gamesPlayedCount, target: 8, path: '/games' },
      { id: 'behavioral', title: 'Behavioral', progress: behProgress, solved: behData.correct, target: 10, path: '/behavioral' },
    ];

    // Overall Readiness: Average of the 8 modules
    const totalProgressSum = sections.reduce((sum, s) => sum + s.progress, 0);
    const overallReadiness = Math.round(totalProgressSum / sections.length);

    // Total questions solved (all MCQs, pseudocodes, debugging, comm, behavioral)
    const totalQuestionsSolved = technicalAttempted + pseudoData.attempted + debugData.attempted + commData.attempted + behData.attempted;

    // Overall Accuracy
    const totalAllAttempted = totalQuestionsSolved + submissions.length;
    const totalAllCorrect = technicalCorrect + pseudoData.correct + debugData.correct + commData.correct + behData.correct + acceptedCodingSubmissions.length;
    const overallAccuracy = totalAllAttempted > 0 ? Math.round((totalAllCorrect / totalAllAttempted) * 100) : 0;

    // Streak calculation (0 for brand new user)
    const maxStreak = progress.length > 0 ? Math.max(0, ...progress.map(p => p.streak || 0)) : 0;

    // Dynamic Weakness Alert
    const weakSection = sections.find(s => s.progress < 50) || sections[0];

    res.status(200).json({
      stats: {
        questionsSolved: totalQuestionsSolved,
        codingProblems: codingSolvedCount,
        mockTests: completedMockCount,
        avgAccuracy: overallAccuracy,
        streak: maxStreak,
      },
      sections,
      overallReadiness,
      weakSection: {
        title: weakSection.title,
        progress: weakSection.progress,
        path: weakSection.path,
        message: weakSection.progress === 0 
          ? `You have not started ${weakSection.title} yet. Complete initial practice to raise readiness!`
          : `Current completion is only ${weakSection.progress}%. Focus here to improve your assessment score.`
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoadmapProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await UserProgress.find({ userId });
    const submissions = await Submission.find({ userId });
    const games = await GameScore.find({ userId });
    const mockAttempts = await MockAttempt.find({ userId });
    const aiConversations = await AIConversation.find({ userId });

    const getCatCorrect = (cat: string) => {
      return progress
        .filter(p => p.category?.toLowerCase() === cat.toLowerCase())
        .reduce((sum, p) => sum + (p.correct || 0), 0);
    };

    const techCorrect = getCatCorrect('technical') || progress.filter(p => !['pseudocode', 'coding', 'debugging', 'games', 'cognitive', 'behavioral', 'communication', 'ai-coding', 'ai-literacy'].includes(p.category?.toLowerCase() || '')).reduce((sum, p) => sum + (p.correct || 0), 0);
    const pseudoCorrect = getCatCorrect('pseudocode');
    const commCorrect = getCatCorrect('communication');
    const debugCorrect = getCatCorrect('debugging');
    const behCorrect = getCatCorrect('behavioral');
    const aiCorrect = getCatCorrect('ai-coding') + getCatCorrect('ai-literacy') + aiConversations.length;
    const codingSolved = new Set(submissions.filter(s => s.status === 'Accepted' && s.problemId).map(s => s.problemId.toString())).size;
    const completedMocks = mockAttempts.filter(m => m.status === 'completed').length;

    // Phase 1: Fundamentals (Technical MCQ) -> target 40
    const phase1Progress = Math.min(100, Math.round((techCorrect / 40) * 100));

    // Phase 2: Assessment Skills (Pseudocode + Communication) -> target 55
    const phase2Progress = Math.min(100, Math.round(((pseudoCorrect + commCorrect) / 55) * 100));

    // Phase 3: Coding -> target 10 problems
    const phase3Progress = Math.min(100, Math.round((codingSolved / 10) * 100));

    // Phase 4: New Assessment (Debugging + AI Coding + Games) -> target 23
    const phase4Progress = Math.min(100, Math.round(((debugCorrect + aiCorrect + games.length) / 23) * 100));

    // Phase 5: Interview Prep (Behavioral SJT) -> target 10
    const phase5Progress = Math.min(100, Math.round((behCorrect / 10) * 100));

    // Phase 6: Mock Tests -> target 3 completed mocks
    const phase6Progress = Math.min(100, Math.round((completedMocks / 3) * 100));

    const phases = [
      { id: 1, title: 'Phase 1: Fundamentals', desc: 'Java, OOP, DBMS, SQL, OS, Networks', progress: phase1Progress },
      { id: 2, title: 'Phase 2: Assessment Skills', desc: 'Technical MCQ, Pseudocode, Communication', progress: phase2Progress },
      { id: 3, title: 'Phase 3: Coding', desc: 'Arrays, Strings, Hashing, Sorting, DSA', progress: phase3Progress },
      { id: 4, title: 'Phase 4: New Assessment', desc: 'Debugging, AI Coding, AI Literacy, Games', progress: phase4Progress },
      { id: 5, title: 'Phase 5: Interview Prep', desc: 'Technical, Projects, HR & Behavioral', progress: phase5Progress },
      { id: 6, title: 'Phase 6: Mock Tests', desc: 'Sectional, Full, Weakness targeting', progress: phase6Progress },
    ];

    res.status(200).json({ phases });
  } catch (error) {
    console.error('Error fetching roadmap progress:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
