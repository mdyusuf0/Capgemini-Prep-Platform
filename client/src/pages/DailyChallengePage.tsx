import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Target, Timer, CheckCircle2, XCircle, ArrowRight, Award, Zap } from 'lucide-react';
import api from '@/services/api';

interface DailyItem {
  _id: string;
  question: string;
  category: string;
  topic: string;
  options: string[];
  answer: number;
  explanation: string;
}

export default function DailyChallengePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
  const [submitted, setSubmitted] = useState(false);

  const { data: questions, isLoading } = useQuery<DailyItem[]>({
    queryKey: ['daily-50-challenge'],
    queryFn: async () => {
      // Fetch mixed 50 questions across categories
      const res = await api.get('/questions?limit=50');
      return res.data?.data || res.data || [];
    }
  });

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || submitted) return;
    const interval = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelect = (optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const calculateScore = () => {
    if (!questions) return 0;
    let correct = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) correct++;
    });
    return correct;
  };

  if (isLoading || !questions) {
    return (
      <div className="flex items-center justify-center p-16 text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const score = calculateScore();

  return (
    <div className="p-8 max-w-4xl mx-auto text-white space-y-6">
      {/* Top Banner */}
      <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Daily 50 Question Sprint</h1>
            <p className="text-xs text-gray-400">Simulate daily assessment pressure across core Capgemini sections.</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-xs text-gray-500 block uppercase font-mono">Time Remaining</span>
            <span className="text-2xl font-bold font-mono text-amber-400 flex items-center gap-1.5">
              <Timer className="w-5 h-5 text-amber-400" />
              {formatTime(timeLeft)}
            </span>
          </div>

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg"
            >
              Submit Sprint
            </button>
          ) : (
            <div className="px-4 py-2 bg-green-950/40 border border-green-500/50 rounded-xl text-green-300 text-sm font-bold flex items-center gap-2">
              <Award className="w-4 h-4" /> Score: {score}/{questions.length}
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold uppercase font-mono">
                {currentQ.category}
              </span>
              <span className="text-xs text-gray-400 font-mono">• {currentQ.topic}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <h2 className="text-lg font-medium text-white leading-relaxed">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIndex] === oIdx;
              const isCorrect = currentQ.answer === oIdx;
              let style = 'bg-[#0a0a0a] hover:bg-[#161622] border-gray-800 text-gray-300';

              if (submitted) {
                if (isCorrect) style = 'bg-green-950/40 border-green-500 text-green-300 font-semibold';
                else if (isSelected) style = 'bg-red-950/40 border-red-500 text-red-300';
                else style = 'bg-[#0a0a0a] opacity-40 border-gray-800 text-gray-600';
              } else if (isSelected) {
                style = 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(oIdx)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {submitted && (
            <div className="p-4 bg-[#14141e] border border-gray-800 rounded-xl space-y-2 text-xs text-gray-300">
              <span className="font-bold text-indigo-400">Explanation:</span>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => i - 1)}
              className="px-4 py-2 bg-[#0a0a0a] hover:bg-[#161622] disabled:opacity-30 border border-gray-800 rounded-xl text-xs font-semibold text-gray-300"
            >
              ← Previous
            </button>
            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(i => i + 1)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Next Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
