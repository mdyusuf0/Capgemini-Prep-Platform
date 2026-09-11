import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import { Brain, Code2, ClipboardList, Target, Flame, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Questions Solved', value: '142', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { label: 'Coding Problems', value: '28', icon: Code2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { label: 'Mock Tests', value: '4', icon: ClipboardList, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { label: 'Avg. Accuracy', value: '78%', icon: Target, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

const sections = [
  { title: 'Technical MCQ', progress: 65, path: '/practice/mcq' },
  { title: 'Pseudocode', progress: 82, path: '/practice/pseudocode' },
  { title: 'Coding', progress: 45, path: '/coding' },
  { title: 'Debugging', progress: 30, path: '/debugging' },
  { title: 'AI Coding', progress: 10, path: '/ai-coding' },
  { title: 'Communication', progress: 90, path: '/communication' },
  { title: 'Cognitive Games', progress: 55, path: '/games' },
  { title: 'Behavioral', progress: 20, path: '/behavioral' },
];

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const today = new Date();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-surface p-6 rounded-2xl border border-white/5">
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
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
          <div className="p-1.5 bg-warning/20 rounded-lg">
            <Flame className="text-warning w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-white/50 font-medium uppercase tracking-wider">Current Streak</div>
            <div className="font-bold text-warning text-lg leading-none">7 Days</div>
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
              <h2 className="text-lg font-bold">Section Progress</h2>
              <button className="text-sm text-primary-400 hover:text-primary-300 font-medium">View Roadmap</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((sec, idx) => (
                <div 
                  key={idx}
                  onClick={() => navigate(sec.path)}
                  className="bg-surface p-4 rounded-xl border border-white/5 hover:border-white/10 cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-white/90 group-hover:text-white transition-colors">{sec.title}</span>
                    <span className="text-sm font-bold text-primary-400">{sec.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full"
                      style={{ width: `${sec.progress}%` }}
                    />
                  </div>
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
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary-500/20 blur-[50px] rounded-full"></div>
            <h2 className="text-lg font-bold w-full text-left mb-6">Overall Readiness</h2>
            
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" className="text-white/10" strokeWidth="12" />
                <circle 
                  cx="80" cy="80" r="70" fill="none" stroke="currentColor" 
                  className="text-primary-500" strokeWidth="12" 
                  strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * 62) / 100} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-white">62<span className="text-lg">%</span></span>
              </div>
            </div>
            
            <p className="text-sm text-white/60">
              You are <strong className="text-white">62%</strong> prepared for the Capgemini assessment. Focus on Debugging and AI Coding to improve your score.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-surface to-background border border-danger/20 p-6 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-danger/10 blur-[40px] rounded-full pointer-events-none"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-danger/20 rounded-full flex items-center justify-center text-danger">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white">Weakness Alert</h3>
                <p className="text-xs text-white/50">Needs immediate attention</p>
              </div>
            </div>
            <div className="bg-background-lighter p-3 rounded-lg border border-white/5 mb-4">
              <div className="font-medium text-white/90">AI Coding (Code Analysis)</div>
              <div className="text-xs text-white/50 mt-1">Accuracy: 18% in last 5 attempts</div>
            </div>
            <button 
              onClick={() => navigate('/ai-coding')}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
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
