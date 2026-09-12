import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { debuggingService, DebugExecutionResponse } from '../services/debuggingService';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Timer, Play, Loader2, CheckCircle, XCircle, AlertCircle, Terminal, Lightbulb, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function TimedDebuggingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

  // Live Test Execution states
  const [isTesting, setIsTesting] = useState(false);
  const [testResultsMap, setTestResultsMap] = useState<Record<string, DebugExecutionResponse>>({});
  const [questionStatusMap, setQuestionStatusMap] = useState<Record<string, 'untested' | 'passed' | 'failed'>>({});
  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'results' | 'testcases'>('results');
  const [showHint, setShowHint] = useState(false);

  const { data: problems, isLoading } = useQuery({
    queryKey: ['timed-debugging'],
    queryFn: () => debuggingService.getTimedSet(),
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (isLoading || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, isSubmitted]);

  const [languageMap, setLanguageMap] = useState<Record<string, 'python' | 'cpp' | 'java'>>({});

  useEffect(() => {
    if (problems && problems[currentIndex]) {
      const p = problems[currentIndex];
      const defaultLang: 'python' | 'cpp' | 'java' = languageMap[p._id] || 
        (p.variants?.python ? 'python' : p.language === 'cpp' ? 'cpp' : p.language === 'java' ? 'java' : 'python');

      if (!languageMap[p._id]) {
        setLanguageMap(prev => ({ ...prev, [p._id]: defaultLang }));
      }

      if (answers[p._id] === undefined) {
        const initialCode = p.variants?.[defaultLang]?.buggyCode || p.buggyCode;
        setAnswers(prev => ({
          ...prev,
          [p._id]: initialCode
        }));
      }
    }
    setShowHint(false);
  }, [problems, currentIndex]);

  const currentProblem = problems ? problems[currentIndex] : null;
  const currentLang = currentProblem ? (languageMap[currentProblem._id] || 'python') : 'python';
  const currentCode = currentProblem ? (answers[currentProblem._id] || currentProblem.variants?.[currentLang]?.buggyCode || currentProblem.buggyCode) : '';
  const currentExecution = currentProblem ? testResultsMap[currentProblem._id] : null;

  const handleLanguageChange = (newLang: 'python' | 'cpp' | 'java') => {
    if (!currentProblem || newLang === currentLang) return;
    setLanguageMap(prev => ({ ...prev, [currentProblem._id]: newLang }));
    const newCode = currentProblem.variants?.[newLang]?.buggyCode || currentProblem.buggyCode;
    setAnswers(prev => ({ ...prev, [currentProblem._id]: newCode }));
  };

  const handleRunAndTest = async () => {
    if (!currentProblem) return;
    setIsTesting(true);
    setConsoleOpen(true);
    setConsoleTab('results');

    try {
      const response = await debuggingService.runCode(currentProblem._id, currentCode, currentLang);
      setTestResultsMap(prev => ({ ...prev, [currentProblem._id]: response }));
      setQuestionStatusMap(prev => ({
        ...prev,
        [currentProblem._id]: response.allPassed ? 'passed' : 'failed'
      }));

      if (response.compileOutput) {
        toast.error('Compilation Error. Review compiler console below.', { id: 'comp-err' });
      } else if (response.allPassed) {
        toast.success('All test cases passed! Fix verified.', { id: 'test-pass' });
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

  const handleSubmit = async () => {
    if (!problems || problems.length === 0) return;
    setIsSubmitted(true);
    let score = 0;
    const finalResults = [];

    toast.loading('Evaluating and grading your fixes...', { id: 'eval' });
    
    for (const prob of problems) {
      const probLang = languageMap[prob._id] || (prob.variants?.python ? 'python' : prob.language || 'python');
      const code = answers[prob._id] || prob.variants?.[probLang]?.buggyCode || prob.buggyCode;
      try {
        const res = await debuggingService.submitFix(prob._id, code, probLang);
        if (res.correct) score++;
        finalResults.push({ problem: prob, correct: res.correct, explanation: res.explanation });
      } catch (e) {
        finalResults.push({ problem: prob, correct: false, explanation: 'Evaluation error.' });
      }
    }
    
    toast.dismiss('eval');
    setResults({ score, total: problems.length, details: finalResults });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-cream text-on-surface">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="font-mono text-xs text-on-surface-variant font-semibold">Initializing Capgemini Timed Debugging Environment...</p>
        </div>
      </div>
    );
  }

  if (!problems || problems.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-cream text-on-surface p-8">
        <div className="bg-white border border-border-hairline p-8 rounded-2xl shadow-sm text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base mb-1">No Debugging Challenges Available</h3>
          <p className="text-xs text-on-surface-variant mb-4">The timed assessment question bank is currently being updated.</p>
          <Button onClick={() => navigate('/debugging')} className="bg-primary-container text-white text-xs font-mono">
            Return to Debugging Hub
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted && results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-on-surface">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-cream border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
            <span>⏱️ ASSESSMENT EVALUATION REPORT</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Timed Debugging Results</h2>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-border-hairline text-center mb-8 shadow-sm">
          <div className="text-6xl font-black text-secondary mb-2 font-mono">
            {results.score} / {results.total}
          </div>
          <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">Bugs Successfully Verified & Fixed</p>
        </div>

        <div className="space-y-4">
          {results.details.map((res: any, idx: number) => (
            <div key={idx} className={`p-5 rounded-2xl border shadow-xs ${res.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-on-surface">Q{idx + 1}: {res.problem.title}</h4>
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${res.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {res.correct ? 'PASSED ✓' : 'FAILED ✗'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed font-mono">{res.explanation}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/debugging')} className="bg-primary-container text-white hover:bg-black rounded-xl font-semibold shadow-sm px-6 text-xs font-mono">
            Return to Debugging Arena
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface-cream text-on-surface">
      {/* Top Assessment Navigation & Control Bar */}
      <div className="h-14 border-b border-border-hairline bg-white flex items-center px-6 justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-surface-cream px-2.5 py-1 rounded-full border border-border-hairline text-on-surface">
            Item {currentIndex + 1} of {problems.length}
          </span>
          <span className="text-sm font-bold text-on-surface hidden md:inline truncate max-w-sm">
            {currentProblem?.title}
          </span>
          {questionStatusMap[currentProblem?._id || ''] === 'passed' && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
              <CheckCircle className="w-3 h-3 text-emerald-600" /> Verified
            </span>
          )}
          {questionStatusMap[currentProblem?._id || ''] === 'failed' && (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-300 px-2 py-0.5 rounded-md">
              <XCircle className="w-3 h-3 text-red-600" /> Issues Found
            </span>
          )}
        </div>

        {/* Quick Question Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs">
          {problems.map((p, idx) => {
            const st = questionStatusMap[p._id];
            const isCur = idx === currentIndex;
            return (
              <button
                key={p._id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer ${
                  isCur 
                    ? 'bg-primary-container text-white shadow-xs' 
                    : st === 'passed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : st === 'failed'
                        ? 'bg-red-100 text-red-800 border border-red-300'
                        : 'bg-surface-cream border border-border-hairline text-zinc-600 hover:border-zinc-400'
                }`}
                title={`Q${idx + 1}: ${p.title}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 font-mono text-xs font-bold px-3 py-1.5 rounded-full border ${timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' : 'bg-surface-cream text-secondary border-border-hairline'}`}>
            <Timer className="w-3.5 h-3.5" />
            {formatTime(timeLeft)}
          </div>
          <Button onClick={handleSubmit} variant="destructive" className="rounded-xl font-bold text-xs px-4 py-1.5 cursor-pointer shadow-xs font-mono">
            Submit Assessment
          </Button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Statement, Specs, Examples & Strategic Hints */}
        <div className="w-1/2 p-6 overflow-y-auto border-r border-border-hairline bg-white flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold rounded bg-surface-cream text-secondary border border-border-hairline uppercase">
                {currentProblem?.language}
              </span>
              <span className="inline-block px-2 py-0.5 text-xs font-mono font-medium rounded bg-surface-cream text-zinc-700 border border-border-hairline uppercase">
                {currentProblem?.bugType}
              </span>
              {currentProblem?.difficulty && (
                <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase rounded bg-surface-cream text-zinc-600 border border-border-hairline">
                  {currentProblem.difficulty}
                </span>
              )}
            </div>

            <h3 className="text-lg font-extrabold text-on-surface tracking-tight">
              {currentProblem?.title}
            </h3>

            {/* Markdown rendered problem description */}
            <div className="text-xs text-on-surface leading-relaxed prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-on-surface prose-p:my-2 prose-pre:bg-surface-cream prose-pre:border prose-pre:border-border-hairline prose-pre:text-on-surface">
              <ReactMarkdown>
                {currentProblem?.description || ''}
              </ReactMarkdown>
            </div>

            {/* Strategic Hint Accordion */}
            {currentProblem?.hints && currentProblem.hints.length > 0 && (
              <div className="pt-2">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                  {showHint ? 'Hide Strategic Hint' : 'Reveal Strategic Hint'}
                  {showHint ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
                </button>
                {showHint && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1 font-mono">
                    <ul className="list-disc list-inside space-y-1">
                      {currentProblem.hints.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Bottom Left Navigation Deck */}
          <div className="mt-6 pt-4 border-t border-border-hairline flex justify-between items-center bg-surface-cream/40 -mx-6 -mb-6 p-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
              className="rounded-lg text-xs font-mono cursor-pointer"
            >
              Previous
            </Button>
            <span className="text-xs font-mono text-zinc-500 font-bold">
              {currentIndex + 1} / {problems.length}
            </span>
            <Button 
              onClick={() => setCurrentIndex(c => Math.min(problems.length - 1, c + 1))}
              disabled={currentIndex === problems.length - 1}
              className="bg-primary-container text-white hover:bg-black rounded-lg text-xs font-mono cursor-pointer shadow-xs"
            >
              Next Question
            </Button>
          </div>
        </div>

        {/* Right Panel: Terminal Monaco IDE + Interactive Test Results Drawer */}
        <div className="w-1/2 flex flex-col bg-surface-charcoal overflow-hidden">
          {/* IDE Action Header Bar */}
          <div className="h-11 bg-primary-container border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono text-white/70">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
                <span className="text-[10px] text-white/40 uppercase tracking-wider px-1 font-bold">Lang:</span>
                {(['python', 'cpp', 'java'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold transition-all cursor-pointer ${
                      currentLang === lang
                        ? 'bg-white text-on-surface shadow-xs'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : 'Java'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Run & Test Code Button */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRunAndTest}
                disabled={isTesting}
                size="sm"
                className="bg-accent-mint text-primary-container hover:bg-[#8ef0a2] font-mono font-bold text-xs rounded-lg px-3 py-1 h-7 flex items-center gap-1.5 cursor-pointer shadow-xs transition-all active:scale-95"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Compiling...
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Run Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Monaco Editor Container */}
          <div className={`transition-all duration-200 ${consoleOpen ? 'h-[55%]' : 'h-[calc(100%-2.75rem)]'}`}>
            <Editor
              height="100%"
              language={currentLang === 'cpp' ? 'cpp' : currentLang === 'java' ? 'java' : 'python'}
              theme="paper-charcoal"
              value={currentCode}
              onChange={(val) => setAnswers(prev => ({ ...prev, [currentProblem!._id]: val || '' }))}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: 13, 
                padding: { top: 12 },
                fontFamily: 'JetBrains Mono, monospace',
                scrollBeyondLastLine: false,
                smoothScrolling: true
              }}
            />
          </div>

          {/* Interactive Bottom Console / Test Results Drawer */}
          <div className={`border-t border-border-hairline bg-surface-paper flex flex-col transition-all duration-200 ${consoleOpen ? 'h-[45%]' : 'h-8 overflow-hidden'}`}>
            {/* Console Bar Tabs */}
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
                  {currentExecution && (
                    <span className={`w-2 h-2 rounded-full ${currentExecution.allPassed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  )}
                </button>

                <button
                  onClick={() => { setConsoleOpen(true); setConsoleTab('testcases'); }}
                  className={`flex items-center gap-1.5 py-1 px-2 rounded font-bold cursor-pointer transition-colors ${
                    consoleTab === 'testcases' ? 'bg-white text-on-surface border border-border-hairline shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Sample Cases ({currentProblem?.testCases?.length || 0})
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
                    {!currentExecution && !isTesting && (
                      <div className="text-center py-6 text-on-surface-variant">
                        <Terminal className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                        <p className="font-semibold">Ready to compile and evaluate.</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">Click "Run & Test Code" above to check your fix against sample test cases.</p>
                      </div>
                    )}

                    {isTesting && (
                      <div className="flex items-center justify-center py-6 text-secondary gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Compiling code with {currentProblem?.language.toUpperCase()} compiler...</span>
                      </div>
                    )}

                    {currentExecution && !isTesting && (
                      <div className="space-y-3">
                        {/* Compilation Error Alert Box */}
                        {currentExecution.compileOutput && (
                          <div className="p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-950">
                            <div className="flex items-center gap-2 font-bold mb-1 text-red-800">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              COMPILATION / SYNTAX ERROR
                            </div>
                            <pre className="text-[11px] bg-white p-2 rounded border border-red-200 text-red-700 whitespace-pre-wrap font-mono overflow-x-auto">
                              {currentExecution.compileOutput}
                            </pre>
                          </div>
                        )}

                        {/* Overall Test Verdict Bar */}
                        <div className={`p-3 rounded-xl border flex items-center justify-between ${
                          currentExecution.allPassed ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
                        }`}>
                          <div className="flex items-center gap-2 font-bold">
                            {currentExecution.allPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span>
                              {currentExecution.allPassed 
                                ? '✓ All Test Cases Passed Successfully' 
                                : `✗ ${currentExecution.results.filter(r => !r.passed).length} of ${currentExecution.results.length} Test Cases Failed`}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold">
                            {currentExecution.results.filter(r => r.passed).length} / {currentExecution.results.length} Passed
                          </span>
                        </div>

                        {/* Test Cases Output Diff Cards */}
                        <div className="space-y-2">
                          {currentExecution.results.map((tc, idx) => (
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
                    {currentProblem?.testCases && currentProblem.testCases.length > 0 ? (
                      currentProblem.testCases.map((tc, idx) => (
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

