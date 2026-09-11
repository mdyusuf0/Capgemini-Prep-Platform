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
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        className={cn(
          "p-6 rounded-xl border shadow-xs bg-surface-paper",
          isCorrect ? "border-accent-mint/50 bg-accent-mint/5" : "border-accent-pink/40 bg-accent-pink/5"
        )}
      >
        <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-border-hairline">
          {isCorrect ? (
            <CheckCircle className="w-5 h-5 text-[#1b5e20]" />
          ) : (
            <XCircle className="w-5 h-5 text-[#9c0032]" />
          )}
          <h3 className={cn("text-base font-bold", isCorrect ? "text-[#1b5e20]" : "text-[#9c0032]")}>
            {isCorrect ? "Evaluation Verified • Correct" : "Evaluation Flagged • Incorrect"}
          </h3>
        </div>

        <div className="space-y-4 text-on-surface">
          <div>
            <h4 className="font-semibold text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
              Architectural Rationale
            </h4>
            <p className="text-sm leading-relaxed text-on-surface whitespace-pre-wrap">{explanation}</p>
          </div>
          
          {whyOthersWrong && (
            <div className="p-3.5 bg-surface-cream rounded-lg border border-border-hairline">
              <h4 className="font-semibold text-xs font-mono uppercase tracking-wider text-on-surface-variant mb-1">
                Distractor Analysis
              </h4>
              <p className="text-xs leading-relaxed text-on-surface-variant whitespace-pre-wrap">{whyOthersWrong}</p>
            </div>
          )}

          <div className="pt-3 border-t border-border-hairline flex items-center justify-between">
            <span className="text-xs px-2 py-0.5 bg-surface-cream rounded border border-border-hairline font-mono text-on-surface-variant">
              Concept: {topic}
            </span>
            <button
              onClick={onNext}
              className="px-5 py-2 bg-primary hover:bg-surface-charcoal text-on-primary rounded-lg text-xs font-medium transition-colors shadow-xs cursor-pointer"
            >
              Next Question →
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
