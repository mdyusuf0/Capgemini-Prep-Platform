import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, ChevronRight, Bookmark, Timer, Flag, 
  CheckCircle, XCircle, ArrowLeft, RotateCcw, ShieldCheck, 
  LineChart, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pseudocodeService, PseudocodeQuestion } from '../services/pseudocodeService';
import CodeBlock from '../components/practice/CodeBlock';
import DryRunTrace from '../components/practice/DryRunTrace';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const PseudocodePracticePage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<PseudocodeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resultInfo, setResultInfo] = useState<{ correct: boolean; correctAnswer: number; explanation: string; dryRunTrace?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimerSeconds(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Session Stats
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    fetchTopics();
    fetchQuestions();
  }, [selectedTopic]);

  const fetchTopics = async () => {
    try {
      const data = await pseudocodeService.getTopics();
      setTopics(['All', ...data]);
    } catch (err) {
      toast.error('Failed to load topics');
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await pseudocodeService.getQuestions({ 
        topic: selectedTopic !== 'All' ? selectedTopic : undefined, 
        limit: 50 
      });
      setQuestions(data.questions);
      setCurrentIndex(0);
      resetState();
    } catch (err) {
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setResultInfo(null);
    setTimerSeconds(0);
    setIsBookmarked(false);
  };

  const currentQ = questions[currentIndex];

  const handleSubmit = async () => {
    if (selectedAnswer === null || !currentQ) return;
    
    try {
      const res = await pseudocodeService.submitAnswer(currentQ._id, selectedAnswer);
      setIsSubmitted(true);
      setResultInfo(res);
      if (res.correct) {
        setCorrectCount(prev => prev + 1);
        toast.success('Correct! Output trace verified.');
      } else {
        setIncorrectCount(prev => prev + 1);
        toast.error('Incorrect! Review the trace evolution.');
      }
    } catch (err) {
      toast.error('Failed to submit answer');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      resetState();
    } else {
      toast.success("You've completed all loaded questions in this topic!");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      resetState();
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center text-on-surface">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-sm text-on-surface-variant">Loading Pseudocode Tracing Engine...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center p-6 text-on-surface">
        <div className="bg-surface-paper border border-border-hairline rounded-xl p-8 max-w-md text-center shadow-sm space-y-4">
          <p className="font-semibold text-lg text-on-surface">No pseudocode problems found.</p>
          <p className="text-xs text-on-surface-variant">Try selecting another topic or resetting filters.</p>
          <button
            onClick={() => setSelectedTopic('All')}
            className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-medium cursor-pointer"
          >
            Show All Topics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        
        {/* Top Meta Ledger Header */}
        <header className="w-full bg-surface-paper border border-border-hairline rounded-xl p-4 md:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => navigate('/practice')}
                className="flex items-center gap-1 text-xs font-mono text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Practice Hub
              </button>
              <span className="text-border-hairline">/</span>
              <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-surface-cream text-on-surface-variant border border-border-hairline">
                MODULE: TRACE-ENGINE
              </span>
              <span className="font-mono text-xs text-secondary font-medium">
                [ID: #PSEUDO-{currentIndex + 1}]
              </span>
              <span className="font-mono text-xs text-on-surface-variant ml-2 font-medium">
                5/5 Capgemini Pool
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
                Pseudocode Tracing & Execution
              </h1>
              <span className={cn(
                "px-2 py-0.5 rounded text-xs font-mono font-bold uppercase",
                currentQ.difficulty === 'easy' ? "bg-accent-mint/20 text-[#1b5e20] border border-accent-mint/30" :
                currentQ.difficulty === 'medium' ? "bg-accent-yellow/30 text-[#7c5e00] border border-accent-yellow/40" :
                "bg-accent-pink/20 text-[#9c0032] border border-accent-pink/30"
              )}>
                {currentQ.difficulty || 'MEDIUM'}
              </span>
            </div>
          </div>

          {/* Filter Pills & System Counters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 bg-surface-cream p-1 rounded-lg border border-border-hairline overflow-x-auto max-w-full">
              {topics.slice(0, 5).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTopic(t)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer",
                    selectedTopic === t
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-charcoal text-on-primary font-mono text-xs font-semibold">
              <Timer className="w-3.5 h-3.5 text-accent-pink animate-pulse" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>
        </header>

        {/* Split IDE Layout (60 / 40) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Workspace (60% -> 7 cols on lg) */}
          <section className="lg:col-span-7 flex flex-col gap-4 min-w-0">
            {/* Terminal IDE Card with Line Numbers & Syntax */}
            <CodeBlock 
              code={currentQ.codeBlock} 
              filename={`trace_problem_${currentIndex + 1}.pseudo`} 
            />

            {/* DryRunTrace Variable State Table Component (when submitted or trace present) */}
            {isSubmitted && resultInfo?.dryRunTrace && (
              <DryRunTrace trace={resultInfo.dryRunTrace} />
            )}

            {/* Default State Inspector Guide (when not submitted yet) */}
            {!isSubmitted && (
              <div className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-4 h-4 text-secondary" />
                    <h3 className="font-semibold text-xs font-mono uppercase tracking-wider text-on-surface">
                      DryRunTrace: State Evolution
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-cream text-on-surface-variant border border-border-hairline">
                    AWAITING SUBMISSION
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Evaluate each iteration manually by tracking variable states through every conditional and bitwise operation. 
                  Submit your prediction on the right to unlock the full step-by-step state evolution table.
                </p>
              </div>
            )}
          </section>

          {/* Right Workspace (40% -> 5 cols on lg) */}
          <aside className="lg:col-span-5 flex flex-col gap-4 min-w-0">
            
            {/* Question Prompt Card */}
            <div className="w-full bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-secondary">
                    Evaluation Prompt
                  </span>
                  <span className="font-mono text-xs text-on-surface-variant">
                    [{currentQ.topic || 'Trace'}]
                  </span>
                </div>
                <h2 className="text-base md:text-lg font-semibold text-on-surface leading-snug">
                  {currentQ.question}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Trace each iteration carefully. Beware of bitwise arithmetic operators masquerading as standard arithmetic.
                </p>
              </div>

              {/* 4 Selectable Option Cards */}
              <div className="flex flex-col gap-2.5">
                {currentQ.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = isSubmitted && resultInfo?.correctAnswer === idx;
                  const isWrong = isSubmitted && isSelected && !isCorrect;

                  let cardStyle = "bg-surface-cream/70 border-border-hairline hover:bg-surface-cream text-on-surface";
                  let badgeStyle = "bg-surface-paper border-border-hairline text-on-surface-variant";

                  if (isSubmitted) {
                    if (isCorrect) {
                      cardStyle = "bg-accent-mint/15 border-accent-mint text-on-surface font-semibold shadow-xs";
                      badgeStyle = "bg-accent-mint text-primary font-bold border-accent-mint";
                    } else if (isWrong) {
                      cardStyle = "bg-accent-pink/15 border-accent-pink text-[#9c0032] font-medium";
                      badgeStyle = "bg-accent-pink text-white font-bold border-accent-pink";
                    } else {
                      cardStyle = "bg-surface-cream/30 border-border-hairline opacity-40 text-on-surface-variant";
                      badgeStyle = "bg-surface-cream text-on-surface-variant/60";
                    }
                  } else if (isSelected) {
                    cardStyle = "bg-primary-container border-primary-container text-on-primary shadow-xs";
                    badgeStyle = "bg-surface-paper text-primary font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isSubmitted}
                      onClick={() => setSelectedAnswer(idx)}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer",
                        cardStyle
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono font-semibold shrink-0 border transition-colors",
                          badgeStyle
                        )}>
                          {letter}
                        </span>
                        <span className="font-mono text-sm font-semibold">
                          {opt}
                        </span>
                      </div>

                      {isSubmitted && isCorrect && (
                        <span className="px-2 py-0.5 rounded bg-accent-mint/20 text-[#1b5e20] text-[10px] font-mono font-bold uppercase tracking-wider">
                          Verified
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Submit Button */}
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className="w-full py-3 bg-primary hover:bg-surface-charcoal disabled:opacity-40 disabled:cursor-not-allowed text-on-primary rounded-xl font-medium text-xs transition-colors shadow-xs cursor-pointer"
                >
                  Submit Trace Prediction
                </button>
              ) : null}

              {/* Inline Cohort Accuracy Metric */}
              <div className="p-3 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <svg className="w-8 h-8 transform -rotate-90 text-secondary shrink-0" viewBox="0 0 36 36">
                    <path 
                      className="text-border-hairline" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3.5"
                    />
                    <path 
                      className="text-secondary" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeDasharray="42, 100" 
                      strokeLinecap="round" 
                      strokeWidth="3.5"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-on-surface-variant font-medium">
                      Cohort Accuracy
                    </span>
                    <span className="font-mono text-xs font-bold text-on-surface">
                      42.6% Solved Correctly
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-accent-pink/20 text-[#9c0032] border border-accent-pink/30 px-2 py-0.5 rounded">
                  High Trap Rate
                </span>
              </div>
            </div>

            {/* Explanation Panel (Expanded Instant Rationale) */}
            {isSubmitted && resultInfo && (
              <div className="w-full bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-border-hairline">
                  <div className="flex items-center gap-1.5">
                    {resultInfo.correct ? (
                      <CheckCircle className="w-4 h-4 text-[#1b5e20]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#9c0032]" />
                    )}
                    <h4 className="font-semibold text-xs font-mono uppercase tracking-wider text-on-surface">
                      Architectural Rationale
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] text-secondary font-semibold">
                    TRACE VERIFIED
                  </span>
                </div>
                <div className="text-xs text-on-surface leading-relaxed whitespace-pre-wrap">
                  {resultInfo.explanation}
                </div>
              </div>
            )}

            {/* Action & Navigation Deck */}
            <div className="w-full bg-surface-paper border border-border-hairline rounded-xl p-3 shadow-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => {
                    setIsBookmarked(!isBookmarked);
                    toast.success(isBookmarked ? "Removed bookmark" : "Bookmarked question");
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-cream hover:bg-surface-paper border border-border-hairline text-on-surface transition-colors text-xs font-medium cursor-pointer"
                  type="button"
                >
                  <Bookmark className={cn("w-3.5 h-3.5", isBookmarked ? "fill-amber-400 text-amber-500" : "")} />
                  <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>
                <button 
                  onClick={() => toast.success("Question flagged for review")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-cream hover:bg-surface-paper border border-border-hairline text-on-surface-variant hover:text-on-surface transition-colors text-xs cursor-pointer"
                  type="button"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Flag</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="p-1.5 rounded-lg bg-surface-cream border border-border-hairline text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-on-surface-variant">
                  {currentIndex + 1}/{questions.length}
                </span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className="h-8 px-4 rounded-lg bg-primary hover:bg-surface-charcoal disabled:opacity-40 text-on-primary transition-colors flex items-center gap-1 text-xs font-medium shadow-xs cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default PseudocodePracticePage;
