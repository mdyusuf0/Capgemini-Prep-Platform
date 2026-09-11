import { Request, Response } from 'express';
import { CodingProblem } from '../models/CodingProblem.js';
import { Submission } from '../models/Submission.js';
import UserProgress from '../models/UserProgress.js';
import { runTestCases, submitCode } from '../services/judge/judge0.js';
import { AuthRequest } from '../middleware/auth.js';

export const getProblems = async (req: Request, res: Response) => {
  try {
    const { difficulty, topic, search, page = '1', limit = '10' } = req.query;
    const query: any = {};

    if (difficulty) query.difficulty = difficulty;
    if (topic) query.topics = { $in: [topic] };
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const problems = await CodingProblem.find(query)
      .select('-testCases -editorial -hints') // exclude heavy/hidden fields for list
      .skip(skip)
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 });

    const total = await CodingProblem.countDocuments(query);

    res.json({
      problems,
      totalPages: Math.ceil(total / parseInt(limit as string)),
      currentPage: parseInt(page as string)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProblemById = async (req: Request, res: Response) => {
  try {
    const problem = await CodingProblem.findById(req.params.id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Hide hidden test cases from the client
    const problemObj = problem.toObject();
    problemObj.testCases = problemObj.testCases.filter(tc => !tc.isHidden);

    res.json(problemObj);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitSolution = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { code, language } = req.body;
    const userId = req.user?._id;

    const problem = await CodingProblem.findById(id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Run against ALL test cases
    const results = await runTestCases(code, language, problem.testCases);
    
    const testCasesPassed = results.filter(r => r.passed).length;
    const totalTestCases = results.length;
    
    let overallStatus = 'Accepted';
    if (results.some(r => r.error === 'Compilation Error')) overallStatus = 'Compilation Error';
    else if (results.some(r => r.error === 'Runtime Error')) overallStatus = 'Runtime Error';
    else if (results.some(r => r.error === 'Time Limit Exceeded')) overallStatus = 'Time Limit Exceeded';
    else if (testCasesPassed < totalTestCases) overallStatus = 'Wrong Answer';

    // Calculate max time and memory
    const maxTime = results.reduce((max, r) => Math.max(max, parseFloat(r.executionTime)), 0);
    const maxMemory = results.reduce((max, r) => Math.max(max, parseFloat(r.memoryUsed)), 0);

    const submission = await Submission.create({
      userId,
      problemId: id,
      code,
      language,
      status: overallStatus,
      testCasesPassed,
      totalTestCases,
      executionTime: `${maxTime}s`,
      memoryUsed: `${maxMemory}KB`,
      results
    });

    if (userId) {
      await UserProgress.findOneAndUpdate(
        { userId, category: 'coding', topic: problem.topics?.[0] || 'Coding' },
        {
          $inc: {
            totalAttempted: 1,
            correct: overallStatus === 'Accepted' ? 1 : 0
          },
          $set: { lastPracticed: new Date() }
        },
        { upsert: true, new: true }
      );
    }

    // Strip out hidden results before sending back to client
    const clientResults = results.map(r => r.isHidden ? { ...r, expected: 'Hidden', actual: 'Hidden', input: 'Hidden' } : r);
    const compileError = results.find(r => r.error === 'Compilation Error')?.actual;

    res.status(201).json({
      submissionId: submission._id,
      status: overallStatus,
      testCasesPassed,
      totalTestCases,
      executionTime: submission.executionTime,
      memoryUsed: submission.memoryUsed,
      results: clientResults,
      compileOutput: compileError || null
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const runCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, language, customInput } = req.body;

    if (customInput !== undefined) {
      const result = await submitCode(code, language, customInput);
      const isCompileErr = result.status.id === 6 || !!result.compile_output;
      return res.json({
        results: [{
          input: customInput,
          expected: 'N/A (Custom Input)',
          actual: result.compile_output ? result.compile_output : (result.stdout || result.stderr || 'No output produced'),
          passed: result.status.id === 3,
          executionTime: `${result.time || 0}s`,
          memoryUsed: `${result.memory || 0}KB`,
          isHidden: false,
          error: isCompileErr ? 'Compilation Error' : (result.status.id === 11 ? 'Runtime Error' : (result.status.id === 5 ? 'Time Limit Exceeded' : undefined))
        }],
        compileOutput: result.compile_output || (isCompileErr ? (result.stderr || 'Compilation Error') : null),
        allPassed: result.status.id === 3
      });
    }

    const problem = await CodingProblem.findById(id);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Run against VISIBLE test cases only
    const visibleTestCases = problem.testCases.filter(tc => !tc.isHidden);
    const results = await runTestCases(code, language, visibleTestCases);
    const compileError = results.find(r => r.error === 'Compilation Error')?.actual;

    res.json({
      results,
      compileOutput: compileError || null,
      allPassed: results.length > 0 && results.every(r => r.passed)
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubmissions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const submissions = await Submission.find({ 
      userId, 
      problemId: req.params.id 
    }).sort({ submittedAt: -1 }).limit(10);
    
    // Mask hidden testcases data
    const sanitizedSubmissions = submissions.map(sub => {
      const subObj = sub.toObject();
      subObj.results = subObj.results.map(r => 
        r.isHidden ? { ...r, input: 'Hidden', expected: 'Hidden', actual: 'Hidden' } : r
      );
      return subObj;
    });

    res.json(sanitizedSubmissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopics = async (req: Request, res: Response) => {
  try {
    const topics = await CodingProblem.distinct('topics');
    res.json(topics);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
