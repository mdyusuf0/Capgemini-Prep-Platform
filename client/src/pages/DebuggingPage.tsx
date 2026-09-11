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

  if (isLoading) return <div className="text-white p-8">Loading...</div>;

  const problems: DebuggingProblem[] = data?.problems || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Debugging Challenges</h1>
          <p className="text-gray-400">Find and fix the bugs in the code. Capgemini style.</p>
        </div>
        <Link to="/debugging/timed">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Timer className="w-4 h-4 mr-2" />
            Timed Mode
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <motion.div
            key={problem._id}
            whileHover={{ scale: 1.02 }}
            className="bg-[#1e1e2e] border border-gray-800 rounded-xl p-6 flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{problem.title}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded ${
                problem.difficulty === 'hard' ? 'bg-red-500/20 text-red-400' :
                problem.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
              {problem.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="flex items-center text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                <Code className="w-3 h-3 mr-1" />
                {problem.language}
              </span>
              <span className="flex items-center text-xs text-gray-400 bg-black/30 px-2 py-1 rounded">
                <Bug className="w-3 h-3 mr-1" />
                {problem.bugType}
              </span>
            </div>

            <Link to={`/debugging/${problem._id}`} className="w-full">
              <Button variant="outline" className="w-full border-indigo-600/50 text-indigo-400 hover:bg-indigo-600 hover:text-white">
                Solve Challenge
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
