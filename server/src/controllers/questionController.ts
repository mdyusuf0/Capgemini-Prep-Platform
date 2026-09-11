import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import Question from '../models/Question.js';
import UserProgress from '../models/UserProgress.js';
import Bookmark from '../models/Bookmark.js';
import Mistake from '../models/Mistake.js';
import mongoose from 'mongoose';

export const getQuestions = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, topic, difficulty, relevance, page = '1', limit = '10', search } = req.query;
    
    const query: any = {};
    const techCategories = ['technical-mcq', 'dsa', 'dbms', 'oops', 'os', 'networks', 'cloud', 'git', 'software-engineering'];

    if (category) {
      if (category === 'all' || category === 'all-technical' || category === 'technical') {
        query.category = { $in: techCategories };
      } else if (category === 'sql-dbms' || category === 'sql') {
        query.category = 'dbms';
      } else {
        query.category = category;
      }
    } else {
      // Default to technical categories if no category specified
      query.category = { $in: techCategories };
    }

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty.toString().toLowerCase();
    if (relevance) query.relevance = relevance;
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { topic: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const questions = await Question.find(query).skip(skip).limit(limitNum).sort({ createdAt: -1 });
    const totalCount = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: questions,
      total: totalCount,
      totalPages: totalPages,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        pages: totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getQuestionById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }
    res.json({ success: true, data: question });
  } catch (error) {
    next(error);
  }
};

export const getTopics = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = (req.params.category || req.query.category || '') as string;
    const techCategories = ['technical-mcq', 'dsa', 'dbms', 'oops', 'os', 'networks', 'cloud', 'git', 'software-engineering'];
    
    let filter: any = {};
    if (!category || category === 'all' || category === 'all-technical' || category === 'technical') {
      filter = { category: { $in: techCategories } };
    } else if (category === 'sql-dbms' || category === 'sql') {
      filter = { category: 'dbms' };
    } else {
      filter = { category };
    }

    const topics = await Question.distinct('topic', filter);
    res.json({ success: true, data: topics });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questionId = req.params.id || req.body.questionId;
    const { selectedAnswer } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const question = await Question.findById(questionId);
    if (!question) {
      res.status(404).json({ success: false, message: 'Question not found' });
      return;
    }

    const isCorrect = question.answer === selectedAnswer;

    // Update Progress
    const category = question.category;
    const topic = question.topic;

    let progress = await UserProgress.findOne({ userId, category, topic });
    if (!progress) {
      progress = new UserProgress({ userId, category, topic });
    }

    progress.totalAttempted += 1;
    if (isCorrect) {
      progress.correct += 1;
      progress.streak += 1;
    } else {
      progress.streak = 0;
      
      // Add mistake
      await Mistake.create({
        userId,
        itemType: 'question',
        itemId: questionId,
        wrongAnswer: selectedAnswer,
        correctAnswer: question.answer
      });
    }

    progress.accuracy = (progress.correct / progress.totalAttempted) * 100;
    progress.lastPracticed = new Date();
    await progress.save();

    res.json({
      success: true,
      correct: isCorrect,
      explanation: question.explanation,
      whyOthersWrong: question.whyOthersWrong
    });
  } catch (error) {
    next(error);
  }
};

export const getProgress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const progress = await UserProgress.find({ userId });
    
    const aggregated = {
      totalAttempted: 0,
      totalCorrect: 0,
      overallAccuracy: 0,
      byCategory: {} as Record<string, { attempted: number, correct: number, accuracy: number }>
    };

    progress.forEach(p => {
      aggregated.totalAttempted += p.totalAttempted;
      aggregated.totalCorrect += p.correct;
      
      if (!aggregated.byCategory[p.category]) {
        aggregated.byCategory[p.category] = { attempted: 0, correct: 0, accuracy: 0 };
      }
      
      aggregated.byCategory[p.category].attempted += p.totalAttempted;
      aggregated.byCategory[p.category].correct += p.correct;
    });

    if (aggregated.totalAttempted > 0) {
      aggregated.overallAccuracy = (aggregated.totalCorrect / aggregated.totalAttempted) * 100;
    }

    Object.keys(aggregated.byCategory).forEach(cat => {
      const catData = aggregated.byCategory[cat];
      if (catData.attempted > 0) {
        catData.accuracy = (catData.correct / catData.attempted) * 100;
      }
    });

    res.json({ success: true, data: aggregated, raw: progress });
  } catch (error) {
    next(error);
  }
};

export const getDailyMission = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    // Find weakest topic
    const progress = await UserProgress.find({ userId }).sort({ accuracy: 1 }).limit(1);
    let weakestTopicQuery = {};
    if (progress.length > 0) {
      weakestTopicQuery = { topic: progress[0].topic };
    }

    const weakQuestions = await Question.aggregate([
      { $match: weakestTopicQuery },
      { $sample: { size: 5 } }
    ]);

    const weakQuestionIds = weakQuestions.map(q => q._id);

    const randomQuestions = await Question.aggregate([
      { $match: { _id: { $nin: weakQuestionIds } } },
      { $sample: { size: 5 } }
    ]);

    res.json({
      success: true,
      data: [...weakQuestions, ...randomQuestions]
    });
  } catch (error) {
    next(error);
  }
};

export const addBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { itemType, itemId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await Bookmark.findOneAndUpdate(
      { userId, itemType, itemId },
      { userId, itemType, itemId },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: 'Bookmark added' });
  } catch (error) {
    next(error);
  }
};

export const removeBookmark = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { itemType, itemId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await Bookmark.findOneAndDelete({ userId, itemType, itemId });

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
};

export const getBookmarks = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 });
    
    // We would ideally populate this dynamically based on itemType, but for now we'll do manual population if needed
    // or rely on the frontend to fetch items by ID. Let's populate 'question' type as an example.
    const populatedBookmarks = await Promise.all(bookmarks.map(async (b) => {
      let item = null;
      if (b.itemType === 'question') {
        item = await Question.findById(b.itemId);
      }
      return { ...b.toObject(), item };
    }));

    res.json({ success: true, data: populatedBookmarks });
  } catch (error) {
    next(error);
  }
};

export const getMistakes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const mistakes = await Mistake.find({ userId }).sort({ attemptedAt: -1 });
    
    const populatedMistakes = await Promise.all(mistakes.map(async (m) => {
      let item = null;
      if (m.itemType === 'question') {
        item = await Question.findById(m.itemId);
      }
      return { ...m.toObject(), item };
    }));

    res.json({ success: true, data: populatedMistakes });
  } catch (error) {
    next(error);
  }
};
