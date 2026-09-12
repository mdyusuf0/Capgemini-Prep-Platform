import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Flag, Check } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { MotionEngine, MotionPuzzle } from '../../services/cognitiveEngine';

export const MotionChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<MotionPuzzle | null>(null);
  const [ballPos, setBallPos] = useState<{ row: number; col: number }>({ row: 1, col: 1 });
  const [blocks, setBlocks] = useState<{ row: number; col: number }[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    const newPuzzle = MotionEngine.generate(level);
    setPuzzle(newPuzzle);
    setBallPos({ ...newPuzzle.start });
    setBlocks(newPuzzle.blocks.map(b => ({ ...b })));
    setMoves(0);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleResetLevel = useCallback(() => {
    if (!puzzle) return;
    playClick();
    setBallPos({ ...puzzle.start });
    setBlocks(puzzle.blocks.map(b => ({ ...b })));
    setMoves(0);
  }, [puzzle]);

  // Execute ball movement in direction [dr, dc]
  const moveBall = useCallback((dr: number, dc: number) => {
    if (!puzzle || feedback !== null) return;

    const nbr = ballPos.row + dr;
    const nbc = ballPos.col + dc;

    // Boundary check
    if (nbr < 0 || nbr >= puzzle.gridSize || nbc < 0 || nbc >= puzzle.gridSize) return;

    // Wall check
    if (puzzle.walls.some(w => w.row === nbr && w.col === nbc)) return;

    // Check if hitting a block
    const blockIdx = blocks.findIndex(b => b.row === nbr && b.col === nbc);
    if (blockIdx !== -1) {
      // Try to push block
      const nextBlockR = nbr + dr;
      const nextBlockC = nbc + dc;

      if (
        nextBlockR < 0 || nextBlockR >= puzzle.gridSize ||
        nextBlockC < 0 || nextBlockC >= puzzle.gridSize ||
        puzzle.walls.some(w => w.row === nextBlockR && w.col === nextBlockC) ||
        blocks.some(b => b.row === nextBlockR && b.col === nextBlockC) ||
        (nextBlockR === puzzle.target.row && nextBlockC === puzzle.target.col)
      ) {
        return; // Block is blocked
      }

      // Valid push
      playClick();
      const nextBlocks = blocks.map((b, idx) =>
        idx === blockIdx ? { row: nextBlockR, col: nextBlockC } : { ...b }
      );
      setBlocks(nextBlocks);
      setBallPos({ row: nbr, col: nbc });
      setMoves(prev => prev + 1);

      // Check win
      if (nbr === puzzle.target.row && nbc === puzzle.target.col) {
        handleWin(moves + 1);
      }
    } else {
      // Free move
      playClick();
      setBallPos({ row: nbr, col: nbc });
      setMoves(prev => prev + 1);

      // Check win
      if (nbr === puzzle.target.row && nbc === puzzle.target.col) {
        handleWin(moves + 1);
      }
    }
  }, [puzzle, feedback, ballPos, blocks, moves]);

  const handleWin = (finalMoves: number) => {
    if (!puzzle) return;
    const withinBudget = finalMoves <= puzzle.maxAllowedMoves;

    if (withinBudget) {
      setFeedback('correct');
      playCorrect();
      setTimeout(() => submitAnswer(true), 500);
    } else {
      setFeedback('wrong');
      playWrong();
      submitAnswer(false);
      setTimeout(() => {
        setFeedback(null);
        handleResetLevel();
      }, 900);
    }
  };

  // Keyboard navigation: Arrow keys & WASD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        moveBall(-1, 0);
      } else if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        moveBall(1, 0);
      } else if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        moveBall(0, -1);
      } else if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        moveBall(0, 1);
      } else if (key === 'r') {
        e.preventDefault();
        handleResetLevel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveBall, handleResetLevel]);

  if (!puzzle) return null;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Lookahead Pathfinding Maze",
      desc: "Navigate the red ball into the checkered goal hole while pushing movable obstacle blocks out of the way.",
    },
    {
      title: "Optimal Move Budget",
      desc: `Shortest optimal path is ${puzzle.optimalMoves} moves. Complete within ${puzzle.maxAllowedMoves} moves to pass the level.`,
    },
    {
      title: "Movement Controls",
      desc: "Use Arrow Keys / WASD, or click the directional arrows on screen. Press 'R' to reset if stuck.",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: 'Arrow Keys / WASD', action: 'Move Red Ball' },
    { key: 'R', action: 'Reset Maze Layout' },
  ];

  return (
    <AdaptiveGameShell
      title="Motion Challenge"
      category="Spatial Planning & Shortest Path"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-5">

        {/* Move Budget & Optimal moves header */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            {puzzle.gridSize}×{puzzle.gridSize} Maze
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline">
            Optimal: {puzzle.optimalMoves} Moves
          </span>
          <span className={`px-2.5 py-1 rounded-lg border font-bold ${
            moves <= puzzle.optimalMoves
              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
              : moves <= puzzle.maxAllowedMoves
              ? 'bg-amber-50 border-amber-300 text-amber-700'
              : 'bg-rose-50 border-rose-300 text-rose-700'
          }`}>
            Moves: {moves} / {puzzle.maxAllowedMoves}
          </span>
          <button
            type="button"
            onClick={handleResetLevel}
            className="p-1.5 rounded-lg bg-surface-cream border border-border-hairline text-muted hover:text-foreground hover:border-secondary transition-all cursor-pointer"
            title="Reset maze"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Maze Grid - Responsive Aspect Container */}
        <div className="p-2 sm:p-4 bg-surface-paper border border-border-hairline rounded-3xl shadow-xs w-full max-w-[min(88vw,340px)] aspect-square flex items-center justify-center">
          <div
            className="grid gap-1 sm:gap-2 w-full h-full"
            style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: puzzle.gridSize }).map((_, r) =>
              Array.from({ length: puzzle.gridSize }).map((_, c) => {
                const isBall = ballPos.row === r && ballPos.col === c;
                const isTarget = puzzle.target.row === r && puzzle.target.col === c;
                const isWall = puzzle.walls.some(w => w.row === r && w.col === c);
                const isBlock = blocks.some(b => b.row === r && b.col === c);

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-full h-full aspect-square rounded-md sm:rounded-xl flex items-center justify-center transition-all select-none ${
                      isWall
                        ? 'bg-slate-700 border border-slate-800 shadow-inner'
                        : isTarget
                        ? 'bg-amber-100 border-2 border-amber-400 shadow-xs'
                        : 'bg-surface-cream/70 border border-border-hairline/80'
                    }`}
                  >
                    {isBall && (
                      <div className="w-3/4 h-3/4 rounded-full bg-rose-500 border-2 border-white shadow-md flex items-center justify-center animate-pulse" />
                    )}
                    {isBlock && !isBall && (
                      <div className="w-3/4 h-3/4 rounded-md sm:rounded-lg bg-blue-500 border-2 border-blue-200 shadow-xs flex items-center justify-center text-white text-[9px] font-mono font-bold">
                        ■
                      </div>
                    )}
                    {isTarget && !isBall && (
                      <Flag size={15} className="text-amber-600 font-bold" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Directional Arrow Controls - Touch Optimized D-Pad */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <button
            type="button"
            onClick={() => moveBall(-1, 0)}
            disabled={feedback !== null}
            className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-surface-paper border border-border-hairline hover:border-secondary active:scale-95 flex items-center justify-center text-foreground cursor-pointer shadow-xs transition-all"
            aria-label="Move Up"
          >
            <ArrowUp size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => moveBall(0, -1)}
              disabled={feedback !== null}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-surface-paper border border-border-hairline hover:border-secondary active:scale-95 flex items-center justify-center text-foreground cursor-pointer shadow-xs transition-all"
              aria-label="Move Left"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveBall(1, 0)}
              disabled={feedback !== null}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-surface-paper border border-border-hairline hover:border-secondary active:scale-95 flex items-center justify-center text-foreground cursor-pointer shadow-xs transition-all"
              aria-label="Move Down"
            >
              <ArrowDown size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveBall(0, 1)}
              disabled={feedback !== null}
              className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-surface-paper border border-border-hairline hover:border-secondary active:scale-95 flex items-center justify-center text-foreground cursor-pointer shadow-xs transition-all"
              aria-label="Move Right"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default MotionChallengeGame;
