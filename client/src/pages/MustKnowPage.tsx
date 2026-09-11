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
    <div className="p-8 max-w-5xl mx-auto text-white space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400">
          <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>High-Yield Placement Priority</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Capgemini Must-Know Questions</h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
          The highest-frequency questions and patterns reported in recent Capgemini Exceller drives. Master these essential concepts before tackling broader practice sets.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-gray-800 pb-4">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === c.id
                ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                : 'bg-[#1e1e2e] hover:bg-[#2a2a3e] text-gray-300 border border-gray-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Questions List */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16 text-gray-400">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
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
                  className="bg-[#1e1e2e] border border-gray-800 hover:border-gray-700 rounded-2xl p-6 transition-all shadow-md space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[11px] font-bold">
                          MUST KNOW
                        </span>
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">{q.category} • {q.topic}</span>
                      </div>
                      <h3 className="text-base font-semibold text-white pt-1">{idx + 1}. {q.question}</h3>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isChosen = selectedAns === oIdx;
                      const isCorrect = q.answer === oIdx;
                      let btnStyle = 'bg-[#0a0a0a] hover:bg-[#161622] border-gray-800 text-gray-300';

                      if (isAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-green-950/40 border-green-500/50 text-green-300 font-semibold';
                        } else if (isChosen) {
                          btnStyle = 'bg-red-950/40 border-red-500/50 text-red-300';
                        } else {
                          btnStyle = 'bg-[#0a0a0a] opacity-40 border-gray-800 text-gray-500';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={isAnswered}
                          onClick={() => handleSelectAnswer(q._id, oIdx)}
                          className={`p-3 rounded-xl border text-left text-sm flex items-center justify-between transition-all ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                          {isAnswered && isChosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Toggle */}
                  <div className="pt-2 border-t border-gray-800/60 flex items-center justify-between">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q._id)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>{isExpanded ? 'Hide Explanation' : 'View Concept & Explanation'}</span>
                    </button>
                    <span className="text-xs text-gray-500 font-mono">Frequency: Very High</span>
                  </div>

                  {/* Detailed Explanation Drawer */}
                  {isExpanded && (
                    <div className="p-4 bg-[#14141e] border border-gray-800 rounded-xl space-y-2 text-xs text-gray-300 leading-relaxed">
                      <div className="font-bold text-amber-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Solution & Analysis:
                      </div>
                      <p>{q.explanation}</p>
                      {q.whyOthersWrong && (
                        <div className="pt-2 text-gray-400">
                          <span className="font-semibold text-gray-300">Why other options are wrong: </span>
                          {q.whyOthersWrong}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center text-gray-500 bg-[#1e1e2e] rounded-2xl border border-gray-800">
              No questions found for the selected filter.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
