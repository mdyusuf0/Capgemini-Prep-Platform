import { Request, Response } from 'express';
import DebuggingProblem from '../models/DebuggingProblem.js';

export const getProblems = async (req: Request, res: Response) => {
  try {
    const { bugType, difficulty, language, topic, page = '1', limit = '20' } = req.query;
    
    const query: any = {};
    if (bugType) query.bugType = bugType;
    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;
    if (topic) query.topic = topic;

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const problems = await DebuggingProblem.find(query)
      .select('-fixedCode')
      .skip(skip)
      .limit(parseInt(limit as string))
      .sort({ capgeminiRelevance: -1, createdAt: -1 });

    const total = await DebuggingProblem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching debugging problems', error });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const problem = await DebuggingProblem.findById(req.params.id).select('-fixedCode');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching debugging problem', error });
  }
};

export const submitFix = async (req: Request, res: Response) => {
  try {
    const { fixedCode } = req.body;
    const problem = await DebuggingProblem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const normalizeString = (str: string) => str.replace(/\s+/g, ' ').trim();
    const isCorrect = normalizeString(fixedCode) === normalizeString(problem.fixedCode);

    res.json({
      correct: isCorrect,
      explanation: problem.explanation,
      fixedCode: problem.fixedCode
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting fix', error });
  }
};

export const getTimedSet = async (req: Request, res: Response) => {
  try {
    const problems = await DebuggingProblem.aggregate([
      { $sample: { size: 10 } },
      { $project: { fixedCode: 0 } }
    ]);
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching timed set', error });
  }
};
