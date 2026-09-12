import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { getQuestions } from '@/services/questionService';
import { Button } from '../components/ui/button';
import { Clock, CheckSquare, Square, Flag, AlertTriangle, BookOpen, Loader2, LayoutGrid, X } from 'lucide-react';
import toast from 'react-hot-toast';

function parseReadingQuestion(rawText: string): { passage: string | null; questionText: string } {
  if (!rawText) return { passage: null, questionText: '' };

  const matchExcerpt = rawText.match(/(?:Read the excerpt|Passage|Read the following passage)[:\s]*\n*["“]([\s\S]+?)["”]\s*(?:\n+Question:\s*|\n+Q:\s*|\n+)?([\s\S]*)/i);
  if (matchExcerpt) {
    const passage = matchExcerpt[1].trim();
    const prompt = matchExcerpt[2].replace(/^Question:\s*/i, '').trim();
    return { passage, questionText: prompt || 'Based on the passage above, select the most appropriate option.' };
  }

  const splitQuestion = rawText.split(/\n+Question:\s*/i);
  if (splitQuestion.length > 1) {
    const passage = splitQuestion[0].replace(/^(?:Read the excerpt|Passage)[:\s]*/i, '').trim().replace(/^["“]|["”]$/g, '');
    const prompt = splitQuestion.slice(1).join('\nQuestion: ').trim();
    return { passage, questionText: prompt };
  }

  return { passage: null, questionText: rawText };
}

