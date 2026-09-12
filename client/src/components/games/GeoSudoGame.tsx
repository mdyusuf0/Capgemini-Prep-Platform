import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Square, Triangle, Circle, Plus, Star, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { GeoSudoEngine, GeoSudoPuzzle } from '../../services/cognitiveEngine';

interface SymbolDef {
  char: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

const SYMBOL_MAP: Record<string, SymbolDef> = {
  '▲': { char: '▲', name: 'Triangle', icon: Triangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  '■': { char: '■', name: 'Square', icon: Square, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  '●': { char: '●', name: 'Circle', icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  '★': { char: '★', name: 'Star', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  '♦': { char: '♦', name: 'Diamond', icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
};

export const GeoSudoGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<GeoSudoPuzzle | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    setSelectedOption(null);
    const newPuzzle = GeoSudoEngine.generate(level);
    setPuzzle(newPuzzle);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleOptionSelect = useCallback((symbol: string) => {
    if (!puzzle || feedback !== null) return;
    playClick();
    setSelectedOption(symbol);

    if (symbol === puzzle.solution) {
      setFeedback('correct');
      playCorrect();
      setTimeout(() => submitAnswer(true), 500);
    } else {
      setFeedback('wrong');
      playWrong();
      submitAnswer(false);
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 700);
    }
  }, [puzzle, feedback, submitAnswer]);

  // Keyboard hotkeys: 1 to 5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || feedback !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= puzzle.options.length) {
        e.preventDefault();
        handleOptionSelect(puzzle.options[num - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, feedback, handleOptionSelect]);

  if (!puzzle) return null;

  const size = puzzle.size;
  const is5x5 = size === 5;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Latin-Square Deductive Logic",
      desc: `Each row and column must contain every geometric symbol exactly once (${size} distinct symbols).`,
    },
    {
      title: "Find the Missing Symbol at '?'",
      desc: "Identify the unique symbol that must occupy the highlighted target cell '?' through row and column elimination.",
    },
    {
      title: "Select from Palette",
      desc: "Click the correct symbol below or press keys 1 through " + size + ".",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: `1 to ${size}`, action: 'Select Candidate Symbol' },
  ];

  return (
    <AdaptiveGameShell
      title="GeoSudo"
      category="Deductive Logic"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Level & Depth Header Badge */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            {size}×{size} Latin Square
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline">
            Deductive Depth: Level {puzzle.deductiveDepth}
          </span>
        </div>

        {/* Latin Square Grid Display - Responsive Aspect Container */}
        <div className="p-2.5 sm:p-5 bg-surface-paper border border-border-hairline rounded-3xl shadow-xs w-full max-w-[min(90vw,360px)] aspect-square flex items-center justify-center">
          <div
            className="grid gap-1.5 sm:gap-2.5 w-full h-full"
            style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
          >
            {puzzle.grid.map((row, r) =>
              row.map((val, c) => {
                const isTarget = puzzle.targetCell.row === r && puzzle.targetCell.col === c;
                const symDef = val ? SYMBOL_MAP[val] : null;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-full h-full aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center border-2 transition-all select-none ${
                      isTarget
                        ? feedback === 'correct'
                          ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200'
                          : feedback === 'wrong'
                          ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                          : 'bg-amber-50/80 border-amber-400 ring-4 ring-amber-200/60 shadow-xs animate-pulse'
                        : val !== null
                        ? 'bg-surface-cream/70 border-border-hairline'
                        : 'bg-surface-paper border-dashed border-border-hairline/80'
                    }`}
                  >
                    {isTarget ? (
                      feedback === 'correct' ? (
                        <Check size={24} className="text-emerald-600 font-bold" />
                      ) : (
                        <span className="text-lg sm:text-2xl font-black font-mono text-amber-600">?</span>
                      )
                    ) : symDef ? (
                      <symDef.icon size={is5x5 ? 18 : 22} strokeWidth={2.5} className={symDef.color} />
                    ) : null}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Options / Symbol Palette */}
        <div className="w-full flex flex-col items-center gap-2 sm:gap-3">
          <div className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-muted text-center">
            Choose symbol for Target Cell [ ? ]:
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {puzzle.options.map((opt, idx) => {
              const symDef = SYMBOL_MAP[opt];
              const isSelected = selectedOption === opt;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleOptionSelect(opt)}
                  disabled={feedback !== null}
                  className={`flex flex-col items-center justify-center w-14 h-14 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                    isSelected && feedback === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-105'
                      : isSelected && feedback === 'wrong'
                      ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                      : 'bg-surface-paper border-border-hairline hover:border-secondary hover:scale-103'
                  }`}
                >
                  {symDef && (
                    <symDef.icon size={22} strokeWidth={2.5} className={symDef.color} />
                  )}
                  <span className="text-[9px] sm:text-[10px] font-mono text-muted font-bold mt-0.5 sm:mt-1">
                    {idx + 1}
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

export default GeoSudoGame;
