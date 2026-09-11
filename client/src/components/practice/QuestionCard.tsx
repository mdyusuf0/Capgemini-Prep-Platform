import React from 'react';
import { Star, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/services/questionService';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  isAnswered: boolean;
  onSelectAnswer: (index: number) => void;
  onSubmit: () => void;
  onBookmark: () => void;
  isBookmarked: boolean;
  questionNumber: number;
  totalQuestions: number;
  timer: number;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export default function QuestionCard({
  question,
  selectedAnswer,
  isAnswered,
  onSelectAnswer,
  onSubmit,
  onBookmark,
  isBookmarked,
  questionNumber,
  totalQuestions,
  timer
}: QuestionCardProps) {
  return (
    <div className="bg-surface border border-white/10 rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 font-medium">Question {questionNumber} of {totalQuestions}</span>
          <span className={cn(
            "px-2.5 py-0.5 rounded-full text-xs font-semibold",
            question.difficulty === 'Easy' ? "bg-green-500/10 text-green-500" :
            question.difficulty === 'Medium' ? "bg-amber-500/10 text-amber-500" :
            "bg-red-500/10 text-red-500"
          )}>
            {question.difficulty}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Capgemini-style
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-4 h-4", i < question.relevance ? "fill-current" : "text-gray-600")} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-mono text-sm">
            <Clock className="w-4 h-4" />
            {formatTime(timer)}
          </div>
          <button 
            onClick={onBookmark}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <Star className={cn("w-5 h-5", isBookmarked ? "fill-amber-400 text-amber-400" : "text-gray-400")} />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
        {question.questionText}
      </div>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          // When not answered, simple selection styles.
          // When answered, we don't know the exact correct answer here unless we show it after submission.
          // The parent component handles correct/incorrect highlighting by passing isAnswered.
          // However, we just show selection state. Correctness comes via explanation panel.
          // Assuming we just disable and lock selection when isAnswered=true.
          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelectAnswer(idx)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4",
                isSelected && !isAnswered ? "border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "border-white/5 bg-white/5 hover:bg-white/10",
                isAnswered && isSelected ? "border-blue-500 opacity-80" : "",
                isAnswered && !isSelected ? "opacity-50 cursor-not-allowed" : ""
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                isSelected ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400"
              )}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-gray-200">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isAnswered && (
        <button
          onClick={onSubmit}
          disabled={selectedAnswer === null}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-white/10 disabled:text-gray-500 text-white rounded-xl font-semibold transition-colors"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
