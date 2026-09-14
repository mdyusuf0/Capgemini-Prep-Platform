import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { mockService } from '../services/mockService';
import { Button } from '../components/ui/button';
import { 
  CheckCircle, XCircle, Clock, Target, ArrowLeft, 
  ShieldCheck, AlertTriangle, Award, CheckCircle2, 
  ChevronDown, ChevronUp, Filter, HelpCircle, Code, BookOpen, Brain, Terminal
} from 'lucide-react';

export default function MockResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  // Query backend result with fallback to session cache
  const { data: apiResult, isLoading } = useQuery({
    queryKey: ['mock-result', id],
    queryFn: async () => {
      try {
        const res = await mockService.getMockResult(id!);
        if (res) return res;
      } catch (e) {
        console.warn('API error fetching mock result, checking session cache:', e);
      }
      return null;
    }
  });

  // Hydrate from API or fallback session storage
  const cachedData = typeof window !== 'undefined' ? sessionStorage.getItem(`mock_result_${id}`) : null;
  const localResult = cachedData ? JSON.parse(cachedData) : null;
  const result = apiResult || localResult;

  if (isLoading && !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-cream text-on-surface font-mono text-sm p-8">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
          <span>Synthesizing Capgemini assessment analytics...</span>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-cream text-on-surface p-8 space-y-4">
        <p className="font-mono text-sm text-on-surface-variant">Assessment result not found or expired.</p>
        <Button onClick={() => navigate('/mocks')} className="rounded-xl font-bold bg-primary-container text-white">
          Return to Mocks Ledger
        </Button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.totalQuestions) * 100) || 0;
  const answers: any[] = result.answers || [];
  const sectionScores: any[] = result.sectionScores || [];

  // Determine overall recruitment eligibility
  const eliminationFailedSection = sectionScores.find((s: any) => s.cutoff && s.accuracy < s.cutoff);
  const isOverallPassed = percentage >= 70 && !eliminationFailedSection;

  // Filter items
  const filteredAnswers = answers.filter((ans: any) => {
    if (filterMode === 'incorrect') return !ans.isCorrect;
    if (filterMode === 'correct') return ans.isCorrect;
    return true;
  });

  const toggleExpand = (idx: number) => {
    setExpandedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/mocks')} 
            className="text-on-surface-variant hover:text-on-surface rounded-xl text-xs font-mono font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Mocks Ledger
          </Button>

          <span className="font-mono text-xs text-on-surface-variant bg-white px-3 py-1.5 rounded-full border border-border-hairline shadow-xs">
            Simulation ID: {id?.substring(0, 10)}...
          </span>
        </div>

        {/* Top Result Banner */}
        <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isOverallPassed 
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' 
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-white/80 border border-current/20">
              {isOverallPassed ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-amber-600" />}
              <span>{isOverallPassed ? 'Benchmark Qualified' : 'Sectional Elimination Triggered'}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {isOverallPassed 
                ? 'Eligible for Capgemini Technical Interview' 
                : eliminationFailedSection 
                ? `Below ${eliminationFailedSection.cutoff}% Cutoff in ${eliminationFailedSection.sectionName}`
                : 'Overall Score Below 70% Elimination Threshold'}
            </h1>

            <p className="text-xs sm:text-sm opacity-90 max-w-2xl leading-relaxed">
              {isOverallPassed 
                ? 'Congratulations! You cleared all elimination stages in the 2026 Aon CoCubes Full OA assessment pattern.'
                : 'Capgemini enforces strict section-wise elimination. Candidates must score at least 70% in Technical MCQs and Pseudocode Tracing to advance to subsequent evaluation stages.'}
            </p>
          </div>

          <div className="flex md:flex-col items-center justify-center p-4 bg-white rounded-2xl border border-current/20 shadow-xs shrink-0 text-center min-w-[140px]">
            <span className="text-4xl font-black text-on-surface">{percentage}%</span>
            <span className="text-xs font-mono text-on-surface-variant mt-0.5 font-bold">
              {result.score} / {result.totalQuestions} Correct
            </span>
          </div>
        </div>

        {/* Overall Score Velocity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Radial Score Gauge */}
          <div className="bg-white rounded-2xl border border-border-hairline p-6 flex flex-col items-center justify-center text-center shadow-xs">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-on-surface-variant mb-3">Overall Assessment Score</span>
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="72" cy="72" r="60" className="stroke-surface-cream" strokeWidth="12" fill="none" />
                <circle 
                  cx="72" cy="72" r="60" 
                  className={`stroke-current ${percentage >= 70 ? 'text-secondary' : percentage >= 50 ? 'text-amber-500' : 'text-red-500'}`} 
                  strokeWidth="12" fill="none" 
                  strokeDasharray="376.99" 
                  strokeDashoffset={376.99 - (376.99 * percentage) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-on-surface">{percentage}%</span>
                <span className="text-[11px] font-mono text-on-surface-variant">{result.score}/{result.totalQuestions}</span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-on-surface">
              Threshold: 70% Cutoff
            </span>
          </div>

          {/* Key Metric Tiles */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-white border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold">Correct Answers</span>
              </div>
              <span className="text-2xl font-black text-on-surface">{result.score}</span>
            </div>

            <div className="bg-white border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-2 bg-red-50 text-red-700 rounded-xl border border-red-200">
                  <XCircle className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold">Incorrect / Skipped</span>
              </div>
              <span className="text-2xl font-black text-on-surface">{result.totalQuestions - result.score}</span>
            </div>

            <div className="bg-white border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-2 bg-secondary-fixed text-secondary rounded-xl border border-secondary/20">
                  <Target className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold">Accuracy Rate</span>
              </div>
              <span className="text-2xl font-black text-on-surface">{percentage}%</span>
            </div>

            <div className="bg-white border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col justify-center">
              <div className="flex items-center gap-2.5 mb-1.5">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                  <Clock className="w-4 h-4" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-bold">Time Invested</span>
              </div>
              <span className="text-2xl font-black text-on-surface">
                {Math.floor((result.timeSpent || 0) / 60)}m {(result.timeSpent || 0) % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Sectional Performance Breakdown */}
        {sectionScores.length > 0 && (
          <div className="bg-white rounded-3xl border border-border-hairline p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-bold text-on-surface tracking-tight">
                Sectional Cutoff Performance
              </h2>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                Official Capgemini recruitment sectional benchmarks and elimination criteria
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectionScores.map((sec: any, sIdx: number) => {
                const passed = sec.accuracy >= (sec.cutoff || 60);

                return (
                  <div 
                    key={sIdx} 
                    className={`p-4 rounded-2xl border transition-all ${
                      passed 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-on-surface">{sec.sectionName}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                        passed 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                          : 'bg-red-100 text-red-800 border-red-300'
                      }`}>
                        {passed ? 'Passed' : 'Eliminated'}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-2xl font-black text-on-surface">{sec.accuracy}%</span>
                      <span className="text-xs font-mono text-on-surface-variant">
                        {sec.correct} / {sec.total} Correct
                      </span>
                    </div>

                    <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${passed ? 'bg-emerald-600' : 'bg-red-500'}`} 
                        style={{ width: `${Math.min(100, sec.accuracy)}%` }}
                      ></div>
                    </div>

                    <p className="text-[11px] font-mono text-on-surface-variant mt-2">
                      Required Cutoff: {sec.cutoff || 60}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Question Itemization Review */}
        <div className="bg-white rounded-3xl border border-border-hairline p-6 sm:p-8 shadow-xs space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-hairline">
            <div>
              <h2 className="text-lg font-bold text-on-surface tracking-tight">
                Question Itemization Review
              </h2>
              <p className="text-xs text-on-surface-variant font-mono mt-0.5">
                Review your selections against the verified question database keys
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 bg-surface-cream p-1 rounded-xl border border-border-hairline">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-on-surface shadow-xs' : 'text-on-surface-variant'
                }`}
              >
                All ({answers.length})
              </button>
              <button
                onClick={() => setFilterMode('incorrect')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterMode === 'incorrect' ? 'bg-red-50 text-red-700 border border-red-200 font-bold' : 'text-on-surface-variant'
                }`}
              >
                Incorrect ({answers.filter(a => !a.isCorrect).length})
              </button>
              <button
                onClick={() => setFilterMode('correct')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  filterMode === 'correct' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' : 'text-on-surface-variant'
                }`}
              >
                Correct ({answers.filter(a => a.isCorrect).length})
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-4">
            {filteredAnswers.map((ans: any, idx: number) => {
              const isExpanded = expandedItems[idx];

              return (
                <div 
                  key={idx} 
                  className={`rounded-2xl border p-5 transition-all ${
                    ans.isCorrect 
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-red-50/40 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-on-surface bg-white px-2.5 py-1 rounded-md border border-border-hairline">
                        Item {idx + 1}
                      </span>
                      {ans.questionType && (
                        <span className="font-mono text-[10px] uppercase text-on-surface-variant">
                          [{ans.questionType}]
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {ans.isCorrect ? (
                        <span className="text-emerald-700 flex items-center text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> CORRECT
                        </span>
                      ) : (
                        <span className="text-red-700 flex items-center text-xs font-mono font-bold bg-white px-2.5 py-0.5 rounded-full border border-red-300">
                          <XCircle className="w-3.5 h-3.5 mr-1" /> INCORRECT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Text */}
                  {ans.questionText && (
                    <p className="text-sm sm:text-base font-bold text-on-surface mb-3 leading-snug">
                      {ans.questionText}
                    </p>
                  )}

                  {/* Selected Choice */}
                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 bg-white/90 rounded-xl border border-border-hairline">
                      <span className="text-on-surface-variant block text-[11px] mb-0.5 font-bold uppercase">Your Selection:</span>
                      <span className={`font-semibold ${ans.isCorrect ? 'text-emerald-800' : 'text-red-700'}`}>
                        {ans.selectedAnswer || 'Skipped / Unattempted'}
                      </span>
                    </div>

                    {/* Correct Answer & Explanation (if incorrect) */}
                    {!ans.isCorrect && ans.correctAnswer && (
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-950">
                        <span className="text-emerald-800 block text-[11px] mb-0.5 font-bold uppercase">Verified Correct Answer:</span>
                        <span className="font-bold text-emerald-900">
                          {ans.correctAnswer}
                        </span>
                      </div>
                    )}

                    {/* Explanation */}
                    {ans.explanation && (
                      <div className="p-3 bg-surface-cream/80 rounded-xl border border-border-hairline text-on-surface">
                        <span className="text-secondary block text-[11px] mb-0.5 font-bold uppercase">Technical Rationale:</span>
                        <p className="text-xs font-sans text-on-surface-variant leading-relaxed">
                          {ans.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
}
