import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { playClick } from '../../utils/sound';
import { motion } from 'framer-motion';

const COLORS = [
  { id: 'orange', class: 'bg-amber-500 text-white', textClass: 'text-amber-600', name: 'Orange' },
  { id: 'blue', class: 'bg-blue-600 text-white', textClass: 'text-blue-600', name: 'Blue' },
  { id: 'green', class: 'bg-emerald-500 text-white', textClass: 'text-emerald-600', name: 'Green' },
  { id: 'grey', class: 'bg-slate-500 text-white', textClass: 'text-slate-600', name: 'Grey' },
];

interface RuleType {
  text: string;
  check: (content: (string | number)[]) => string;
  allowedColors: string[];
}

const RULES: RuleType[] = [
  {
    text: "If grid contains 'Z', mark Orange. Otherwise mark Blue.",
    check: (content) => content.includes('Z') ? 'orange' : 'blue',
    allowedColors: ['orange', 'blue'],
  },
  {
    text: "If all numbers are Even, mark Green. Otherwise mark Grey.",
    check: (content) => {
      const nums = content.filter((c): c is number => typeof c === 'number');
      const allEven = nums.length > 0 && nums.every(n => n % 2 === 0);
      return allEven ? 'green' : 'grey';
    },
    allowedColors: ['green', 'grey'],
  },
  {
    text: "If grid contains any Vowel (A, E, I), mark Orange. Otherwise mark Blue.",
    check: (content) => content.some(c => typeof c === 'string' && 'AEI'.includes(c)) ? 'orange' : 'blue',
    allowedColors: ['orange', 'blue'],
  },
  {
    text: "If the sum of all numbers exceeds 10, mark Green. Otherwise mark Grey.",
    check: (content) => {
      const sum = content.filter((c): c is number => typeof c === 'number').reduce((a, b) => a + b, 0);
      return sum > 10 ? 'green' : 'grey';
    },
    allowedColors: ['green', 'grey'],
  },
  {
    text: "If grid contains 3 or more Numbers, mark Orange. Otherwise mark Blue.",
    check: (content) => {
      const numCount = content.filter(c => typeof c === 'number').length;
      return numCount >= 3 ? 'orange' : 'blue';
    },
    allowedColors: ['orange', 'blue'],
  },
  {
    text: "If grid contains at least one Odd number, mark Green. Otherwise mark Grey.",
    check: (content) => {
      const hasOdd = content.some(c => typeof c === 'number' && c % 2 !== 0);
      return hasOdd ? 'green' : 'grey';
    },
    allowedColors: ['green', 'grey'],
  }
];

