import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { getQuestions, getTopics, submitAnswer, addBookmark, removeBookmark } from '@/services/questionService';

import QuestionCard from '@/components/practice/QuestionCard';
import ExplanationPanel from '@/components/practice/ExplanationPanel';
import TopicFilter from '@/components/practice/TopicFilter';
import SessionStats from '@/components/practice/SessionStats';

export default function MCQPracticePage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Pagination & Current State
  const [page, setPage] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Timer
  const [timer, setTimer] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  // Answer State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [explanationData, setExplanationData] = useState<{ correct: boolean, explanation: string, whyOthersWrong: string } | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Session Stats
  const [stats, setStats] = useState({ answered: 0, correct: 0, wrong: 0, streak: 0 });

  // Fetch Topics
  const { data: topics = [] } = useQuery({
    queryKey: ['topics', category],
    queryFn: () => getTopics(category || ''),
    enabled: !!category
  });

  // Fetch Questions
  const { data: questionsData, isLoading, isError } = useQuery({
    queryKey: ['questions', category, selectedTopic, selectedDifficulty, page],
    queryFn: () => getQuestions({ 
      category: category, 
      topic: selectedTopic || undefined, 
      difficulty: selectedDifficulty || undefined, 
      page, 
      limit: 10 
    }),
    enabled: !!category
  });

  const questions = questionsData?.data || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Submit Answer Mutation
  const submitMutation = useMutation({
    mutationFn: (answerIdx: number) => submitAnswer(currentQuestion._id, answerIdx),
    onSuccess: (data) => {
      setIsAnswered(true);
      setExplanationData(data);
      
      // Update stats
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
    } else if (page < (questionsData?.totalPages || 1)) {
      setPage(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      toast.success("You've reached the end of available questions!");
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
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
    } catch (err) {
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
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-xl font-semibold">Failed to load questions.</p>
          <button onClick={() => navigate('/practice')} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/practice')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Question Area */}
          <div className="flex-1 lg:w-[70%]">
            {questions.length === 0 ? (
              <div className="bg-surface rounded-2xl p-12 text-center border border-white/5">
                <p className="text-xl text-gray-400 mb-4">No questions found for the selected filters.</p>
                <button 
                  onClick={() => { setSelectedTopic(null); setSelectedDifficulty(null); }}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Clear Filters
                </button>
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
                    totalQuestions={questionsData?.total || 0}
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

                {/* Navigation (Bottom) */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0 && page === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={(!isAnswered && !selectedAnswer) || (currentQuestionIndex === questions.length - 1 && page === questionsData?.totalPages)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Sidebar */}
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
