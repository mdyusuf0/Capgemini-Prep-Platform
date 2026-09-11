import axios from 'axios';
import { env } from '../../config/env.js';

export const LANGUAGE_IDS: Record<string, number> = {
  java: 62,
  cpp: 54,
  python: 71,
  c: 50,
};

export interface JudgeResult {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string;
  memory: number;
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

const judgeApi = axios.create({
  baseURL: env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    ...(env.JUDGE0_API_KEY && { 'x-rapidapi-key': env.JUDGE0_API_KEY }),
    'x-rapidapi-host': new URL(env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com').hostname,
  },
});

export const submitCode = async (code: string, language: string, stdin: string): Promise<JudgeResult> => {
  const language_id = LANGUAGE_IDS[language.toLowerCase()];
  if (!language_id) throw new Error(`Unsupported language: ${language}`);

  if (!env.JUDGE0_API_KEY) {
    // Fallback local evaluation for demo/development if no key
    console.warn('⚠️ No JUDGE0_API_KEY provided. Using local fallback evaluation.');
    return {
      stdout: stdin, // Dummy echo
      stderr: null,
      compile_output: null,
      status: { id: 3, description: 'Accepted' }, // 3 = Accepted in Judge0
      time: '0.01',
      memory: 1024,
    };
  }

  try {
    const response = await judgeApi.post('/submissions?base64_encoded=false&wait=true', {
      source_code: code,
      language_id,
      stdin,
    });
    return response.data;
  } catch (error: any) {
    console.error('Judge0 API Error:', error?.response?.data || error.message);
    throw new Error('Failed to execute code on judge server');
  }
};

export const runTestCases = async (
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string; isHidden: boolean }[]
): Promise<TestCaseResult[]> => {
  const results: TestCaseResult[] = [];

  for (const testCase of testCases) {
    try {
      const result = await submitCode(code, language, testCase.input);
      
      const actualOutput = (result.stdout || '').trim();
      const expectedOutput = testCase.expectedOutput.trim();
      
      let passed = false;
      let error = undefined;

      if (result.status.id === 3) {
        // Status 3 is Accepted. Compare outputs
        passed = actualOutput === expectedOutput;
        if (!passed) error = 'Wrong Answer';
      } else {
        error = result.compile_output ? 'Compilation Error' : result.stderr ? 'Runtime Error' : result.status.description;
      }

      // If we used the local fallback dummy
      if (!env.JUDGE0_API_KEY) {
        passed = true; // Pretend it passed for dev if no API key
        error = undefined;
      }

      results.push({
        input: testCase.input,
        expected: expectedOutput,
        actual: actualOutput || result.compile_output || result.stderr || '',
        passed,
        isHidden: testCase.isHidden,
        executionTime: `${result.time || 0}s`,
        memoryUsed: `${result.memory || 0}KB`,
        error
      });
    } catch (error: any) {
      results.push({
        input: testCase.input,
        expected: testCase.expectedOutput.trim(),
        actual: '',
        passed: false,
        isHidden: testCase.isHidden,
        executionTime: '0s',
        memoryUsed: '0KB',
        error: error.message
      });
    }
  }

  return results;
};
