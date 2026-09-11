import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getProblems, getTopics } from '@/services/codingService';
import { Search, Code2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const CodingListPage = () => {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);

  const { data: topicsData } = useQuery({
    queryKey: ['codingTopics'],
    queryFn: getTopics
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['codingProblems', search, difficulty, topic, page],
    queryFn: () => getProblems({ search, difficulty, topic, page, limit: 15 }),
    placeholderData: (previousData) => previousData
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'hard': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Code2 className="text-indigo-400" /> Coding Practice
            </h1>
            <p className="text-gray-400 mt-1">Master Capgemini coding round questions with our live judge.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-[#1e1e2e] border border-gray-700 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 text-sm w-full md:w-64"
              />
            </div>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white w-full md:w-36"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-[#0a0a0a] border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500 text-white w-full md:w-40"
            >
              <option value="">All Topics</option>
              {Array.isArray(topicsData) && topicsData.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {isError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Failed to load problems.
          </div>
        )}

        <div className="bg-[#1e1e2e] rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#2a2a3e] border-b border-gray-700 text-gray-400 text-sm">
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Difficulty</th>
                <th className="p-4 font-medium hidden md:table-cell">Topics</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">Loading problems...</td>
                </tr>
              ) : data?.problems?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No problems found matching your criteria.</td>
                </tr>
              ) : (
                data?.problems?.map((prob: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={prob._id} 
                    className="border-b border-gray-800/50 hover:bg-[#2a2a3e] transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-indigo-500 transition-colors" />
                    </td>
                    <td className="p-4">
                      <Link to={`/coding/${prob._id}`} className="text-white hover:text-indigo-400 font-medium">
                        {prob.title}
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty.charAt(0).toUpperCase() + prob.difficulty.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-gray-500">
                      {prob.topics?.join(', ')}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-4 py-2 rounded-lg bg-[#1e1e2e] border border-gray-800 disabled:opacity-50 hover:bg-[#2a2a3e]"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-400">Page {page} of {data.totalPages}</span>
            <button
              disabled={page === data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 rounded-lg bg-[#1e1e2e] border border-gray-800 disabled:opacity-50 hover:bg-[#2a2a3e]"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
