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
    <div className="bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs text-on-surface">
      <h3 className="text-sm font-label-caps uppercase tracking-wider font-semibold mb-4 pb-2 border-b border-border-hairline flex items-center gap-2 text-on-surface">
        <Activity className="w-4 h-4 text-secondary" />
        Session Telemetry
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-cream p-3 rounded-lg border border-border-hairline">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-mono font-medium mb-1 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-secondary" /> Answered
          </div>
          <div className="text-2xl font-mono font-bold text-on-surface">{answered}</div>
        </div>

        <div className="bg-surface-cream p-3 rounded-lg border border-border-hairline">
          <div className="flex items-center gap-1.5 text-on-surface-variant text-xs font-mono font-medium mb-1 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-accent-pink" /> Streak
          </div>
          <div className="text-2xl font-mono font-bold flex items-baseline gap-1 text-on-surface">
            {streak} <span className="text-xs text-on-surface-variant font-normal">🔥</span>
          </div>
        </div>

        <div className="bg-accent-mint/10 p-3 rounded-lg border border-accent-mint/30">
          <div className="flex items-center gap-1.5 text-[#1b5e20] text-xs font-mono font-medium mb-1 uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" /> Correct
          </div>
          <div className="text-2xl font-mono font-bold text-[#1b5e20]">{correct}</div>
        </div>

        <div className="bg-accent-pink/10 p-3 rounded-lg border border-accent-pink/30">
          <div className="flex items-center gap-1.5 text-[#9c0032] text-xs font-mono font-medium mb-1 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5" /> Wrong
          </div>
          <div className="text-2xl font-mono font-bold text-[#9c0032]">{wrong}</div>
        </div>
      </div>

      <div className="mt-4 p-3.5 bg-surface-cream rounded-lg border border-border-hairline">
        <div className="flex justify-between items-end mb-2 font-mono">
          <span className="text-xs text-on-surface-variant uppercase font-medium">Session Accuracy</span>
          <span className="text-base font-bold text-on-surface">{Math.round(accuracy)}%</span>
        </div>
        <div className="w-full h-1.5 bg-border-hairline rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-secondary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${accuracy}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
}
