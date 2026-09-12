import api from './api';

export interface TestCaseItem {
  input: string;
  expectedOutput: string;
}

export interface TestCaseResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  isHidden: boolean;
  executionTime: string;
  memoryUsed: string;
  error?: string;
}

export interface DebugExecutionResponse {
  results: TestCaseResult[];
  compileOutput: string | null;
  allPassed: boolean;
}

export interface ILanguageVariant {
  buggyCode: string;
  fixedCode?: string;
  explanation?: string;
  hints?: string[];
}

export interface DebuggingProblem {
  _id: string;
  title: string;
  description: string;
  buggyCode: string;
  language: string;
  availableLanguages?: ('python' | 'cpp' | 'java')[];
  variants?: {
    cpp?: ILanguageVariant;
    java?: ILanguageVariant;
    python?: ILanguageVariant;
  };
  bugType: string;
  bugCategory?: string;
  difficulty: string;
  topic?: string;
  hints: string[];
  explanation?: string;
  fixedCode?: string;
  testCases?: TestCaseItem[];
}

export const debuggingService = {
  getProblems: async (params?: any) => {
    const res = await api.get('/debugging', { params });
    return res.data;
  },
  
  getProblemById: async (id: string): Promise<DebuggingProblem> => {
    const res = await api.get(`/debugging/${id}`);
    return res.data;
  },
  
  getTimedSet: async (): Promise<DebuggingProblem[]> => {
    const res = await api.get('/debugging/timed-set');
    return res.data;
  },
  
  runCode: async (id: string, code: string, language?: string): Promise<DebugExecutionResponse> => {
    const res = await api.post(`/debugging/${id}/run`, { code, language });
    return res.data;
  },

  submitFix: async (id: string, fixedCode: string, language?: string) => {
    const res = await api.post(`/debugging/${id}/submit`, { fixedCode, language });
    return res.data;
  }
};
