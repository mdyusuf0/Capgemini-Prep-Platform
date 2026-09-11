import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProblemById, submitSolution, runCode, TestCaseResult, SubmissionResponse } from '@/services/codingService';
import { MonacoEditor } from '@/components/coding/MonacoEditor';
import { TestResults } from '@/components/coding/TestResults';
import { Play, Send, ArrowLeft, Loader2, Lightbulb, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export const CodingProblemPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState<'java'|'cpp'|'python'|'c'>('java');
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<'testcases'|'results'>('testcases');
  const [customInput, setCustomInput] = useState('');
  
  const [testResults, setTestResults] = useState<TestCaseResult[]>([]);
  const [submissionSummary, setSubmissionSummary] = useState<SubmissionResponse | null>(null);

  const { data: problem, isLoading: isProblemLoading } = useQuery({
    queryKey: ['codingProblem', id],
    queryFn: () => getProblemById(id!),
    enabled: !!id
  });

  // Load starter code when problem or language changes
  useEffect(() => {
    if (problem && problem.starterCode) {
      setCode(problem.starterCode[language] || '');
    }
  }, [problem, language]);

  const runMutation = useMutation({
    mutationFn: (isSubmit: boolean) => {
      if (isSubmit) {
        return submitSolution(id!, code, language);
      } else {
        return runCode(id!, code, language, customInput.trim() ? customInput : undefined);
      }
    },
    onSuccess: (data: any, isSubmit) => {
      setActiveTab('results');
      if (isSubmit) {
        const subData = data as SubmissionResponse;
        setTestResults(subData.results);
        setSubmissionSummary(subData);
        if (subData.status === 'Accepted') {
          toast.success('Solution Accepted!');
        } else {
          toast.error(`Submission Failed: ${subData.status}`);
        }
      } else {
        setTestResults(data);
        setSubmissionSummary(null);
        toast.success('Execution completed');
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Execution error');
    }
  });

  if (isProblemLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-8">
        Problem not found.
      </div>
    );
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-[#0a0a0a]">
      {/* Top Action Bar */}
      <div className="h-14 border-b border-gray-800 px-6 flex items-center justify-between bg-[#1e1e2e]/50">
        <button 
          onClick={() => navigate('/coding')}
          className="flex items-center text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Problems
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => runMutation.mutate(false)}
            disabled={runMutation.isPending}
            className="flex items-center px-4 py-2 border border-gray-700 hover:bg-[#2a2a3e] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {runMutation.isPending && !runMutation.variables ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2 text-green-400" />
            )}
            Run Code
          </button>
          
          <button
            onClick={() => runMutation.mutate(true)}
            disabled={runMutation.isPending}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {runMutation.isPending && runMutation.variables ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Submit
          </button>
        </div>
      </div>

      {/* Split Pane */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Description */}
        <div className="w-1/2 border-r border-gray-800 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs border ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
              </span>
              <div className="flex gap-2">
                {problem.topics?.map((t: string) => (
                  <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-gray-800 text-gray-400">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>

            <div className="space-y-4">
              {problem.examples?.map((ex: any, i: number) => (
                <div key={i} className="bg-[#1e1e2e] p-4 rounded-lg border border-gray-800">
                  <h4 className="font-semibold text-white mb-2">Example {i + 1}:</h4>
                  <div className="font-mono text-sm space-y-1">
                    <div><span className="text-gray-500">Input:</span> <br/> <pre className="bg-[#0a0a0a] p-2 rounded mt-1">{ex.input}</pre></div>
                    <div><span className="text-gray-500">Output:</span> <br/> <pre className="bg-[#0a0a0a] p-2 rounded mt-1">{ex.output}</pre></div>
                    {ex.explanation && <div><span className="text-gray-500">Explanation:</span> <div className="mt-1 text-gray-300">{ex.explanation}</div></div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-white">Constraints:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {problem.constraints?.map((c: string, i: number) => (
                  <li key={i} className="font-mono text-sm bg-gray-800/50 inline-block px-2 py-0.5 rounded">{c}</li>
                ))}
              </ul>
            </div>

            {problem.hints && problem.hints.length > 0 && (
              <details className="group border border-gray-800 rounded-lg bg-[#1e1e2e]">
                <summary className="flex items-center cursor-pointer p-3 font-medium text-white">
                  <Lightbulb className="w-5 h-5 text-yellow-500 mr-2" />
                  Hints
                </summary>
                <div className="p-4 pt-0 border-t border-gray-800 space-y-2">
                  {problem.hints.map((hint: string, i: number) => (
                    <div key={i} className="text-sm text-gray-300">
                      <span className="font-bold mr-2">Hint {i + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
              </details>
            )}
            
          </div>
        </div>

        {/* Right Pane: Editor & Output */}
        <div className="w-1/2 flex flex-col bg-[#1e1e2e]">
          
          {/* Editor Header */}
          <div className="h-12 border-b border-gray-800 flex items-center px-4 bg-[#0a0a0a]">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-[#1e1e2e] border border-gray-700 text-sm rounded px-3 py-1.5 text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python 3</option>
              <option value="c">C</option>
            </select>
            
            <button 
              onClick={() => setCode(problem.starterCode[language] || '')}
              className="ml-auto text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Reset to Starter Code
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-[400px]">
            <MonacoEditor code={code} language={language} onChange={(val?: string) => setCode(val || '')} />
          </div>

          {/* Console / Test Cases */}
          <div className="h-64 border-t border-gray-800 flex flex-col bg-[#0a0a0a]">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-800">
              <button 
                onClick={() => setActiveTab('testcases')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'testcases' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-[#1e1e2e]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Test Cases
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'results' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-[#1e1e2e]' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Test Results
                {submissionSummary?.status === 'Accepted' && <CheckCircle2 className="w-3 h-3 text-green-500"/>}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'testcases' ? (
                <div className="space-y-4 h-full flex flex-col">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Custom Input (Optional)</label>
                    <textarea 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter custom input here..."
                      className="w-full h-32 bg-[#1e1e2e] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>
                  {problem.testCases && problem.testCases.filter((t: any) => !t.isHidden).length > 0 && (
                     <div className="text-sm text-gray-500">
                        Or run against {problem.testCases.filter((t: any) => !t.isHidden).length} visible test cases.
                     </div>
                  )}
                </div>
              ) : (
                <TestResults 
                  results={testResults} 
                  summary={submissionSummary ? {
                    status: submissionSummary.status,
                    passed: submissionSummary.testCasesPassed,
                    total: submissionSummary.totalTestCases,
                    time: submissionSummary.executionTime,
                    memory: submissionSummary.memoryUsed
                  } : undefined} 
                />
              )}
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
};