export const ColorTheGridGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [grids, setGrids] = useState<(string | number)[][]>([]);
  const [rule, setRule] = useState<RuleType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[0].id);
  const [userColors, setUserColors] = useState<{ [index: number]: string }>({});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateGridContent = useCallback(() => {
    const content: (string | number)[] = [];
    const chars = 'ABEZXY';
    for (let i = 0; i < 4; i++) {
      if (Math.random() > 0.45) {
        content.push(Math.floor(Math.random() * 9) + 1);
      } else {
        content.push(chars[Math.floor(Math.random() * chars.length)]);
      }
    }
    return content;
  }, []);

  const generateLevel = useCallback(() => {
    setFeedback(null);
    const newGrids: (string | number)[][] = [];
    for (let i = 0; i < 4; i++) {
      newGrids.push(generateGridContent());
    }
    setGrids(newGrids);
    setUserColors({});

    const chosenRule = RULES[Math.floor(Math.random() * RULES.length)];
    setRule(chosenRule);
    setSelectedColor(chosenRule.allowedColors[0]);
    resetLevelTimer();
  }, [generateGridContent, resetLevelTimer]);

  useEffect(() => {
    generateLevel();
  }, [level, generateLevel]);

  const handleGridClick = (index: number) => {
    playClick();
    setUserColors(prev => ({ ...prev, [index]: selectedColor }));
  };

  const handleSubmit = useCallback(() => {
    if (!rule || feedback !== null) return;
    playClick();

    let correct = true;
    for (let i = 0; i < grids.length; i++) {
      const expected = rule.check(grids[i]);
      if (userColors[i] !== expected) {
        correct = false;
        break;
      }
    }

    if (correct) {
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
    } else {
      setFeedback('wrong');
      submitAnswer(false);
      setTimeout(() => setFeedback(null), 800);
    }
  }, [rule, grids, userColors, feedback, submitAnswer]);

  // Keyboard Hotkeys: 1-4 for palette, Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        const idx = Number(e.key) - 1;
        if (COLORS[idx]) {
          e.preventDefault();
          playClick();
          setSelectedColor(COLORS[idx].id);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmit]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3, 4', action: 'Pick Palette Color' },
    { key: 'Enter', action: 'Confirm & Submit' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Evaluate Rule Condition",
      desc: "Read the active conditional rule statement at the top. Determine whether each of the 4 grids satisfies the criterion.",
    },
    {
      title: "Tag Grid Color",
      desc: "Select the corresponding color in your palette (or press keys 1-4) and click the target grid to tag it.",
    },
    {
      title: "Lock In Submission",
      desc: "Once all 4 grids are classified, click 'Submit Classification' or press Enter to lock in your answer.",
    }
  ];

  if (!rule) return null;

  return (
    <AdaptiveGameShell
      title="Color the Grid"
      category="Conditional Classification"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto w-full gap-6">
        
        {/* Active Evaluation Rule Box */}
        <div className="bg-surface-paper p-4 sm:p-5 rounded-2xl border border-secondary/30 text-on-surface text-center max-w-xl shadow-xs w-full">
          <span className="text-[10px] uppercase font-mono font-bold text-secondary tracking-wider block mb-1">
            Active Evaluation Rule (Level {level})
          </span>
          <p className="text-sm sm:text-base font-semibold text-on-surface">{rule.text}</p>
        </div>

        {/* 4 Alphanumeric Grids */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {grids.map((content, idx) => {
            const colorId = userColors[idx];
            const colorObj = COLORS.find(c => c.id === colorId);

            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGridClick(idx)}
                  className={`w-28 h-28 sm:w-32 sm:h-32 grid grid-cols-2 gap-1.5 p-2 rounded-2xl shadow-xs cursor-pointer transition-all border-2 ${
                    colorObj
                      ? `${colorObj.class} border-transparent shadow-md scale-102`
                      : 'bg-surface-paper border-border-hairline hover:border-secondary'
                  }`}
                >
                  {content.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center bg-surface-cream/90 rounded-lg font-black font-mono text-base text-on-surface shadow-2xs"
                    >
                      {item}
                    </div>
                  ))}
                </button>
                <span className="text-[10px] font-mono text-on-surface-variant font-bold">
                  Grid #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        {/* Color Palette Selector */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="text-[11px] font-mono text-on-surface-variant font-semibold uppercase tracking-wider">
            Select Color Tag
          </span>
          <div className="flex gap-2.5 p-2 bg-surface-paper rounded-2xl border border-border-hairline shadow-xs">
            {rule.allowedColors.map((colorId) => {
              const c = COLORS.find(col => col.id === colorId);
              if (!c) return null;
              const isSelected = selectedColor === c.id;

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedColor(c.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all border ${
                    isSelected
                      ? `${c.class} border-transparent shadow-sm scale-105`
                      : 'bg-surface-cream text-on-surface border-border-hairline hover:bg-surface-paper'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${c.class}`}></span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="w-full max-w-xs mt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={Object.keys(userColors).length < 4}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-xs cursor-pointer ${
              feedback === 'correct'
                ? 'bg-emerald-600 text-white'
                : feedback === 'wrong'
                ? 'bg-rose-600 text-white'
                : Object.keys(userColors).length === 4
                ? 'bg-primary text-on-primary hover:bg-surface-charcoal'
                : 'bg-surface-cream text-on-surface-variant border border-border-hairline cursor-not-allowed opacity-60'
            }`}
          >
            {feedback === 'correct'
              ? '✓ Level Solved! Advancing...'
              : feedback === 'wrong'
              ? '✕ Classification Incorrect - Try Again'
              : Object.keys(userColors).length === 4
              ? 'Submit Classification [Enter]'
              : `Tag All 4 Grids (${Object.keys(userColors).length}/4)`}
          </button>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default ColorTheGridGame;
