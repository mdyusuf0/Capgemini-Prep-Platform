import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { getQuestions } from '@/services/questionService';
import { Button } from '../components/ui/button';
import { Clock, CheckSquare, Square, Flag, AlertTriangle, BookOpen, Loader2 } from 'lucide-react';
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
    <div className="h-screen flex flex-col bg-surface-cream text-on-surface fixed inset-0 z-50">
      {/* Top Bar */}
      <div className="h-16 border-b border-border-hairline bg-white flex items-center px-6 justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center font-mono font-bold text-xs">
            OA
          </div>
          <div>
            <h2 className="text-sm font-bold text-on-surface">Capgemini Simulation Engine</h2>
            <p className="text-[11px] font-mono text-on-surface-variant">Live Proctoring Active</p>
          </div>
        </div>

        <div className={`flex items-center gap-2.5 font-mono text-lg font-bold px-4 py-1.5 rounded-full border ${
          timeLeft < 300 ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' : 'bg-surface-cream text-secondary border-border-hairline'
        }`}>
          <Clock className="w-5 h-5" />
          {formatTime(timeLeft)}
        </div>

        <Button onClick={handleConfirmSubmit} disabled={completeMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-5 py-2 cursor-pointer shadow-sm">
          Submit Assessment
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Navigator */}
        <div className="w-64 border-r border-border-hairline bg-white flex flex-col shadow-xs">
          <div className="p-4 border-b border-border-hairline">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">Question Matrix</h3>
          </div>
          <div className="p-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                let stateClass = 'bg-surface-cream text-zinc-600 border-border-hairline hover:bg-zinc-200'; // not visited
                if (answers[q._id]) stateClass = 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'; // answered
                if (reviewMarked[q._id]) stateClass = 'bg-amber-50 text-amber-800 border-amber-300 font-bold'; // review
                if (currentIndex === idx) stateClass = 'bg-primary-container text-white border-black font-bold shadow-xs'; // current

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

        {/* Center - Question Area */}
        <div className="flex-1 flex flex-col bg-surface-cream">
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              {(() => {
                const rawPrompt = (currentQ as any).question || (currentQ as any).text || (currentQ as any).questionText || '';
                const { passage, questionText } = parseReadingQuestion(rawPrompt);
                
                return (
                  <div className="mb-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase tracking-wider text-secondary font-bold bg-secondary-fixed px-2.5 py-1 rounded-full border border-secondary/20">
                        Item {currentIndex + 1} of {questions.length}
                      </span>
                      {(currentQ as any).topic && (
                        <span className="text-xs font-mono text-on-surface-variant">
                          • {(currentQ as any).topic}
                        </span>
                      )}
                    </div>

                    {passage && (
                      <div className="bg-white border border-border-hairline rounded-2xl p-5 space-y-2.5 shadow-xs">
                        <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase tracking-wider">
                          <BookOpen className="w-4 h-4" />
                          <span>Reading Passage Excerpt</span>
                        </div>
                        <div className="text-sm md:text-base leading-relaxed text-on-surface bg-surface-cream/50 p-4 rounded-xl border border-border-hairline/70 font-serif italic">
                          "{passage}"
                        </div>
                      </div>
                    )}

                    <h3 className="text-xl md:text-2xl text-on-surface mt-2 font-extrabold tracking-tight leading-snug">
                      {questionText || 'Select the most appropriate answer.'}
                    </h3>
                  </div>
                );
              })()}

              <div className="space-y-3">
                {currentQ.options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ._id]: opt })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3.5 ${
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
                    <span className="text-sm font-medium">{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-20 border-t border-border-hairline bg-white flex items-center justify-between px-8 shadow-xs">
            <Button 
              variant="outline" 
              onClick={() => setCurrentIndex(c => Math.max(0, c - 1))}
              disabled={currentIndex === 0}
              className="rounded-xl text-xs font-semibold px-4"
            >
              Previous
            </Button>

            <Button 
              variant="outline"
              className={`rounded-xl text-xs font-semibold px-4 ${
                reviewMarked[currentQ._id] 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'text-on-surface-variant'
              }`}
              onClick={() => setReviewMarked({ ...reviewMarked, [currentQ._id]: !reviewMarked[currentQ._id] })}
            >
              <Flag className="w-3.5 h-3.5 mr-2" />
              {reviewMarked[currentQ._id] ? 'Unmark Review' : 'Mark for Review'}
            </Button>

            <Button 
              onClick={() => setCurrentIndex(c => Math.min(questions.length - 1, c + 1))}
              disabled={currentIndex === questions.length - 1}
              className="bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold px-5 shadow-sm"
            >
              Save & Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
