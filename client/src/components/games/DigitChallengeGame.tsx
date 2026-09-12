import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Delete, Check, RotateCcw } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { DigitEngine, DigitPuzzle } from '../../services/cognitiveEngine';

export const DigitChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<DigitPuzzle | null>(null);
  const [userSlots, setUserSlots] = useState<{ [pos: number]: number | null }>({});
  const [activeSlotIdx, setActiveSlotIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    const newPuzzle = DigitEngine.generate(level);
    setPuzzle(newPuzzle);

    const initialSlots: { [pos: number]: number | null } = {};
    newPuzzle.missingPositions.forEach(pos => {
      initialSlots[pos] = null;
    });
    setUserSlots(initialSlots);
    setActiveSlotIdx(newPuzzle.missingPositions[0]);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleDigitPick = useCallback((digit: number) => {
    if (!puzzle || feedback !== null) return;
    playClick();

    // Check if digit already used in userSlots
    const alreadyUsed = Object.values(userSlots).includes(digit);
    if (alreadyUsed) return;

    setUserSlots(prev => {
      const updated = { ...prev, [activeSlotIdx]: digit };

      // Auto-advance activeSlotIdx to next empty missing position
      const nextEmpty = puzzle.missingPositions.find(p => p !== activeSlotIdx && updated[p] === null);
      if (nextEmpty !== undefined) {
        setActiveSlotIdx(nextEmpty);
      }

      // Check if all slots filled
      const allFilled = puzzle.missingPositions.every(p => updated[p] !== null);
      if (allFilled) {
        // Construct full operand array
        const finalOperands = Array.from({ length: puzzle.operandCount }, (_, i) => {
          if (puzzle.missingPositions.includes(i)) {
            return updated[i]!;
          }
          return puzzle.correctDigits[i];
        });

        // Evaluate with BODMAS
        const result = DigitEngine.evaluateBODMAS(finalOperands, puzzle.operators);

        if (result === puzzle.target) {
          setFeedback('correct');
          playCorrect();
          setTimeout(() => submitAnswer(true), 500);
        } else {
          setFeedback('wrong');
          playWrong();
          submitAnswer(false);
          setTimeout(() => {
            setFeedback(null);
            // Clear inputs
            const resetMap: { [pos: number]: number | null } = {};
            puzzle.missingPositions.forEach(p => { resetMap[p] = null; });
            setUserSlots(resetMap);
            setActiveSlotIdx(puzzle.missingPositions[0]);
          }, 800);
        }
      }

      return updated;
    });
  }, [puzzle, feedback, activeSlotIdx, userSlots, submitAnswer]);

  const handleClearSlot = useCallback((pos: number) => {
    playClick();
    setUserSlots(prev => ({ ...prev, [pos]: null }));
    setActiveSlotIdx(pos);
  }, []);

  const handleResetAll = useCallback(() => {
    if (!puzzle) return;
    playClick();
    const resetMap: { [pos: number]: number | null } = {};
    puzzle.missingPositions.forEach(p => { resetMap[p] = null; });
    setUserSlots(resetMap);
    setActiveSlotIdx(puzzle.missingPositions[0]);
  }, [puzzle]);

  // Keyboard support: 1 to 9, Backspace
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || feedback !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= 9 && puzzle.availableDigits.includes(num)) {
        e.preventDefault();
        handleDigitPick(num);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleClearSlot(activeSlotIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, feedback, activeSlotIdx, handleDigitPick, handleClearSlot]);

  if (!puzzle) return null;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Mental Calculation Velocity",
      desc: "Fill in the missing numbers to satisfy the target value using strict BODMAS precedence (×, ÷ before +, -).",
    },
    {
      title: "Non-Repeating Digits Constraint",
      desc: "Each number in the equation must be unique. No duplicate digits may be selected.",
    },
    {
      title: "Fast Input",
      desc: "Click digits from the palette or press number keys 1 to 9 on your keyboard.",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1 to 9', action: 'Input Digit' },
    { key: 'Backspace', action: 'Clear Current Slot' },
  ];

  return (
    <AdaptiveGameShell
      title="Digit Challenge"
      category="Numerical Velocity & Precedence"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Level & Precedence header */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            {puzzle.operandCount} Operands (BODMAS)
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline">
            Target = {puzzle.target}
          </span>
        </div>

        {/* Equation Board Display */}
        <div className="w-full bg-surface-paper border border-border-hairline rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-xs flex flex-col items-center gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
            {Array.from({ length: puzzle.operandCount }).map((_, i) => {
              const isMissing = puzzle.missingPositions.includes(i);
              const isCurrent = activeSlotIdx === i;
              const userVal = userSlots[i];
              const displayVal = isMissing ? userVal : puzzle.correctDigits[i];
              const op = puzzle.operators[i];

              return (
                <React.Fragment key={i}>
                  {/* Operand Slot */}
                  <button
                    type="button"
                    onClick={() => isMissing && setActiveSlotIdx(i)}
                    disabled={!isMissing || feedback !== null}
                    className={`w-11 h-12 sm:w-16 sm:h-17 rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-black text-lg sm:text-2xl transition-all shadow-2xs touch-manipulation ${
                      !isMissing
                        ? 'bg-surface-cream border-2 border-border-hairline text-foreground cursor-default'
                        : isCurrent
                        ? 'bg-secondary/10 border-2 border-secondary ring-2 sm:ring-4 ring-secondary/20 text-secondary scale-103'
                        : displayVal !== null
                        ? 'bg-surface-paper border-2 border-border-hairline text-foreground hover:border-secondary'
                        : 'bg-amber-50/70 border-2 border-dashed border-amber-300 text-amber-600'
                    }`}
                  >
                    {displayVal !== null && displayVal !== undefined ? (
                      displayVal
                    ) : (
                      <span className="text-base sm:text-xl font-bold opacity-60">?</span>
                    )}
                  </button>

                  {/* Operator */}
                  {op && (
                    <span className="text-base sm:text-2xl font-black font-mono text-muted px-0.5 sm:px-1">
                      {op}
                    </span>
                  )}
                </React.Fragment>
              );
            })}

            <span className="text-base sm:text-2xl font-black font-mono text-muted px-0.5 sm:px-1">=</span>

            {/* Target Value Box */}
            <div className="w-13 h-12 sm:w-18 sm:h-17 rounded-xl sm:rounded-2xl bg-surface-cream border-2 border-border-hairline flex items-center justify-center font-mono font-black text-lg sm:text-3xl text-primary shadow-xs">
              {puzzle.target}
            </div>
          </div>

          {/* Feedback Status */}
          {feedback === 'correct' && (
            <div className="flex items-center gap-2 text-emerald-600 font-mono font-bold text-xs sm:text-sm">
              <Check size={18} />
              <span>Correct equation verified!</span>
            </div>
          )}
          {feedback === 'wrong' && (
            <div className="text-rose-600 font-mono font-bold text-xs sm:text-sm">
              Incorrect calculation. Resetting slots...
            </div>
          )}
        </div>

        {/* Digit Selection Palette */}
        <div className="w-full flex flex-col items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-wider uppercase text-muted">
              Select Digit (No duplicates):
            </span>
            <button
              type="button"
              onClick={handleResetAll}
              className="text-xs font-mono text-muted hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors py-1 px-2 rounded-lg bg-surface-cream border border-border-hairline active:scale-95 touch-manipulation min-h-[32px]"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {puzzle.availableDigits.map(digit => {
              const isUsed = Object.values(userSlots).includes(digit);

              return (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitPick(digit)}
                  disabled={isUsed || feedback !== null}
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-2 font-mono font-black text-lg sm:text-xl transition-all shadow-xs touch-manipulation ${
                    isUsed
                      ? 'bg-surface-cream border-border-hairline opacity-30 cursor-not-allowed text-muted'
                      : 'bg-surface-paper border-border-hairline hover:border-secondary hover:scale-105 active:scale-95 text-foreground cursor-pointer'
                  }`}
                >
                  {digit}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default DigitChallengeGame;
