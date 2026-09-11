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

  if (loading) return <div className="p-8 text-white">Loading Analytics...</div>;

  const data = [
    { name: 'Correct', value: overview?.accuracy || 0 },
    { name: 'Incorrect', value: 100 - (overview?.accuracy || 0) }
  ];
  const COLORS = ['#3b82f6', '#ef4444'];

  return (
    <div className="p-8 max-w-7xl mx-auto text-white space-y-8">
      <h1 className="text-3xl font-bold">Analytics & AI Coach</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 rounded-lg"><Target className="text-blue-500 w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-sm">Questions Solved</p>
            <p className="text-2xl font-bold">{overview?.questionsSolved || 0}</p>
          </div>
        </div>
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-lg"><TrendingUp className="text-green-500 w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-sm">Accuracy</p>
            <p className="text-2xl font-bold">{overview?.accuracy?.toFixed(1) || 0}%</p>
          </div>
        </div>
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-orange-500/10 rounded-lg"><Award className="text-orange-500 w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-sm">Current Streak</p>
            <p className="text-2xl font-bold">{overview?.streak || 0} Days</p>
          </div>
        </div>
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 rounded-lg"><Activity className="text-purple-500 w-6 h-6" /></div>
          <div>
            <p className="text-gray-400 text-sm">Prep Score</p>
            <p className="text-2xl font-bold">{overview?.score || 0}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e1e2e] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4">Accuracy Over Time (Last 30 Days)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 w-full text-left">Overall Accuracy</h2>
          <div className="h-48 w-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{overview?.accuracy?.toFixed(0)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="text-indigo-400 w-6 h-6" />
            <h2 className="text-xl font-bold">AI Coach Advice</h2>
          </div>
          <p className="text-gray-300 leading-relaxed bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/20">
            {coachAdvice}
          </p>
        </div>
        <div className="bg-[#1e1e2e] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold mb-4 text-red-400">Weak Areas to Focus</h2>
          <div className="flex flex-wrap gap-2">
            {weakAreas.map((area, idx) => (
              <span key={idx} className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm">
                {area.topic} ({area.accuracy}%)
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
