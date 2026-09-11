import api from './api';

export interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  isHidden: boolean;
  executionTime?: string;
  memoryUsed?: string;
}

export interface SubmissionResponse {
  submissionId: string;
  status: string;
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: string;
  memoryUsed: string;
  results: TestCaseResult[];
}

export interface CodingProblem {
  _id: string;
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  hints: string[];
  editorial?: string;
  expectedComplexity: { time: string; space: string };
  starterCode: {
    java: string;
    cpp: string;
    python: string;
    c: string;
  };
  testCases?: { input: string; expectedOutput: string; isHidden: boolean }[];
}

export const getProblems = async (params?: any) => {
  const { data } = await api.get('/coding', { params });
  return data; // { problems: [], totalPages, currentPage }
};

export const getProblemById = async (id: string): Promise<CodingProblem> => {
  const { data } = await api.get(`/coding/${id}`);
  return data;
};

export const submitSolution = async (id: string, code: string, language: string): Promise<SubmissionResponse> => {
  const { data } = await api.post(`/coding/${id}/submit`, { code, language });
  return data;
};

export const runCode = async (id: string, code: string, language: string, customInput?: string) => {
  const { data } = await api.post(`/coding/${id}/run`, { code, language, customInput });
  return data.results; // TestCaseResult[]
};

export const getSubmissions = async (id: string) => {
  const { data } = await api.get(`/coding/${id}/submissions`);
  return data;
};

export const getTopics = async () => {
  const { data } = await api.get('/coding/topics');
  return data;
};
