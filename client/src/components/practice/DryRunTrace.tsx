import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LineChart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DryRunTraceProps {
  trace: string;
}

const DryRunTrace: React.FC<DryRunTraceProps> = ({ trace }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Parse trace if it's formatted like a markdown table or simple lines
  const lines = trace.trim().split('\n');
  const isTable = lines[0].includes('|');

  return (
    <div className="mt-4 border border-border-hairline rounded-xl overflow-hidden bg-surface-paper shadow-xs">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-surface-cream/70 hover:bg-surface-cream transition-colors cursor-pointer border-b border-border-hairline"
      >
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-secondary" />
          <span className="font-semibold text-xs font-mono uppercase tracking-wider text-on-surface">
            DryRunTrace: State Evolution
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface-variant">
            SCHEMA: VariableDump
          </span>
        </div>
        {isExpanded ? <ChevronUp size={16} className="text-on-surface-variant" /> : <ChevronDown size={16} className="text-on-surface-variant" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 overflow-x-auto">
              {isTable ? (
                <table className="w-full text-xs text-left font-mono">
                  <thead className="text-[11px] text-on-surface-variant uppercase bg-surface-cream border-b border-border-hairline">
                    <tr>
                      {lines[0].split('|').map((header, i) => (
                        header.trim() && <th key={i} className="px-3 py-2 font-semibold">{header.trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-hairline">
                    {lines.slice(2).map((line, idx) => {
                      if (!line.includes('|')) return null;
                      const isEven = idx % 2 === 0;
                      return (
                        <tr key={idx} className={isEven ? "bg-surface-paper hover:bg-surface-cream/60 transition-colors" : "bg-surface-cream/30 hover:bg-surface-cream/60 transition-colors"}>
                          {line.split('|').map((cell, i) => {
                            if (!cell.trim()) return null;
                            const text = cell.trim();
                            const isState = text.startsWith('{') || text.includes('=');
                            return (
                              <td key={i} className="px-3 py-2 text-on-surface font-mono">
                                {isState ? (
                                  <span className="px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold text-[11px]">
                                    {text}
                                  </span>
                                ) : (
                                  text
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="font-mono text-xs space-y-1 text-on-surface-variant bg-surface-cream p-3 rounded-lg border border-border-hairline">
                  {lines.map((line, idx) => (
                    <div key={idx} className="hover:bg-surface-paper px-2 py-0.5 rounded transition-colors text-on-surface">
                      {line}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] font-mono text-on-surface-variant pt-3 border-t border-border-hairline mt-3">
                <span>Displaying {Math.max(1, lines.length - 2)} trace records</span>
                <span className="text-secondary font-medium">Memory overhead: O(1) registers</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DryRunTrace;
