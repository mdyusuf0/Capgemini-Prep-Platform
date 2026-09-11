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

  if (isLoading) return <div className="text-white p-8">Loading timed set...</div>;
  if (!problems || problems.length === 0) return <div className="text-white p-8">No problems available.</div>;

  if (isSubmitted && results) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-white">
        <h2 className="text-3xl font-bold mb-8 text-center">Timed Debugging Results</h2>
        <div className="bg-[#1e1e2e] p-8 rounded-xl border border-gray-800 text-center mb-8">
          <div className="text-6xl font-bold text-indigo-500 mb-2">
            {results.score} / {results.total}
          </div>
          <p className="text-gray-400">Bugs Fixed</p>
        </div>

        <div className="space-y-4">
          {results.details.map((res: any, idx: number) => (
            <div key={idx} className={`p-4 rounded-lg border ${res.correct ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <h4 className="font-semibold mb-2">Q{idx + 1}: {res.problem.title}</h4>
              <p className="text-sm text-gray-300">{res.explanation}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/debugging')} className="bg-indigo-600">Back to Debugging</Button>
        </div>
      </div>
    );
  }

  const currentProblem = problems[currentIndex];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-800 bg-[#1e1e2e] flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Question {currentIndex + 1} of {problems.length}</h2>
        </div>
        <div className={`flex items-center gap-2 font-mono text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-indigo-400'}`}>
          <Timer className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>
        <Button onClick={handleSubmit} variant="destructive">
          Submit Test
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/3 p-6 overflow-y-auto border-r border-gray-800 bg-[#0a0a0a] flex flex-col">
          <h3 className="text-xl font-semibold text-white mb-4">{currentProblem.title}</h3>
          <p className="text-gray-300 whitespace-pre-wrap flex-grow">{currentProblem.description}</p>
          
          <div className="mt-6 flex justify-between items-center bg-[#1e1e2e] p-4 rounded-lg">
             <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentIndex(c => Math.min(problems.length - 1, c + 1))}
              disabled={currentIndex === problems.length - 1}
            >
              Next Question
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 flex flex-col">
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
            options={{ minimap: { enabled: false }, fontSize: 14 }}
          />
        </div>
      </div>
    </div>
  );
}
