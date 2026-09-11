import { TestCaseResult } from '../../services/codingService';
import { CheckCircle, XCircle, Clock, Cpu } from 'lucide-react';

interface TestResultsProps {
  results: TestCaseResult[];
  summary?: {
    status: string;
    passed: number;
    total: number;
    time: string;
    memory: string;
  };
}

export const TestResults = ({ results, summary }: TestResultsProps) => {
  if (!results || results.length === 0) return null;

  return (
    <div className="flex flex-col h-full space-y-4">
      {summary && (
        <div className={`p-4 rounded-lg flex items-center justify-between \${summary.status === 'Accepted' ? 'bg-green-900/20 border border-green-800' : 'bg-red-900/20 border border-red-800'}`}>
          <div>
            <h3 className={`text-lg font-bold \${summary.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}`}>
              {summary.status}
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Passed {summary.passed} of {summary.total} test cases
            </p>
          </div>
          <div className="flex space-x-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {summary.time}
            </div>
            <div className="flex items-center">
              <Cpu className="w-4 h-4 mr-1" /> {summary.memory}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {results.map((res, idx) => (
          <div key={idx} className="bg-[#1e1e2e] p-4 rounded-md border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-200">Test Case {idx + 1}</span>
              {res.passed ? (
                <span className="flex items-center text-green-400 text-sm"><CheckCircle className="w-4 h-4 mr-1"/> Passed</span>
              ) : (
                <span className="flex items-center text-red-400 text-sm"><XCircle className="w-4 h-4 mr-1"/> Failed</span>
              )}
            </div>
            
            {res.isHidden ? (
              <div className="text-gray-500 italic text-sm mt-2">Hidden Test Case</div>
            ) : (
              <div className="space-y-2 mt-3 text-sm font-mono">
                <div>
                  <div className="text-gray-500 mb-1">Input:</div>
                  <div className="bg-[#0a0a0a] p-2 rounded text-gray-300 whitespace-pre-wrap">{res.input}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Expected Output:</div>
                  <div className="bg-[#0a0a0a] p-2 rounded text-gray-300 whitespace-pre-wrap">{res.expected}</div>
                </div>
                <div>
                  <div className="text-gray-500 mb-1">Actual Output:</div>
                  <div className={`bg-[#0a0a0a] p-2 rounded whitespace-pre-wrap \${res.passed ? 'text-gray-300' : 'text-red-400'}`}>
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
