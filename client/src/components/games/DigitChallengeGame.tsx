import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calculator, CheckCircle2, RotateCcw } from 'lucide-react';
import api from '@/services/api';

interface DigitPuzzle {
  target: number;
  availableDigits: number[];
  solutionFormula: string;
}

export const DigitChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<DigitPuzzle | null>(null);
  const [expression, setExpression] = useState<string[]>([]);
  const [usedDigits, setUsedDigits] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [won, setWon] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPuzzle = async () => {
    setLoading(true);
    setWon(false);
    setExpression([]);
    setUsedDigits([]);
    try {
      const { data } = await api.get('/games/generate/digit');
      setPuzzle(data);
    } catch {
      setPuzzle({
        target: 24,
        availableDigits: [4, 6, 2, 3],
        solutionFormula: "(4 * 6) * (3 - 2) = 24"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [round]);

  const handleAddDigit = (digit: number, index: number) => {
    if (usedDigits.includes(index) || won) return;
    setExpression(prev => [...prev, String(digit)]);
    setUsedDigits(prev => [...prev, index]);
  };

  const handleAddOperator = (op: string) => {
    if (won || expression.length === 0) return;
    const last = expression[expression.length - 1];
    if (['+', '-', '*', '/'].includes(last)) return;
    setExpression(prev => [...prev, op]);
  };

  const handleClear = () => {
    setExpression([]);
    setUsedDigits([]);
  };

  const handleEvaluate = () => {
    if (!puzzle || won) return;
    try {
      // Safe math eval with basic arithmetic
      const formula = expression.join(' ');
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${formula})`)();
      if (result === puzzle.target) {
        setWon(true);
        setScore(s => s + 100);
      }
    } catch {
      // Invalid expression
    }
  };

  if (loading || !puzzle) {
    return (
      <div className="flex items-center justify-center p-12 text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 text-on-surface">
      <div className="flex items-center justify-between border-b border-border-hairline pb-4">
        <button onClick={onBack} className="flex items-center text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Arena
        </button>
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div><span className="text-on-surface-variant">Round:</span> <span className="font-bold text-on-surface">{round}/5</span></div>
          <div><span className="text-on-surface-variant">Velocity Score:</span> <span className="font-bold text-secondary">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-on-surface flex items-center justify-center gap-2 tracking-tight">
          <Calculator className="text-secondary w-6 h-6" /> Digit Challenge (Numerical Velocity)
        </h2>
        <p className="text-on-surface-variant text-xs">
          Combine the available digits using basic arithmetic operations to hit the exact target integer.
        </p>
      </div>

      {/* Target Display */}
      <div className="bg-white border-2 border-border-hairline rounded-2xl p-6 text-center shadow-sm">
        <span className="text-xs text-on-surface-variant uppercase tracking-widest font-mono font-semibold">TARGET VALUE</span>
        <div className="text-5xl font-black text-secondary mt-2 font-mono tracking-wider">
          {puzzle.target}
        </div>
      </div>

      {/* Formula Workspace */}
      <div className="p-4 bg-surface-cream rounded-xl border border-border-hairline min-h-[56px] flex items-center justify-between">
        <div className="font-mono text-xl text-on-surface font-bold tracking-wider">
          {expression.length > 0 ? expression.join(' ') : <span className="text-zinc-400 text-xs font-normal">Select digits and operators below...</span>}
        </div>
        {expression.length > 0 && (
          <button onClick={handleClear} className="text-xs text-on-surface-variant hover:text-red-600 flex items-center gap-1 font-mono cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Digits and Operators */}
      <div className="space-y-4">
        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold block mb-2 text-center">Available Digits:</span>
          <div className="flex gap-3 justify-center">
            {puzzle.availableDigits.map((digit, idx) => {
              const isUsed = usedDigits.includes(idx);
              return (
                <button
                  key={idx}
                  disabled={isUsed || won}
                  onClick={() => handleAddDigit(digit, idx)}
                  className={`w-14 h-14 rounded-xl text-2xl font-bold font-mono transition-all cursor-pointer shadow-xs ${
                    isUsed 
                      ? 'bg-surface-cream text-zinc-300 border border-border-hairline cursor-not-allowed' 
                      : 'bg-white hover:bg-surface-cream border border-border-hairline text-on-surface hover:border-zinc-400 active:scale-95'
                  }`}
                >
                  {digit}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold block mb-2 text-center">Operators:</span>
          <div className="flex gap-3 justify-center">
            {['+', '-', '*', '/'].map((op) => (
              <button
                key={op}
                disabled={won}
                onClick={() => handleAddOperator(op)}
                className="w-12 h-12 rounded-xl text-xl font-bold font-mono bg-white hover:bg-surface-cream border border-border-hairline text-secondary hover:border-zinc-400 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={won || expression.length < 3}
          className="w-full py-3 bg-primary-container hover:bg-black disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer text-xs uppercase font-mono tracking-wider"
        >
          Verify Target Solution (=)
        </button>
      </div>

      {won && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-950">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="font-bold text-xs">Target Reached! (+100 Velocity Score)</div>
              <div className="text-[11px] font-mono text-emerald-800">{puzzle.solutionFormula}</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-primary-container hover:bg-black text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Next Puzzle →
          </button>
        </div>
      )}
    </div>
  );
};
export default DigitChallengeGame;
