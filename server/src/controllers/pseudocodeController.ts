import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import PseudocodeQuestion from '../models/PseudocodeQuestion.js';
import UserProgress from '../models/UserProgress.js';
import Mistake from '../models/Mistake.js';

// GET /api/pseudocode
export const getPseudocodeQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { topic, difficulty, page = '1', limit = '10' } = req.query;
    const pageNumber = parseInt(page as string, 10) || 1;
    const limitNumber = parseInt(limit as string, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const query: any = {};
    if (topic && topic !== 'All') query.topic = topic;
    if (difficulty && difficulty !== 'All') query.difficulty = difficulty;

    const questions = await PseudocodeQuestion.find(query)
      .select('-answer -explanation -dryRunTrace') // Hide sensitive fields for listing
      .skip(skip)
      .limit(limitNumber)
      .lean();

    const total = await PseudocodeQuestion.countDocuments(query);

    res.json({
      questions,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error('Error fetching pseudocode questions:', error);
    res.status(500).json({ message: 'Server error fetching pseudocode questions' });
  }
};

// GET /api/pseudocode/:id
export const getPseudocodeById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const question = await PseudocodeQuestion.findById(req.params.id).lean();
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }
    
    // Hide answers unless they just answered, but for practice mode we might need it, 
    // or we fetch it via submit. Depending on requirements, we omit answer here, 
    // but the prompt says client needs answer for display after. We will omit it initially.
    const { answer, explanation, dryRunTrace, ...safeQuestion } = question;
    res.json(safeQuestion);
  } catch (error) {
    console.error('Error fetching pseudocode question:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/pseudocode/topics/list
export const getPseudocodeTopics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topics = await PseudocodeQuestion.distinct('topic');
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/pseudocode/submit
export const submitPseudocodeAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { questionId, selectedAnswer } = req.body;
    const userId = req.user?._id;

    if (!questionId || selectedAnswer === undefined) {
      res.status(400).json({ message: 'questionId and selectedAnswer are required' });
      return;
    }

    const question = await PseudocodeQuestion.findById(questionId);
    if (!question) {
      res.status(404).json({ message: 'Question not found' });
      return;
    }

    let isCorrect = false;
    if (typeof question.answer === 'number' && typeof selectedAnswer === 'number') {
      isCorrect = question.answer === selectedAnswer;
    } else if (!isNaN(Number(selectedAnswer)) && !isNaN(Number(question.answer))) {
      isCorrect = Number(question.answer) === Number(selectedAnswer);
    } else if (typeof selectedAnswer === 'string' && question.options && question.options[question.answer] !== undefined) {
      isCorrect = selectedAnswer.trim().toLowerCase() === question.options[question.answer].trim().toLowerCase();
    }

    // Track Progress using correct UserProgress schema (if authenticated)
    if (userId) {
      const progress = await UserProgress.findOneAndUpdate(
        { userId, category: 'pseudocode', topic: question.topic },
        {
          $inc: {
            totalAttempted: 1,
            correct: isCorrect ? 1 : 0
          },
          $set: { lastPracticed: new Date() }
        },
        { upsert: true, new: true }
      );
      if (progress) {
        progress.accuracy = progress.totalAttempted > 0 ? Math.round((progress.correct / progress.totalAttempted) * 100) : 0;
        await progress.save();
      }

      // Handle Mistake
      if (!isCorrect) {
        await Mistake.findOneAndUpdate(
          { userId, itemType: 'pseudocode', itemId: questionId },
          { 
            $set: { 
              wrongAnswer: selectedAnswer,
              correctAnswer: question.answer,
              attemptedAt: new Date()
            }
          },
          { upsert: true, new: true }
        );
      }
    }

    res.json({
      correct: isCorrect,
      correctAnswer: question.answer,
      explanation: question.explanation,
      dryRunTrace: question.dryRunTrace
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/pseudocode/speed-set/generate
export const getPseudocodeSpeedSet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const questions = await PseudocodeQuestion.aggregate([
      { $sample: { size: 30 } },
      { $project: { answer: 0, explanation: 0, dryRunTrace: 0 } } // Exclude sensitive details
    ]);
    res.json(questions);
  } catch (error) {
    console.error('Error generating speed set:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
