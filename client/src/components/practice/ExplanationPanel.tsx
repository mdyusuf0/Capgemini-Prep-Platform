import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplanationPanelProps {
  isCorrect: boolean;
  explanation: string;
  whyOthersWrong: string;
  topic: string;
  onNext: () => void;
}

export default function ExplanationPanel({
  isCorrect,
  explanation,
  whyOthersWrong,
  topic,
  onNext
}: ExplanationPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={cn(
          "mt-6 p-6 rounded-xl border",
          isCorrect ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <XCircle className="w-6 h-6 text-red-500" />
          )}
          <h3 className={cn("text-xl font-bold", isCorrect ? "text-green-500" : "text-red-500")}>
            {isCorrect ? "Correct!" : "Incorrect!"}
          </h3>
        </div>

        <div className="space-y-4 text-gray-300">
          <div>
            <h4 className="font-semibold text-white mb-1">Explanation</h4>
            <p className="text-sm leading-relaxed">{explanation}</p>
          </div>
          
          {whyOthersWrong && (
            <div>
              <h4 className="font-semibold text-white mb-1">Why other options are wrong</h4>
              <p className="text-sm leading-relaxed">{whyOthersWrong}</p>
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs px-2 py-1 bg-white/5 rounded text-gray-400">
              Concept: {topic}
            </span>
            <button
              onClick={onNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Next Question
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
