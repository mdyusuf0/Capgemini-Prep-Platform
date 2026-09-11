import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import api from '@/services/api';

interface GeoSudoPuzzle {
  size: number;
  symbols: string[];
  grid: (string | null)[][];
  targetCell: { row: number; col: number };
  solution: string;
  options: string[];
}

export const GeoSudoGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<GeoSudoPuzzle | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPuzzle = async () => {
    setLoading(true);
    setFeedback(null);
    setSelectedSymbol(null);
    try {
      const level = round >= 3 ? 5 : 4;
      const { data } = await api.get(`/games/generate/geosudo?level=${level}`);
      setPuzzle(data);
    } catch {
      // Fallback puzzle
      setPuzzle({
        size: 4,
        symbols: ['▲', '■', '●', '★'],
        grid: [
          ['■', '●', '★', null],
          [null, null, '■', '●'],
          ['▲', '■', null, '★'],
          [null, null, '▲', '■']
        ],
        targetCell: { row: 0, col: 3 },
        solution: '▲',
        options: ['●', '▲', '★', '■']
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [round]);

  const handleSelectOption = (sym: string) => {
    if (feedback !== null || !puzzle) return;
    setSelectedSymbol(sym);

    if (sym === puzzle.solution) {
      setFeedback('correct');
      setScore(s => s + 100);
    } else {
      setFeedback('wrong');
    }
  };

  const handleNext = () => {
    setRound(r => r + 1);
  };

  if (loading || !puzzle) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-on-surface">
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
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Geo-Sudo (Deductive Reasoning)</h2>
        <p className="text-on-surface-variant text-xs max-w-lg mx-auto">
          Every row and column must contain each symbol exactly once. Deduce the missing symbol at the target cell <span className="text-secondary font-bold font-mono">(?)</span>.
        </p>
      </div>

      {/* Grid */}
      <div className="flex justify-center my-6">
        <div 
          className="grid gap-2 p-4 bg-white border border-border-hairline rounded-2xl shadow-sm"
          style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
        >
          {puzzle.grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isTarget = rIdx === puzzle.targetCell.row && cIdx === puzzle.targetCell.col;
              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center text-2xl font-bold transition-all ${
                    isTarget
                      ? selectedSymbol
                        ? feedback === 'correct' ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-700' : 'bg-red-50 border-2 border-red-500 text-red-700'
                        : 'bg-secondary-fixed/30 border-2 border-dashed border-secondary text-secondary animate-pulse'
                      : cell
                        ? 'bg-surface-cream border border-border-hairline text-on-surface shadow-xs'
                        : 'bg-surface-cream/40 border border-border-hairline/60 text-zinc-300'
                  }`}
                >
                  {isTarget ? (selectedSymbol || '?') : (cell || '')}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 text-center">
        <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold">Select the missing symbol:</span>
        <div className="flex justify-center gap-3">
          {puzzle.options.map((sym, idx) => (
            <button
              key={idx}
              disabled={feedback !== null}
              onClick={() => handleSelectOption(sym)}
              className={`w-14 h-14 rounded-xl text-2xl font-bold flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:pointer-events-none cursor-pointer shadow-xs ${
                selectedSymbol === sym
                  ? feedback === 'correct' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                  : 'bg-white hover:bg-surface-cream border border-border-hairline text-on-surface hover:border-zinc-400'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div className={`p-4 rounded-xl flex items-center justify-between border animate-in fade-in slide-in-from-bottom-2 ${
          feedback === 'correct' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-center space-x-3">
            {feedback === 'correct' ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
            <div>
              <div className="font-bold text-sm">{feedback === 'correct' ? 'Correct Deduction!' : 'Incorrect Deduction'}</div>
              <div className="text-xs text-on-surface-variant font-mono">Solution was: {puzzle.solution}</div>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-primary-container hover:bg-black text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
          >
            {round >= 5 ? 'Finish Game' : 'Next Puzzle →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default GeoSudoGame;
