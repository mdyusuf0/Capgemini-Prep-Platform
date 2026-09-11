import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { debuggingService } from '../services/debuggingService';
import Editor from '@monaco-editor/react';
import { Button } from '../components/ui/button';
import { Timer, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TimedDebuggingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<any>(null);

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

  useEffect(() => {
    if (problems && problems[currentIndex] && answers[problems[currentIndex]._id] === undefined) {
      setAnswers(prev => ({
        ...prev,
        [problems[currentIndex]._id]: problems[currentIndex].buggyCode
      }));
    }
  }, [problems, currentIndex]);

  const handleSubmit = async () => {
    setIsSubmitted(true);
    let score = 0;
    const finalResults = [];

    toast.loading('Evaluating your fixes...', { id: 'eval' });
    
    for (const prob of problems!) {
      const code = answers[prob._id] || prob.buggyCode;
      try {
        const res = await debuggingService.submitFix(prob._id, code);
        if (res.correct) score++;
        finalResults.push({ problem: prob, correct: res.correct, explanation: res.explanation });
      } catch (e) {
        finalResults.push({ problem: prob, correct: false, explanation: 'Error evaluating.' });
      }
    }
    
    toast.dismiss('eval');
    setResults({ score, total: problems!.length, details: finalResults });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="text-on-surface font-mono text-sm p-8">Loading timed set...</div>;
  if (!problems || problems.length === 0) return <div className="text-on-surface font-mono text-sm p-8">No problems available.</div>;

  if (isSubmitted && results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-on-surface">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
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
            <div key={idx} className={`p-5 rounded-2xl border ${res.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-on-surface">Q{idx + 1}: {res.problem.title}</h4>
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${res.correct ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                  {res.correct ? 'PASSED' : 'FAILED'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">{res.explanation}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/debugging')} className="bg-primary-container text-white hover:bg-black rounded-xl font-semibold shadow-sm px-6">
            Back to Debugging Hub
          </Button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-surface-cream text-on-surface">
      {/* Top Bar */}
      <div className="h-14 border-b border-border-hairline bg-white flex items-center px-6 justify-between shadow-xs z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-surface-cream px-2.5 py-1 rounded-full border border-border-hairline text-on-surface">
            Item {currentIndex + 1} of {problems.length}
          </span>
          <span className="text-sm font-bold text-on-surface hidden md:inline">{currentProblem.title}</span>
        </div>
        <div className={`flex items-center gap-2 font-mono text-sm font-bold px-3 py-1 rounded-full border ${timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-surface-cream text-secondary border-border-hairline'}`}>
          <Timer className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
        <Button onClick={handleSubmit} variant="destructive" className="rounded-xl font-bold text-xs px-4">
          Submit Test
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 p-6 overflow-y-auto border-r border-border-hairline bg-white flex flex-col justify-between shadow-xs">
          <div>
            <div className="inline-block px-2 py-0.5 text-xs font-mono font-semibold rounded bg-surface-cream text-zinc-700 border border-border-hairline mb-2">
              {currentProblem.language.toUpperCase()} • {currentProblem.bugType}
            </div>
            <h3 className="text-lg font-extrabold text-on-surface mb-3 tracking-tight">{currentProblem.title}</h3>
            <p className="text-xs text-on-surface-variant whitespace-pre-wrap leading-relaxed">{currentProblem.description}</p>
          </div>
          
          <div className="mt-6 flex justify-between items-center bg-surface-cream border border-border-hairline p-3 rounded-xl">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
              className="rounded-lg text-xs"
            >
              Previous
            </Button>
            <span className="text-xs font-mono text-zinc-500">
              {currentIndex + 1} / {problems.length}
            </span>
            <Button 
              onClick={() => setCurrentIndex(c => Math.min(problems.length - 1, c + 1))}
              disabled={currentIndex === problems.length - 1}
              className="bg-primary-container text-white hover:bg-black rounded-lg text-xs"
            >
              Next Question
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col bg-surface-charcoal">
          <div className="h-8 bg-primary-container border-b border-white/10 px-4 flex items-center justify-between text-xs font-mono text-white/60">
            <span>TERMINAL IDE: {currentProblem.language.toUpperCase()}</span>
            <span>CAPGEMINI SIMULATOR</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage={
                currentProblem.language === 'cpp' ? 'cpp' : 
                currentProblem.language === 'python' ? 'python' : 
                currentProblem.language === 'java' ? 'java' : 'c'
              }
              theme="vs-dark"
              value={answers[currentProblem._id] || currentProblem.buggyCode}
              onChange={(val) => setAnswers(prev => ({ ...prev, [currentProblem._id]: val || '' }))}
              options={{ minimap: { enabled: false }, fontSize: 13, padding: { top: 12 } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
