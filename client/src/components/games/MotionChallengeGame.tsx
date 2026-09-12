import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Flag } from 'lucide-react';
import { playClick } from '../../utils/sound';

// Cell codes: 0 = Empty, 1 = Wall, 2 = Movable Block, 3 = Red Ball (Player), 4 = Goal Hole
const LEVELS: number[][][] = [
  // Level 1: Open corridor
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 2, 0, 1],
    [1, 0, 1, 2, 0, 1],
    [1, 0, 2, 0, 0, 1],
    [1, 0, 1, 0, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 2: The Corridor
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 0, 1, 1],
    [1, 1, 2, 0, 0, 1],
    [1, 1, 0, 2, 0, 1],
    [1, 1, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 3: Two Rooms
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 1, 0, 1],
    [1, 2, 2, 1, 0, 1],
    [1, 0, 0, 0, 0, 1],
    [1, 0, 1, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 4: The Squeeze
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 2, 0, 2, 1],
    [1, 0, 1, 0, 1, 1],
    [1, 0, 2, 0, 0, 1],
    [1, 0, 1, 2, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 5: Open Field
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 2, 0, 1],
    [1, 0, 0, 2, 0, 1],
    [1, 2, 0, 0, 2, 1],
    [1, 0, 2, 4, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 6: Zig-Zag Alley
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 2, 0, 0, 1],
    [1, 1, 1, 2, 0, 1],
    [1, 0, 0, 0, 2, 1],
    [1, 0, 1, 1, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 7: The Crossroad
  [
    [1, 1, 1, 1, 1, 1],
    [1, 0, 0, 3, 0, 1],
    [1, 0, 1, 2, 0, 1],
    [1, 2, 2, 0, 2, 1],
    [1, 0, 4, 0, 0, 1],
    [1, 1, 1, 1, 1, 1],
  ],
  // Level 8: Double Obstacle Chamber
  [
    [1, 1, 1, 1, 1, 1],
    [1, 3, 0, 1, 0, 1],
    [1, 2, 0, 2, 0, 1],
    [1, 0, 2, 1, 2, 1],
    [1, 0, 0, 0, 4, 1],
    [1, 1, 1, 1, 1, 1],
  ]
];

