import React, { useState, useEffect } from 'react';
import { ArrowLeft, Move, RotateCcw, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

interface MotionPuzzle {
  gridSize: number;
  start: { row: number; col: number };
  target: { row: number; col: number };
  obstacles: { row: number; col: number }[];
  optimalMoves: number;
}

export const MotionChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<MotionPuzzle | null>(null);
  const [playerPos, setPlayerPos] = useState<{ row: number; col: number }>({ row: 0, col: 0 });
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);
  const [round, setRound] = useState(1);

  const fetchPuzzle = async () => {
    setWon(false);
    setMoves(0);
    try {
      const { data } = await api.get('/games/generate/motion');
      setPuzzle(data);
      setPlayerPos(data.start);
    } catch {
      setPuzzle({
        gridSize: 6,
        start: { row: 0, col: 0 },
        target: { row: 5, col: 5 },
        obstacles: [{ row: 1, col: 1 }, { row: 2, col: 2 }, { row: 3, col: 3 }],
        optimalMoves: 10
      });
      setPlayerPos({ row: 0, col: 0 });
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [round]);

  const handleMove = (dr: number, dc: number) => {
    if (!puzzle || won) return;
    const nr = playerPos.row + dr;
    const nc = playerPos.col + dc;

    if (nr < 0 || nr >= puzzle.gridSize || nc < 0 || nc >= puzzle.gridSize) return;
    if (puzzle.obstacles.some(o => o.row === nr && o.col === nc)) return;

    const nextPos = { row: nr, col: nc };
    setPlayerPos(nextPos);
    setMoves(m => m + 1);

    if (nextPos.row === puzzle.target.row && nextPos.col === puzzle.target.col) {
      setWon(true);
      const moveEfficiency = Math.max(0, 100 - (moves + 1 - puzzle.optimalMoves) * 10);
      setScore(s => s + moveEfficiency);
    }
  };

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center p-12 text-on-surface-variant">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 text-on-surface">
      <div className="flex items-center justify-between border-b border-border-hairline pb-4">
        <button onClick={onBack} className="flex items-center text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" /> Return to Arena
        </button>
        <div className="flex items-center space-x-6 text-xs font-mono">
          <div><span className="text-on-surface-variant">Moves:</span> <span className="font-bold text-on-surface">{moves}</span> (Optimal: {puzzle.optimalMoves})</div>
          <div><span className="text-on-surface-variant">Velocity Score:</span> <span className="font-bold text-secondary">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-on-surface flex items-center justify-center gap-2 tracking-tight">
          <Move className="text-secondary w-6 h-6" /> Motion Challenge (Pathfinding)
        </h2>
        <p className="text-on-surface-variant text-xs">
          Navigate from Start to the Target Destination with the fewest possible steps. Avoid red obstacles.
        </p>
      </div>

      {/* Grid */}
      <div className="flex justify-center my-4">
        <div 
          className="grid gap-1.5 p-3 bg-white border border-border-hairline rounded-2xl shadow-sm"
          style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: puzzle.gridSize * puzzle.gridSize }).map((_, idx) => {
            const r = Math.floor(idx / puzzle.gridSize);
            const c = idx % puzzle.gridSize;
            const isPlayer = playerPos.row === r && playerPos.col === c;
            const isTarget = puzzle.target.row === r && puzzle.target.col === c;
            const isObstacle = puzzle.obstacles.some(o => o.row === r && o.col === c);

            return (
              <div
                key={idx}
                className={`w-11 h-11 md:w-13 md:h-13 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${
                  isPlayer
                    ? 'bg-primary-container text-white shadow-md scale-105'
                    : isTarget
                      ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-700 animate-pulse font-black'
                      : isObstacle
                        ? 'bg-red-50 border border-red-200 text-red-500'
                        : 'bg-surface-cream border border-border-hairline/60'
                }`}
              >
                {isPlayer ? '●' : isTarget ? '★' : isObstacle ? '✕' : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={() => handleMove(-1, 0)}
          className="w-12 h-12 bg-white hover:bg-surface-cream border border-border-hairline hover:border-zinc-400 rounded-xl font-bold text-on-surface text-lg active:scale-95 shadow-xs cursor-pointer flex items-center justify-center transition-all"
        >
          ▲
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => handleMove(0, -1)}
            className="w-12 h-12 bg-white hover:bg-surface-cream border border-border-hairline hover:border-zinc-400 rounded-xl font-bold text-on-surface text-lg active:scale-95 shadow-xs cursor-pointer flex items-center justify-center transition-all"
          >
            ◀
          </button>
          <button
            onClick={() => handleMove(1, 0)}
            className="w-12 h-12 bg-white hover:bg-surface-cream border border-border-hairline hover:border-zinc-400 rounded-xl font-bold text-on-surface text-lg active:scale-95 shadow-xs cursor-pointer flex items-center justify-center transition-all"
          >
            ▼
          </button>
          <button
            onClick={() => handleMove(0, 1)}
            className="w-12 h-12 bg-white hover:bg-surface-cream border border-border-hairline hover:border-zinc-400 rounded-xl font-bold text-on-surface text-lg active:scale-95 shadow-xs cursor-pointer flex items-center justify-center transition-all"
          >
            ▶
          </button>
        </div>
      </div>

      {won && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-emerald-950 shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <div>
              <div className="font-bold text-sm">Destination Reached!</div>
              <div className="text-xs text-on-surface-variant font-mono">Moves taken: {moves} (Optimal: {puzzle.optimalMoves})</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-primary-container hover:bg-black text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
          >
            Next Maze →
          </button>
        </div>
      )}
    </div>
  );
};
export default MotionChallengeGame;
