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
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <button onClick={onBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Game
        </button>
        <div className="flex items-center space-x-6 text-sm">
          <div><span className="text-gray-500">Round:</span> <span className="font-bold text-white">{round}/5</span></div>
          <div><span className="text-gray-500">Score:</span> <span className="font-bold text-orange-400">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Calculator className="text-orange-400 w-6 h-6" /> Digit Challenge (Numerical Speed)
        </h2>
        <p className="text-gray-400 text-sm">
          Use the available digits and operators to reach the Target Number.
        </p>
      </div>

      {/* Target Display */}
      <div className="bg-[#1e1e2e] border-2 border-orange-500/40 rounded-2xl p-6 text-center shadow-xl">
        <span className="text-xs text-gray-400 uppercase tracking-widest font-mono">TARGET VALUE</span>
        <div className="text-5xl font-black text-orange-400 mt-2 font-mono tracking-wider">
          {puzzle.target}
        </div>
      </div>

      {/* Formula Workspace */}
      <div className="p-4 bg-[#0a0a0a] rounded-xl border border-gray-800 min-h-[56px] flex items-center justify-between">
        <div className="font-mono text-xl text-white font-bold tracking-wider">
          {expression.length > 0 ? expression.join(' ') : <span className="text-gray-600 text-sm">Construct equation here...</span>}
        </div>
        {expression.length > 0 && (
          <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Digits and Operators */}
      <div className="space-y-4">
        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2">Available Digits (Use Once):</span>
          <div className="flex gap-3 justify-center">
            {puzzle.availableDigits.map((digit, idx) => {
              const isUsed = usedDigits.includes(idx);
              return (
                <button
                  key={idx}
                  disabled={isUsed || won}
                  onClick={() => handleAddDigit(digit, idx)}
                  className={`w-14 h-14 rounded-xl text-2xl font-bold font-mono transition-all ${
                    isUsed ? 'bg-gray-800/40 text-gray-600 border border-gray-800' : 'bg-[#1e1e2e] hover:bg-[#2a2a3e] border border-gray-700 text-white active:scale-95'
                  }`}
                >
                  {digit}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block mb-2 text-center">Operators:</span>
          <div className="flex gap-3 justify-center">
            {['+', '-', '*', '/'].map((op) => (
              <button
                key={op}
                disabled={won}
                onClick={() => handleAddOperator(op)}
                className="w-12 h-12 rounded-xl text-xl font-bold font-mono bg-[#1e1e2e] hover:bg-orange-600/30 border border-gray-700 text-orange-300 transition-all active:scale-95"
              >
                {op}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={won || expression.length < 3}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all shadow-lg"
        >
          Check Target Solution (=)
        </button>
      </div>

      {won && (
        <div className="p-4 bg-green-900/20 border border-green-500/40 rounded-xl flex items-center justify-between text-green-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <div>
              <div className="font-bold">Target Reached! (+100 pts)</div>
              <div className="text-xs text-gray-400">{puzzle.solutionFormula}</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Next Puzzle →
          </button>
        </div>
      )}
    </div>
  );
};
export default DigitChallengeGame;
