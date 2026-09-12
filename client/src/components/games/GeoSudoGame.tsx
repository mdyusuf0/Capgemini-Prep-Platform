import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Square, Triangle, Circle, Plus, AlertCircle, Check } from 'lucide-react';
import { playClick } from '../../utils/sound';

interface ShapeDef {
  id: number;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  name: string;
}

const SHAPES: ShapeDef[] = [
  { id: 1, icon: Square, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', name: 'Square' },
  { id: 2, icon: Triangle, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', name: 'Triangle' },
  { id: 3, icon: Circle, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', name: 'Circle' },
  { id: 4, icon: Plus, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', name: 'Plus' },
];

export const GeoSudoGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<boolean[][]>([]);
  const [size] = useState<number>(4);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number }>({ r: 0, c: 0 });
  const [hasConflict, setHasConflict] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const isValid = useCallback((board: number[][], r: number, c: number, num: number, s: number): boolean => {
    for (let i = 0; i < s; i++) if (board[r][i] === num) return false;
    for (let i = 0; i < s; i++) if (board[i][c] === num) return false;
    return true;
  }, []);

  const solve = useCallback((board: number[][], s: number): boolean => {
    for (let r = 0; r < s; r++) {
      for (let c = 0; c < s; c++) {
        if (board[r][c] === 0) {
          const nums = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
          for (const num of nums) {
            if (isValid(board, r, c, num, s)) {
              board[r][c] = num;
              if (solve(board, s)) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }, [isValid]);

  const createSolvedGrid = useCallback((s: number): number[][] => {
    const board = Array(s).fill(0).map(() => Array(s).fill(0));
    solve(board, s);
    return board;
  }, [solve]);

  const generateLevel = useCallback((s: number) => {
    setFeedback(null);
    const fullGrid = createSolvedGrid(s);
    // Remove cells based on difficulty: 4 to 8 cells empty
    const removeCount = Math.min(s * s - 3, Math.max(4, 3 + Math.floor(level * 0.7)));
    const newGrid = fullGrid.map(row => [...row]);
    const mask = fullGrid.map(row => row.map(() => true));

    let removed = 0;
    let attempts = 0;
    while (removed < removeCount && attempts < 100) {
      attempts++;
      const r = Math.floor(Math.random() * s);
      const c = Math.floor(Math.random() * s);
      if (newGrid[r][c] !== 0) {
        newGrid[r][c] = 0;
        mask[r][c] = false;
        removed++;
      }
    }

    setGrid(newGrid);
    setInitialGrid(mask);

    // Find first empty cell
    let firstR = 0, firstC = 0;
    for (let r = 0; r < s; r++) {
      for (let c = 0; c < s; c++) {
        if (!mask[r][c]) {
          firstR = r;
          firstC = c;
          break;
        }
      }
    }
    setSelectedCell({ r: firstR, c: firstC });
    setHasConflict(false);
    resetLevelTimer();
  }, [createSolvedGrid, level, resetLevelTimer]);

  useEffect(() => {
    generateLevel(size);
  }, [level, size, generateLevel]);

  const checkConflicts = useCallback((currentGrid: number[][]): boolean => {
    let conflict = false;
    for (let r = 0; r < size; r++) {
      const seenRow = new Set<number>();
      const seenCol = new Set<number>();
      for (let c = 0; c < size; c++) {
        const rowVal = currentGrid[r][c];
        const colVal = currentGrid[c][r];
        if (rowVal !== 0) {
          if (seenRow.has(rowVal)) conflict = true;
          seenRow.add(rowVal);
        }
        if (colVal !== 0) {
          if (seenCol.has(colVal)) conflict = true;
          seenCol.add(colVal);
        }
      }
    }
    setHasConflict(conflict);
    return conflict;
  }, [size]);

  const handleShapeSelect = useCallback((shapeId: number) => {
    if (!selectedCell || feedback !== null) return;
    const { r, c } = selectedCell;
    if (initialGrid[r] && initialGrid[r][c]) return; // Pre-filled given cell

    playClick();
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = shapeId;
    setGrid(newGrid);

    const conflict = checkConflicts(newGrid);

    // Check completion if no empty cells
    let isFull = true;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (newGrid[row][col] === 0) isFull = false;
      }
    }

    if (isFull && !conflict) {
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
    }
  }, [selectedCell, feedback, initialGrid, grid, checkConflicts, size, submitAnswer]);

  const handleCellClick = (r: number, c: number) => {
    if (initialGrid[r] && initialGrid[r][c]) return;
    playClick();
    setSelectedCell({ r, c });
  };

  // Keyboard controls: 1-4 for shapes, Arrows to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        handleShapeSelect(Number(e.key));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, r: Math.max(0, prev.r - 1) }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, r: Math.min(size - 1, prev.r + 1) }));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, c: Math.max(0, prev.c - 1) }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell(prev => ({ ...prev, c: Math.min(size - 1, prev.c + 1) }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleShapeSelect, size]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3, 4', action: 'Place Shape' },
    { key: 'Arrow Keys', action: 'Move Cell Cursor' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Latin-Square Sudoku Logic",
      desc: "Each row and each column must contain exactly one of each geometric symbol: Square, Triangle, Circle, and Plus.",
    },
    {
      title: "Select Cell & Place Shape",
      desc: "Click on an empty dashed cell, then pick the non-conflicting shape from the palette (or press keys 1 to 4).",
    },
    {
      title: "Instant Verification",
      desc: "If any row or column contains duplicate shapes, an active conflict warning appears. Fill all cells cleanly to complete the level.",
    }
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

        {/* Status / Conflict Warning Banner */}
        {hasConflict && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold animate-pulse shadow-xs">
            <AlertCircle size={15} />
            <span>Conflict Detected: Duplicate symbol in row or column</span>
          </div>
        )}

        {/* 4x4 Latin Square Board */}
        <div className="p-3 sm:p-4 bg-surface-paper border border-border-hairline rounded-3xl shadow-xs">
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isPreFilled = initialGrid[r] && initialGrid[r][c];
                const isSelected = selectedCell.r === r && selectedCell.c === c;
                const shape = SHAPES.find(s => s.id === val);

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    disabled={isPreFilled}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer border-2 shadow-2xs ${
                      isSelected
                        ? 'border-secondary ring-3 ring-secondary/20 scale-102'
                        : isPreFilled
                        ? 'bg-surface-cream border-border-hairline cursor-default'
                        : 'bg-surface-paper border-dashed border-border-hairline hover:border-secondary'
                    }`}
                  >
                    {shape && (
                      <shape.icon
                        size={28}
                        strokeWidth={2.5}
                        className={`${shape.color} ${isPreFilled ? 'opacity-90' : 'scale-105'}`}
                      />
                    )}
                    {!shape && isSelected && (
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Shape Palette */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
            Place Symbol into Selected Cell
          </span>

          <div className="flex gap-2.5">
            {SHAPES.map((shape) => (
              <button
                key={shape.id}
                type="button"
                onClick={() => handleShapeSelect(shape.id)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border transition-all cursor-pointer shadow-xs ${shape.bg} hover:scale-105`}
              >
                <shape.icon size={26} strokeWidth={2.5} className={shape.color} />
                <span className="text-[10px] font-mono font-bold text-on-surface-variant">
                  Key [{shape.id}]
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Solved feedback banner */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-mono text-xs font-bold shadow-md">
            <Check size={16} /> Latin Square Solved! Advancing to Level {level + 1}...
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};

export default GeoSudoGame;
