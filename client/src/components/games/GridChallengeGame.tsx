import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { motion } from 'framer-motion';
import { playClick } from '../../utils/sound';
import { Brain, Check, HelpCircle } from 'lucide-react';

interface Coord {
  r: number;
  c: number;
}

interface SymmetryTask {
  matrix: boolean[][];
  isSymmetric: boolean;
}

export const GridChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();

  // Phases: 'MEMORIZE', 'DISTRACT', 'RECALL'
  const [phase, setPhase] = useState<'MEMORIZE' | 'DISTRACT' | 'RECALL'>('MEMORIZE');
  const [sequence, setSequence] = useState<Coord[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userSequence, setUserSequence] = useState<Coord[]>([]);
  const [symmetryTask, setSymmetryTask] = useState<SymmetryTask | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const gridSize = Math.min(5, 3 + Math.floor(level / 4)); // 3x3 to 5x5
  const sequenceLength = Math.min(5, 2 + Math.floor(level / 3)); // 2 to 5 dots

  // Generate matrix for symmetry distraction task
  const generateSymmetryTask = useCallback(() => {
    const matrixSize = 6;
    const isSymmetric = Math.random() > 0.5;
    const matrix = Array(matrixSize).fill(0).map(() => Array(matrixSize).fill(false));

    // Generate left half
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize / 2; c++) {
        const filled = Math.random() > 0.55;
        matrix[r][c] = filled;
        // Mirror to right half
        matrix[r][matrixSize - 1 - c] = filled;
      }
    }

    // If asymmetric, flip cells on the right
    if (!isSymmetric) {
      const flipR = Math.floor(Math.random() * matrixSize);
      const flipC = matrixSize - 1 - Math.floor(Math.random() * (matrixSize / 2));
      matrix[flipR][flipC] = !matrix[flipR][flipC];
    }

    setSymmetryTask({ matrix, isSymmetric });
  }, []);

  const startLevel = useCallback(() => {
    setFeedback(null);
    const newSeq: Coord[] = [];
    while (newSeq.length < sequenceLength) {
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      if (!newSeq.some(p => p.r === r && p.c === c)) {
        newSeq.push({ r, c });
      }
    }
    setSequence(newSeq);
    setCurrentStep(0);
    setUserSequence([]);
    setPhase('MEMORIZE');
    resetLevelTimer();
  }, [gridSize, sequenceLength, resetLevelTimer]);

  useEffect(() => {
    startLevel();
  }, [level, startLevel]);

  // Timer to cycle between MEMORIZE and DISTRACT
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'MEMORIZE') {
      timer = setTimeout(() => {
        generateSymmetryTask();
        setPhase('DISTRACT');
      }, 1500);
    }
    return () => clearTimeout(timer);
  }, [phase, generateSymmetryTask]);

  const handleSymmetryAnswer = useCallback((answer: boolean) => {
    playClick();
    if (currentStep < sequence.length - 1) {
      setCurrentStep(prev => prev + 1);
      setPhase('MEMORIZE');
    } else {
      setPhase('RECALL');
    }
  }, [currentStep, sequence.length]);

  const handleGridClick = useCallback((r: number, c: number) => {
    if (phase !== 'RECALL' || feedback !== null) return;
    if (userSequence.some(p => p.r === r && p.c === c)) return;

    playClick();
    const newSeq = [...userSequence, { r, c }];
    setUserSequence(newSeq);

    if (newSeq.length === sequence.length) {
      // Check sequence accuracy
      let correct = true;
      for (let i = 0; i < sequence.length; i++) {
        if (newSeq[i].r !== sequence[i].r || newSeq[i].c !== sequence[i].c) {
          correct = false;
          break;
        }
      }

      if (correct) {
        setFeedback('correct');
        setTimeout(() => submitAnswer(true), 400);
      } else {
        setFeedback('wrong');
        submitAnswer(false);
        setTimeout(() => startLevel(), 800);
      }
    }
  }, [phase, feedback, userSequence, sequence, submitAnswer, startLevel]);

  // Keyboard support: Y/N for symmetry
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'DISTRACT') {
        if (e.key.toLowerCase() === 'y' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleSymmetryAnswer(true);
        } else if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleSymmetryAnswer(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleSymmetryAnswer]);

  const SHORTCUTS: ShortcutItem[] = [
    { key: 'Y / Arrow Left', action: 'Answer YES (Symmetric)' },
    { key: 'N / Arrow Right', action: 'Answer NO (Asymmetric)' },
  ];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Dual-Task Working Memory",
      desc: "Observe the highlighted dot on the grid and commit its spatial position to memory.",
    },
    {
      title: "Interference Task: Vertical Symmetry",
      desc: "Quickly determine whether the 6x6 pixel figure is vertically symmetrical across its central axis (Press Y for Yes, N for No).",
    },
    {
      title: "Sequential Coordinate Recall",
      desc: "Once all items have been presented, click the grid cells in the exact order they appeared.",
    }
  ];

  const activeDot = sequence[currentStep];

  return (
    <AdaptiveGameShell
      title="Grid Challenge"
      category="Working Memory"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Phase Indicator */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-paper border border-border-hairline shadow-xs font-mono text-xs font-bold text-on-surface">
          <Brain size={14} className="text-secondary" />
          <span>
            {phase === 'MEMORIZE' && `Memorize Dot ${currentStep + 1} of ${sequence.length}`}
            {phase === 'DISTRACT' && `Distraction Task: Is this figure vertically symmetric?`}
            {phase === 'RECALL' && `Recall: Click dots in order (${userSequence.length}/${sequence.length})`}
          </span>
        </div>

        {/* Phase 1: MEMORIZE PHASE */}
        {phase === 'MEMORIZE' && activeDot && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-mono text-on-surface-variant font-semibold uppercase tracking-wider">
              Target Dot Coordinate
            </span>
            <div
              className="p-3 bg-surface-paper rounded-3xl border border-border-hairline shadow-xs grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => {
                  const isDot = activeDot.r === r && activeDot.c === c;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border transition-all ${
                        isDot
                          ? 'bg-secondary border-secondary shadow-md scale-105'
                          : 'bg-surface-cream border-border-hairline'
                      }`}
                    >
                      {isDot && <span className="w-4 h-4 rounded-full bg-white shadow-xs"></span>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Phase 2: DISTRACT PHASE (Symmetry Check) */}
        {phase === 'DISTRACT' && symmetryTask && (
          <div className="flex flex-col items-center gap-4">
            <div className="relative p-3 bg-surface-paper rounded-2xl border border-border-hairline shadow-xs">
              <div className="grid grid-cols-6 gap-1.5">
                {symmetryTask.matrix.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-colors ${
                        val
                          ? 'bg-on-surface border-on-surface'
                          : 'bg-surface-cream border-border-hairline'
                      }`}
                    />
                  ))
                )}
              </div>
              {/* Vertical axis line */}
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-secondary/50 transform -translate-x-1/2 pointer-events-none"></div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleSymmetryAnswer(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                YES (Symmetric) [Y]
              </button>
              <button
                type="button"
                onClick={() => handleSymmetryAnswer(false)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                NO (Asymmetric) [N]
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: RECALL PHASE */}
        {phase === 'RECALL' && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-mono text-on-surface-variant font-semibold uppercase tracking-wider">
              Click in chronological order
            </span>
            <div
              className="p-3 bg-surface-paper rounded-3xl border border-border-hairline shadow-xs grid gap-2"
              style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: gridSize }).map((_, r) =>
                Array.from({ length: gridSize }).map((_, c) => {
                  const clickIdx = userSequence.findIndex(p => p.r === r && p.c === c);
                  const isClicked = clickIdx !== -1;

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => handleGridClick(r, c)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-sm transition-all cursor-pointer border ${
                        isClicked
                          ? 'bg-secondary text-on-secondary border-secondary shadow-xs scale-102'
                          : 'bg-surface-cream hover:bg-surface-paper border-border-hairline hover:border-secondary'
                      }`}
                    >
                      {isClicked && <span>#{clickIdx + 1}</span>}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Solved feedback */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white font-mono text-xs font-bold shadow-md">
            <Check size={16} /> Perfect Recall! Advancing to Level {level + 1}...
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};

export default GridChallengeGame;
