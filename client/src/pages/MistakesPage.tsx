import React, { useState } from 'react';
import { XCircle, CheckCircle2, RefreshCw, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMistakes } from '@/services/questionService';
import { useNavigate } from 'react-router-dom';

export default function MistakesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'mcq' | 'pseudocode' | 'coding' | 'debugging'>('all');
  const navigate = useNavigate();

  const { data: mistakes = [], isLoading } = useQuery({
    queryKey: ['user-mistakes'],
    queryFn: getMistakes
  });

  const filteredMistakes = mistakes.filter((m: any) => {
    if (activeTab === 'all') return true;
    const type = (m.itemType || '').toLowerCase();
    if (activeTab === 'mcq') return type === 'question' || type === 'mcq';
    if (activeTab === 'pseudocode') return type === 'pseudocode';
    if (activeTab === 'coding') return type === 'coding';
    if (activeTab === 'debugging') return type === 'debugging';
    return true;
  });

  return (
    <div className="p-8 max-w-5xl mx-auto text-on-surface space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>✨ CAPGEMINI PREP BY YUSUF</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-2 flex items-center space-x-3 text-on-surface tracking-tight">
          <XCircle className="w-8 h-8 text-accent-pink" />
          <span>Mistakes Notebook & Error Ledger</span>
        </h1>
        <p className="text-on-surface-variant text-sm">
          Review questions you previously failed or missed to target recurring conceptual blindspots and reinforce key patterns.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="inline-flex gap-1.5 p-1 bg-surface-container-high rounded-xl border border-border-hairline">
          {[
            { id: 'all', label: 'All Errors' },
            { id: 'mcq', label: 'MCQ' },
            { id: 'pseudocode', label: 'Pseudocode' },
            { id: 'coding', label: 'Coding' },
            { id: 'debugging', label: 'Debugging' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('/practice/mcq')}
          className="flex items-center space-x-2 bg-primary-container hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Practice Fresh Problems</span>
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white border border-border-hairline rounded-2xl p-12 flex flex-col items-center justify-center space-y-3 shadow-sm">
          <Loader2 className="w-6 h-6 text-secondary animate-spin" />
          <p className="text-xs font-mono text-on-surface-variant">Loading mistakes ledger...</p>
        </div>
      ) : filteredMistakes.length === 0 ? (
        <div className="bg-white border border-border-hairline rounded-2xl p-12 text-center text-on-surface-variant font-mono text-xs shadow-sm space-y-2">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-bold text-on-surface">No recorded errors in this section!</p>
          <p className="text-xs text-zinc-400">100% accuracy velocity maintained. Any future incorrect attempts will appear here for targeted review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMistakes.map((m: any) => {
            const item = m.item || {};
            const prompt = item.question || item.title || item.questionText || 'Mistake Item';

            return (
              <div
                key={m._id}
                className="bg-white border border-border-hairline hover:border-zinc-400 rounded-2xl p-6 transition-all shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-mono font-bold uppercase">
                      Failed Attempt
                    </span>
                    <span className="text-xs text-on-surface-variant font-mono">
                      {item.category || m.itemType} {item.topic ? `• ${item.topic}` : ''}
                    </span>
                  </div>
                  {m.attemptedAt && (
                    <span className="text-[11px] font-mono text-zinc-400">
                      {new Date(m.attemptedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-on-surface leading-snug">
                  {prompt}
                </h3>

                {item.options && Array.isArray(item.options) && (
                  <div className="space-y-2 pt-1">
                    {item.options.map((opt: string, idx: number) => {
                      const isWrongChoice = (m.userAnswer !== undefined && Number(m.userAnswer) === idx) || (m.wrongOptionSelected !== undefined && Number(m.wrongOptionSelected) === idx);
                      const isCorrectChoice = Number(item.answer) === idx;

                      let style = 'bg-surface-cream/40 border-border-hairline text-on-surface-variant';
                      if (isCorrectChoice) {
                        style = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold';
                      } else if (isWrongChoice) {
                        style = 'bg-red-50 border-red-300 text-red-950 font-semibold';
                      }

                      return (
                        <div key={idx} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${style}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white border border-border-hairline flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isCorrectChoice && (
                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                              CORRECT ANSWER
                            </span>
                          )}
                          {isWrongChoice && !isCorrectChoice && (
                            <span className="text-[10px] font-mono font-bold text-red-700 bg-red-100/70 px-2 py-0.5 rounded">
                              YOUR CHOICE
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {item.explanation && (
                  <div className="text-xs text-on-surface-variant bg-surface-cream/70 p-3.5 rounded-xl border border-border-hairline leading-relaxed">
                    <span className="font-bold text-on-surface font-mono text-[11px]">Correct Rationale: </span>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
