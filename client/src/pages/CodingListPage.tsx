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
    switch (diff?.toLowerCase()) {
      case 'easy': return 'bg-accent-mint/20 text-[#1b5e20] border-accent-mint/30';
      case 'medium': return 'bg-accent-yellow/30 text-[#7c5e00] border-accent-yellow/40';
      case 'hard': return 'bg-accent-pink/20 text-[#9c0032] border-accent-pink/30';
      default: return 'bg-surface-cream text-on-surface-variant border-border-hairline';
    }
  };

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Strip & Filters */}
        <div className="bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] uppercase px-2 py-0.5 rounded bg-surface-cream border border-border-hairline text-on-surface-variant">
                MODULE: SEC:03
              </span>
              <span className="font-mono text-xs text-secondary font-medium">[JUDGE0 ENGINE]</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-on-surface flex items-center gap-2">
              <Code2 className="text-secondary w-5 h-5" /> Capgemini Coding Lab
            </h1>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Live compiler sandbox and testcase verification for Capgemini Round 2 coding assessment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="Search problem catalog..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="bg-surface-cream border border-border-hairline rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-secondary text-on-surface placeholder-on-surface-variant text-xs font-mono w-full md:w-56"
              />
            </div>

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-surface-cream border border-border-hairline rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary text-on-surface text-xs font-mono w-full md:w-32 cursor-pointer"
            >
              <option value="">All Tiers</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-surface-cream border border-border-hairline rounded-lg px-3 py-1.5 focus:outline-none focus:border-secondary text-on-surface text-xs font-mono w-full md:w-36 cursor-pointer"
            >
              <option value="">All Topics</option>
              {Array.isArray(topicsData) && topicsData.map((t: string) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {isError && (
          <div className="bg-accent-pink/15 border border-accent-pink text-[#9c0032] p-4 rounded-xl flex items-center font-mono text-xs">
            <AlertCircle className="w-4 h-4 mr-2" />
            Failed to load coding problem registry. Please ensure backend services are active.
          </div>
        )}

        {/* Problem Roster Table */}
        <div className="bg-surface-paper rounded-xl border border-border-hairline overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead>
              <tr className="bg-surface-cream border-b border-border-hairline font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
                <th className="p-3.5 font-semibold w-16">Status</th>
                <th className="p-3.5 font-semibold">Problem Title</th>
                <th className="p-3.5 font-semibold w-32">Difficulty</th>
                <th className="p-3.5 font-semibold hidden md:table-cell">Topics</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-hairline">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-mono text-on-surface-variant">
                    Loading problem registry...
                  </td>
                </tr>
              ) : data?.problems?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-mono text-on-surface-variant">
                    No coding problems found matching your active filters.
                  </td>
                </tr>
              ) : (
                data?.problems?.map((prob: any, idx: number) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    key={prob._id} 
                    className="hover:bg-surface-cream/60 transition-colors group"
                  >
                    <td className="p-3.5">
                      <div className="w-4 h-4 rounded-full border border-border-hairline group-hover:border-secondary transition-colors" />
                    </td>
                    <td className="p-3.5">
                      <Link to={`/coding/${prob._id}`} className="text-on-surface group-hover:text-secondary font-medium transition-colors">
                        {prob.title}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase border ${getDifficultyColor(prob.difficulty)}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="p-3.5 hidden md:table-cell font-mono text-[11px] text-on-surface-variant">
                      {prob.topics?.join(', ')}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-4 font-mono text-xs">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3.5 py-1.5 rounded-lg bg-surface-paper border border-border-hairline disabled:opacity-40 hover:bg-surface-cream transition-colors text-on-surface cursor-pointer"
            >
              Previous
            </button>
            <span className="px-3 py-1.5 text-on-surface-variant">Page {page} of {data.totalPages}</span>
            <button
              disabled={page === data.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3.5 py-1.5 rounded-lg bg-surface-paper border border-border-hairline disabled:opacity-40 hover:bg-surface-cream transition-colors text-on-surface cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
