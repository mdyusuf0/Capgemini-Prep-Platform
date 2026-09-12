import axios from 'axios';
import { env } from '../../config/env.js';
import { executeLocally } from './localRunner.js';

export const LANGUAGE_IDS: Record<string, number> = {
  java: 62,
  cpp: 54,
  'c++': 54,
  python: 71,
  py: 71,
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
  const normLang = language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase() === 'py' ? 'python' : language.toLowerCase();
  const language_id = LANGUAGE_IDS[normLang];
  if (!language_id) throw new Error(`Unsupported language: ${language}`);

  if (env.JUDGE0_API_KEY) {
    try {
      const response = await judgeApi.post('/submissions?base64_encoded=false&wait=true', {
        source_code: code,
        language_id,
        stdin,
      });
      return response.data;
    } catch (error: any) {
      console.warn('Judge0 API unavailable, falling back to local compiler:', error?.message);
    }
  }

  // Real local compilation & sandboxed execution
  const localRes = await executeLocally(code, normLang, stdin);
  return {
    stdout: localRes.stdout,
    stderr: localRes.stderr,
    compile_output: localRes.compile_output,
    status: localRes.status,
    time: localRes.time,
    memory: localRes.memory,
  };
};

export const runTestCases = async (
  code: string,
  language: string,
  testCases: { input: string; expectedOutput: string; isHidden?: boolean }[]
): Promise<TestCaseResult[]> => {
  const results: TestCaseResult[] = [];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    try {
      const result = await submitCode(code, language, testCase.input);
      
      const actualOutput = (result.stdout || '').replace(/\r\n/g, '\n').trim();
      const expectedOutput = (testCase.expectedOutput || '').replace(/\r\n/g, '\n').trim();
      
      let passed = false;
      let error: string | undefined = undefined;

      if (result.status.id === 6 || result.compile_output) {
        error = 'Compilation Error';
        passed = false;
      } else if (result.status.id === 5) {
        error = 'Time Limit Exceeded';
        passed = false;
      } else if (result.status.id === 11 || result.stderr) {
        error = 'Runtime Error';
        passed = false;
      } else if (result.status.id === 3) {
        passed = actualOutput === expectedOutput;
        if (!passed) error = 'Wrong Answer';
      } else {
        error = result.status.description || 'Execution Error';
      }

      results.push({
        input: testCase.input,
        expected: expectedOutput,
        actual: result.compile_output ? result.compile_output : (actualOutput || result.stderr || ''),
        passed,
        isHidden: !!testCase.isHidden,
        executionTime: `${result.time || 0}s`,
        memoryUsed: `${result.memory || 0}KB`,
        error
      });

      // If compilation failed, all subsequent test cases will have the exact same compilation error
      if (error === 'Compilation Error' && i === 0) {
        for (let j = 1; j < testCases.length; j++) {
          results.push({
            input: testCases[j].input,
            expected: (testCases[j].expectedOutput || '').replace(/\r\n/g, '\n').trim(),
            actual: result.compile_output || 'Compilation Error',
            passed: false,
            isHidden: !!testCases[j].isHidden,
            executionTime: '0.00s',
            memoryUsed: '0KB',
            error: 'Compilation Error'
          });
        }
        break;
      }
    } catch (error: any) {
      results.push({
        input: testCase.input,
        expected: (testCase.expectedOutput || '').replace(/\r\n/g, '\n').trim(),
        actual: error.message,
        passed: false,
        isHidden: !!testCase.isHidden,
        executionTime: '0s',
        memoryUsed: '0KB',
        error: error.message
      });
    }
  }

  return results;
};

