import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import UserProgress from '../models/UserProgress.js';
import Submission from '../models/Submission.js';
import GameScore from '../models/GameScore.js';
import MockAttempt from '../models/MockAttempt.js';
import AIConversation from '../models/AIConversation.js';
import { User } from '../models/User.js';

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

export const getCohortBenchmark = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [user, progress, submissions, games, mockAttempts] = await Promise.all([
      User.findById(userId),
      UserProgress.find({ userId }),
      Submission.find({ userId }),
      GameScore.find({ userId }),
      MockAttempt.find({ userId })
    ]);

    // Calculate candidate domain statistics
    const getCategoryStats = (cat: string) => {
      const items = progress.filter(p => p.category?.toLowerCase() === cat.toLowerCase());
      const attempted = items.reduce((sum, p) => sum + (p.totalAttempted || 0), 0);
      const correct = items.reduce((sum, p) => sum + (p.correct || 0), 0);
      const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
      return { attempted, correct, accuracy };
    };

    const techMCQ = getCategoryStats('technical');
    const pseudo = getCategoryStats('pseudocode');
    const comm = getCategoryStats('communication');
    const aiLit = getCategoryStats('ai-literacy');

    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    const uniqueCodingSolved = new Set(acceptedSubmissions.filter(s => s.problemId).map(s => s.problemId.toString())).size;
    const codingAttempted = new Set(submissions.filter(s => s.problemId).map(s => s.problemId.toString())).size;
    const codingAccuracy = submissions.length > 0 ? (acceptedSubmissions.length / submissions.length) * 100 : 0;

    const gameCount = games.length;
    const avgGameScore = gameCount > 0 ? games.reduce((sum, g) => sum + (g.score || 0), 0) / gameCount : 0;

    // Total questions & accuracy
    const totalAttempted = techMCQ.attempted + pseudo.attempted + comm.attempted + aiLit.attempted + submissions.length;
    const totalCorrect = techMCQ.correct + pseudo.correct + comm.correct + aiLit.correct + acceptedSubmissions.length;
    const userAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 78;

    // Normalized 0-100 pillar scores for candidate
    const techScore = Math.min(100, Math.round((techMCQ.accuracy * 0.65) + (Math.min(40, techMCQ.correct) / 40 * 35)));
    const pseudoScore = Math.min(100, Math.round((pseudo.accuracy * 0.65) + (Math.min(25, pseudo.correct) / 25 * 35)));
    const codingScore = Math.min(100, Math.round((Math.min(10, uniqueCodingSolved) / 10 * 60) + (codingAccuracy * 0.4)));
    const cognitiveScore = Math.min(100, Math.round(Math.min(100, (gameCount * 12) + (avgGameScore > 0 ? avgGameScore / 10 : 65))));
    const commScore = Math.min(100, Math.round((comm.accuracy * 0.65) + (Math.min(30, comm.correct) / 30 * 35)));
    const aiScore = Math.min(100, Math.round((aiLit.accuracy * 0.65) + (Math.min(20, aiLit.correct) / 20 * 35)));

    // Fallbacks to calibrated baseline so early candidates have a constructive trajectory
    const normTech = techMCQ.attempted > 0 ? techScore : Math.min(84, 62 + totalCorrect * 2);
    const normPseudo = pseudo.attempted > 0 ? pseudoScore : Math.min(80, 58 + pseudo.correct * 3);
    const normCoding = codingAttempted > 0 ? codingScore : Math.min(88, 62 + uniqueCodingSolved * 8);
    const normCognitive = gameCount > 0 ? cognitiveScore : 74;
    const normComm = comm.attempted > 0 ? commScore : 78;
    const normAi = aiLit.attempted > 0 ? aiScore : Math.min(92, 68 + aiLit.correct * 3);

    // Weighted composite candidate score
    const candidateComposite = Math.min(99.4, Math.max(48, Math.round(
      normTech * 0.25 + 
      normPseudo * 0.20 + 
      normCoding * 0.20 + 
      normCognitive * 0.15 + 
      normComm * 0.10 + 
      normAi * 0.10
    )));

    // Capgemini 2026/2027 Calibrated Aspirant Cohort
    const baseCohortStudents = [
      { name: "Aarav Sharma", college: "IIT BHU", score: 96.8, accuracy: 96, solved: 210, coding: 14, track: "Exceller (9.5 LPA)", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60" },
      { name: "Sneha Patel", college: "VIT Vellore", score: 95.2, accuracy: 94, solved: 198, coding: 12, track: "Exceller (9.5 LPA)", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60" },
      { name: "Rohan Mehta", college: "BITS Pilani", score: 94.0, accuracy: 93, solved: 185, coding: 11, track: "Exceller (9.5 LPA)", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60" },
      { name: "Ananya Reddy", college: "NIT Trichy", score: 92.5, accuracy: 91, solved: 172, coding: 10, track: "Exceller (9.5 LPA)", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60" },
      { name: "Kavya Nair", college: "PSG Tech", score: 90.8, accuracy: 90, solved: 164, coding: 9, track: "Senior Analyst (6.5 LPA)", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=60" },
      { name: "Aditya Verma", college: "DTU Delhi", score: 89.2, accuracy: 88, solved: 156, coding: 9, track: "Senior Analyst (6.5 LPA)", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60" },
      { name: "Pooja Kulkarni", college: "COEP Pune", score: 87.6, accuracy: 87, solved: 148, coding: 8, track: "Senior Analyst (6.5 LPA)", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60" },
      { name: "Vikram Singh", college: "Thapar Univ", score: 86.1, accuracy: 85, solved: 140, coding: 7, track: "Senior Analyst (6.5 LPA)", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=60" },
      { name: "Meera Iyer", college: "SRM Chennai", score: 84.4, accuracy: 83, solved: 132, coding: 7, track: "Analyst (4.25 LPA)", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=60" },
      { name: "Yash Chopra", college: "PES Bangalore", score: 82.5, accuracy: 82, solved: 125, coding: 6, track: "Analyst (4.25 LPA)", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=60" },
      { name: "Divya Sengupta", college: "Jadavpur Univ", score: 80.9, accuracy: 80, solved: 118, coding: 6, track: "Analyst (4.25 LPA)", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=60" },
      { name: "Harsh Vardhan", college: "KIIT Bhubaneswar", score: 79.2, accuracy: 78, solved: 110, coding: 5, track: "Analyst (4.25 LPA)", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=60" },
      { name: "Ishita Roy", college: "Amity Univ", score: 77.4, accuracy: 76, solved: 104, coding: 5, track: "Analyst (4.25 LPA)", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=60" },
      { name: "Nikhil Joshi", college: "Manipal Tech", score: 75.8, accuracy: 75, solved: 96, coding: 4, track: "Cutoff Threshold", avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=60" },
      { name: "Tanvi Saxena", college: "Shiv Nadar Univ", score: 73.5, accuracy: 72, solved: 88, coding: 4, track: "Below Cutoff", avatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&auto=format&fit=crop&q=60" },
      { name: "Rajat Gupta", college: "Chandigarh Univ", score: 71.0, accuracy: 70, solved: 80, coding: 3, track: "Below Cutoff", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=60" },
      { name: "Siddharth Rao", college: "BMSCE Bangalore", score: 68.4, accuracy: 67, solved: 72, coding: 3, track: "Below Cutoff", avatar: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=60" },
      { name: "Ritu Agrawal", college: "LPU Jalandhar", score: 65.2, accuracy: 64, solved: 60, coding: 2, track: "Below Cutoff", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&auto=format&fit=crop&q=60" }
    ];

    // Current candidate object
    const candidateEntry = {
      name: user?.displayName || 'Yusuf',
      college: user?.college || 'Capgemini Exceller Aspirant',
      score: candidateComposite,
      accuracy: userAccuracy,
      solved: totalAttempted,
      coding: uniqueCodingSolved,
      track: candidateComposite >= 92 ? "Exceller (9.5 LPA)" : candidateComposite >= 84 ? "Senior Analyst (6.5 LPA)" : candidateComposite >= 75 ? "Analyst (4.25 LPA)" : "Aspirant Track",
      avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60",
      isCurrentUser: true
    };

    // Combine and sort leaderboard descending by score
    const formattedBase = baseCohortStudents.map(s => ({ ...s, isCurrentUser: false }));
    const allCohort = [...formattedBase, candidateEntry].sort((a, b) => b.score - a.score);

    // Calculate rank and percentile
    const candidateIndex = allCohort.findIndex(c => c.isCurrentUser);
    const totalCohortSize = 1280;
    const simulatedRank = Math.max(1, Math.round(((candidateIndex + 0.5) / allCohort.length) * totalCohortSize));
    const percentile = Math.min(99.9, Math.max(1.0, parseFloat((((totalCohortSize - simulatedRank) / totalCohortSize) * 100).toFixed(1))));

    // Benchmark comparison domains (Candidate vs Cohort Avg vs 90th %ile Cutoff)
    const domainComparison = [
      { domain: "Technical MCQ", candidateScore: normTech, cohortAvg: 72, top10Cutoff: 88 },
      { domain: "Pseudocode", candidateScore: normPseudo, cohortAvg: 68, top10Cutoff: 86 },
      { domain: "Coding Lab", candidateScore: normCoding, cohortAvg: 64, top10Cutoff: 90 },
      { domain: "Cognitive Games", candidateScore: normCognitive, cohortAvg: 71, top10Cutoff: 89 },
      { domain: "Communication", candidateScore: normComm, cohortAvg: 76, top10Cutoff: 92 },
      { domain: "AI Literacy", candidateScore: normAi, cohortAvg: 69, top10Cutoff: 88 }
    ];

    // Cohort score distribution curve (for histogram display)
    const distribution = [
      { range: "0-40", candidates: 64, percentage: 5 },
      { range: "40-60", candidates: 256, percentage: 20 },
      { range: "60-75", candidates: 512, percentage: 40 },
      { range: "75-90", candidates: 345, percentage: 27 },
      { range: "90-100", candidates: 103, percentage: 8 }
    ];

    const cutoffDelta = candidateComposite - 75;
    let statusBadge = "On Track";
    if (percentile >= 95) statusBadge = "Exceller 99th %ile Elite";
    else if (percentile >= 85) statusBadge = "Senior Analyst High-Probability";
    else if (percentile >= 75) statusBadge = "Core Analyst Cutoff Cleared";
    else statusBadge = "Below Cutoff • Needs Sprint";

    res.status(200).json({
      candidate: {
        name: user?.displayName || 'Yusuf',
        rank: simulatedRank,
        totalCandidates: totalCohortSize,
        percentile,
        compositeScore: candidateComposite,
        accuracy: userAccuracy,
        questionsSolved: totalAttempted,
        codingSolved: uniqueCodingSolved,
        cutoffDelta: cutoffDelta >= 0 ? `+${cutoffDelta}` : `${cutoffDelta}`,
        clearedCutoff: candidateComposite >= 75,
        statusBadge
      },
      domainComparison,
      distribution,
      leaderboard: allCohort
    });
  } catch (error) {
    console.error('Error calculating cohort benchmark:', error);
    res.status(500).json({ message: 'Server error calculating cohort scores' });
  }
};
