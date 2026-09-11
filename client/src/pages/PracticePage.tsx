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
    <div className="min-h-screen bg-background text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-semibold text-indigo-400 mb-2">
            <span>✨ Capgemini Prep By Yusuf</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Practice Hub</h1>
          <p className="text-gray-400">Master every topic for your Capgemini placement with comprehensive practice sets curated by Yusuf.</p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Link to={category.path}>
                  <div className="group bg-surface hover:bg-surface/80 border border-white/5 rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden h-full flex flex-col">
                    <div className={cn("p-3 rounded-lg w-fit mb-4", category.color)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 flex-grow">{category.description}</p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="w-full bg-white/5 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Questions solved: 0/100</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
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
