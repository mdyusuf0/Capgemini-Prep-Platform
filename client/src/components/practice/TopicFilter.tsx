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
    <div className="bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs text-on-surface">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-border-hairline">
        <h3 className="text-sm font-label-caps uppercase tracking-wider font-semibold flex items-center gap-2 text-on-surface">
          <Filter className="w-4 h-4 text-secondary" />
          Filter Ledger
        </h3>
        <button
          onClick={onReset}
          className="text-on-surface-variant hover:text-on-surface flex items-center gap-1 text-xs transition-colors cursor-pointer"
          title="Reset filters"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      <div className="space-y-5">
        <div>
          <h4 className="text-xs font-mono font-medium text-on-surface-variant mb-2.5 uppercase tracking-wider">Difficulty Tier</h4>
          <div className="flex flex-wrap gap-1.5">
            {difficulties.map(diff => (
              <button
                key={diff}
                onClick={() => onSelectDifficulty(selectedDifficulty === diff ? null : diff)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-mono font-semibold transition-all border cursor-pointer",
                  selectedDifficulty === diff 
                    ? "bg-primary-container text-on-primary border-primary-container shadow-xs" 
                    : "bg-surface-cream border-border-hairline text-on-surface-variant hover:bg-surface-paper hover:text-on-surface"
                )}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-mono font-medium text-on-surface-variant mb-2.5 uppercase tracking-wider">Topic Index</h4>
          {topics.length > 0 ? (
            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => onSelectTopic(null)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  !selectedTopic 
                    ? "bg-primary text-on-primary font-semibold shadow-xs" 
                    : "text-on-surface-variant hover:bg-surface-cream hover:text-on-surface"
                )}
              >
                All Topics
              </button>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => onSelectTopic(topic)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                    selectedTopic === topic 
                      ? "bg-primary text-on-primary font-semibold shadow-xs" 
                      : "text-on-surface-variant hover:bg-surface-cream hover:text-on-surface"
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant">No topics available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
