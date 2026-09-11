import React from 'react';
import { Activity, CheckCircle, XCircle, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface SessionStatsProps {
  answered: number;
  correct: number;
  wrong: number;
  accuracy: number;
  streak: number;
}

export default function SessionStats({ answered, correct, wrong, accuracy, streak }: SessionStatsProps) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" />
        Session Stats
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-blue-400" /> Answered
          </div>
          <div className="text-2xl font-bold">{answered}</div>
        </div>

        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-1 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Streak
          </div>
          <div className="text-2xl font-bold flex items-baseline gap-1">
            {streak} <span className="text-sm text-gray-500 font-normal">🔥</span>
          </div>
        </div>

        <div className="bg-green-500/5 p-3 rounded-xl border border-green-500/10">
          <div className="flex items-center gap-2 text-green-500/70 text-xs font-medium mb-1 uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" /> Correct
          </div>
          <div className="text-2xl font-bold text-green-500">{correct}</div>
        </div>

        <div className="bg-red-500/5 p-3 rounded-xl border border-red-500/10">
          <div className="flex items-center gap-2 text-red-500/70 text-xs font-medium mb-1 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" /> Wrong
          </div>
          <div className="text-2xl font-bold text-red-500">{wrong}</div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-400 font-medium">Accuracy</span>
          <span className="text-xl font-bold">{Math.round(accuracy)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
