import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import { Brain, Code2, ClipboardList, Target, Flame, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';

const defaultSections = [
  { title: 'Technical MCQ', progress: 0, path: '/practice/mcq' },
  { title: 'Pseudocode', progress: 0, path: '/practice/pseudocode' },
  { title: 'Coding', progress: 0, path: '/coding' },
  { title: 'Debugging', progress: 0, path: '/debugging' },
  { title: 'AI Coding', progress: 0, path: '/ai-coding' },
  { title: 'Communication', progress: 0, path: '/communication' },
  { title: 'Cognitive Games', progress: 0, path: '/games' },
  { title: 'Behavioral', progress: 0, path: '/behavioral' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const today = new Date();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard-progress'],
    queryFn: () => analyticsService.getDashboardProgress(),
    refetchOnWindowFocus: true
  });

  const stats = [
    { label: 'Questions Solved', value: String(dashboardData?.stats?.questionsSolved ?? 0), icon: Brain, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Coding Problems', value: String(dashboardData?.stats?.codingProblems ?? 0), icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Mock Tests', value: String(dashboardData?.stats?.mockTests ?? 0), icon: ClipboardList, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Avg. Accuracy', value: `${dashboardData?.stats?.avgAccuracy ?? 0}%`, icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ];

  const sections = dashboardData?.sections || defaultSections;
  const overallReadiness = dashboardData?.overallReadiness ?? 0;
  const streak = dashboardData?.stats?.streak ?? 0;
  const weakSection = dashboardData?.weakSection || {
    title: 'Technical MCQ',
    progress: 0,
    path: '/practice/mcq',
    message: 'Start with Technical MCQ to build your core CS foundation.'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface p-6 rounded-2xl border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <img
              src="/logo.jpg"
              alt="Yusuf"
              className="relative w-16 h-16 rounded-full object-cover object-top border-2 border-indigo-400 shadow-xl ring-2 ring-white/10"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-2">
              <span>✨ Capgemini Prep By Yusuf</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-white/50 text-sm">
              {formatDate(today)} • Ready to continue your preparation?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="p-1.5 bg-warning/20 rounded-lg">
            <Flame className="text-warning w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white/50 font-medium uppercase tracking-wider">Current Streak</div>
            <div className="font-bold text-warning text-lg leading-none">{streak} Days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-5 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/50 font-medium">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass p-6 rounded-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-white">Section Progress</h2>
                <p className="text-xs text-white/50">Real-time mastery across all 8 Capgemini modules</p>
              </div>
              <button 
                onClick={() => navigate('/roadmap')}
                className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 hover:underline cursor-pointer"
              >
                View Roadmap <ChevronRight size={15} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((sec: any, idx: number) => (
                <div 
                  key={idx}
                  onClick={() => navigate(sec.path)}
                  className="bg-surface p-4 rounded-xl border border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">{sec.title}</span>
                    <span className="text-sm font-bold text-indigo-400">{sec.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-700"
                      style={{ width: `${sec.progress}%` }}
                    />
                  </div>
                  {sec.target && (
                    <div className="flex justify-between items-center text-[11px] text-white/40 mt-1.5">
                      <span>{sec.solved ?? 0} solved</span>
                      <span>Target: {sec.target}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 blur-[50px] rounded-full"></div>
            <h2 className="text-lg font-bold w-full text-left mb-6">Overall Readiness</h2>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="12" />
                <circle 
                  cx="80" cy="80" r="70" fill="none" stroke="currentColor" 
                  className="text-indigo-500 transition-all duration-1000" strokeWidth="12" 
                  strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * overallReadiness) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white">{overallReadiness}<span className="text-lg">%</span></span>
              </div>
            </div>
            
            <p className="text-sm text-white/60">
              {overallReadiness === 0 ? (
                <span>You have just started! Practice problems and complete assessments to increase your readiness score.</span>
              ) : (
                <span>You are <strong className="text-white">{overallReadiness}%</strong> prepared for the Capgemini assessment. Keep practicing daily to hit 100%!</span>
              )}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-surface to-background border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 blur-[40px] rounded-full pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Recommended Focus</h3>
                <p className="text-xs text-white/50">Next recommended preparation step</p>
              </div>
            </div>
            <div className="bg-background-lighter p-3.5 rounded-xl border border-white/5 mb-4">
              <div className="font-medium text-white/90">{weakSection.title}</div>
              <div className="text-xs text-white/50 mt-1">{weakSection.message}</div>
            </div>
            <button 
              onClick={() => navigate(weakSection.path)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              Practice Now <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      <footer className="pt-8 border-t border-white/5 text-center text-xs text-white/40 space-y-1">
        <p className="font-semibold text-white/60">Capgemini Prep By Yusuf • 2026/2027 On-Campus Placement Preparation System</p>
        <p className="text-white/30">Crafted by Yusuf for comprehensive assessment mastery</p>
      </footer>
    </div>
  );
};
