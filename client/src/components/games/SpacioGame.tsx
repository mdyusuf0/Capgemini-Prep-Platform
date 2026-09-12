import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Circle, Square, Check } from 'lucide-react';
import { playClick } from '../../utils/sound';

interface ArrowProps {
  rotation: number;
}

const ArrowIcon: React.FC<ArrowProps> = ({ rotation }) => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ transform: `rotate(${rotation}deg)` }}
    className="transition-transform duration-200"
  >
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

interface QuestionOption {
  id: number;
  type: 'rotation' | 'count' | 'fill' | 'shape_kind';
  rotation?: number;
  count?: number;
  filled?: boolean;
  shapeKind?: 'square' | 'circle';
}

interface QuestionState {
  options: QuestionOption[];
  correct: number;
  explanation: string;
}

export const SpacioGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [currentQuestion, setCurrentQuestion] = useState<QuestionState | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateQuestion = useCallback(() => {
    setFeedback(null);
    const ruleTypes: ('ROTATION' | 'COUNT' | 'FILL' | 'SIDES')[] = ['ROTATION', 'COUNT', 'FILL', 'SIDES'];
    const chosenType = ruleTypes[Math.floor(Math.random() * ruleTypes.length)];
    const correctIdx = Math.floor(Math.random() * 5);
    const options: QuestionOption[] = [];
    let ruleExplanation = '';

    if (chosenType === 'ROTATION') {
      const step = Math.random() > 0.5 ? 90 : 45;
      const start = Math.floor(Math.random() * 8) * 45;
      for (let i = 0; i < 5; i++) {
        let rot = (start + i * step) % 360;
        if (i === correctIdx) {
          rot = (rot + (step === 90 ? 45 : 90)) % 360;
        }
        options.push({ id: i, rotation: rot, type: 'rotation' });
      }
      ruleExplanation = `All arrows rotate sequentially by ${step}° clockwise, except Option ${String.fromCharCode(65 + correctIdx)}.`;
    } else if (chosenType === 'COUNT') {
      const baseCount = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
      for (let i = 0; i < 5; i++) {
        let count = baseCount;
        if (i === correctIdx) {
          count = baseCount + 1;
        }
        options.push({ id: i, count, type: 'count' });
      }
      ruleExplanation = `All figures contain exactly ${baseCount} items, except Option ${String.fromCharCode(65 + correctIdx)} which has ${baseCount + 1}.`;
    } else if (chosenType === 'FILL') {
      const majorityFilled = Math.random() > 0.5;
      for (let i = 0; i < 5; i++) {
        const filled = (i === correctIdx) ? !majorityFilled : majorityFilled;
        options.push({ id: i, filled, type: 'fill' });
      }
      ruleExplanation = `Option ${String.fromCharCode(65 + correctIdx)} is the only ${majorityFilled ? 'hollow' : 'filled'} shape.`;
    } else {
      // SIDES / SHAPE TYPE
      for (let i = 0; i < 5; i++) {
        const shapeKind = (i === correctIdx) ? 'square' : 'circle';
        options.push({ id: i, shapeKind, type: 'shape_kind' });
      }
      ruleExplanation = `Option ${String.fromCharCode(65 + correctIdx)} is a Square, while all other options are Circles.`;
    }

    setCurrentQuestion({ options, correct: correctIdx, explanation: ruleExplanation });
    resetLevelTimer();
  }, [resetLevelTimer]);

  useEffect(() => {
    generateQuestion();
  }, [level, generateQuestion]);

  const handleOptionClick = useCallback((idx: number) => {
    if (!currentQuestion || feedback !== null) return;
    playClick();

    if (idx === currentQuestion.correct) {
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
    } else {
      setFeedback('wrong');
      submitAnswer(false);
      setTimeout(() => generateQuestion(), 700);
    }
  }, [currentQuestion, feedback, submitAnswer, generateQuestion]);

  // Keyboard Hotkeys: A-E or 1-5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyMap: Record<string, number> = {
        '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
        'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4,
      };
      const lower = e.key.toLowerCase();
      if (lower in keyMap) {
        e.preventDefault();
        handleOptionClick(keyMap[lower]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOptionClick]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: 'A, B, C, D, E', action: 'Select Figure' },
    { key: '1, 2, 3, 4, 5', action: 'Alternative Option Keys' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Identify the Pattern Breaker",
      desc: "Four of the five figures adhere to a consistent logical transformation rule. Exactly one figure violates the pattern.",
    },
    {
      title: "Transformation Principles",
      desc: "Analyze sequential rotation angles (45° / 90°), count symmetry, solid vs hollow shading, and shape topology.",
    },
    {
      title: "High-Velocity Selection",
      desc: "Press [A] through [E] or [1] through [5] on your keyboard to instantly record your deduction.",
    }
  ];

  if (!currentQuestion) return null;

  return (
    <AdaptiveGameShell
      title="Inductive Reasoning (Spacio)"
      category="Inductive Logic"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto w-full gap-7">

        <div className="text-center">
          <span className="text-[11px] font-bold font-mono text-on-surface-variant uppercase tracking-wider block mb-1">
            Level {level} Inductive Rule Discovery
          </span>
          <h2 className="text-base sm:text-lg font-bold text-on-surface">
            Which figure does NOT belong in this set?
          </h2>
        </div>

        {/* 5 Options Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full">
          {currentQuestion.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrectSelected = feedback === 'correct' && idx === currentQuestion.correct;
            const isWrongSelected = feedback === 'wrong' && idx === currentQuestion.correct;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleOptionClick(idx)}
                className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
                  isCorrectSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                    : isWrongSelected
                    ? 'bg-rose-100 border-rose-400'
                    : 'bg-surface-paper border-border-hairline hover:border-secondary hover:bg-surface-cream'
                }`}
              >
                {/* Visual Representation */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center bg-surface-cream rounded-xl border border-border-hairline shadow-2xs">
                  {opt.type === 'rotation' && opt.rotation !== undefined && (
                    <ArrowIcon rotation={opt.rotation} />
                  )}

                  {opt.type === 'count' && opt.count !== undefined && (
                    <div className="flex flex-wrap gap-1 items-center justify-center max-w-10">
                      {Array.from({ length: opt.count }).map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-secondary"></div>
                      ))}
                    </div>
                  )}

                  {opt.type === 'fill' && (
                    <div
                      className={`w-7 h-7 rounded-lg border-2 border-secondary ${
                        opt.filled ? 'bg-secondary' : 'bg-transparent'
                      }`}
                    />
                  )}

                  {opt.type === 'shape_kind' && (
                    <>
                      {opt.shapeKind === 'square' ? (
                        <Square size={28} className="text-secondary fill-secondary/20" />
                      ) : (
                        <Circle size={28} className="text-secondary fill-secondary/20" />
                      )}
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 font-mono text-xs font-bold text-on-surface">
                  <span>[{letter}]</span>
                  <span className="text-on-surface-variant font-normal">#{idx + 1}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Solved feedback */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-mono text-xs font-bold shadow-md">
            <Check size={16} /> Pattern Exception Found! Advancing to Level {level + 1}...
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};

export default SpacioGame;