export const MotionChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [grid, setGrid] = useState<number[][]>([]);
  const [selectedItem, setSelectedItem] = useState<{ r: number; c: number; val: number } | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | null>(null);

  const loadLevel = useCallback(() => {
    setFeedback(null);
    const levelIndex = (level - 1) % LEVELS.length;
    const template = LEVELS[levelIndex];
    const newGrid = template.map(row => [...row]);

    setGrid(newGrid);
    setMoves(0);

    // Auto-select Ball (val = 3)
    for (let r = 0; r < newGrid.length; r++) {
      for (let c = 0; c < newGrid[r].length; c++) {
        if (newGrid[r][c] === 3) {
          setSelectedItem({ r, c, val: 3 });
          break;
        }
      }
    }
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadLevel();
  }, [loadLevel]);

  const handleCellClick = (r: number, c: number) => {
    const val = grid[r][c];
    if (val === 2 || val === 3) {
      playClick();
      setSelectedItem({ r, c, val });
    }
  };

  const moveItem = useCallback((dr: number, dc: number) => {
    if (!selectedItem || feedback !== null) return;

    const { r, c, val } = selectedItem;
    const nr = r + dr;
    const nc = c + dc;

    // Check grid bounds
    if (nr < 0 || nr >= grid.length || nc < 0 || nc >= grid[0].length) return;

    const targetCell = grid[nr][nc];

    // Ball reaches Goal Hole (val = 3 to cell 4)
    if (targetCell === 4 && val === 3) {
      playClick();
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = 0;
      setGrid(newGrid);
      setMoves(m => m + 1);
      setFeedback('correct');
      setTimeout(() => submitAnswer(true), 400);
      return;
    }

    // Only move into empty cell (val = 0)
    if (targetCell === 0) {
      playClick();
      const newGrid = grid.map(row => [...row]);
      newGrid[r][c] = 0;
      newGrid[nr][nc] = val;
      setGrid(newGrid);
      setSelectedItem({ r: nr, c: nc, val });
      setMoves(m => m + 1);
    }
  }, [selectedItem, feedback, grid, submitAnswer]);

  // Keyboard navigation: Arrows and WASD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['arrowup', 'w'].includes(key)) {
        e.preventDefault();
        moveItem(-1, 0);
      } else if (['arrowdown', 's'].includes(key)) {
        e.preventDefault();
        moveItem(1, 0);
      } else if (['arrowleft', 'a'].includes(key)) {
        e.preventDefault();
        moveItem(0, -1);
      } else if (['arrowright', 'd'].includes(key)) {
        e.preventDefault();
        moveItem(0, 1);
      } else if (key === 'r') {
        e.preventDefault();
        loadLevel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveItem, loadLevel]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: 'Arrow Keys / WASD', action: 'Move Selected Piece' },
    { key: 'R', action: 'Reset Maze' },
    { key: 'Click Piece', action: 'Switch Ball / Block' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Pathfinding to Target",
      desc: "Navigate the red sphere into the target goal hole using the fewest possible moves.",
    },
    {
      title: "Movable Obstacle Blocks",
      desc: "Click on grey obstacle blocks to select and push them out of your path into vacant corridors.",
    },
    {
      title: "Lookahead Planning",
      desc: "Plan several steps in advance to avoid dead-ends or trapping movable blocks against walls.",
    }
  ];

  return (
    <AdaptiveGameShell
      title="Motion Challenge"
      category="Spatial Reasoning"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-5">

        {/* Moves Ribbon & Reset */}
        <div className="flex items-center justify-between w-full max-w-sm px-4 py-2 bg-surface-paper rounded-2xl border border-border-hairline shadow-xs text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-on-surface-variant">Step Count:</span>
            <span className="font-bold text-secondary text-sm">{moves}</span>
          </div>
          <button
            type="button"
            onClick={loadLevel}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-cream hover:bg-surface-paper border border-border-hairline text-on-surface transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset [R]
          </button>
        </div>

        {/* 6x6 Maze Grid */}
        <div className="p-3 sm:p-4 bg-surface-paper rounded-3xl border border-border-hairline shadow-xs">
          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isSelected = selectedItem?.r === r && selectedItem?.c === c;

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center transition-all border ${
                      val === 1
                        ? 'bg-surface-charcoal border-surface-charcoal cursor-not-allowed shadow-inner'
                        : val === 2
                        ? `bg-slate-400 border-slate-500 cursor-pointer shadow-xs ${
                            isSelected ? 'ring-3 ring-secondary scale-105' : ''
                          }`
                        : val === 3
                        ? `bg-rose-500 border-rose-600 cursor-pointer shadow-md ${
                            isSelected ? 'ring-3 ring-rose-300 scale-105' : ''
                          }`
                        : val === 4
                        ? 'bg-emerald-100 border-emerald-400'
                        : 'bg-surface-cream border-border-hairline hover:bg-surface-paper'
                    }`}
                  >
                    {val === 3 && <div className="w-5 h-5 rounded-full bg-white shadow-xs"></div>}
                    {val === 2 && <div className="w-4 h-4 rounded-xs bg-slate-200"></div>}
                    {val === 4 && <Flag size={18} className="text-emerald-600" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Directional Pad */}
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={() => moveItem(-1, 0)}
            className="w-12 h-12 rounded-xl bg-surface-paper border border-border-hairline hover:bg-surface-cream flex items-center justify-center text-on-surface shadow-xs cursor-pointer"
          >
            <ArrowUp size={20} />
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => moveItem(0, -1)}
              className="w-12 h-12 rounded-xl bg-surface-paper border border-border-hairline hover:bg-surface-cream flex items-center justify-center text-on-surface shadow-xs cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveItem(1, 0)}
              className="w-12 h-12 rounded-xl bg-surface-paper border border-border-hairline hover:bg-surface-cream flex items-center justify-center text-on-surface shadow-xs cursor-pointer"
            >
              <ArrowDown size={20} />
            </button>
            <button
              type="button"
              onClick={() => moveItem(0, 1)}
              className="w-12 h-12 rounded-xl bg-surface-paper border border-border-hairline hover:bg-surface-cream flex items-center justify-center text-on-surface shadow-xs cursor-pointer"
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
