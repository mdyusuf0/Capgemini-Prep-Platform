import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Cpu, FileCode, Code2, Bug, Bot, BrainCircuit, 
  MessageSquare, Gamepad2, Users, Database, Layers, Monitor,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'technical-mcq', title: 'Technical MCQ', path: '/practice/mcq/technical-mcq', icon: Cpu, color: 'bg-blue-500/10 text-blue-500', description: 'C/C++, Java, DSA, DBMS, OS, Networks' },
  { id: 'pseudocode', title: 'Pseudocode', path: '/practice/pseudocode', icon: FileCode, color: 'bg-purple-500/10 text-purple-500', description: 'Output prediction, tracing, dry runs' },
  { id: 'coding', title: 'Coding', path: '/coding', icon: Code2, color: 'bg-green-500/10 text-green-500', description: 'Arrays, strings, hashing, sorting' },
  { id: 'debugging', title: 'Debugging', path: '/debugging', icon: Bug, color: 'bg-red-500/10 text-red-500', description: 'Find and fix bugs in code' },
  { id: 'ai-coding', title: 'AI Coding', path: '/ai-coding', icon: Bot, color: 'bg-cyan-500/10 text-cyan-500', description: 'AI-assisted problem solving' },
  { id: 'ai-literacy', title: 'AI Literacy', path: '/ai-literacy', icon: BrainCircuit, color: 'bg-pink-500/10 text-pink-500', description: 'GenAI, LLMs, prompt engineering' },
  { id: 'communication', title: 'Communication', path: '/communication', icon: MessageSquare, color: 'bg-amber-500/10 text-amber-500', description: 'Grammar, vocabulary, comprehension' },
  { id: 'cognitive', title: 'Cognitive Games', path: '/games', icon: Gamepad2, color: 'bg-orange-500/10 text-orange-500', description: 'Pattern, memory, logic games' },
  { id: 'behavioral', title: 'Behavioral', path: '/behavioral', icon: Users, color: 'bg-indigo-500/10 text-indigo-500', description: 'Situational judgment, Capgemini values' },
  { id: 'sql-dbms', title: 'SQL & DBMS', path: '/practice/mcq/dbms', icon: Database, color: 'bg-teal-500/10 text-teal-500', description: 'Queries, normalization, ACID' },
  { id: 'oops', title: 'OOPs', path: '/practice/mcq/oops', icon: Layers, color: 'bg-violet-500/10 text-violet-500', description: '4 pillars, polymorphism, inheritance' },
  { id: 'os', title: 'OS', path: '/practice/mcq/os', icon: Monitor, color: 'bg-slate-500/10 text-slate-500', description: 'Process, threads, scheduling, memory' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Strip */}
        <div className="bg-surface-paper border border-border-hairline rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-surface-cream border border-border-hairline rounded text-[11px] font-semibold text-secondary mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
              <span>Capgemini Prep • A platform by Yusuf</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">Capgemini Practice Hub</h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Master every round of the Capgemini Exceller recruitment pattern with targeted interactive modules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg bg-surface-cream border border-border-hairline text-xs text-on-surface-variant font-medium">
              12 Specialized Modules Active
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link to={category.path}>
                  <div className="group bg-surface-paper hover:bg-surface-cream/50 border border-border-hairline hover:border-secondary/40 rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer relative overflow-hidden h-full flex flex-col shadow-xs">
                    <div className={cn("p-2.5 rounded-lg w-fit mb-3.5 border border-border-hairline", category.color)}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-on-surface mb-1 group-hover:text-secondary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-on-surface-variant text-xs mb-5 flex-grow leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="mt-auto space-y-2 pt-3 border-t border-border-hairline">
                      <div className="w-full bg-surface-cream rounded-full h-1.5 overflow-hidden border border-border-hairline">
                        <div className="bg-secondary h-full rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-medium">
                        <span>Modules cleared: 2/12</span>
                        <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
