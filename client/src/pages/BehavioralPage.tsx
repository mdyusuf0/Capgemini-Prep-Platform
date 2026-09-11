import React, { useState } from 'react';
import { Target, Users, Shield, Briefcase, Zap, Brain, MessageSquare, CheckCircle2, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, submitAnswer } from '@/services/questionService';
import toast from 'react-hot-toast';

const DIMENSIONS = [
  { name: 'Teamwork', icon: <Users size={16}/> },
  { name: 'Adaptability', icon: <Zap size={16}/> },
  { name: 'Ownership', icon: <Target size={16}/> },
  { name: 'Communication', icon: <MessageSquare size={16}/> },
  { name: 'Problem Solving', icon: <Brain size={16}/> },
  { name: 'Professionalism', icon: <Briefcase size={16}/> },
  { name: 'Integrity', icon: <Shield size={16}/> },
];

export const BehavioralPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({
    'Teamwork': 0,
    'Adaptability': 0,
    'Ownership': 0,
    'Communication': 0,
    'Problem Solving': 0,
    'Professionalism': 0,
    'Integrity': 0,
  });

  const queryClient = useQueryClient();

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['behavioral-questions'],
    queryFn: () => getQuestions({ category: 'behavioral', limit: 20 })
  });

  const questions = questionsData?.data || [];
  const currentScenario = questions[currentIndex];

  const submitMutation = useMutation({
    mutationFn: (answerIdx: number) => submitAnswer(currentScenario._id, answerIdx),
    onSuccess: (data) => {
      setShowResults(true);
      setSubmissionResult(data);
      if (data.correct) {
        toast.success('Aligned with Capgemini core values!');
        // Boost dimensions
        setScores(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(k => {
            updated[k] = Math.min(100, updated[k] + 15);
          });
          return updated;
        });
      } else {
        toast.error('Not the optimal behavioral response. Read rationale below.');
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-progress'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] });
    }
  });

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
    if (currentScenario) {
      submitMutation.mutate(index);
    }
  };

  const handleNext = () => {
    setShowResults(false);
    setSelectedAnswer(null);
    setSubmissionResult(null);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setCurrentIndex(0);
      toast.success('Completed all situational judgment scenarios!');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 text-on-surface">
      {/* Left side: SJT Scenario */}
      <div className="flex-1 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-2">
            <span>✨ CAPGEMINI PREP BY YUSUF</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-1">Situational Judgment Test (Round 1.4)</h1>
          <p className="text-on-surface-variant text-sm">Evaluate your alignment with Capgemini's 7 Core Values and Adept Essentials corporate profile.</p>
        </div>

        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-border-hairline flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <p className="text-xs font-mono text-on-surface-variant">Loading situational judgment scenarios...</p>
          </div>
        ) : currentScenario ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-hairline shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-surface-cream text-secondary text-xs font-mono font-bold px-3 py-1 rounded-full border border-border-hairline">
                SCENARIO {currentIndex + 1} OF {questions.length}: {currentScenario.topic || 'Workplace Scenario'}
              </span>
              <span className="text-xs font-mono text-on-surface-variant">Adept Essentials</span>
            </div>

            <h2 className="text-lg md:text-xl text-on-surface font-bold leading-relaxed tracking-tight">
              {(currentScenario as any).questionText || (currentScenario as any).description || (currentScenario as any).title}
            </h2>
            
            <div className="space-y-3">
              {currentScenario.options?.map((opt: string, i: number) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  disabled={showResults || submitMutation.isPending}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition-all cursor-pointer ${
                    showResults 
                      ? i === currentScenario.answer
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                        : selectedAnswer === i 
                          ? 'bg-red-50 border-red-400 text-red-950'
                          : 'bg-surface-cream border-border-hairline text-zinc-400 opacity-60'
                      : selectedAnswer === i
                        ? 'bg-secondary-fixed/40 border-secondary text-on-surface font-semibold shadow-xs'
                        : 'bg-white border-border-hairline hover:border-zinc-400 hover:bg-surface-cream text-on-surface'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 border border-border-hairline">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResults && (
              <div className="p-6 bg-surface-cream border border-border-hairline rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  {submissionResult?.correct ? (
                    <CheckCircle2 className="text-emerald-600 w-5 h-5" />
                  ) : (
                    <XCircle className="text-red-600 w-5 h-5" />
                  )}
                  <h3 className="text-base font-bold text-on-surface">
                    {submissionResult?.correct ? 'Optimal Value Alignment' : 'Sub-Optimal Choice'}
                  </h3>
                </div>
                <p className="text-on-surface-variant text-xs md:text-sm leading-relaxed">
                  {submissionResult?.explanation || currentScenario.explanation}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-white text-zinc-700 border border-border-hairline px-3 py-1 rounded-full text-xs font-mono">
                    Values: Team Spirit, Honesty, Modesty
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-mono font-bold">
                    +15 Value Alignment Score
                  </span>
                </div>
                <button 
                  onClick={handleNext}
                  className="mt-4 w-full bg-primary-container hover:bg-black text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  Next Scenario <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Right side: Capgemini Values Radar */}
      <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-6 flex items-center gap-2">
            <Target className="text-secondary w-5 h-5" />
            Your Value Profile
          </h3>
          
          <div className="space-y-4">
            {DIMENSIONS.map((dim, i) => {
              const currentScore = scores[dim.name] ?? 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1 text-on-surface-variant font-medium">
                    <span className="flex items-center gap-2">{dim.icon} {dim.name}</span>
                    <span className="text-secondary font-mono font-bold">{currentScore}%</span>
                  </div>
                  <div className="h-2 bg-surface-cream rounded-full overflow-hidden border border-border-hairline">
                    <div 
                      className="h-full bg-gradient-to-r from-secondary to-primary-container rounded-full transition-all duration-700"
                      style={{ width: `${currentScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-border-hairline">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-3">Capgemini's 7 Core Values</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Honesty', 'Boldness', 'Trust', 'Freedom', 'Fun', 'Modesty', 'Team Spirit'].map(v => (
                <span key={v} className="bg-surface-cream text-zinc-700 px-2.5 py-1 rounded-full border border-border-hairline text-[11px] font-mono font-medium">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
