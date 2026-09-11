import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Target, TrendingUp, Award, Brain, Activity } from 'lucide-react';
import { analyticsService } from '../services/analyticsService';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [weakAreas, setWeakAreas] = useState<any[]>([]);
  const [coachAdvice, setCoachAdvice] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovData, trData, waData, caData] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getTrends(),
          analyticsService.getWeakAreas(),
          analyticsService.getCoachAdvice()
        ]);
        setOverview(ovData.overview);
        setTrends(trData.trends || []);
        setWeakAreas(waData.weakAreas || []);
        setCoachAdvice(caData.advice || '');
      } catch (error) {
        console.error('Failed to load analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-on-surface font-mono text-sm">Loading Analytics Telemetry...</div>;

  const data = [
    { name: 'Correct', value: overview?.accuracy || 0 },
    { name: 'Incorrect', value: 100 - (overview?.accuracy || 0) }
  ];
  const COLORS = ['#006684', '#fc618d'];

  return (
    <div className="p-8 max-w-7xl mx-auto text-on-surface space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
          <span>📊 PERFORMANCE TELEMETRY</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Analytics & AI Diagnostic Coach</h1>
        <p className="text-on-surface-variant text-sm mt-1">Real-time metrics, cohort accuracy variance, and AI-recommended remedial paths.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-secondary-fixed text-on-secondary-fixed rounded-xl border border-secondary/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Questions Solved</p>
            <p className="text-2xl font-black text-on-surface">{overview?.questionsSolved || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Accuracy</p>
            <p className="text-2xl font-black text-on-surface">{overview?.accuracy?.toFixed(1) || 0}%</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Current Streak</p>
            <p className="text-2xl font-black text-on-surface">{overview?.streak || 0} Days</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border-hairline shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">Readiness Score</p>
            <p className="text-2xl font-black text-on-surface">{overview?.score || 0}</p>
          </div>
        </div>
      </div>

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
          <h2 className="text-base font-bold mb-4 w-full text-left text-on-surface">Overall Accuracy</h2>
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
              <span className="text-3xl font-black text-on-surface">{overview?.accuracy?.toFixed(0)}%</span>
              <span className="text-[10px] font-mono uppercase text-on-surface-variant">Accuracy</span>
            </div>
          </div>
        </div>
      </div>

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
