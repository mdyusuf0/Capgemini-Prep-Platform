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
      <div className="flex items-center justify-center p-12 text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <button onClick={onBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Game
        </button>
        <div className="flex items-center space-x-6 text-sm">
          <div><span className="text-gray-500">Round:</span> <span className="font-bold text-white">{round}/5</span></div>
          <div><span className="text-gray-500">Score:</span> <span className="font-bold text-indigo-400">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Geo-Sudo (Deductive Reasoning)</h2>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Every row and column must contain each symbol exactly once. Deduce the missing symbol at the target cell <span className="text-indigo-400 font-bold">(?)</span>.
        </p>
      </div>

      {/* Grid */}
      <div className="flex justify-center my-6">
        <div 
          className="grid gap-2 p-4 bg-[#1e1e2e] border-2 border-indigo-500/30 rounded-2xl shadow-xl"
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
                        ? feedback === 'correct' ? 'bg-green-600/30 border-2 border-green-500 text-green-400' : 'bg-red-600/30 border-2 border-red-500 text-red-400'
                        : 'bg-indigo-600/20 border-2 border-dashed border-indigo-400 text-indigo-300 animate-pulse'
                      : cell
                        ? 'bg-[#0a0a0a] border border-gray-700 text-white'
                        : 'bg-[#12121a] border border-gray-800 text-gray-600'
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
      <div className="space-y-4 text-center">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Select the missing symbol:</span>
        <div className="flex justify-center gap-4">
          {puzzle.options.map((sym, idx) => (
            <button
              key={idx}
              disabled={feedback !== null}
              onClick={() => handleSelectOption(sym)}
              className={`w-14 h-14 rounded-xl text-2xl font-bold flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:pointer-events-none ${
                selectedSymbol === sym
                  ? feedback === 'correct' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  : 'bg-[#1e1e2e] hover:bg-[#2a2a3e] border border-gray-700 text-white'
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
          feedback === 'correct' ? 'bg-green-900/20 border-green-500/40 text-green-300' : 'bg-red-900/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center space-x-3">
            {feedback === 'correct' ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
            <div>
              <div className="font-bold">{feedback === 'correct' ? 'Correct Deduction!' : 'Incorrect Deduction'}</div>
              <div className="text-xs text-gray-400">Solution was: {puzzle.solution}</div>
            </div>
          </div>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {round >= 5 ? 'Finish Game' : 'Next Puzzle →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default GeoSudoGame;
