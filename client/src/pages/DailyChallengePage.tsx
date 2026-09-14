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
      let list: DailyItem[] = [];
      try {
        const res = await api.get('/questions/daily-sprint?limit=50');
        list = res.data?.data || res.data || [];
      } catch {
        const res = await api.get('/questions?limit=50');
        list = res.data?.data || res.data || [];
      }

      // Strict client-side deduplication safeguard
      const seen = new Set<string>();
      const deduplicated: DailyItem[] = [];
      for (const q of list) {
        const clean = (q.question || '').replace(/^\[[^\]]+\]\s*/i, '').trim();
        const key = clean.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          deduplicated.push({
            ...q,
            question: clean
          });
        }
      }
      return deduplicated;
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
      if (selectedAnswers[idx] !== undefined && Number(selectedAnswers[idx]) === Number(q.answer)) correct++;
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
    <div className="p-8 max-w-4xl mx-auto text-on-surface space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed border border-secondary/20 flex items-center justify-center text-on-secondary-fixed">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-on-surface tracking-tight">Daily 50-Question Velocity Sprint</h1>
            <p className="text-xs text-on-surface-variant">Rapid evaluation protocol across core assessment modules.</p>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="text-right">
            <span className="text-[10px] text-on-surface-variant block uppercase font-mono font-bold tracking-wider">Remaining</span>
            <span className="text-xl font-black font-mono text-on-surface flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-secondary" />
              {formatTime(timeLeft)}
            </span>
          </div>

          {!submitted ? (
            <button
              onClick={() => setSubmitted(true)}
              className="px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Submit Sprint
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-mono font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Score: {score}/{questions.length}
            </div>
          )}
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white border border-border-hairline rounded-2xl p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border-hairline pb-4">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-surface-cream text-secondary border border-border-hairline rounded-lg text-xs font-bold uppercase font-mono">
                {currentQ.category}
              </span>
              <span className="text-xs text-on-surface-variant font-mono">• {currentQ.topic}</span>
            </div>
            <span className="text-xs text-on-surface-variant font-mono font-semibold">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>

          <h2 className="text-lg font-bold text-on-surface leading-relaxed tracking-tight">
            {currentQ.question}
          </h2>

          {/* Options */}
          <div className="space-y-3 pt-1">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIndex] === oIdx;
              const isCorrect = Number(currentQ.answer) === oIdx;
              let style = 'bg-white hover:bg-surface-cream border-border-hairline hover:border-zinc-400 text-on-surface';

              if (submitted) {
                if (isCorrect) style = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs';
                else if (isSelected) style = 'bg-red-50 border-red-400 text-red-950';
                else style = 'bg-surface-cream opacity-50 border-border-hairline text-zinc-400';
              } else if (isSelected) {
                style = 'bg-secondary-fixed/40 border-secondary text-on-surface font-semibold shadow-xs';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelect(oIdx)}
                  disabled={submitted}
                  className={`w-full p-4 rounded-xl border text-left text-xs md:text-sm flex items-center justify-between transition-all cursor-pointer ${style}`}
                >
                  <span className="leading-snug">{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 ml-2" />}
                  {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {submitted && (
            <div className="p-4 bg-surface-cream border border-border-hairline rounded-xl space-y-1.5 text-xs text-on-surface">
              <span className="font-mono font-bold text-secondary uppercase tracking-wider text-[11px] block">Architectural Rationale:</span>
              <p className="leading-relaxed text-on-surface-variant">{currentQ.explanation}</p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border-hairline">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => i - 1)}
              className="px-4 py-2 bg-surface-cream hover:bg-zinc-200 disabled:opacity-30 border border-border-hairline rounded-xl text-xs font-semibold text-on-surface transition-colors cursor-pointer"
            >
              ← Previous
            </button>
            <button
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(i => i + 1)}
              className="px-5 py-2 bg-primary-container hover:bg-black disabled:opacity-30 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
