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

const publicJudgeApi = axios.create({
  baseURL: 'https://ce.judge0.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 12000,
});

const customJudgeApi = axios.create({
  baseURL: env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    ...(env.JUDGE0_API_KEY && { 'x-rapidapi-key': env.JUDGE0_API_KEY }),
    'x-rapidapi-host': new URL(env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com').hostname,
  },
  timeout: 12000,
});

export const submitCode = async (code: string, language: string, stdin: string): Promise<JudgeResult> => {
  const normLang = language.toLowerCase() === 'c++' ? 'cpp' : language.toLowerCase() === 'py' ? 'python' : language.toLowerCase();
  const language_id = LANGUAGE_IDS[normLang];
  if (!language_id) throw new Error(`Unsupported language: ${language}`);

  // Normalize Java code for remote compilation so class is always Main
  let processedCode = code;
  if (normLang === 'java') {
    if (/public\s+class\s+([A-Za-z0-9_]+)/.test(processedCode)) {
      processedCode = processedCode.replace(/public\s+class\s+([A-Za-z0-9_]+)/, 'public class Main');
    } else if (!/class\s+Main/.test(processedCode)) {
      processedCode = `public class Main {\n${processedCode}\n}`;
    }
  }

  // Tier 1: User-configured custom RapidAPI Judge0 (if API key provided)
  if (env.JUDGE0_API_KEY) {
    try {
      const response = await customJudgeApi.post('/submissions?base64_encoded=false&wait=true', {
        source_code: processedCode,
        language_id,
        stdin,
      });
      if (response.data && response.data.status) {
        return response.data;
      }
    } catch (error: any) {
      console.warn('Custom Judge0 API unavailable, falling back to public Judge0 CE:', error?.message);
    }
  }

  // Tier 2: Public Judge0 CE Sandbox (free, fast, sandbox with OpenJDK 21, GCC 13, Python 3)
  try {
    const response = await publicJudgeApi.post('/submissions?base64_encoded=false&wait=true', {
      source_code: processedCode,
      language_id,
      stdin,
    });
    if (response.data && response.data.status) {
      return response.data;
    }
  } catch (error: any) {
    console.warn('Public Judge0 CE unavailable, attempting local runner:', error?.message);
  }

  // Tier 3: Local compilation & sandboxed execution (if host environment has javac/g++/python)
  try {
    const localRes = await executeLocally(code, normLang, stdin);
    const isMissingCompiler = Boolean(
      localRes.status?.id === 13 ||
      (localRes.stderr && (
        localRes.stderr.includes('not found') ||
        localRes.stderr.includes('is not recognized') ||
        localRes.stderr.includes('No such file')
      ))
    );
    if (!isMissingCompiler) {
      return {
        stdout: localRes.stdout,
        stderr: localRes.stderr,
        compile_output: localRes.compile_output,
        status: localRes.status,
        time: localRes.time,
        memory: localRes.memory,
      };
    }
    console.warn(`Local runner compiler binary for ${normLang} not found on host system.`);
  } catch (err: any) {
    console.warn('Local execution failed:', err?.message);
  }

  // Tier 4: Fallback message if all compiler engines are unreachable
  return {
    stdout: null,
    stderr: `Compiler service for ${normLang} is temporarily unavailable.`,
    compile_output: `Compiler service unavailable.`,
    status: { id: 13, description: 'Compiler Unavailable' },
    time: '0.00',
    memory: 0,
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

      if (result.status.id === 13) {
        error = 'Compiler Unavailable';
        passed = false;
      } else if (result.status.id === 6 || result.compile_output) {
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

