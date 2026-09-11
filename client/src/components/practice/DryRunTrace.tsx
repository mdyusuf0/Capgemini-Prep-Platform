import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DryRunTraceProps {
  trace: string;
}

const DryRunTrace: React.FC<DryRunTraceProps> = ({ trace }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse trace if it's formatted like a markdown table or simple lines
  // Assuming format: Step | Line | Variable States | Output
  const lines = trace.trim().split('\n');
  const isTable = lines[0].includes('|');

  return (
    <div className="mt-4 border border-gray-800 rounded-lg overflow-hidden bg-[#12121c]">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-[#1a1a2e] hover:bg-[#23233b] transition-colors"
      >
        <span className="font-medium text-blue-400 flex items-center gap-2">
          Step-by-Step Dry Run Trace
        </span>
        {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800"
          >
            <div className="p-4 overflow-x-auto">
              {isTable ? (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-400 uppercase bg-[#0a0a0a]">
                    <tr>
                      {lines[0].split('|').map((header, i) => (
                        header.trim() && <th key={i} className="px-4 py-2 border-b border-gray-800">{header.trim()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lines.slice(2).map((line, idx) => {
                      if (!line.includes('|')) return null;
                      return (
                        <tr key={idx} className="border-b border-gray-800 hover:bg-[#1a1a2e] transition-colors">
                          {line.split('|').map((cell, i) => (
                            cell.trim() && <td key={i} className="px-4 py-3 font-mono text-gray-300">{cell.trim()}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="font-mono text-sm space-y-1 text-gray-300">
                  {lines.map((line, idx) => (
                    <div key={idx} className="hover:bg-[#1a1a2e] px-2 py-1 rounded">
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DryRunTrace;
