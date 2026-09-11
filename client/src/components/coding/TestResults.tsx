import { TestCaseResult } from '../../services/codingService';
import { CheckCircle, XCircle, Clock, Cpu, AlertTriangle } from 'lucide-react';

interface TestResultsProps {
  results: TestCaseResult[];
  compileOutput?: string | null;
  summary?: {
    status: string;
    passed: number;
    total: number;
    time: string;
    memory: string;
  };
}

export const TestResults = ({ results, compileOutput, summary }: TestResultsProps) => {
  if ((!results || results.length === 0) && !compileOutput) return null;

  return (
    <div className="flex flex-col h-full space-y-3 font-sans">
      {/* Compiler Diagnostic Output Banner */}
      {compileOutput && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 text-xs font-mono shadow-xs">
          <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Compiler Diagnostic / Syntax Error:</span>
          </div>
          <pre className="text-red-900 bg-white p-3 rounded-lg border border-red-200 whitespace-pre-wrap text-[11px] overflow-x-auto max-h-52 leading-relaxed">
            {compileOutput}
          </pre>
        </div>
      )}

      {summary && (
        <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
          summary.status === 'Accepted' 
            ? 'bg-accent-mint/15 border-accent-mint/40 text-on-surface' 
            : 'bg-accent-pink/15 border-accent-pink/40 text-on-surface'
        }`}>
          <div>
            <h3 className={`text-base font-bold font-mono ${
              summary.status === 'Accepted' ? 'text-[#1b5e20]' : 'text-[#9c0032]'
            }`}>
              {summary.status === 'Accepted' ? '✓ Solution Accepted' : `✗ Execution ${summary.status}`}
            </h3>
            <p className="text-on-surface-variant text-xs mt-0.5 font-mono">
              Passed {summary.passed} of {summary.total} test cases
            </p>
          </div>
          <div className="flex space-x-3 text-xs font-mono text-on-surface-variant">
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-secondary" /> {summary.time}
            </div>
            <div className="flex items-center">
              <Cpu className="w-3.5 h-3.5 mr-1 text-on-surface-variant" /> {summary.memory}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2.5 pb-2">
        {results && results.map((res, idx) => (
          <div key={idx} className="bg-surface-paper p-3.5 rounded-lg border border-border-hairline shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-on-surface">Test Case {idx + 1}</span>
              {res.passed ? (
                <span className="flex items-center text-[#1b5e20] text-xs font-mono font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-accent-mint"/> Passed
                </span>
              ) : (
                <span className="flex items-center text-[#9c0032] text-xs font-mono font-semibold">
                  <XCircle className="w-3.5 h-3.5 mr-1 text-accent-pink"/> {res.error ? `Failed (${res.error})` : 'Failed'}
                </span>
              )}
            </div>
            
            {res.isHidden ? (
              <div className="text-on-surface-variant italic text-xs mt-1 font-mono">[Hidden Verification Test Case]</div>
            ) : (
              <div className="space-y-1.5 mt-2 text-xs font-mono">
                <div>
                  <div className="text-on-surface-variant text-[11px] mb-0.5">Input:</div>
                  <div className="bg-surface-cream p-2 rounded border border-border-hairline text-on-surface whitespace-pre-wrap">{res.input}</div>
                </div>
                <div>
                  <div className="text-on-surface-variant text-[11px] mb-0.5">Expected Output:</div>
                  <div className="bg-surface-cream p-2 rounded border border-border-hairline text-on-surface whitespace-pre-wrap">{res.expected}</div>
                </div>
                <div>
                  <div className="text-on-surface-variant text-[11px] mb-0.5">Actual Output:</div>
                  <div className={`p-2 rounded border border-border-hairline whitespace-pre-wrap ${
                    res.passed ? 'bg-surface-cream text-on-surface' : 'bg-accent-pink/10 text-[#9c0032] font-semibold'
                  }`}>
                    {res.actual || 'No output'}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
