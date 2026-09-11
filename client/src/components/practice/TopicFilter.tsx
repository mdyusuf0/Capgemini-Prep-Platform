import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopicFilterProps {
  topics: string[];
  selectedTopic: string | null;
  onSelectTopic: (topic: string | null) => void;
  difficulties: string[];
  selectedDifficulty: string | null;
  onSelectDifficulty: (diff: string | null) => void;
  onReset: () => void;
}

export default function TopicFilter({
  topics,
  selectedTopic,
  onSelectTopic,
  difficulties,
  selectedDifficulty,
  onSelectDifficulty,
  onReset
}: TopicFilterProps) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-500" />
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-gray-400 hover:text-white flex items-center gap-1 text-xs transition-colors"
          title="Reset filters"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Difficulty</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(selectedDifficulty === diff ? null : diff)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                  selectedDifficulty === diff 
                    ? "bg-blue-600 border-blue-500 text-white" 
                    : "bg-white/5 border-transparent text-gray-300 hover:bg-white/10"
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Topics</h4>
          {topics.length > 0 ? (
            <div className="space-y-1">
              <button
                onClick={() => onSelectTopic(null)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  !selectedTopic ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                All Topics
              </button>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => onSelectTopic(topic)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    selectedTopic === topic ? "bg-white/10 text-white font-medium" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No topics available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
