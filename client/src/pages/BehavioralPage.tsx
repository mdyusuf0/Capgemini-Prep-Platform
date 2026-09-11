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
    <div className="p-6 md:p-8 max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 text-white">
      {/* Left side: SJT Scenario */}
      <div className="flex-1 space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-2">
            <span>✨ Capgemini Prep By Yusuf</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Situational Judgment Test (Round 1.4)</h1>
          <p className="text-gray-400 text-sm">Evaluate your alignment with Capgemini's 7 Core Values and Adept Essentials profile.</p>
        </div>

        {isLoading ? (
          <div className="bg-[#1e1e2e] p-12 rounded-xl border border-gray-800 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-gray-400">Loading situational judgment scenarios...</p>
          </div>
        ) : currentScenario ? (
          <div className="bg-[#1e1e2e] p-6 md:p-8 rounded-xl border border-gray-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="inline-block bg-indigo-900/50 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/30">
                Scenario {currentIndex + 1} of {questions.length}: {currentScenario.topic || 'Workplace Scenario'}
              </span>
              <span className="text-xs text-gray-400">Capgemini Adept Essentials</span>
            </div>

            <h2 className="text-lg md:text-xl text-white font-medium leading-relaxed">
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
                        ? 'bg-emerald-900/30 border-emerald-500 text-emerald-100 font-medium'
                        : selectedAnswer === i 
                          ? 'bg-rose-900/30 border-rose-500 text-rose-100'
                          : 'bg-[#0a0a0a] border-gray-800 text-gray-500 opacity-50'
                      : selectedAnswer === i
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-[#0a0a0a] border-gray-700 hover:border-indigo-500 hover:bg-indigo-900/20 text-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              ))}
            </div>

            {showResults && (
              <div className="p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-xl space-y-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  {submissionResult?.correct ? (
                    <CheckCircle2 className="text-emerald-400 w-5 h-5" />
                  ) : (
                    <XCircle className="text-rose-400 w-5 h-5" />
                  )}
                  <h3 className="text-base font-bold text-white">
                    {submissionResult?.correct ? 'Optimal Value Alignment' : 'Sub-Optimal Choice'}
                  </h3>
                </div>
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed">
                  {submissionResult?.explanation || currentScenario.explanation}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="bg-[#0a0a0a] text-indigo-300 border border-indigo-800/60 px-3 py-1 rounded-full text-xs">
                    Values: Team Spirit, Honesty, Modesty
                  </span>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
                    +15 Value Score
                  </span>
                </div>
                <button 
                  onClick={handleNext}
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20"
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
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-indigo-400" />
            Your Value Profile
          </h3>
          
          <div className="space-y-4">
            {DIMENSIONS.map((dim, i) => {
              const currentScore = scores[dim.name] ?? 0;
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1 text-gray-300">
                    <span className="flex items-center gap-2">{dim.icon} {dim.name}</span>
                    <span className="text-indigo-400 font-mono font-bold">{currentScore}%</span>
                  </div>
                  <div className="h-2 bg-[#0a0a0a] rounded-full overflow-hidden border border-gray-800">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
                      style={{ width: `${currentScore}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-xs font-semibold text-gray-400 mb-3">Capgemini's 7 Core Values</h4>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['Honesty', 'Boldness', 'Trust', 'Freedom', 'Fun', 'Modesty', 'Team Spirit'].map(v => (
                <span key={v} className="bg-indigo-900/30 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-900/50 text-[11px]">
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
