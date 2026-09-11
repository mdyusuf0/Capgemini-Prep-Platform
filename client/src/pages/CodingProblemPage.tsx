import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProblemById, submitSolution, runCode, TestCaseResult, SubmissionResponse, RunCodeResponse } from '@/services/codingService';
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
  const [compileOutput, setCompileOutput] = useState<string | null>(null);

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

  const runMutation = useMutation<SubmissionResponse | RunCodeResponse, any, boolean>({
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
        setTestResults(subData.results || []);
        setSubmissionSummary(subData);
        setCompileOutput(subData.compileOutput || null);
        if (subData.status === 'Accepted') {
          toast.success('Solution Accepted! All test cases passed.');
        } else if (subData.status === 'Compilation Error') {
          toast.error('Compilation Error! Review compiler diagnostics below.');
        } else {
          toast.error(`Submission: ${subData.status}`);
        }
      } else {
        const runData = data as { results: TestCaseResult[]; compileOutput: string | null; allPassed: boolean };
        setTestResults(runData.results || []);
        setCompileOutput(runData.compileOutput || null);
        setSubmissionSummary(null);
        if (runData.compileOutput) {
          toast.error('Compilation / Syntax Error!');
        } else if (runData.allPassed) {
          toast.success('All visible test cases passed!');
        } else {
          toast('Tests completed with failures.', { icon: '⚠️' });
        }
      }
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Execution error');
    }
  });

  if (isProblemLoading) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center text-on-surface">
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 animate-spin text-secondary mb-3" />
          <p className="font-mono text-xs text-on-surface-variant">Initializing Coding Environment...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-surface-cream text-on-surface p-8 flex items-center justify-center">
        <div className="bg-surface-paper border border-border-hairline p-8 rounded-xl shadow-xs text-center">
          <p className="font-semibold text-lg">Problem specification not found.</p>
          <button 
            onClick={() => navigate('/coding')}
            className="mt-4 px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-mono"
          >
            Back to Problem Roster
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-accent-mint/20 text-[#1b5e20] border-accent-mint/30';
      case 'medium': return 'bg-accent-yellow/30 text-[#7c5e00] border-accent-yellow/40';
      case 'hard': return 'bg-accent-pink/20 text-[#9c0032] border-accent-pink/30';
      default: return 'bg-surface-cream text-on-surface-variant border-border-hairline';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-surface-cream text-on-surface">
      {/* Top Problem Meta Header Strip */}
      <section className="w-full bg-surface-paper border-b border-border-hairline px-6 py-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center flex-wrap gap-2.5 min-w-0">
            <button 
              onClick={() => navigate('/coding')}
              className="flex items-center text-xs font-mono text-on-surface-variant hover:text-on-surface transition-colors mr-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              Roster
            </button>
            <span className="font-mono text-xs text-on-surface-variant bg-surface-cream border border-border-hairline px-2 py-0.5 rounded">
              ID: {problem._id ? problem._id.slice(-4) : '074'}
            </span>
            <h1 className="text-base md:text-lg font-bold text-on-surface tracking-tight truncate max-w-md">
              {problem.title}
            </h1>
            <span className={`text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded border ${getDifficultyColor(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-surface-cream border border-border-hairline text-on-surface-variant hidden sm:inline-block">
              {problem.topics?.[0] || 'Algorithms'}
            </span>
          </div>

          {/* Quick Benchmark Metrics & Run Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 font-mono text-xs text-on-surface-variant border-r border-border-hairline pr-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                <span>1000ms</span>
              </div>
              <div className="flex items-center gap-1">
                <span>256MB</span>
              </div>
              <div className="flex items-center gap-1 text-[#1b5e20] font-semibold">
                <span>68.2% Acpt.</span>
              </div>
            </div>

            <button
              onClick={() => runMutation.mutate(false)}
              disabled={runMutation.isPending}
              className="flex items-center px-3.5 py-1.5 bg-surface-cream hover:bg-surface-paper border border-border-hairline text-on-surface text-xs font-mono font-semibold rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {runMutation.isPending && !runMutation.variables ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-secondary" />
              ) : (
                <Play className="w-3.5 h-3.5 mr-1.5 text-secondary fill-current" />
              )}
              Run Code
            </button>
            
            <button
              onClick={() => runMutation.mutate(true)}
              disabled={runMutation.isPending}
              className="flex items-center px-4 py-1.5 bg-primary hover:bg-surface-charcoal text-on-primary text-xs font-mono font-semibold rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {runMutation.isPending && runMutation.variables ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 mr-1.5" />
              )}
              Submit Solution
            </button>
          </div>
        </div>
      </section>

      {/* Split-Pane Engineering Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Pane: Description & Specifications (45%) */}
        <div className="w-[45%] border-r border-border-hairline bg-surface-paper overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-secondary">
                Problem Specification
              </span>
              <div className="flex gap-1.5">
                {problem.topics?.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded text-[11px] font-mono bg-surface-cream border border-border-hairline text-on-surface-variant">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-on-surface leading-relaxed font-sans">
              <ReactMarkdown>{problem.description}</ReactMarkdown>
            </div>

            {/* Benchmark Visual Insight */}
            <div className="p-3.5 bg-surface-cream rounded-lg border border-border-hairline flex flex-col gap-2 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="text-on-surface-variant uppercase font-medium">Runtime Ceiling Target</span>
                <span className="font-bold text-on-surface">O(N log N) · ≤ 24ms</span>
              </div>
              <div className="w-full bg-border-hairline h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-3">
              {problem.examples?.map((ex: any, i: number) => (
                <div key={i} className="bg-surface-cream p-4 rounded-xl border border-border-hairline">
                  <h4 className="font-bold text-xs font-mono text-on-surface mb-2 uppercase tracking-wider">Example {i + 1}</h4>
                  <div className="font-mono text-xs space-y-2">
                    <div>
                      <span className="text-on-surface-variant font-semibold">Input:</span>
                      <pre className="bg-surface-paper p-2 rounded border border-border-hairline mt-1 text-on-surface overflow-x-auto">{ex.input}</pre>
                    </div>
                    <div>
                      <span className="text-on-surface-variant font-semibold">Output:</span>
                      <pre className="bg-surface-paper p-2 rounded border border-border-hairline mt-1 text-secondary font-bold overflow-x-auto">{ex.output}</pre>
                    </div>
                    {ex.explanation && (
                      <div>
                        <span className="text-on-surface-variant font-semibold">Explanation:</span>
                        <div className="mt-1 text-on-surface leading-relaxed text-xs">{ex.explanation}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs font-mono text-on-surface uppercase tracking-wider">Constraints & Invariants:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {problem.constraints?.map((c: string, i: number) => (
                  <li key={i} className="font-mono text-xs text-on-surface bg-surface-cream px-2 py-0.5 rounded border border-border-hairline inline-block mr-2 mb-1">
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hints */}
            {problem.hints && problem.hints.length > 0 && (
              <details className="group border border-border-hairline rounded-xl bg-surface-cream overflow-hidden">
                <summary className="flex items-center cursor-pointer p-3 font-mono text-xs font-semibold text-on-surface">
                  <Lightbulb className="w-4 h-4 text-amber-500 mr-2" />
                  Editorial Hints ({problem.hints.length})
                </summary>
                <div className="p-3.5 pt-1 border-t border-border-hairline space-y-2 bg-surface-paper">
                  {problem.hints.map((hint: string, i: number) => (
                    <div key={i} className="text-xs text-on-surface-variant leading-relaxed">
                      <span className="font-mono font-bold text-on-surface mr-1">Hint {i + 1}:</span> {hint}
                    </div>
                  ))}
                </div>
              </details>
            )}
            
          </div>
        </div>

        {/* Right Pane: Monaco Editor & Output Console (55%) */}
        <div className="w-[55%] flex flex-col bg-surface-charcoal">
          
          {/* Editor Header Bar */}
          <div className="h-10 border-b border-white/10 flex items-center justify-between px-4 bg-primary-container text-on-primary">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-pink inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-accent-yellow inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-accent-mint inline-block"></span>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-surface-charcoal border border-white/10 text-xs font-mono rounded px-2.5 py-1 text-white focus:outline-none cursor-pointer"
              >
                <option value="java">Java (OpenJDK 17)</option>
                <option value="cpp">C++ (GCC 12.2)</option>
                <option value="python">Python 3 (3.11)</option>
                <option value="c">C (Clang 15)</option>
              </select>
            </div>
            
            <button 
              onClick={() => setCode(problem.starterCode[language] || '')}
              className="text-[11px] font-mono text-on-primary-container hover:text-white transition-colors cursor-pointer"
            >
              Reset Starter Code
            </button>
          </div>

          {/* Monaco Editor Canvas */}
          <div className="flex-1 min-h-[350px]">
            <MonacoEditor code={code} language={language} onChange={(val?: string) => setCode(val || '')} />
          </div>

          {/* Monaco Status Bar */}
          <div className="bg-primary-container px-4 py-1 flex items-center justify-between text-on-surface-variant font-mono text-[11px] border-t border-white/5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-mint"></span>Monaco v0.45</span>
              <span>Spaces: 4</span>
              <span>UTF-8</span>
            </div>
            <span className="text-secondary-fixed">[JUDGE0 CLUSTER ACTIVE]</span>
          </div>

          {/* Console / Test Results Deck */}
          <div className="h-64 border-t border-border-hairline flex flex-col bg-surface-paper">
            
            {/* Tabs Bar */}
            <div className="flex border-b border-border-hairline bg-surface-cream/80">
              <button 
                onClick={() => setActiveTab('testcases')}
                className={`px-4 py-2 text-xs font-mono font-semibold transition-colors cursor-pointer ${
                  activeTab === 'testcases' 
                    ? 'text-on-surface border-b-2 border-primary bg-surface-paper' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Test Cases
              </button>
              <button 
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'results' 
                    ? 'text-on-surface border-b-2 border-primary bg-surface-paper' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Execution Results
                {submissionSummary?.status === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-accent-mint"/>}
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-surface-paper">
              {activeTab === 'testcases' ? (
                <div className="space-y-3 h-full flex flex-col font-mono text-xs">
                  <div>
                    <label className="block text-on-surface-variant font-medium mb-1.5 uppercase tracking-wider text-[11px]">
                      Custom Input Vector (Optional)
                    </label>
                    <textarea 
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="Enter custom input here..."
                      className="w-full h-28 bg-surface-cream border border-border-hairline rounded-lg p-2.5 text-xs text-on-surface font-mono focus:outline-none focus:border-secondary resize-none"
                    />
                  </div>
                  {problem.testCases && problem.testCases.filter((t: any) => !t.isHidden).length > 0 && (
                     <div className="text-[11px] text-on-surface-variant">
                        Running against {problem.testCases.filter((t: any) => !t.isHidden).length} visible assertion test cases.
                     </div>
                  )}
                </div>
              ) : (
                <TestResults 
                  results={testResults} 
                  compileOutput={compileOutput}
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
