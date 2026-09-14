import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

export interface LocalExecutionResult {
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

const EXECUTION_TIMEOUT_MS = 6000;

function runProcess(
  cmd: string,
  args: string[],
  stdinText: string,
  cwd: string,
  timeoutMs: number = EXECUTION_TIMEOUT_MS
): Promise<{ stdout: string; stderr: string; exitCode: number | null; timedOut: boolean; duration: number }> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    let timedOut = false;
    let stdout = '';
    let stderr = '';

    const proc = spawn(cmd, args, { cwd, shell: true });

    const timer = setTimeout(() => {
      timedOut = true;
      try {
        proc.kill('SIGKILL');
      } catch (e) {}
    }, timeoutMs);

    if (stdinText) {
      try {
        proc.stdin.write(stdinText);
        proc.stdin.end();
      } catch (e) {}
    } else {
      proc.stdin.end();
    }

    proc.stdout.on('data', (data: any) => {
      stdout += data.toString();
    });

    proc.stderr.on('data', (data: any) => {
      stderr += data.toString();
    });

    proc.on('error', (err: any) => {
      stderr += err.message;
    });

    proc.on('close', (exitCode: any) => {
      clearTimeout(timer);
      const duration = (Date.now() - startTime) / 1000;
      resolve({ stdout, stderr, exitCode, timedOut, duration });
    });
  });
}

