import express, { Request, Response } from 'express';
import InterviewQuestion from '../models/InterviewQuestion.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { category = 'technical-interview', topic, difficulty, limit = '50' } = req.query;
    const query: any = {};
    if (category) {
      query.category = category;
    }
    if (topic) {
      query.topic = { $regex: topic as string, $options: 'i' };
    }
    if (difficulty) {
      query.difficulty = (difficulty as string).toLowerCase();
    }

    const limitNum = parseInt(limit as string, 10) || 50;
    const questions = await InterviewQuestion.find(query).limit(limitNum).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: questions,
      total: questions.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch interview questions', error });
  }
});

export default router;
