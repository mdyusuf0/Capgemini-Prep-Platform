import React from 'react';
import { Star, Clock, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Question } from '@/services/questionService';

function parseReadingQuestion(rawText: string): { passage: string | null; questionText: string } {
  if (!rawText) return { passage: null, questionText: '' };

  const matchExcerpt = rawText.match(/(?:Read the excerpt|Passage|Read the following passage)[:\s]*\n*["“]([\s\S]+?)["”]\s*(?:\n+Question:\s*|\n+Q:\s*|\n+)?([\s\S]*)/i);
  if (matchExcerpt) {
    const passage = matchExcerpt[1].trim();
    const prompt = matchExcerpt[2].replace(/^Question:\s*/i, '').trim();
    return { passage, questionText: prompt || 'Based on the passage above, select the most appropriate option.' };
  }

  const splitQuestion = rawText.split(/\n+Question:\s*/i);
  if (splitQuestion.length > 1) {
    const passage = splitQuestion[0].replace(/^(?:Read the excerpt|Passage)[:\s]*/i, '').trim().replace(/^["“]|["”]$/g, '');
    const prompt = splitQuestion.slice(1).join('\nQuestion: ').trim();
    return { passage, questionText: prompt };
  }

  return { passage: null, questionText: rawText };
}

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
    <div className="bg-surface-paper border border-border-hairline rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs text-on-surface">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={cn(
            "px-2.5 py-0.5 rounded text-xs font-code font-bold uppercase",
            question.difficulty?.toLowerCase() === 'easy' ? "bg-accent-mint/20 text-[#1b5e20] border border-accent-mint/30" :
            question.difficulty?.toLowerCase() === 'medium' ? "bg-accent-yellow/30 text-[#7c5e00] border border-accent-yellow/40" :
            "bg-accent-pink/20 text-[#9c0032] border border-accent-pink/30"
          )}>
            {question.difficulty}
          </span>
          <span className="px-2 py-0.5 rounded bg-surface-cream text-secondary border border-border-hairline text-xs font-medium flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-secondary" /> Capgemini Pattern
          </span>
        </div>
        
        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
          <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-3.5 h-3.5", i < (question.relevance || 3) ? "fill-amber-400 text-amber-500" : "text-border-hairline")} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-on-primary bg-surface-charcoal px-3 py-1 rounded-lg text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-accent-pink animate-pulse" />
            {formatTime(timer)}
          </div>
          <button 
            onClick={onBookmark}
            className="p-2 hover:bg-surface-cream rounded-lg transition-colors border border-transparent hover:border-border-hairline min-h-[36px] min-w-[36px] flex items-center justify-center touch-manipulation"
            title="Bookmark"
          >
            <Star className={cn("w-4 h-4", isBookmarked ? "fill-amber-400 text-amber-500" : "text-on-surface-variant")} />
          </button>
        </div>
      </div>

      {/* Question / Reading Passage Rendering */}
      {(() => {
        const rawText = question.question || question.questionText || question.description || question.title || '';
        const { passage, questionText } = parseReadingQuestion(rawText);

        return (
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {passage && (
              <div className="bg-surface-cream/80 border border-border-hairline rounded-2xl p-4 sm:p-5 md:p-6 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2 text-secondary font-mono text-xs font-bold uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Reading Passage Excerpt</span>
                  </div>
                  <span className="text-[10px] font-mono text-on-surface-variant bg-white px-2.5 py-0.5 rounded-full border border-border-hairline">
                    Capgemini Verbal Reading Comprehension
                  </span>
                </div>
                <div className="text-sm md:text-base leading-relaxed text-on-surface bg-white/90 p-3.5 sm:p-4 md:p-5 rounded-xl border border-border-hairline/80 font-serif italic shadow-2xs">
                  "{passage}"
                </div>
              </div>
            )}
            <div className="text-base sm:text-lg md:text-xl font-bold text-on-surface leading-relaxed tracking-tight">
              {questionText}
            </div>
          </div>
        );
      })()}

      {/* Options */}
      <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const isCorrect = isAnswered && question.answer !== undefined && Number(question.answer) === idx;
          const isWrong = isAnswered && isSelected && !isCorrect;

          let optionStyle = "border-border-hairline bg-surface-cream/60 hover:bg-surface-cream hover:border-on-surface-variant/30 text-on-surface";
          let badgeStyle = "bg-surface-paper border border-border-hairline text-on-surface-variant font-semibold";

          if (isAnswered) {
            if (isCorrect) {
              optionStyle = "border-accent-mint bg-accent-mint/15 text-on-surface font-semibold shadow-xs";
              badgeStyle = "bg-accent-mint text-primary font-bold";
            } else if (isWrong) {
              optionStyle = "border-accent-pink bg-accent-pink/15 text-[#9c0032] font-medium";
              badgeStyle = "bg-accent-pink text-white font-bold";
            } else {
              optionStyle = "border-border-hairline bg-surface-cream/30 opacity-40 text-on-surface-variant cursor-not-allowed";
              badgeStyle = "bg-surface-cream text-on-surface-variant/60";
            }
          } else if (isSelected) {
            optionStyle = "border-primary-container bg-primary-container text-on-primary shadow-xs";
            badgeStyle = "bg-white text-primary font-bold";
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => onSelectAnswer(idx)}
              className={cn(
                "w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center gap-3.5 cursor-pointer font-sans min-h-[48px] touch-manipulation active:scale-98",
                optionStyle
              )}
            >
              <div className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 transition-colors",
                badgeStyle
              )}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="leading-relaxed text-sm sm:text-base font-medium break-words">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Submit Button */}
      {!isAnswered && (
        <button
          onClick={onSubmit}
          disabled={selectedAnswer === null}
          className="w-full py-3.5 sm:py-4 bg-primary hover:bg-surface-charcoal disabled:opacity-40 disabled:cursor-not-allowed text-on-primary rounded-xl font-medium transition-colors shadow-sm cursor-pointer text-sm sm:text-base min-h-[48px] touch-manipulation active:scale-98"
        >
          Submit Answer
        </button>
      )}
    </div>
  );
}