export async function executeLocally(
  code: string,
  language: string,
  stdin: string = ''
): Promise<LocalExecutionResult> {
  const lang = language.toLowerCase();
  const runId = crypto.randomBytes(8).toString('hex');
  const tempDir = path.join(os.tmpdir(), `capgeminiprep_${runId}`);

  try {
    fs.mkdirSync(tempDir, { recursive: true });

    if (lang === 'cpp' || lang === 'c++') {
      const srcFile = path.join(tempDir, 'main.cpp');
      const exeFile = path.join(tempDir, 'main.exe');
      fs.writeFileSync(srcFile, code, 'utf8');

      const compile = await runProcess('g++', ['-O2', '-std=c++14', 'main.cpp', '-o', 'main.exe'], '', tempDir, 10000);
      if (compile.exitCode !== 0) {
        const isMissing = compile.exitCode === 127 || (compile.stderr && (
          compile.stderr.includes('not found') ||
          compile.stderr.includes('is not recognized') ||
          compile.stderr.includes('No such file')
        ));
        return {
          stdout: null,
          stderr: compile.stderr,
          compile_output: isMissing ? null : (compile.stderr || 'Compilation error with exit code ' + compile.exitCode),
          status: { id: isMissing ? 13 : 6, description: isMissing ? 'Host Compiler Not Installed' : 'Compilation Error' },
          time: '0.00',
          memory: 0
        };
      }

      const run = await runProcess(exeFile, [], stdin, tempDir, EXECUTION_TIMEOUT_MS);
      if (run.timedOut) {
        return {
          stdout: run.stdout,
          stderr: 'Time Limit Exceeded (execution exceeded 6 seconds)',
          compile_output: null,
          status: { id: 5, description: 'Time Limit Exceeded' },
          time: `${run.duration.toFixed(2)}`,
          memory: 2048
        };
      }
      if (run.exitCode !== 0) {
        return {
          stdout: run.stdout,
          stderr: run.stderr || `Runtime error with exit code ${run.exitCode}`,
          compile_output: null,
          status: { id: 11, description: 'Runtime Error' },
          time: `${run.duration.toFixed(2)}`,
          memory: 2048
        };
      }

      return {
        stdout: run.stdout,
        stderr: null,
        compile_output: null,
        status: { id: 3, description: 'Accepted' },
        time: `${run.duration.toFixed(2)}`,
        memory: 2048
      };
    }

    if (lang === 'c') {
      const srcFile = path.join(tempDir, 'main.c');
      const exeFile = path.join(tempDir, 'main.exe');
      fs.writeFileSync(srcFile, code, 'utf8');

      const compile = await runProcess('gcc', ['-O2', 'main.c', '-o', 'main.exe'], '', tempDir, 10000);
      if (compile.exitCode !== 0) {
        return {
          stdout: null,
          stderr: compile.stderr,
          compile_output: compile.stderr || 'Compilation error with exit code ' + compile.exitCode,
          status: { id: 6, description: 'Compilation Error' },
          time: '0.00',
          memory: 0
        };
      }

      const run = await runProcess(exeFile, [], stdin, tempDir, EXECUTION_TIMEOUT_MS);
      if (run.timedOut) {
        return {
          stdout: run.stdout,
          stderr: 'Time Limit Exceeded',
          compile_output: null,
          status: { id: 5, description: 'Time Limit Exceeded' },
          time: `${run.duration.toFixed(2)}`,
          memory: 2048
        };
      }
      if (run.exitCode !== 0) {
        return {
          stdout: run.stdout,
          stderr: run.stderr || `Runtime error with exit code ${run.exitCode}`,
          compile_output: null,
          status: { id: 11, description: 'Runtime Error' },
          time: `${run.duration.toFixed(2)}`,
          memory: 2048
        };
      }

      return {
        stdout: run.stdout,
        stderr: null,
        compile_output: null,
        status: { id: 3, description: 'Accepted' },
        time: `${run.duration.toFixed(2)}`,
        memory: 2048
      };
    }

    if (lang === 'java') {
      const match = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = match ? match[1] : 'Main';
      const javaCode = match ? code : `public class Main {\n${code}\n}`;
      const srcFile = path.join(tempDir, `${className}.java`);
      fs.writeFileSync(srcFile, javaCode, 'utf8');

      const compile = await runProcess('javac', [`${className}.java`], '', tempDir, 10000);
      if (compile.exitCode !== 0) {
        const isMissing = compile.exitCode === 127 || (compile.stderr && (
          compile.stderr.includes('not found') ||
          compile.stderr.includes('is not recognized') ||
          compile.stderr.includes('No such file')
        ));
        return {
          stdout: null,
          stderr: compile.stderr,
          compile_output: isMissing ? null : (compile.stderr || 'Compilation error in Java program'),
          status: { id: isMissing ? 13 : 6, description: isMissing ? 'Host Compiler Not Installed' : 'Compilation Error' },
          time: '0.00',
          memory: 0
        };
      }

      const run = await runProcess('java', ['-cp', '.', className], stdin, tempDir, EXECUTION_TIMEOUT_MS);
      if (run.timedOut) {
        return {
          stdout: run.stdout,
          stderr: 'Time Limit Exceeded',
          compile_output: null,
          status: { id: 5, description: 'Time Limit Exceeded' },
          time: `${run.duration.toFixed(2)}`,
          memory: 4096
        };
      }
      if (run.exitCode !== 0) {
        return {
          stdout: run.stdout,
          stderr: run.stderr || `Runtime Exception: process exited with code ${run.exitCode}`,
          compile_output: null,
          status: { id: 11, description: 'Runtime Error' },
          time: `${run.duration.toFixed(2)}`,
          memory: 4096
        };
      }

      return {
        stdout: run.stdout,
        stderr: null,
        compile_output: null,
        status: { id: 3, description: 'Accepted' },
        time: `${run.duration.toFixed(2)}`,
        memory: 4096
      };
    }

    if (lang === 'python' || lang === 'py') {
      const srcFile = path.join(tempDir, 'solution.py');
      fs.writeFileSync(srcFile, code, 'utf8');

      const pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
      const run = await runProcess(pythonCmd, ['-u', 'solution.py'], stdin, tempDir, EXECUTION_TIMEOUT_MS);
      if (run.timedOut) {
        return {
          stdout: run.stdout,
          stderr: 'Time Limit Exceeded',
          compile_output: null,
          status: { id: 5, description: 'Time Limit Exceeded' },
          time: `${run.duration.toFixed(2)}`,
          memory: 1024
        };
      }
      if (run.exitCode !== 0) {
        const isMissing = run.exitCode === 127 || (run.stderr && (
          run.stderr.includes('not found') ||
          run.stderr.includes('is not recognized') ||
          run.stderr.includes('No such file')
        ));
        if (isMissing) {
          return {
            stdout: null,
            stderr: run.stderr,
            compile_output: null,
            status: { id: 13, description: 'Host Compiler Not Installed' },
            time: '0.00',
            memory: 0
          };
        }
        const isSyntax = run.stderr.includes('SyntaxError') || run.stderr.includes('IndentationError');
        return {
          stdout: run.stdout,
          stderr: run.stderr,
          compile_output: isSyntax ? run.stderr : null,
          status: { id: isSyntax ? 6 : 11, description: isSyntax ? 'Compilation Error' : 'Runtime Error' },
          time: `${run.duration.toFixed(2)}`,
          memory: 1024
        };
      }

      return {
        stdout: run.stdout,
        stderr: null,
        compile_output: null,
        status: { id: 3, description: 'Accepted' },
        time: `${run.duration.toFixed(2)}`,
        memory: 1024
      };
    }

    return {
      stdout: null,
      stderr: `Unsupported language: ${language}`,
      compile_output: `Unsupported language: ${language}`,
      status: { id: 13, description: 'Internal Error' },
      time: '0.00',
      memory: 0
    };
  } finally {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (e) {}
  }
}
