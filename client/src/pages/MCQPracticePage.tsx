import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { getQuestions, getTopics, submitAnswer, addBookmark, removeBookmark } from '@/services/questionService';
import { cn } from '@/lib/utils';

import QuestionCard from '@/components/practice/QuestionCard';
import ExplanationPanel from '@/components/practice/ExplanationPanel';
import TopicFilter from '@/components/practice/TopicFilter';
import SessionStats from '@/components/practice/SessionStats';

const techCategories = [
  { id: 'all', label: '⚡ All Technical (870 Qs)' },
  { id: 'technical-mcq', label: 'Core C / C++ / Java' },
  { id: 'dsa', label: 'Data Structures & Algo' },
  { id: 'dbms', label: 'DBMS & SQL' },
  { id: 'oops', label: 'OOPs Concepts' },
  { id: 'os', label: 'Operating Systems' },
  { id: 'networks', label: 'Computer Networks' },
  { id: 'cloud', label: 'Cloud Architecture' },
  { id: 'git', label: 'Git & SE' },
];

export default function MCQPracticePage() {
  const { category: routeCategory } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // Active Category (handles /practice/mcq, /practice/mcq/dsa, /practice/mcq/sql-dbms, etc.)
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (routeCategory === 'sql-dbms') return 'dbms';
    return routeCategory || 'all';
  });

  useEffect(() => {
    if (routeCategory) {
      setSelectedCategory(routeCategory === 'sql-dbms' ? 'dbms' : routeCategory);
    }
  }, [routeCategory]);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Pagination & Question Index
  const [page, setPage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Timer
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, page]);

  // Answer State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanationData, setExplanationData] = useState<{ correct: boolean, explanation: string, whyOthersWrong: string } | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Session Stats
  const [stats, setStats] = useState({ answered: 0, correct: 0, wrong: 0, streak: 0 });

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setPage(1);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setExplanationData(null);
    setTimer(0);
  };

  // Fetch Topics (Always enabled)
  const { data: topics = [] } = useQuery({
    queryKey: ['topics', selectedCategory],
    queryFn: () => getTopics(selectedCategory === 'all' ? undefined : selectedCategory),
    staleTime: 60 * 1000,
  });

  // Fetch Questions (Always enabled)
  const { data: questionsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['questions', selectedCategory, selectedTopic, selectedDifficulty, page],
    queryFn: () => getQuestions({ 
      category: selectedCategory === 'all' ? undefined : selectedCategory, 
      topic: selectedTopic || undefined, 
      difficulty: selectedDifficulty ? selectedDifficulty.toLowerCase() : undefined, 
      page, 
      limit: 10 
    }),
    staleTime: 60 * 1000,
  });

  const questions = questionsData?.data || [];
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questionsData?.total || 0;
  const totalPages = questionsData?.totalPages || Math.ceil(totalQuestions / 10) || 1;

  // Submit Answer Mutation
  const submitMutation = useMutation({
    mutationFn: (answerIdx: number) => submitAnswer(currentQuestion._id, answerIdx),
    onSuccess: (data) => {
      setIsAnswered(true);
      setExplanationData(data);
      
      setStats(prev => {
        const isCorrect = data.correct;
        return {
          answered: prev.answered + 1,
          correct: prev.correct + (isCorrect ? 1 : 0),
          wrong: prev.wrong + (isCorrect ? 0 : 1),
          streak: isCorrect ? prev.streak + 1 : 0
        };
      });
    },
    onError: () => {
      toast.error("Failed to submit answer. Please try again.");
    }
  });

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setExplanationData(null);
    setTimer(0);
    setIsBookmarked(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (page < totalPages) {
      setPage(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      toast.success("You've reached the end of available questions in this section!");
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setExplanationData(null);
      setTimer(0);
    } else if (page > 1) {
      setPage(prev => prev - 1);
      setCurrentQuestionIndex(9);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setExplanationData(null);
      setTimer(0);
    }
  };

  const toggleBookmark = async () => {
    if (!currentQuestion) return;
    try {
      if (isBookmarked) {
        await removeBookmark('Question', currentQuestion._id);
        toast.success("Removed from bookmarks");
      } else {
        await addBookmark('Question', currentQuestion._id);
        toast.success("Added to bookmarks");
      }
      setIsBookmarked(!isBookmarked);
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer !== null && currentQuestion) {
      submitMutation.mutate(selectedAnswer);
    }
  };

  const accuracy = stats.answered > 0 ? (stats.correct / stats.answered) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center text-on-surface">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-3 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-on-surface-variant font-mono text-sm">Loading Capgemini Assessment Ledger...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center text-on-surface p-4">
        <div className="text-center space-y-4 max-w-md bg-surface-paper p-8 rounded-xl border border-border-hairline shadow-sm">
          <p className="text-[#9c0032] text-lg font-semibold">Unable to fetch assessment questions</p>
          <p className="text-on-surface-variant text-sm">Please make sure the server telemetry is operational.</p>
          <div className="flex justify-center gap-3 pt-2">
            <button 
              onClick={() => refetch()} 
              className="px-5 py-2 bg-primary hover:bg-surface-charcoal text-on-primary rounded-lg font-medium text-sm transition-colors cursor-pointer"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/practice')} 
              className="px-5 py-2 bg-surface-cream border border-border-hairline hover:bg-surface-paper text-on-surface rounded-lg font-medium text-sm transition-colors cursor-pointer"
            >
              Back to Practice Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-surface-paper rounded-xl border border-border-hairline p-4 md:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                onClick={() => navigate('/practice')}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors text-xs font-mono font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Practice Hub
              </button>
              <span className="text-border-hairline">/</span>
              <span className="font-label-caps text-label-caps uppercase px-2 py-0.5 rounded bg-surface-cream text-on-surface-variant border border-border-hairline">
                MODULE: SEC:01
              </span>
              <span className="font-mono text-xs text-secondary font-medium">[POOL: CAPGEMINI-EXCELLER]</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">Capgemini Technical MCQ</h1>
              <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-surface-charcoal text-white rounded">
                ROUND 1.1 FOCUS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-surface-cream border border-border-hairline px-3 py-1.5 rounded-lg text-xs font-mono text-on-surface-variant">
              Available: <span className="font-bold text-on-surface">{totalQuestions}</span> Qs
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {techCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold whitespace-nowrap transition-all border cursor-pointer",
                selectedCategory === cat.id
                  ? "bg-primary-container text-on-primary border-primary-container shadow-xs"
                  : "bg-surface-paper border-border-hairline text-on-surface-variant hover:text-on-surface hover:bg-surface-cream"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Question Area */}
          <div className="flex-1 lg:w-[70%] space-y-6">
            {questions.length === 0 ? (
              <div className="bg-surface-paper rounded-xl p-12 text-center border border-border-hairline shadow-xs space-y-4">
                <p className="text-lg font-medium text-on-surface">No questions found for the selected filters.</p>
                <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                  Try clearing topic/difficulty filters or selecting a different category from above.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button 
                    onClick={() => { 
                    setSelectedTopic(null); 
                    setSelectedDifficulty(null); 
                    setSelectedCategory('all');
                    setPage(1);
                    setCurrentQuestionIndex(0);
                  }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-surface-charcoal text-on-primary font-medium text-sm rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" /> Reset Filters
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentQuestion && (
                  <QuestionCard 
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    isAnswered={isAnswered}
                    onSelectAnswer={setSelectedAnswer}
                    onSubmit={handleSubmit}
                    onBookmark={toggleBookmark}
                    isBookmarked={isBookmarked}
                    questionNumber={(page - 1) * 10 + currentQuestionIndex + 1}
                    totalQuestions={totalQuestions}
                    timer={timer}
                  />
                )}

                {isAnswered && explanationData && currentQuestion && (
                  <ExplanationPanel 
                    isCorrect={explanationData.correct}
                    explanation={explanationData.explanation}
                    whyOthersWrong={explanationData.whyOthersWrong}
                    topic={currentQuestion.topic}
                    onNext={handleNext}
                  />
                )}

                {/* Navigation (Bottom Deck) */}
                <div className="bg-surface-paper rounded-xl border border-border-hairline p-3 shadow-xs flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0 && page === 1}
                    className="flex items-center gap-1 px-4 py-1.5 bg-surface-cream hover:bg-surface-paper border border-border-hairline disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors text-xs font-medium cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <div className="text-xs text-on-surface-variant font-mono">
                    Page {page} of {totalPages}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === questions.length - 1 && page === totalPages}
                    className="flex items-center gap-1 px-4 py-1.5 bg-primary hover:bg-surface-charcoal disabled:opacity-40 disabled:cursor-not-allowed text-on-primary rounded-lg transition-colors text-xs font-medium shadow-xs cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Stats & Filters */}
          <div className="w-full lg:w-[30%] space-y-6">
            <SessionStats 
              answered={stats.answered}
              correct={stats.correct}
              wrong={stats.wrong}
              accuracy={accuracy}
              streak={stats.streak}
            />

            <TopicFilter 
              topics={topics}
              selectedTopic={selectedTopic}
              onSelectTopic={(t) => { setSelectedTopic(t); setPage(1); setCurrentQuestionIndex(0); }}
              difficulties={['Easy', 'Medium', 'Hard']}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={(d) => { setSelectedDifficulty(d); setPage(1); setCurrentQuestionIndex(0); }}
              onReset={() => {
                setSelectedTopic(null);
                setSelectedDifficulty(null);
                setPage(1);
                setCurrentQuestionIndex(0);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
