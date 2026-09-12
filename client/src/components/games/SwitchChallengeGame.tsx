import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Square, Triangle, Circle, Plus, Star, ArrowDown, Check } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { SwitchEngine, SwitchPuzzle } from '../../services/cognitiveEngine';

interface SymbolDef {
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

const SYMBOL_DEFS: Record<string, SymbolDef> = {
  '▲': { icon: Triangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  '■': { icon: Square, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  '●': { icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  '★': { icon: Star, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  '♦': { icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
};

export const SwitchChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<SwitchPuzzle | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    setSelectedIdx(null);
    const newPuzzle = SwitchEngine.generate(level);
    setPuzzle(newPuzzle);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleOptionSelect = useCallback((idx: number) => {
    if (!puzzle || feedback !== null) return;
    playClick();
    setSelectedIdx(idx);

    if (idx === puzzle.correctAnswerIndex) {
      setFeedback('correct');
      playCorrect();
      setTimeout(() => submitAnswer(true), 500);
    } else {
      setFeedback('wrong');
      playWrong();
      submitAnswer(false);
      setTimeout(() => {
        setFeedback(null);
        setSelectedIdx(null);
      }, 700);
    }
  }, [puzzle, feedback, submitAnswer]);

  // Hotkeys: 1 to 4 or A to D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || feedback !== null) return;
      const keyMap: Record<string, number> = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 'b': 1, 'c': 2, 'd': 3
      };
      const lower = e.key.toLowerCase();
      if (lower in keyMap && keyMap[lower] < puzzle.options.length) {
        e.preventDefault();
        handleOptionSelect(keyMap[lower]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, feedback, handleOptionSelect]);

  if (!puzzle) return null;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Reverse-Engineer the Permutation",
      desc: "Identify which switch code reorders the input elements into the output sequence.",
    },
    {
      title: "How Switch Codes Work",
      desc: "A code like '3 1 4 2' means: 1st output position comes from position 3, 2nd from position 1, etc.",
    },
    {
      title: "Watch Out for Distractors",
      desc: "Candidate options share common prefixes. Verify the entire sequence before choosing.",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3, 4', action: 'Select Option 1 to 4' },
    { key: 'A, B, C, D', action: 'Alternative Hotkeys' },
  ];

  const renderSequenceRow = (symbols: string[], label: string) => (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 w-full">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
        {label}
      </span>
      <div className="flex items-center justify-center gap-1.5 sm:gap-3 p-2 sm:p-3 bg-surface-cream/80 border border-border-hairline rounded-2xl max-w-full overflow-x-auto">
        {symbols.map((sym, i) => {
          const def = SYMBOL_DEFS[sym] || SYMBOL_DEFS['▲'];
          return (
            <div
              key={i}
              className={`w-9 h-9 sm:w-13 sm:h-13 rounded-lg sm:rounded-xl flex flex-col items-center justify-center border shadow-2xs shrink-0 ${def.bg}`}
            >
              <def.icon size={18} strokeWidth={2.5} className={def.color} />
              <span className="text-[8px] sm:text-[9px] font-mono font-bold text-muted mt-0.5">
                {i + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AdaptiveGameShell
      title="Switch Challenge"
      category="Deductive Sequence Permutation"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-5">

        {/* Level details badge */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            {puzzle.symbolCount} Symbols
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline">
            {puzzle.layers === 2 ? 'Two-Stage Switch' : 'Single-Stage Switch'}
          </span>
        </div>

        {/* Transformation Pipeline Card */}
        <div className="w-full bg-surface-paper border border-border-hairline rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col items-center gap-3">
          
          {/* 1. Input Sequence */}
          {renderSequenceRow(puzzle.inputSequence, 'Input Sequence')}

          <ArrowDown size={18} className="text-secondary animate-bounce" />

          {/* 2. Switch 1 */}
          {puzzle.layers === 2 ? (
            <>
              <div className="px-4 py-1.5 rounded-xl bg-surface-cream border border-border-hairline text-xs font-mono font-bold text-foreground flex items-center gap-2">
                <span>Switch 1 (Known):</span>
                <span className="px-2 py-0.5 rounded bg-secondary/10 text-secondary font-mono tracking-widest">
                  {puzzle.switch1.codeString}
                </span>
              </div>

              {puzzle.intermediateSequence && (
                renderSequenceRow(puzzle.intermediateSequence, 'Intermediate Sequence')
              )}

              <ArrowDown size={18} className="text-secondary animate-bounce" />

              <div className="px-5 py-2 rounded-xl bg-amber-50 border-2 border-dashed border-amber-400 text-xs font-mono font-bold text-amber-700 flex items-center gap-2 animate-pulse">
                <span>Switch 2 (Deduce ?):</span>
                <span className="text-sm font-black tracking-widest">[ ? ? ? ? ]</span>
              </div>

              <ArrowDown size={18} className="text-secondary animate-bounce" />
            </>
          ) : (
            <>
              <div className="px-5 py-2 rounded-xl bg-amber-50 border-2 border-dashed border-amber-400 text-xs font-mono font-bold text-amber-700 flex items-center gap-2 animate-pulse">
                <span>Switch Operator (Deduce ?):</span>
                <span className="text-sm font-black tracking-widest">[ ? ? ? ? ]</span>
              </div>

              <ArrowDown size={18} className="text-secondary animate-bounce" />
            </>
          )}

          {/* 3. Output Sequence */}
          {renderSequenceRow(puzzle.outputSequence, 'Target Output Sequence')}

        </div>

        {/* Options / Switch Codes */}
        <div className="w-full flex flex-col gap-3">
          <div className="text-xs font-mono font-bold tracking-wider uppercase text-muted text-center">
            Select matching switch operator code:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
            {puzzle.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  disabled={feedback !== null}
                  className={`flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer shadow-xs active:scale-98 ${
                    isSelected && feedback === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-102'
                      : isSelected && feedback === 'wrong'
                      ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                      : 'bg-surface-paper border-border-hairline hover:border-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-surface-cream border border-border-hairline text-xs font-mono font-bold flex items-center justify-center text-muted shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-mono text-base sm:text-lg font-black tracking-widest text-foreground">
                      {opt}
                    </span>
                  </div>
                  {isSelected && feedback === 'correct' && (
                    <Check size={20} className="text-emerald-600 font-bold shrink-0" />
                  )}
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
