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
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Sections
          </button>
          <div className="flex items-center gap-3 text-xs bg-surface px-3 py-1.5 rounded-full border border-white/5">
            <span className="text-white/50">Session Score:</span>
            <span className="font-bold text-emerald-400">{sessionScore} pts</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-white mb-1">{sectionInfo.title} Practice</h1>
          <p className="text-sm text-white/50">{sectionInfo.description}</p>
        </div>

        {isLoading ? (
          <div className="bg-surface p-12 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-white/50">Loading communication questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-surface p-12 rounded-2xl border border-white/5 text-center space-y-4">
            <p className="text-white/70">No questions found in this subtopic yet.</p>
            <button 
              onClick={() => handleSelectSection('all')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-sm font-semibold transition-colors"
            >
              Practice All Communication Questions
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="bg-surface p-6 md:p-8 rounded-2xl border border-white/5 space-y-6 shadow-xl">
            <div className="flex items-center justify-between text-xs text-white/50 border-b border-white/5 pb-4">
              <span>Question {currentIndex + 1} of {questions.length}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
                {currentQuestion.topic || 'Communication'}
              </span>
            </div>

            <div className="text-lg md:text-xl font-medium text-white leading-relaxed">
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
                    className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-background-lighter/50 border-white/5 hover:border-white/20 text-white/80'
                    }`}
                  >
                    <span>{opt}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ml-3 ${
                      isSelected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-white/20'
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
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
              >
                {submitMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : 'Submit Answer'}
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                  result?.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {result?.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-sm mb-1 text-white">
                      {result?.correct ? 'Correct! Excellent verbal judgment.' : 'Incorrect'}
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {result?.explanation || currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                {currentIndex < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Next Question <ChevronRight size={16} />
                  </button>
                ) : (
                  <div className="text-center p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-sm font-semibold text-white mb-2">🎉 Communication Practice Completed!</p>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors"
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
    <div className="p-8 max-w-6xl mx-auto space-y-8 text-white">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-2">
          <span>✨ Capgemini Prep By Yusuf</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">English Communication</h1>
        <p className="text-gray-400">Enhance your verbal and written skills for Capgemini's communication assessment (Round 1.2).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTIONS.map((section) => (
          <div 
            key={section.id}
            onClick={() => handleSelectSection(section.id)}
            className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 hover:border-indigo-500 cursor-pointer transition-all hover:-translate-y-1 group shadow-lg"
          >
            <div className="w-12 h-12 bg-indigo-900/50 rounded-lg flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              {section.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{section.title}</h3>
            <p className="text-sm text-gray-400">{section.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
