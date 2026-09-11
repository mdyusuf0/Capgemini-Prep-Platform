import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { debuggingService, DebuggingProblem } from '../services/debuggingService';
import { Link } from 'react-router-dom';
import { Bug, Timer, Code } from 'lucide-react';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';

export default function DebuggingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['debugging-problems'],
    queryFn: () => debuggingService.getProblems()
  });

  if (isLoading) return <div className="text-on-surface font-mono text-sm p-8">Loading Debugging Roster...</div>;

  const problems: DebuggingProblem[] = data?.problems || [];

  return (
    <div className="container mx-auto px-6 py-8 text-on-surface">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container border border-border-hairline rounded-full text-xs font-mono font-medium text-on-surface mb-3">
            <span>🐛 CODE VERIFICATION ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Debugging Challenges</h1>
          <p className="text-on-surface-variant text-sm mt-1">Locate logic flaws, runtime exceptions, and boundary bugs under Capgemini assessment patterns.</p>
        </div>
        <Link to="/debugging/timed">
          <Button className="bg-primary-container hover:bg-black text-white rounded-xl font-semibold shadow-sm">
            <Timer className="w-4 h-4 mr-2" />
            Timed Speedrun Mode
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <motion.div
            key={problem._id}
            whileHover={{ y: -2 }}
            className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col h-full shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-bold text-on-surface">{problem.title}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${
                problem.difficulty === 'hard' ? 'bg-red-50 text-red-700 border-red-200' :
                problem.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            
            <p className="text-on-surface-variant text-xs mb-4 line-clamp-2 flex-grow leading-relaxed">
              {problem.description}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center text-xs font-mono text-zinc-700 bg-surface-cream border border-border-hairline px-2.5 py-1 rounded-md">
                <Code className="w-3 h-3 mr-1 text-secondary" />
                {problem.language}
              </span>
              <span className="flex items-center text-xs font-mono text-zinc-700 bg-surface-cream border border-border-hairline px-2.5 py-1 rounded-md">
                <Bug className="w-3 h-3 mr-1 text-[#fc618d]" />
                {problem.bugType}
              </span>
            </div>

            <Link to={`/debugging/${problem._id}`} className="w-full">
              <Button className="w-full bg-primary-container text-white hover:bg-black rounded-xl font-semibold shadow-sm">
                Solve Challenge
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
