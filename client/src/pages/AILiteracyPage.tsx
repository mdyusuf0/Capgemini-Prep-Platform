import React, { useState } from 'react';
import { Brain, Shield, Code, Cpu, ShieldAlert, Bot, Sparkles, ArrowLeft, CheckCircle2, XCircle, ChevronRight, Loader2, Database } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQuestions, submitAnswer } from '@/services/questionService';
import toast from 'react-hot-toast';

const TOPICS = [
  { id: 'all', title: 'All AI Topics', icon: <Sparkles className="w-5 h-5" />, description: 'Comprehensive practice across all modern AI literacy topics.' },
  { id: 'LLM Fundamentals', title: 'LLM Fundamentals', icon: <Bot className="w-5 h-5" />, description: 'Transformers, attention mechanisms, context windows, tokens.' },
  { id: 'Prompt Engineering', title: 'Prompt Engineering', icon: <Code className="w-5 h-5" />, description: 'Master zero-shot, few-shot, and chain-of-thought prompt design.' },
  { id: 'RAG', title: 'RAG & Vector Search', icon: <Database className="w-5 h-5" />, description: 'Retrieval augmented generation, embeddings, vector databases.' },
  { id: 'Responsible AI', title: 'Responsible AI & Ethics', icon: <Shield className="w-5 h-5" />, description: 'Algorithmic bias, data privacy, hallucinations, and safety.' },
  { id: 'AI Security', title: 'AI Security & Jailbreaks', icon: <ShieldAlert className="w-5 h-5" />, description: 'Adversarial prompts, prompt injection, and red-teaming.' }
];

export const AILiteracyPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; explanation: string; whyOthersWrong?: string } | null>(null);
  const [sessionScore, setSessionScore] = useState(0);

  const queryClient = useQueryClient();

  const { data: questionsData, isLoading } = useQuery({
    queryKey: ['ai-literacy-questions', selectedTopic],
    queryFn: () => getQuestions({
      category: 'ai-literacy',
      topic: selectedTopic === 'all' ? undefined : selectedTopic || undefined,
      limit: 30
    }),
    enabled: !!selectedTopic
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
        toast.success('Correct! AI Literacy mastery demonstrated.');
      } else {
        toast.error('Incorrect. Review the technical breakdown.');
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

  const handleSelectTopic = (id: string) => {
    setSelectedTopic(id);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setResult(null);
  };

  if (selectedTopic) {
    const topicInfo = TOPICS.find(t => t.id === selectedTopic) || TOPICS[0];
    const questionPrompt = currentQuestion ? (
      currentQuestion.question || 
      (currentQuestion as any).questionText || 
      (currentQuestion as any).description || 
      (currentQuestion as any).title || 
      ''
    ) : '';

    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6 text-on-surface">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="text-secondary hover:underline flex items-center gap-2 text-xs font-mono font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Return to AI Literacy Modules
          </button>
          <div className="flex items-center gap-3 text-xs bg-surface-cream px-3 py-1.5 rounded-full border border-border-hairline font-mono">
            <span className="text-on-surface-variant">Session Score:</span>
            <span className="font-bold text-secondary">{sessionScore} pts</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-on-surface tracking-tight mb-1">{topicInfo.title} Practice</h1>
          <p className="text-xs text-on-surface-variant">{topicInfo.description}</p>
        </div>

        {isLoading ? (
          <div className="bg-white p-12 rounded-2xl border border-border-hairline flex flex-col items-center justify-center space-y-3 shadow-sm">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
            <p className="text-xs font-mono text-on-surface-variant">Loading AI Literacy items from Capgemini bank...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-border-hairline text-center space-y-4 shadow-sm">
            <p className="text-sm text-on-surface-variant">No questions found in this subtopic yet.</p>
            <button 
              onClick={() => handleSelectTopic('all')}
              className="px-5 py-2.5 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Practice All AI Literacy Questions
            </button>
          </div>
        ) : currentQuestion ? (
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-border-hairline space-y-6 shadow-sm">
            <div className="flex items-center justify-between text-xs text-on-surface-variant border-b border-border-hairline pb-4 font-mono">
              <span className="font-bold">Item {currentIndex + 1} of {questions.length}</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-surface-cream text-secondary border border-border-hairline font-medium">
                  {currentQuestion.topic || 'AI Literacy'}
                </span>
                {currentQuestion.subtopic && (
                  <span className="text-on-surface-variant font-medium text-[11px]">
                    • {currentQuestion.subtopic}
                  </span>
                )}
              </div>
            </div>

            <div className="text-lg md:text-xl font-bold text-on-surface leading-relaxed tracking-tight">
              {questionPrompt}
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
                      {result?.correct ? 'Correct! Strong AI conceptual understanding.' : 'Incorrect Choice'}
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      {result?.explanation || currentQuestion.explanation}
                    </p>
                    {result?.whyOthersWrong && (
                      <div className="mt-2 text-[11px] text-zinc-600 bg-white/70 p-2.5 rounded-lg border border-border-hairline">
                        <span className="font-bold text-on-surface">Why alternative options are suboptimal: </span>
                        {result.whyOthersWrong}
                      </div>
                    )}
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
                    <p className="text-sm font-bold text-on-surface mb-3">🎉 AI Literacy Assessment Module Completed!</p>
                    <button
                      onClick={() => setSelectedTopic(null)}
                      className="px-6 py-2.5 bg-primary-container hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Return to AI Topics
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
        <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">AI Literacy & Prompt Engineering</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl">
          Master foundational Generative AI concepts, transformer mechanisms, RAG architectures, prompt techniques, and AI security expected in Capgemini candidate profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => handleSelectTopic(topic.id)}
            className="bg-white p-6 rounded-2xl border border-border-hairline hover:border-zinc-400 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
          >
            <div className="w-12 h-12 bg-secondary-fixed text-on-secondary-fixed rounded-xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-secondary/20">
              {topic.icon}
            </div>
            <h3 className="text-base font-bold text-on-surface mb-1.5">{topic.title}</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
