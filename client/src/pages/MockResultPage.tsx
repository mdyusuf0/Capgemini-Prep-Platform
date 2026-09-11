import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { Button } from '../components/ui/button';
import { CheckCircle, XCircle, Clock, Target, ArrowLeft } from 'lucide-react';

export default function MockResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: result, isLoading } = useQuery({
    queryKey: ['mock-result', id],
    queryFn: () => mockService.getMockResult(id!)
  });

  if (isLoading) return <div className="text-on-surface font-mono text-sm p-8">Loading assessment results...</div>;
  if (!result) return <div className="text-on-surface font-mono text-sm p-8">Result not found.</div>;

  const percentage = Math.round((result.score / result.totalQuestions) * 100) || 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl text-on-surface">
      <Button variant="ghost" onClick={() => navigate('/mocks')} className="mb-6 text-on-surface-variant hover:text-on-surface rounded-xl">
        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Mocks Ledger
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="col-span-1 md:col-span-1 bg-white rounded-2xl border border-border-hairline p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-4">Overall Score Velocity</span>
          <div className="relative w-40 h-40 flex items-center justify-center mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" className="stroke-surface-cream" strokeWidth="12" fill="none" />
              <circle 
                cx="80" cy="80" r="70" 
                className={`stroke-current ${percentage >= 70 ? 'text-secondary' : percentage >= 40 ? 'text-amber-500' : 'text-red-500'}`} 
                strokeWidth="12" fill="none" 
                strokeDasharray="439.8" 
                strokeDashoffset={439.8 - (439.8 * percentage) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-on-surface tracking-tight">{percentage}%</span>
              <span className="text-xs font-mono text-on-surface-variant">{result.score} / {result.totalQuestions}</span>
            </div>
          </div>
          <p className="text-sm font-bold text-on-surface">
            {percentage >= 70 ? 'Benchmark Passed • High Velocity' : percentage >= 40 ? 'Borderline Cutoff • Review Mistakes' : 'Below Cutoff • Immediate Revision Required'}
          </p>
        </div>

        {/* Stats */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Correct</span>
            </div>
            <span className="text-3xl font-black text-on-surface">{result.score}</span>
          </div>

          <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Incorrect</span>
            </div>
            <span className="text-3xl font-black text-on-surface">{result.totalQuestions - result.score}</span>
          </div>

          <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-secondary-fixed text-on-secondary-fixed rounded-lg border border-secondary/20">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Accuracy</span>
            </div>
            <span className="text-3xl font-black text-on-surface">{percentage}%</span>
          </div>

          <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col justify-center shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 text-purple-700 rounded-lg border border-purple-200">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Time Taken</span>
            </div>
            <span className="text-3xl font-black text-on-surface">
              {Math.floor(result.timeSpent / 60)}m {result.timeSpent % 60}s
            </span>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div className="bg-white rounded-2xl border border-border-hairline p-6 shadow-sm">
        <h3 className="text-lg font-bold text-on-surface mb-6 tracking-tight">Question Itemization Review</h3>
        <div className="space-y-3">
          {result.answers.map((ans: any, idx: number) => (
            <div key={idx} className={`p-4 rounded-xl border ${ans.isCorrect ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50/60 border-red-200'}`}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-mono text-xs font-bold text-on-surface">Item {idx + 1}</span>
                {ans.isCorrect ? (
                  <span className="text-emerald-700 flex items-center text-xs font-mono font-bold"><CheckCircle className="w-3.5 h-3.5 mr-1"/> CORRECT</span>
                ) : (
                  <span className="text-red-700 flex items-center text-xs font-mono font-bold"><XCircle className="w-3.5 h-3.5 mr-1"/> INCORRECT</span>
                )}
              </div>
              <div className="text-xs text-on-surface-variant">
                <p>Selected Choice: <span className="font-semibold text-on-surface">{ans.selectedAnswer || 'Skipped'}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
