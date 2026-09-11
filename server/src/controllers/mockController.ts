import { Request, Response } from 'express';
import MockTest from '../models/MockTest.js';
import MockAttempt from '../models/MockAttempt.js';
import { AuthRequest } from '../middleware/auth.js';
import mongoose from 'mongoose';

// dummy models for generation
import Question from '../models/Question.js'; 

export const getMockTests = async (req: Request, res: Response) => {
  try {
    const tests = await MockTest.find({ isGenerated: false }).sort({ createdAt: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mock tests', error });
  }
};

export const generateMock = async (req: AuthRequest, res: Response) => {
  try {
    const { type, sections } = req.body;
    let newSections = [];
    let totalTime = 0;
    
    // Simplistic generation for now - in reality you'd fetch actual Qs from DB
    // Assuming type 'quick' 20Q 20M
    if (type === 'quick') {
      newSections.push({
        name: 'Mixed Quick',
        category: 'mixed',
        questionCount: 20,
        timeMinutes: 20,
        questionIds: [] // Populate with real IDs later
      });
      totalTime = 20;
    } else if (type === 'full-capgemini') {
      newSections = [
        { name: 'Technical MCQ', category: 'technical', questionCount: 40, timeMinutes: 40, questionIds: [] },
        { name: 'Pseudocode', category: 'pseudocode', questionCount: 15, timeMinutes: 15, questionIds: [] },
        { name: 'Communication', category: 'communication', questionCount: 30, timeMinutes: 30, questionIds: [] }
      ];
      totalTime = 85;
    } else {
      newSections = sections || [];
      totalTime = sections?.reduce((acc: number, s: any) => acc + s.timeMinutes, 0) || 60;
    }

    const mockTest = new MockTest({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Mock Test`,
      type,
      sections: newSections,
      totalTimeMinutes: totalTime,
      isGenerated: true
    });

    await mockTest.save();
    res.json(mockTest);
  } catch (error) {
    res.status(500).json({ message: 'Error generating mock test', error });
  }
};

export const startMock = async (req: AuthRequest, res: Response) => {
  try {
    const { testId } = req.body;
    const test = await MockTest.findById(testId);
    
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const totalQ = test.sections.reduce((acc, s) => acc + s.questionCount, 0);

    const attempt = new MockAttempt({
      userId: req.user?._id,
      mockTestId: testId,
      status: 'in-progress',
      totalQuestions: totalQ
    });

    await attempt.save();
    res.json({ attemptId: attempt._id, test });
  } catch (error) {
    res.status(500).json({ message: 'Error starting mock test', error });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { attemptId, questionId, selectedAnswer, timeTaken, isCorrect } = req.body;
    
    const attempt = await MockAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user?._id },
      { 
        $push: { 
          answers: { questionId, selectedAnswer, timeTaken, isCorrect, questionType: 'mcq' } 
        } 
      },
      { new: true }
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error saving answer', error });
  }
};

export const completeMock = async (req: AuthRequest, res: Response) => {
  try {
    const { attemptId, answers, timeSpent } = req.body;
    
    // In a real app, validate answers on backend. Using client truth for now for brevity.
    let correct = 0;
    answers.forEach((a: any) => {
      if (a.isCorrect) correct++;
    });

    const attempt = await MockAttempt.findOneAndUpdate(
      { _id: attemptId, userId: req.user?._id },
      {
        status: 'completed',
        completedAt: new Date(),
        answers,
        timeSpent,
        score: correct
      },
      { new: true }
    );

    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error completing mock', error });
  }
};

export const getMockResult = async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await MockAttempt.findOne({ _id: req.params.id, userId: req.user?._id })
      .populate('mockTestId');
    if (!attempt) return res.status(404).json({ message: 'Result not found' });
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching result', error });
  }
};

export const getAttemptHistory = async (req: AuthRequest, res: Response) => {
  try {
    const attempts = await MockAttempt.find({ userId: req.user?._id })
      .populate('mockTestId')
      .sort({ createdAt: -1 });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
};
