import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import DebuggingProblem from '../models/DebuggingProblem.js';
import UserProgress from '../models/UserProgress.js';
import { runTestCases } from '../services/judge/judge0.js';

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

export const runDebuggingCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const problem = await DebuggingProblem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const testCases = problem.testCases && problem.testCases.length > 0
      ? problem.testCases
      : [{ input: '', expectedOutput: '', isHidden: false }];

    const results = await runTestCases(code, problem.language || 'cpp', testCases);
    const compileError = results.find(r => r.error === 'Compilation Error')?.actual;

    res.json({
      results,
      compileOutput: compileError || null,
      allPassed: results.every(r => r.passed)
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error executing code', error: error.message });
  }
};

export const submitFix = async (req: AuthRequest, res: Response) => {
  try {
    const { fixedCode } = req.body;
    const userId = req.user?._id;
    const problem = await DebuggingProblem.findById(req.params.id);
    
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const testCases = problem.testCases && problem.testCases.length > 0
      ? problem.testCases
      : [{ input: '', expectedOutput: '', isHidden: false }];

    const results = await runTestCases(fixedCode, problem.language || 'cpp', testCases);
    const compileError = results.find(r => r.error === 'Compilation Error')?.actual;
    const allPassed = results.length > 0 && results.every(r => r.passed);

    // Normalize comparison as secondary fallback check
    const normalizeString = (str: string) => str.replace(/\s+/g, ' ').trim();
    const matchesSolution = normalizeString(fixedCode) === normalizeString(problem.fixedCode);
    const isCorrect = allPassed || matchesSolution;

    if (userId) {
      await UserProgress.findOneAndUpdate(
        { userId, category: 'debugging', topic: problem.bugType || 'Debugging' },
        {
          $inc: {
            totalAttempted: 1,
            correct: isCorrect ? 1 : 0
          },
          $set: { lastPracticed: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    res.json({
      correct: isCorrect,
      explanation: problem.explanation,
      fixedCode: problem.fixedCode,
      results,
      compileOutput: compileError || null
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error submitting fix', error: error.message });
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
