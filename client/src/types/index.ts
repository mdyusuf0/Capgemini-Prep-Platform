export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PseudocodeQuestion extends Question {
  codeSnippet: string;
  options: string[];
  correctOptionIndex: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodingProblem extends Question {
  problemStatement: string;
  constraints: string[];
  examples: Array<{ input: string; output: string; explanation?: string }>;
  testCases: TestCase[];
}

export interface DebuggingProblem extends CodingProblem {
  buggyCode: string;
  language: string;
}

export interface MockTest {
  id: string;
  title: string;
  durationMinutes: number;
  totalQuestions: number;
  type: 'full' | 'section' | 'quick';
}

export interface MockAttempt {
  id: string;
  testId: string;
  userId: string;
  score: number;
  completedAt: string;
}

export interface Submission {
  id: string;
  problemId: string;
  userId: string;
  status: 'accepted' | 'wrong_answer' | 'time_limit_exceeded' | 'runtime_error' | 'compilation_error';
  code: string;
  language: string;
  submittedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  entityId: string;
  entityType: 'question' | 'problem' | 'article';
}

export interface Mistake {
  id: string;
  userId: string;
  questionId: string;
  attemptedAnswer: string;
  timestamp: string;
}

export interface UserProgress {
  userId: string;
  questionsSolved: number;
  codingProblemsSolved: number;
  averageAccuracy: number;
  currentStreak: number;
  overallScore: number;
}

export interface GameScore {
  userId: string;
  gameId: string;
  score: number;
  playedAt: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  total: number;
}
