import React, { useState } from 'react';
import { BookOpen, Edit3, Type, FileText, CheckCircle, AlignLeft, ArrowLeft, ChevronRight, CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, submitAnswer } from '@/services/questionService';
import toast from 'react-hot-toast';

const SECTIONS = [
  { id: 'all', title: 'All Topics', icon: <Sparkles />, description: 'Comprehensive English communication practice questions.' },
  { id: 'Grammar', title: 'Grammar & Syntax', icon: <Edit3 />, description: 'Tenses, subject-verb agreement, conditionals.' },
  { id: 'Sentence', title: 'Sentence Correction', icon: <CheckCircle />, description: 'Spot the error, choose grammatically correct structure.' },
  { id: 'Prepositions', title: 'Prepositions & Articles', icon: <AlignLeft />, description: 'Prepositions of time, place, and article usage.' },
  { id: 'Vocabulary', title: 'Vocabulary & Idioms', icon: <Type />, description: 'Synonyms, antonyms, contextual meaning.' },
  { id: 'Reading', title: 'Reading Comprehension', icon: <BookOpen />, description: 'Inference, main ideas, and passage evaluation.' },
];

export const CommunicationPage: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [sessionScore, setSessionScore] = useState(0);

  const queryClient = useQueryClient();

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['communication-questions', selectedSection],
    queryFn: () => getQuestions({
      category: 'communication',
      topic: selectedSection === 'all' ? undefined : selectedSection || undefined,
      limit: 20
    }),
    enabled: !!selectedSection
  });

  const questions = questionsData?.data || [];
  const currentQuestion = questions[currentIndex];

  const submitMutation = useMutation({
    mutationFn: (answerIdx: number) => submitAnswer(currentQuestion._id, answerIdx),
    onSuccess: (data) => {
      setIsAnswered(true);
      setResult(data);
      if (data.correct) {
        setSessionScore(s => s + 1);
        toast.success('Correct answer!');
      } else {
        toast.error('Incorrect. Review the explanation.');
      }
      queryClient.invalidateQueries({ queryKey: ['dashboard-progress'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-progress'] });
    },
    onError: () => {
      toast.error('Failed to submit answer');
    }
  });

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setResult(null);
    }
  };

  const handleSelectSection = (id: string) => {
    setSelectedSection(id);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setResult(null);
  };

  if (selectedSection) {
    const sectionInfo = SECTIONS.find(s => s.id === selectedSection) || SECTIONS[0];
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 text-white">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedSection(null)}
            className="text-secondary hover:underline flex items-center gap-2 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Return to Verbal Modules
          </button>
          <div className="flex items-center gap-3 text-xs bg-surface-cream px-3 py-1.5 rounded-full border border-border-hairline font-mono">
            <span className="text-on-surface-variant">Session Velocity:</span>
            <span className="font-bold text-secondary">{sessionScore} pts</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight mb-1">{sectionInfo.title} Practice</h1>
          <p className="text-xs text-on-surface-variant">{sectionInfo.description}</p>
        </div>

        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-border-hairline flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <p className="text-xs font-mono text-on-surface-variant">Loading communication assessment items...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-border-hairline text-center space-y-4 shadow-sm">
            <p className="text-sm text-on-surface-variant">No questions found in this subtopic yet.</p>
            <button 
              onClick={() => handleSelectSection('all')}
              className="px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Practice All Verbal Questions
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-hairline space-y-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant border-b border-border-hairline pb-4 font-mono">
              <span className="font-bold">Item {currentIndex + 1} of {questions.length}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-surface-cream text-secondary border border-border-hairline font-medium">
                {currentQuestion.topic || 'Communication'}
              </span>
            </div>

            <div className="text-lg md:text-xl font-bold text-on-surface leading-relaxed tracking-tight">
              {(currentQuestion as any).questionText || (currentQuestion as any).description || (currentQuestion as any).title}
            </div>

            <div className="space-y-3">
              {currentQuestion.options?.map((opt: string, idx: number) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    disabled={isAnswered || submitMutation.isPending}
                    onClick={() => setSelectedAnswer(idx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs md:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-secondary-fixed/40 border-secondary text-on-surface font-semibold shadow-xs'
                        : 'bg-white border-border-hairline hover:border-zinc-400 hover:bg-surface-cream text-on-surface'
                    }`}
                  >
                    <span className="leading-snug">{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 ml-3 ${
                      isSelected ? 'border-secondary bg-secondary text-white' : 'border-border-hairline bg-surface-cream text-zinc-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                  </button>
                );
              })}
            </div>

            {!isAnswered ? (
              <button
                disabled={selectedAnswer === null || submitMutation.isPending}
                onClick={() => selectedAnswer !== null && submitMutation.mutate(selectedAnswer)}
                className="w-full py-3 bg-primary-container hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Submit Answer'}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result?.correct ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                }`}>
                  {result?.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className={`font-bold text-xs mb-1 ${result?.correct ? 'text-emerald-900' : 'text-red-900'}`}>
                      {result?.correct ? 'Correct! Optimal verbal judgment.' : 'Incorrect Choice'}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {result?.explanation || currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-primary-container hover:bg-black text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                ) : (
                  <div className="text-center p-6 bg-surface-cream rounded-2xl border border-border-hairline">
                    <p className="text-sm font-bold text-on-surface mb-3">🎉 Verbal Assessment Protocol Completed!</p>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="px-6 py-2.5 bg-primary-container hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Return to Topics
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-on-surface">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">English Communication & Verbal Ability</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">Enhance verbal syntax, sentence completion, reading comprehension, and spoken fluency for Capgemini Round 1.2.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <div 
            key={section.id}
            onClick={() => handleSelectSection(section.id)}
            className="bg-white p-6 rounded-2xl border border-border-hairline hover:border-zinc-400 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
          >
            <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-secondary/20">
              {section.icon}
            </div>
            <h3 className="text-base font-bold text-on-surface mb-1.5">{section.title}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
