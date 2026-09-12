import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { motion } from 'framer-motion';
import { Square, Triangle, Circle, Plus, ArrowDown } from 'lucide-react';
import { playClick } from '../../utils/sound';

interface ShapeDef {
  id: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  name: string;
}

const SHAPES: ShapeDef[] = [
  { id: 'square', icon: Square, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', name: 'Square' },
  { id: 'triangle', icon: Triangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', name: 'Triangle' },
  { id: 'circle', icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', name: 'Circle' },
  { id: 'plus', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', name: 'Plus' },
];

export const SwitchChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [inputSeq, setInputSeq] = useState<ShapeDef[]>([]);
  const [outputSeq, setOutputSeq] = useState<ShapeDef[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateLevel = useCallback(() => {
    setFeedback(null);

    // 1. Generate random input sequence (4 distinct shapes)
    const shuffled = [...SHAPES].sort(() => Math.random() - 0.5);
    setInputSeq(shuffled);

    // 2. Generate random permutation code of [1, 2, 3, 4]
    const indices = [1, 2, 3, 4];
    const perm = [...indices].sort(() => Math.random() - 0.5);
    const code = perm.join('');
    setCorrectOption(code);

    // 3. Output sequence: Output[i] = inputSeq[perm[i] - 1]
    const newOutput = perm.map(p => shuffled[p - 1]);
    setOutputSeq(newOutput);

    // 4. Generate distractors
    const distractors = new Set<string>();
    distractors.add(code);
    while (distractors.size < 4) {
      const d = [1, 2, 3, 4].sort(() => Math.random() - 0.5).join('');
      distractors.add(d);
    }
    setOptions(Array.from(distractors).sort());
    resetLevelTimer();
  }, [resetLevelTimer]);

  useEffect(() => {
    generateLevel();
  }, [level, generateLevel]);

  const handleOptionClick = useCallback((opt: string) => {
    if (feedback !== null) return;
    playClick();

    if (opt === correctOption) {
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
    } else {
      setFeedback('wrong');
      submitAnswer(false);
      setTimeout(() => setFeedback(null), 700);
    }
  }, [correctOption, feedback, submitAnswer]);

  // Keyboard Hotkeys: 1-4 and A-D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (feedback !== null) return;
      const keyMap: Record<string, number> = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 'b': 1, 'c': 2, 'd': 3
      };
      const lowerKey = e.key.toLowerCase();
      if (lowerKey in keyMap && options[keyMap[lowerKey]]) {
        e.preventDefault();
        handleOptionClick(options[keyMap[lowerKey]]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, handleOptionClick, feedback]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3, 4', action: 'Select Option 1 to 4' },
    { key: 'A, B, C, D', action: 'Alternative Keys' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Inspect Input & Output Sequences",
      desc: "The top row shows the input positions 1, 2, 3, 4. The bottom row shows the transformed output positions.",
    },
    {
      title: "Decode the 4-Digit Permutation",
      desc: "Each digit in the code indicates the ORIGINAL index of the item that now occupies that position in the output.",
    },
    {
      title: "Fast Keyboard Selection",
      desc: "Press 1, 2, 3, 4 or A, B, C, D on your keyboard to lock in your answer with maximum speed.",
    }
  ];

  return (
    <AdaptiveGameShell
      title="Switch Challenge"
      category="Deductive Logic"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-2xl mx-auto w-full gap-7">

        {/* Input Sequence */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold font-mono text-on-surface-variant uppercase tracking-wider mb-2">
            Input Sequence (Positions 1 to 4)
          </span>
          <div className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 bg-surface-paper rounded-2xl shadow-xs border border-border-hairline">
            {inputSeq.map((shape, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl border ${shape.bg} ${shape.color} shadow-2xs`}
                >
                  <shape.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-mono font-bold text-on-surface-variant">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Switch Funnel Visual */}
        <div className="flex flex-col items-center gap-1 text-on-surface-variant">
          <div className="px-4 py-1.5 bg-secondary-fixed/50 border border-secondary/30 rounded-xl text-xs font-mono font-bold text-secondary flex items-center gap-1.5 shadow-2xs animate-pulse">
            <ArrowDown size={14} />
            <span>[ SWITCH OPERATOR ? ]</span>
            <ArrowDown size={14} />
          </div>
        </div>

        {/* Output Sequence */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-bold font-mono text-on-surface-variant uppercase tracking-wider mb-2">
            Transformed Output Sequence
          </span>
          <div className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 bg-surface-paper rounded-2xl shadow-xs border border-border-hairline">
            {outputSeq.map((shape, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl border ${shape.bg} ${shape.color} shadow-2xs`}
                >
                  <shape.icon size={28} strokeWidth={2.5} />
                </div>
                <span className="text-xs font-mono font-bold text-on-surface-variant">Pos {i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Permutation Options */}
        <div className="w-full max-w-lg mt-2">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold block text-center mb-3">
            Which position mapping rule produced this output?
          </span>

          <div className="grid grid-cols-2 gap-3">
            {options.map((opt, idx) => {
              const keyLetter = String.fromCharCode(65 + idx);
              const isSelectedFeedback = feedback !== null && opt === correctOption;
              const isWrongFeedback = feedback === 'wrong';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionClick(opt)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer font-mono flex items-center justify-between shadow-xs ${
                    isSelectedFeedback
                      ? 'bg-emerald-600 text-white border-transparent scale-102'
                      : isWrongFeedback
                      ? 'bg-surface-cream border-border-hairline opacity-75'
                      : 'bg-surface-paper border-border-hairline hover:border-secondary hover:bg-surface-cream'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-surface-cream border border-border-hairline text-on-surface text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-on-surface-variant font-bold">[{keyLetter}]</span>
                  </div>
                  <span className="text-base font-black tracking-widest text-on-surface">
                    {opt.split('').join(' ')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default SwitchChallengeGame;
