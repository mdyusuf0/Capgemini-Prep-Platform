import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flame, CheckCircle2, XCircle, ChevronDown, ChevronUp, Sparkles, BookOpen, Filter } from 'lucide-react';
import api from '@/services/api';

interface QuestionItem {
  _id: string;
  question: string;
  category: string;
  topic: string;
  difficulty: string;
  options: string[];
  answer: number;
  explanation: string;
  whyOthersWrong?: string;
  priority: string;
  frequency: string;
}

export default function MustKnowPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const { data: questions, isLoading } = useQuery<QuestionItem[]>({
    queryKey: ['must-know-questions', selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('priority', 'MUST_KNOW');
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      const res = await api.get(`/questions?${params.toString()}`);
      return res.data?.data || res.data || [];
    }
  });

  const categories = [
    { id: 'all', label: 'All Must-Know' },
    { id: 'oops', label: 'OOPs' },
    { id: 'dsa', label: 'DSA' },
    { id: 'dbms', label: 'SQL & DBMS' },
    { id: 'os', label: 'Operating Systems' },
    { id: 'networks', label: 'Networks' },
    { id: 'ai-literacy', label: 'AI Literacy' },
    { id: 'communication', label: 'Communication' }
  ];

  const handleSelectAnswer = (qId: string, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: optIdx }));
    setExpandedId(qId);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface">
          <Flame className="w-3.5 h-3.5 fill-[#fc618d] text-[#fc618d]" />
          <span>HIGH-YIELD RECRUITMENT BENCHMARK</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Capgemini Must-Know Questions</h1>
        <p className="text-on-surface-variant text-sm max-w-2xl leading-relaxed">
          The highest-frequency questions and core patterns reported in recent Capgemini assessment drives. Master these fundamental topics before taking full mocks.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-border-hairline pb-4">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
              selectedCategory === c.id
                ? 'bg-primary-container text-white border-black shadow-xs'
                : 'bg-white hover:bg-surface-cream text-on-surface-variant hover:text-on-surface border-border-hairline'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16 text-on-surface-variant font-mono text-xs">
          <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions && questions.length > 0 ? (
            questions.map((q, idx) => {
              const selectedAns = userAnswers[q._id];
              const isAnswered = selectedAns !== undefined;
              const isExpanded = expandedId === q._id;

              return (
                <div
                  key={q._id}
                  className="bg-white border border-border-hairline hover:border-zinc-400 rounded-2xl p-6 transition-all shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[10px] font-bold font-mono">
                          MUST KNOW
                        </span>
                        <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold">{q.category} • {q.topic}</span>
                      </div>
                      <h3 className="text-base font-bold text-on-surface pt-1 leading-snug">{idx + 1}. {q.question}</h3>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedAns === oIdx;
                      const isCorrect = Number(q.answer) === oIdx;
                      let btnStyle = 'bg-white hover:bg-surface-cream border-border-hairline hover:border-zinc-400 text-on-surface';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold shadow-xs';
                        } else if (isChosen) {
                          btnStyle = 'bg-red-50 border-red-400 text-red-950';
                        } else {
                          btnStyle = 'bg-surface-cream opacity-50 border-border-hairline text-zinc-400';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(q._id, oIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span className="leading-snug">{opt}</span>
                          {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />}
                          {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 border-t border-border-hairline flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="text-xs text-secondary hover:underline font-bold font-mono flex items-center gap-1 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? 'Hide Architectural Analysis' : 'View Concept & Analysis'}</span>
                    </button>
                    <span className="text-xs text-on-surface-variant font-mono">Frequency: Very High</span>
                  </div>

                  {/* Detailed Explanation Drawer */}
                  {isExpanded && (
                    <div className="p-4 bg-surface-cream border border-border-hairline rounded-xl space-y-2 text-xs text-on-surface leading-relaxed">
                      <div className="font-bold text-secondary flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-3.5 h-3.5 text-secondary" /> Solution & Analysis:
                      </div>
                      <p>{q.explanation}</p>
                      {q.whyOthersWrong && (
                        <div className="pt-2 text-on-surface-variant">
                          <span className="font-semibold text-on-surface">Distractor Rationale: </span>
                          {q.whyOthersWrong}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-on-surface-variant font-mono text-xs bg-white rounded-2xl border border-border-hairline">
              No questions found for the selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
