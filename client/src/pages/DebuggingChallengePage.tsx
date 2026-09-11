import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { debuggingService, DebugExecutionResponse } from '../services/debuggingService';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Bug, Lightbulb, Play, ArrowLeft, CheckCircle, XCircle, Terminal, AlertCircle, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function DebuggingChallengePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Live Test Execution states
  const [isTesting, setIsTesting] = useState(false);
  const [executionResult, setExecutionResult] = useState<DebugExecutionResponse | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'results' | 'testcases'>('results');

  const { data: problem, isLoading } = useQuery({
    queryKey: ['debugging-problem', id],
    queryFn: () => debuggingService.getProblemById(id!),
    enabled: !!id
  });

  useEffect(() => {
    if (problem) {
      setCode(problem.buggyCode);
      setResult(null);
      setExecutionResult(null);
      setShowHint(false);
    }
  }, [problem]);

  const handleRunAndTest = async () => {
    if (!id) return;
    setIsTesting(true);
    setConsoleOpen(true);
    setConsoleTab('results');

    try {
      const response = await debuggingService.runCode(id, code);
      setExecutionResult(response);

      if (response.compileOutput) {
        toast.error('Compilation Error. Review compiler console below.', { id: 'comp-err' });
      } else if (response.allPassed) {
        toast.success('All test cases passed!', { id: 'test-pass' });
      } else {
        const passedCount = response.results.filter(r => r.passed).length;
        toast.error(`Passed ${passedCount} of ${response.results.length} test cases`, { id: 'test-fail' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error executing test suite');
    } finally {
      setIsTesting(false);
    }
  };

  const submitMutation = useMutation({
    mutationFn: (fixedCode: string) => debuggingService.submitFix(id!, fixedCode),
    onSuccess: (data) => {
      setResult(data);
      if (data.results) {
        setExecutionResult({
          results: data.results,
          compileOutput: data.compileOutput || null,
          allPassed: data.correct
        });
        setConsoleOpen(true);
        setConsoleTab('results');
      }
      if (data.correct) {
        toast.success('Bug Successfully Fixed!');
      } else {
        toast.error('Correction incomplete. Review test results below.');
      }
    }
  });

  if (isLoading) return <div className="text-on-surface font-mono text-sm p-8">Loading problem...</div>;
  if (!problem) return <div className="text-on-surface font-mono text-sm p-8">Problem not found</div>;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface-cream text-on-surface">
      {/* Header */}
      <div className="h-14 border-b border-border-hairline bg-white flex items-center px-6 justify-between shadow-xs z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/debugging')} className="text-zinc-600 hover:text-black rounded-lg cursor-pointer font-mono text-xs">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
          <div className="h-4 w-px bg-border-hairline hidden md:block"></div>
          <h2 className="text-base font-bold text-on-surface truncate max-w-md">{problem.title}</h2>
          <span className="px-2.5 py-0.5 bg-surface-cream border border-border-hairline rounded-full text-xs text-secondary font-mono font-bold uppercase">
            {problem.language}
          </span>
          <span className="px-2.5 py-0.5 bg-surface-cream border border-border-hairline rounded-full text-xs text-zinc-600 font-mono font-semibold uppercase hidden sm:inline-block">
            {problem.bugType}
          </span>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-2.5">
          <Button 
            onClick={handleRunAndTest}
            disabled={isTesting || submitMutation.isPending}
            variant="outline"
            className="border-border-hairline hover:bg-surface-cream text-on-surface rounded-xl font-bold font-mono text-xs px-3.5 shadow-xs cursor-pointer h-8"
          >
            {isTesting ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-secondary" /> : <Play className="w-3.5 h-3.5 mr-1.5 text-secondary fill-secondary" />}
            {isTesting ? 'Testing...' : 'Run & Test'}
          </Button>

          <Button 
            onClick={() => submitMutation.mutate(code)}
            disabled={submitMutation.isPending || isTesting}
            className="bg-primary-container hover:bg-black text-white rounded-xl font-bold font-mono shadow-sm text-xs px-4 h-8 cursor-pointer"
          >
            {submitMutation.isPending ? 'Verifying...' : 'Submit Fix'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Description & Hints */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-border-hairline bg-white space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-cream border border-border-hairline shadow-xs">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-on-surface-variant text-[11px] font-mono uppercase tracking-wider font-semibold">Bug Classification</h3>
              <p className="text-on-surface font-bold capitalize text-sm">{problem.bugType} • {problem.bugCategory || 'Logical Condition'}</p>
            </div>
          </div>

          <div>
            <div className="text-xs text-on-surface leading-relaxed prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-on-surface prose-p:my-2 prose-pre:bg-surface-cream prose-pre:border prose-pre:border-border-hairline prose-pre:text-on-surface">
              <ReactMarkdown>
                {problem.description}
              </ReactMarkdown>
            </div>
          </div>

          {/* Hint Section */}
          <div>
            <Button 
              variant="outline" 
              onClick={() => setShowHint(!showHint)}
              className="text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 rounded-xl text-xs font-semibold font-mono cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              {showHint ? 'Hide Strategic Hint' : 'Reveal Strategic Hint'}
            </Button>
            
            <AnimatePresence>
              {showHint && problem.hints?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-950 text-xs leading-relaxed font-mono"
                >
                  <ul className="list-disc list-inside space-y-1">
                    {problem.hints.map((hint: string, i: number) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Final Submission Result Banner */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border shadow-xs ${
                  result.correct ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {result.correct ? (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`text-sm font-bold ${result.correct ? 'text-emerald-800' : 'text-red-800'}`}>
                    {result.correct ? 'Bug Successfully Fixed!' : 'Correction Incomplete'}
                  </h3>
                </div>
                <div className="text-xs leading-relaxed text-on-surface font-mono">
                  <p>{result.explanation}</p>
                </div>
                
                {result.correct && (
                  <Button 
                    className="mt-3 bg-primary-container hover:bg-black text-white w-full rounded-xl font-semibold text-xs shadow-sm font-mono cursor-pointer"
                    onClick={() => navigate('/debugging')}
                  >
                    Return to Debugging Hub
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel - Monaco Editor + Bottom Console Drawer */}
        <div className="w-1/2 flex flex-col bg-surface-charcoal overflow-hidden">
          <div className="h-10 bg-primary-container border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono text-white/70">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-accent-mint" />
              <span>TERMINAL IDE: {problem.language.toUpperCase()}</span>
            </div>
            <span className="text-[11px] text-white/50">CAPGEMINI EVALUATOR</span>
          </div>

          {/* Editor */}
          <div className={`transition-all duration-200 ${consoleOpen ? 'h-[55%]' : 'h-[calc(100%-2.5rem)]'}`}>
            <Editor
              height="100%"
              language={
                problem.language === 'cpp' ? 'cpp' : 
                problem.language === 'python' ? 'python' : 
                problem.language === 'java' ? 'java' : 'c'
              }
              theme="paper-charcoal"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 14 },
                scrollBeyondLastLine: false,
                smoothScrolling: true
              }}
            />
          </div>

          {/* Interactive Bottom Console / Test Results Drawer */}
          <div className={`border-t border-border-hairline bg-surface-paper flex flex-col transition-all duration-200 ${consoleOpen ? 'h-[45%]' : 'h-8 overflow-hidden'}`}>
            <div className="h-8 bg-surface-cream border-b border-border-hairline px-4 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setConsoleOpen(true); setConsoleTab('results'); }}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded font-bold cursor-pointer transition-colors ${
                    consoleTab === 'results' ? 'bg-white text-on-surface border border-border-hairline shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Terminal className="w-3 h-3 text-secondary" />
                  Compiler & Test Results
                  {executionResult && (
                    <span className={`w-2 h-2 rounded-full ${executionResult.allPassed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  )}
                </button>

                <button
                  onClick={() => { setConsoleOpen(true); setConsoleTab('testcases'); }}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded font-bold cursor-pointer transition-colors ${
                    consoleTab === 'testcases' ? 'bg-white text-on-surface border border-border-hairline shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Sample Cases ({problem.testCases?.length || 0})
                </button>
              </div>

              <button
                onClick={() => setConsoleOpen(!consoleOpen)}
                className="text-on-surface-variant hover:text-on-surface font-mono text-xs flex items-center gap-1 cursor-pointer"
              >
                {consoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                {consoleOpen ? 'Minimize' : 'Expand Console'}
              </button>
            </div>

            {/* Console Drawer Body */}
            {consoleOpen && (
              <div className="flex-1 p-4 overflow-y-auto text-on-surface font-mono text-xs space-y-3 bg-white">
                {consoleTab === 'results' && (
                  <>
                    {!executionResult && !isTesting && (
                      <div className="text-center py-6 text-on-surface-variant">
                        <Terminal className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                        <p className="font-semibold">Ready to compile and evaluate.</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Click "Run & Test" above to verify your fix against sample test cases.</p>
                      </div>
                    )}

                    {isTesting && (
                      <div className="flex items-center justify-center py-6 text-secondary gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Compiling code with {problem.language.toUpperCase()} compiler...</span>
                      </div>
                    )}

                    {executionResult && !isTesting && (
                      <div className="space-y-3">
                        {/* Compilation Error Alert Box */}
                        {executionResult.compileOutput && (
                          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-950">
                            <div className="flex items-center gap-2 font-bold mb-1 text-red-800">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              COMPILATION / SYNTAX ERROR
                            </div>
                            <pre className="text-[11px] bg-white p-2 rounded border border-red-200 text-red-700 whitespace-pre-wrap font-mono overflow-x-auto">
                              {executionResult.compileOutput}
                            </pre>
                          </div>
                        )}

                        {/* Overall Test Verdict Bar */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between ${
                          executionResult.allPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                        }`}>
                          <div className="flex items-center gap-2 font-bold">
                            {executionResult.allPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span>
                              {executionResult.allPassed 
                                ? '✓ All Test Cases Passed Successfully' 
                                : `✗ ${executionResult.results.filter(r => !r.passed).length} of ${executionResult.results.length} Test Cases Failed`}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold">
                            {executionResult.results.filter(r => r.passed).length} / {executionResult.results.length} Passed
                          </span>
                        </div>

                        {/* Test Cases Output Diff Cards */}
                        <div className="space-y-2">
                          {executionResult.results.map((tc, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-border-hairline bg-surface-cream/50 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-on-surface">Test Case #{idx + 1}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  tc.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {tc.passed ? 'PASSED ✓' : (tc.error || 'FAILED ✗')}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] pt-1">
                                <div>
                                  <span className="text-zinc-500 font-semibold block mb-0.5">Input:</span>
                                  <pre className="bg-white p-1.5 rounded border border-border-hairline text-on-surface whitespace-pre-wrap overflow-x-auto">
                                    {tc.input || '(empty input)'}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-zinc-500 font-semibold block mb-0.5">Expected Output:</span>
                                  <pre className="bg-white p-1.5 rounded border border-border-hairline text-emerald-700 whitespace-pre-wrap overflow-x-auto">
                                    {tc.expected}
                                  </pre>
                                </div>
                                <div>
                                  <span className="text-zinc-500 font-semibold block mb-0.5">Your Output:</span>
                                  <pre className={`p-1.5 rounded border whitespace-pre-wrap overflow-x-auto ${
                                    tc.passed ? 'bg-white border-border-hairline text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                                  }`}>
                                    {tc.actual || '(no output)'}
                                  </pre>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {consoleTab === 'testcases' && (
                  <div className="space-y-3">
                    {problem.testCases && problem.testCases.length > 0 ? (
                      problem.testCases.map((tc, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-border-hairline bg-surface-cream/50 space-y-1.5">
                          <span className="font-bold text-on-surface">Sample Case #{idx + 1}</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-zinc-500 font-semibold block mb-0.5">Input:</span>
                              <pre className="bg-white p-2 rounded border border-border-hairline text-on-surface whitespace-pre-wrap overflow-x-auto">
                                {tc.input || '(empty)'}
                              </pre>
                            </div>
                            <div>
                              <span className="text-zinc-500 font-semibold block mb-0.5">Expected Output:</span>
                              <pre className="bg-white p-2 rounded border border-border-hairline text-emerald-700 whitespace-pre-wrap overflow-x-auto">
                                {tc.expectedOutput}
                              </pre>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-zinc-500 py-4 text-center">No additional sample cases provided for this problem.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
