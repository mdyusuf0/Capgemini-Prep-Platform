import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Delete, Check } from 'lucide-react';
import { playClick } from '../../utils/sound';

interface EquationState {
  parts: (number | string)[];
  missingIndices: number[];
}

export const DigitChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [equation, setEquation] = useState<EquationState>({ parts: [], missingIndices: [] });
  const [userInputs, setUserInputs] = useState<{ [index: number]: number }>({});
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const evaluateExpression = useCallback((parts: (number | string)[]): number => {
    const tokens = [...parts];
    const collapsed: (number | string)[] = [];

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if ((token === '×' || token === '÷' || token === '*') && collapsed.length > 0 && i + 1 < tokens.length) {
        const left = Number(collapsed.pop());
        const right = Number(tokens[i + 1]);
        const value = (token === '×' || token === '*') ? left * right : Math.floor(left / right);
        collapsed.push(value);
        i += 1;
      } else {
        collapsed.push(token);
      }
    }

    let result = Number(collapsed[0]);
    for (let i = 1; i < collapsed.length; i += 2) {
      const operator = collapsed[i];
      const value = Number(collapsed[i + 1]);
      if (operator === '+') result += value;
      if (operator === '-') result -= value;
    }

    return result;
  }, []);

  const checkUnique = useCallback((nums: number[]): boolean => {
    const str = nums.join('');
    const unique = new Set(str.split(''));
    return unique.size === str.length;
  }, []);

  const generateLevel = useCallback(() => {
    setUserInputs({});
    setFeedback(null);

    let parts: (number | string)[] = [];
    let missingIndices: number[] = [];
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 150) {
      attempts++;
      parts = [];
      missingIndices = [];

      if (level <= 2) {
        const a = Math.floor(Math.random() * 9) + 1;
        const b = Math.floor(Math.random() * 9) + 1;
        const res = a + b;
        if (res <= 18 && checkUnique([a, b, res])) {
          parts = [a, '+', b, '=', res];
          missingIndices = [0];
          isValid = true;
        }
      } else if (level <= 5) {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 9) + 1;
        const res = a * b + c;

        if (res < 100 && checkUnique([a, b, c, res])) {
          parts = [a, '×', b, '+', c, '=', res];
          missingIndices = [0, 4];
          isValid = true;
        }
      } else {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        const c = Math.floor(Math.random() * 9) + 1;
        const res = a * b - c;

        if (res > 0 && res < 100 && checkUnique([a, b, c, res])) {
          parts = [a, '×', b, '-', c, '=', res];
          missingIndices = [0, 2, 4];
          isValid = true;
        }
      }
    }

    if (!isValid) {
      parts = [3, '+', 4, '=', 7];
      missingIndices = [0];
    }

    setEquation({ parts, missingIndices });
    resetLevelTimer();
  }, [checkUnique, level, resetLevelTimer]);

  useEffect(() => {
    generateLevel();
  }, [level, generateLevel]);

  const usedDigits = useMemo(() => {
    if (!equation.parts) return [];
    const used = new Set<number>();

    equation.parts.forEach((part, idx) => {
      if (typeof part === 'number' && !equation.missingIndices.includes(idx)) {
        String(part).split('').forEach(d => used.add(Number(d)));
      }
    });

    Object.values(userInputs).forEach(val => {
      if (val !== undefined) used.add(val);
    });

    return Array.from(used);
  }, [equation, userInputs]);

  const handleDigitClick = useCallback((digit: number) => {
    if (usedDigits.includes(digit) || feedback !== null) return;
    const firstEmpty = equation.missingIndices.find(idx => userInputs[idx] === undefined);
    if (firstEmpty !== undefined) {
      playClick();
      setUserInputs(prev => ({ ...prev, [firstEmpty]: digit }));
    }
  }, [equation.missingIndices, usedDigits, userInputs, feedback]);

  const handleBackspace = useCallback(() => {
    const filledIndices = Object.keys(userInputs).map(Number).sort((a, b) => b - a);
    if (filledIndices.length > 0) {
      playClick();
      setUserInputs(prev => {
        const next = { ...prev };
        delete next[filledIndices[0]];
        return next;
      });
    }
  }, [userInputs]);

  const handleSubmit = useCallback(() => {
    if (feedback !== null) return;
    const allFilled = equation.missingIndices.every(idx => userInputs[idx] !== undefined);
    if (!allFilled) return;

    // Reconstruct LHS tokens and target RHS
    const lhsParts: (number | string)[] = [];
    const equalsIdx = equation.parts.indexOf('=');

    for (let i = 0; i < equalsIdx; i++) {
      if (equation.missingIndices.includes(i)) {
        lhsParts.push(userInputs[i]);
      } else {
        lhsParts.push(equation.parts[i]);
      }
    }

    const targetVal = Number(equation.parts[equalsIdx + 1]);
    const computedVal = evaluateExpression(lhsParts);

    if (computedVal === targetVal) {
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
    } else {
      setFeedback('wrong');
      submitAnswer(false);
      setTimeout(() => setFeedback(null), 800);
    }
  }, [feedback, equation, userInputs, evaluateExpression, submitAnswer]);

  // Keyboard controls: 1-9 for digits, Backspace, Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        const digit = Number(e.key);
        if (!usedDigits.includes(digit)) {
          e.preventDefault();
          handleDigitClick(digit);
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigitClick, handleBackspace, handleSubmit, usedDigits]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1 to 9', action: 'Input Digits' },
    { key: 'Backspace', action: 'Remove Last Digit' },
    { key: 'Enter', action: 'Submit Equation' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Fill in the Missing Digits",
      desc: "Identify digits (1-9) that satisfy the algebraic equation following operator precedence (× before + / -).",
    },
    {
      title: "Strict Uniqueness Rule",
      desc: "Each digit can only appear ONCE in the entire equation (including given numbers). Already used digits are greyed out.",
    },
    {
      title: "Keyboard Velocity",
      desc: "Type digits 1-9 on your keyboard and press Enter to verify your solution quickly.",
    }
  ];

  const allFilled = equation.missingIndices.length > 0 && equation.missingIndices.every(idx => userInputs[idx] !== undefined);

  return (
    <AdaptiveGameShell
      title="Digit Challenge"
      category="Mental Agility"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-7">

        {/* Equation Display Box */}
        <div className="w-full bg-surface-paper border border-border-hairline rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col items-center">
          <span className="text-[11px] font-mono font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            Level {level} Equation • Precedence: [ × before + / - ]
          </span>

          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {equation.parts.map((part, idx) => {
              const isMissing = equation.missingIndices.includes(idx);
              const isOperator = typeof part === 'string';

              if (isMissing) {
                const userVal = userInputs[idx];
                return (
                  <div
                    key={idx}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-black font-mono shadow-xs transition-all border-2 ${
                      userVal !== undefined
                        ? 'bg-secondary-fixed/30 border-secondary text-secondary'
                        : 'bg-surface-cream border-dashed border-border-hairline text-on-surface-variant animate-pulse'
                    }`}
                  >
                    {userVal !== undefined ? userVal : '?'}
                  </div>
                );
              }

              if (isOperator) {
                return (
                  <span
                    key={idx}
                    className={`text-xl sm:text-2xl font-black font-mono ${
                      part === '=' ? 'text-on-surface' : 'text-secondary'
                    }`}
                  >
                    {part}
                  </span>
                );
              }

              return (
                <div
                  key={idx}
                  className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-surface-cream border border-border-hairline flex items-center justify-center text-xl sm:text-2xl font-black font-mono text-on-surface shadow-2xs"
                >
                  {part}
                </div>
              );
            })}
          </div>
        </div>

        {/* Keypad */}
        <div className="w-full max-w-sm flex flex-col items-center gap-3">
          <div className="grid grid-cols-3 gap-2.5 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
              const isUsed = usedDigits.includes(digit);

              return (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleDigitClick(digit)}
                  disabled={isUsed}
                  className={`h-12 sm:h-14 rounded-2xl font-mono text-lg font-black transition-all flex items-center justify-center cursor-pointer shadow-xs border ${
                    isUsed
                      ? 'bg-surface-cream text-on-surface-variant/30 border-border-hairline/40 cursor-not-allowed'
                      : 'bg-surface-paper border-border-hairline text-on-surface hover:bg-surface-cream hover:border-secondary hover:scale-102'
                  }`}
                >
                  {digit}
                </button>
              );
            })}
          </div>

          {/* Action Row: Backspace & Submit */}
          <div className="grid grid-cols-2 gap-2.5 w-full">
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-2xl bg-surface-cream border border-border-hairline text-on-surface hover:bg-surface-paper font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Delete size={16} /> Backspace
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allFilled}
              className={`h-12 rounded-2xl font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                feedback === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : feedback === 'wrong'
                  ? 'bg-rose-600 text-white'
                  : allFilled
                  ? 'bg-primary text-on-primary hover:bg-surface-charcoal'
                  : 'bg-surface-cream border border-border-hairline text-on-surface-variant/50 cursor-not-allowed'
              }`}
            >
              <Check size={16} />
              {feedback === 'correct' ? 'Correct!' : (feedback === 'wrong' ? 'Mismatch!' : 'Submit [Enter]')}
            </button>
          </div>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default DigitChallengeGame;