export default function MockTestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['mock-test-questions', id],
    queryFn: async () => {
      const res = await getQuestions({ limit: 25 });
      return res.data || [];
    }
  });

  const questions = (questionsData && questionsData.length > 0) ? questionsData : [
    { _id: 'q0', question: 'Capgemini Assessment Question initializing...', options: ['Option A', 'Option B', 'Option C', 'Option D'] }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [mobileMatrixOpen, setMobileMatrixOpen] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const completeMutation = useMutation({
    mutationFn: (data: any) => mockService.completeMock(id!, data.answers, data.timeSpent),
    onSuccess: () => {
      toast.success('Test submitted successfully');
      navigate(`/mocks/result/${id}`);
    }
  });

  const submitTest = () => {
    const formattedAnswers = Object.entries(answers).map(([qId, ans]) => ({
      questionId: qId,
      selectedAnswer: ans,
      isCorrect: Math.random() > 0.5 // Dummy evaluation
    }));
    
    completeMutation.mutate({
      answers: formattedAnswers,
      timeSpent: (20 * 60) - timeLeft
    });
  };

  const handleConfirmSubmit = () => {
    const unanswered = questions.length - Object.keys(answers).length;
    if (unanswered > 0) {
      if (window.confirm(`You have ${unanswered} unanswered questions. Are you sure you want to submit?`)) {
        submitTest();
      }
    } else {
      submitTest();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="h-dvh flex flex-col bg-surface-cream text-on-surface fixed inset-0 z-50 overflow-hidden">
      {/* Top Bar */}
      <div className="h-14 sm:h-16 border-b border-border-hairline bg-white flex items-center px-3 sm:px-6 justify-between gap-2 shadow-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Question Matrix Trigger */}
          <button
            type="button"
            onClick={() => setMobileMatrixOpen(true)}
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-surface-cream border border-border-hairline text-xs font-mono font-bold text-secondary cursor-pointer touch-manipulation active:scale-95"
            title="Open Question Matrix"
          >
            <LayoutGrid size={14} />
            <span>{currentIndex + 1}/{questions.length}</span>
          </button>

          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-primary-container text-white items-center justify-center font-mono font-bold text-xs">
            OA
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-on-surface">Capgemini Simulation</h2>
            <p className="text-[10px] font-mono text-on-surface-variant">Live Proctoring Active</p>
          </div>
        </div>

        {/* Prominent Timer */}
        <div className={`flex items-center gap-1.5 sm:gap-2 font-mono text-sm sm:text-lg font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border ${
          timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' : 'bg-surface-cream text-secondary border-border-hairline'
        }`}>
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        <Button 
          onClick={handleConfirmSubmit} 
          disabled={completeMutation.isPending} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3 sm:px-5 py-1.5 sm:py-2 cursor-pointer shadow-sm touch-manipulation active:scale-95 h-9"
        >
          {completeMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
          <span>Submit</span>
          <span className="hidden sm:inline ml-1">Assessment</span>
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Left Sidebar - Navigator */}
        <div className="hidden lg:flex w-64 border-r border-border-hairline bg-white flex-col shadow-xs shrink-0">
          <div className="p-4 border-b border-border-hairline">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">Question Matrix</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                let stateClass = 'bg-surface-cream text-zinc-600 border-border-hairline hover:bg-zinc-200';
                if (answers[q._id]) stateClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                if (reviewMarked[q._id]) stateClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                if (currentIndex === idx) stateClass = 'bg-primary-container text-white border-black font-bold shadow-xs';

                return (
                  <button
                    key={q._id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-10 w-full rounded-xl border flex items-center justify-center text-xs font-mono font-semibold transition-all cursor-pointer ${stateClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Legend */}
          <div className="p-4 border-t border-border-hairline text-xs space-y-2 text-on-surface-variant font-mono">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300"></div> Answered</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-surface-cream border border-border-hairline"></div> Unvisited</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-50 border border-amber-300"></div> Marked Review</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-primary-container border border-black"></div> Active Item</div>
          </div>
        </div>

        {/* Mobile Slide-Up Question Matrix Drawer */}
        {mobileMatrixOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
              onClick={() => setMobileMatrixOpen(false)} 
            />
            <div className="relative bg-white rounded-t-3xl border-t border-border-hairline shadow-2xl p-5 max-h-[75vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
                <div className="flex items-center gap-2">
                  <LayoutGrid size={18} className="text-secondary" />
                  <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-on-surface">Question Matrix</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMatrixOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-surface-cream text-muted cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Matrix Grid */}
              <div className="py-4 overflow-y-auto flex-1">
                <div className="grid grid-cols-5 gap-2.5">
                  {questions.map((q, idx) => {
                    let stateClass = 'bg-surface-cream text-zinc-600 border-border-hairline';
                    if (answers[q._id]) stateClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
                    if (reviewMarked[q._id]) stateClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
                    if (currentIndex === idx) stateClass = 'bg-primary-container text-white border-black font-bold shadow-xs';

                    return (
                      <button
                        key={q._id}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setMobileMatrixOpen(false);
                        }}
                        className={`h-11 w-full rounded-xl border flex items-center justify-center text-xs font-mono font-semibold transition-all cursor-pointer touch-manipulation active:scale-95 ${stateClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Compact Legend */}
              <div className="pt-3 border-t border-border-hairline flex items-center justify-between text-[11px] text-on-surface-variant font-mono">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-emerald-500"></div> Done</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-amber-500"></div> Review</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-surface-charcoal"></div> Active</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-zinc-300"></div> Skip</div>
              </div>
            </div>
          </div>
        )}

        {/* Center - Question Area */}
        <div className="flex-1 flex flex-col bg-surface-cream min-w-0">
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {(() => {
                const rawPrompt = (currentQ as any).question || (currentQ as any).text || (currentQ as any).questionText || '';
                const { passage, questionText } = parseReadingQuestion(rawPrompt);
                
                return (
                  <div className="mb-5 sm:mb-6 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold bg-secondary-fixed px-2.5 py-1 rounded-full border border-secondary/20">
                        Item {currentIndex + 1} of {questions.length}
                      </span>
                      {(currentQ as any).topic && (
                        <span className="text-xs font-mono text-on-surface-variant truncate">
                          • {(currentQ as any).topic}
                        </span>
                      )}
                    </div>

                    {passage && (
                      <div className="bg-white border border-border-hairline rounded-2xl p-4 sm:p-5 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase tracking-wider">
                          <BookOpen className="w-4 h-4" />
                          <span>Reading Passage Excerpt</span>
                        </div>
                        <div className="text-sm md:text-base leading-relaxed text-on-surface bg-surface-cream/50 p-3.5 sm:p-4 rounded-xl border border-border-hairline/70 font-serif italic">
                          "{passage}"
                        </div>
                      </div>
                    )}

                    <h3 className="text-lg sm:text-xl md:text-2xl text-on-surface mt-2 font-extrabold tracking-tight leading-snug">
                      {questionText || 'Select the most appropriate answer.'}
                    </h3>
                  </div>
                );
              })()}

              <div className="space-y-2.5 sm:space-y-3">
                {currentQ.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ._id]: opt })}
                    className={`p-3.5 sm:p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 min-h-[48px] touch-manipulation active:scale-98 ${
                      answers[currentQ._id] === opt 
                        ? 'bg-secondary-fixed/30 border-secondary text-on-surface font-semibold shadow-xs' 
                        : 'bg-white border-border-hairline text-on-surface hover:border-zinc-400'
                    }`}
                  >
                    {answers[currentQ._id] === opt ? (
                      <CheckSquare className="w-5 h-5 text-secondary shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-zinc-400 shrink-0" />
                    )}
                    <span className="text-sm sm:text-base font-medium break-words">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-16 sm:h-20 border-t border-border-hairline bg-white flex items-center justify-between px-3 sm:px-8 shadow-xs pb-safe shrink-0">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
              className="rounded-xl text-xs font-semibold px-3 sm:px-4 h-9 sm:h-10 touch-manipulation active:scale-95 cursor-pointer"
            >
              Previous
            </Button>

            <Button 
              variant="outline"
              className={`rounded-xl text-xs font-semibold px-2.5 sm:px-4 h-9 sm:h-10 touch-manipulation active:scale-95 cursor-pointer ${
                reviewMarked[currentQ._id] 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setReviewMarked({ ...reviewMarked, [currentQ._id]: !reviewMarked[currentQ._id] })}
            >
              <Flag className="w-3.5 h-3.5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{reviewMarked[currentQ._id] ? 'Unmark Review' : 'Mark for Review'}</span>
              <span className="sm:hidden">{reviewMarked[currentQ._id] ? 'Unmark' : 'Review'}</span>
            </Button>

            <Button 
              onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
              disabled={currentIndex === questions.length - 1}
              className="bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold px-4 sm:px-5 h-9 sm:h-10 shadow-sm touch-manipulation active:scale-95 cursor-pointer"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
