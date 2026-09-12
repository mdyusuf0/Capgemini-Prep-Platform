import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { 
  Target, 
  TrendingUp, 
  Award, 
  Brain, 
  Activity, 
  Users, 
  Trophy, 
  RefreshCw, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [cohort, setCohort] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshingCohort, setRefreshingCohort] = useState(false);
  const [leaderboardFilter, setLeaderboardFilter] = useState<'all' | 'top' | 'surrounding'>('all');

  const fetchAllData = async () => {
    try {
      const [ovData, trData, waData, caData, cohData] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTrends(),
        analyticsService.getWeakAreas(),
        analyticsService.getCoachAdvice(),
        analyticsService.getCohortBenchmark().catch(() => null)
      ]);
      setOverview(ovData.overview);
      setTrends(trData.trends || []);
      setWeakAreas(waData.weakAreas || []);
      setCoachAdvice(caData.advice || '');
      if (cohData) setCohort(cohData);
    } catch (error) {
      console.error('Failed to load analytics', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefreshCohort = async () => {
    setRefreshingCohort(true);
    try {
      const freshCohort = await analyticsService.getCohortBenchmark();
      setCohort(freshCohort);
      toast.success('Live cohort benchmark calibrated with latest telemetry!');
    } catch {
      toast.error('Could not refresh cohort benchmark');
    } finally {
      setRefreshingCohort(false);
    }
  };

  if (loading) return (
    <div className="p-12 text-center text-on-surface font-mono text-sm space-y-3">
      <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin mx-auto" />
      <p>Synchronizing Real-Time Cohort Telemetry & Analytics...</p>
    </div>
  );

  const data = [
    { name: 'Correct', value: overview?.accuracy || 0 },
    { name: 'Incorrect', value: Math.max(0, 100 - (overview?.accuracy || 0)) }
  ];
  const COLORS = ['#006684', '#fc618d'];

  // Leaderboard filter logic
  const fullLeaderboard = cohort?.leaderboard || [];
  let displayedLeaderboard = fullLeaderboard;
  if (leaderboardFilter === 'top') {
    displayedLeaderboard = fullLeaderboard.slice(0, 10);
  } else if (leaderboardFilter === 'surrounding') {
    const userIdx = fullLeaderboard.findIndex((c: any) => c.isCurrentUser);
    if (userIdx !== -1) {
      const start = Math.max(0, userIdx - 2);
      const end = Math.min(fullLeaderboard.length, userIdx + 3);
      displayedLeaderboard = fullLeaderboard.slice(start, end);
    } else {
      displayedLeaderboard = fullLeaderboard.slice(0, 10);
    }
  }

  const candidate = cohort?.candidate;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto text-on-surface space-y-8">
      {/* Header with Live Sync Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-2">
            <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse" />
            <span>CAPGEMINI 2026/2027 COHORT TELEMETRY</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface">Candidate Cohort Benchmark & Analytics</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Real-time peer scoring, live percentile rank, and domain accuracy comparison across 1,280 active aspirants.
          </p>
        </div>

        <button
          onClick={handleRefreshCohort}
          disabled={refreshingCohort}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-border-hairline text-xs font-bold text-on-surface hover:bg-surface-cream hover:border-zinc-400 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshingCohort ? 'animate-spin text-secondary' : 'text-zinc-600'} />
          {refreshingCohort ? 'Synchronizing...' : 'Recalibrate Live Cohort'}
        </button>
      </div>

      {/* Hero Cohort Standing Banner */}
      {candidate && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-surface-cream border-2 border-secondary/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border-hairline">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-bold font-mono border border-secondary/20 flex items-center gap-1.5">
                  <Trophy size={14} /> {candidate.statusBadge}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                  {candidate.clearedCutoff ? '✓ Capgemini Cutoff Qualified' : 'Targeting 75% Cutoff'}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
                {candidate.name} is in the top {((100 - candidate.percentile)).toFixed(1)}% of all candidates
              </h2>
              <p className="text-xs md:text-sm text-on-surface-variant max-w-2xl">
                Benchmarked dynamically across Capgemini's 4-stage recruitment pipeline against {candidate.totalCandidates.toLocaleString()} active students nationwide.
              </p>
            </div>

            {/* Percentile Big Badge */}
            <div className="flex items-center gap-5 bg-white p-5 rounded-2xl border border-border-hairline shadow-xs shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex flex-col items-center justify-center text-white shadow-md">
                <span className="text-xl font-black tracking-tight">{candidate.percentile}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest font-semibold text-zinc-200">Percentile</span>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">National Rank</div>
                <div className="text-2xl font-black text-on-surface">#{candidate.rank} <span className="text-xs font-normal text-on-surface-variant">/ {candidate.totalCandidates}</span></div>
                <div className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                  <ArrowUpRight size={13} /> Cutoff Margin: {candidate.cutoffDelta} pts
                </div>
              </div>
            </div>
          </div>

          {/* 4 Key Real-time Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/80 p-4 rounded-xl border border-border-hairline">
              <span className="text-[11px] font-mono uppercase text-on-surface-variant block mb-1">Composite Score</span>
              <span className="text-2xl font-black text-on-surface">{candidate.compositeScore}</span>
              <span className="text-xs text-on-surface-variant font-mono"> / 100</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-border-hairline">
              <span className="text-[11px] font-mono uppercase text-on-surface-variant block mb-1">Overall Accuracy</span>
              <span className="text-2xl font-black text-emerald-600">{candidate.accuracy}%</span>
              <span className="text-xs text-on-surface-variant font-mono"> vs 72% avg</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-border-hairline">
              <span className="text-[11px] font-mono uppercase text-on-surface-variant block mb-1">Questions Solved</span>
              <span className="text-2xl font-black text-on-surface">{candidate.questionsSolved}</span>
              <span className="text-xs text-on-surface-variant font-mono"> verified</span>
            </div>
            <div className="bg-white/80 p-4 rounded-xl border border-border-hairline">
              <span className="text-[11px] font-mono uppercase text-on-surface-variant block mb-1">Coding Solved</span>
              <span className="text-2xl font-black text-secondary">{candidate.codingSolved}</span>
              <span className="text-xs text-on-surface-variant font-mono"> problems</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Domain Comparative Analytics: Candidate vs Cohort Average vs 90th %ile Cutoff */}
      {cohort?.domainComparison && (
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-border-hairline shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Domain-by-Domain Peer Score Comparison
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Compare your performance in each Capgemini recruitment pillar against the national cohort average and the top 10% cutoff.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#006684]" /> You</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#a1a1aa]" /> Cohort Average</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-xs bg-[#e11d48]" /> Top 10% Cutoff</span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={cohort.domainComparison} 
                margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                <XAxis dataKey="domain" stroke="#71717a" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#71717a" fontSize={12} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e2df', 
                    borderRadius: '12px', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                  }} 
                />
                <Bar dataKey="candidateScore" name="Your Score" fill="#006684" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cohortAvg" name="Cohort Average" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="top10Cutoff" name="Top 10% Cutoff" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Live Peer Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-border-hairline shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border-hairline flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-cream/50">
          <div>
            <h2 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Live Candidate Peer Leaderboard
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Real-time standings calibrated across the 2026/2027 Capgemini recruitment cohort.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-paper rounded-xl border border-border-hairline text-xs font-medium">
            <button
              onClick={() => setLeaderboardFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                leaderboardFilter === 'all' 
                  ? 'bg-primary text-white font-bold shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Cohort ({fullLeaderboard.length})
            </button>
            <button
              onClick={() => setLeaderboardFilter('top')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                leaderboardFilter === 'top' 
                  ? 'bg-primary text-white font-bold shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Top 10 Elite
            </button>
            <button
              onClick={() => setLeaderboardFilter('surrounding')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                leaderboardFilter === 'surrounding' 
                  ? 'bg-primary text-white font-bold shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Surrounding You
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border-hairline bg-surface-cream text-on-surface-variant font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold w-14">Rank</th>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Target Track</th>
                <th className="py-3 px-4 font-semibold text-right">Score</th>
                <th className="py-3 px-4 font-semibold text-right">Accuracy</th>
                <th className="py-3 px-4 font-semibold text-right">Questions</th>
                <th className="py-3 px-4 font-semibold text-right">Coding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {displayedLeaderboard.map((student: any, idx: number) => {
                const isCurrent = student.isCurrentUser;
                const actualRank = fullLeaderboard.findIndex((c: any) => c.name === student.name && c.college === student.college) + 1;
                return (
                  <tr 
                    key={idx}
                    className={`transition-colors ${
                      isCurrent 
                        ? 'bg-secondary-fixed/30 font-semibold border-l-4 border-l-secondary' 
                        : 'hover:bg-surface-cream/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {actualRank === 1 ? '🥇 1' : actualRank === 2 ? '🥈 2' : actualRank === 3 ? '🥉 3' : `#${actualRank}`}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name}
                          className="w-8 h-8 rounded-full object-cover border border-border-hairline shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-on-surface">
                            <span>{student.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-secondary text-white text-[10px] font-mono uppercase font-black tracking-wider">
                                YOU
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-on-surface-variant">{student.college}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
                        student.track.includes('Exceller') 
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : student.track.includes('Senior')
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}>
                        {student.track}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-on-surface text-sm">
                      {typeof student.score === 'number' ? student.score.toFixed(1) : student.score}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-emerald-600">
                      {student.accuracy}%
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-on-surface-variant">
                      {student.solved}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-secondary font-bold">
                      {student.coding}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Accuracy Velocity & Overall Accuracy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border-hairline shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-bold text-on-surface">Accuracy Velocity (Last 30 Days)</h2>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-cream px-2.5 py-1 rounded-full border border-border-hairline">Daily Trend</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e2df" />
                <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
                <YAxis stroke="#71717a" domain={[0, 100]} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e2df', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#006684" strokeWidth={2.5} dot={{ fill: '#006684', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm flex flex-col items-center">
          <h2 className="text-base font-bold mb-4 w-full text-left text-on-surface">Overall Accuracy Breakdown</h2>
          <div className="h-48 w-48 relative my-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e2df', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-on-surface">{overview?.accuracy?.toFixed(0) || 76}%</span>
              <span className="text-[10px] font-mono uppercase text-on-surface-variant">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Diagnostic Coach & Critical Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm">
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 bg-secondary-fixed rounded-lg text-on-secondary-fixed">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-on-surface">AI Coach Diagnostic Rationale</h2>
              <p className="text-xs text-on-surface-variant">Algorithmic weakness remediation advice</p>
            </div>
          </div>
          <div className="text-on-surface text-sm leading-relaxed bg-surface-cream p-5 rounded-xl border border-border-hairline">
            {coachAdvice || "Complete at least 5 assessment modules to generate in-depth personalized AI diagnostics."}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm">
          <h2 className="text-base font-bold mb-2 text-red-600 flex items-center gap-2">
            <span>Critical Focus Areas</span>
            <span className="text-xs font-mono text-zinc-500 font-normal">(&lt;60% accuracy)</span>
          </h2>
          <p className="text-xs text-on-surface-variant mb-4">Topics that require immediate revision before the next mock round.</p>
          <div className="flex flex-wrap gap-2">
            {weakAreas && weakAreas.length > 0 ? (
              weakAreas.map((area, idx) => (
                <span key={idx} className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-full text-xs font-medium font-mono">
                  {area.topic} • {area.accuracy}%
                </span>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant italic">No acute weaknesses detected yet. Keep up the high velocity!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
