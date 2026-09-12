import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Brain, Check, AlertCircle, Sparkles } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { GridEngine, GridPuzzle, GridCoordinate, SymmetryTaskData } from '../../services/cognitiveEngine';

type GamePhase = 'MEMORIZE' | 'DISTRACT' | 'RECALL';

export const GridChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<GridPuzzle | null>(null);
  const [phase, setPhase] = useState<GamePhase>('MEMORIZE');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userSequence, setUserSequence] = useState<GridCoordinate[]>([]);
  const [symmetryErrors, setSymmetryErrors] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    const newPuzzle = GridEngine.generate(level);
    setPuzzle(newPuzzle);
    setPhase('MEMORIZE');
    setCurrentStep(0);
    setUserSequence([]);
    setSymmetryErrors(0);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  // Phase transition timer: MEMORIZE (dot flash) -> DISTRACT (symmetry test)
  useEffect(() => {
    if (!puzzle || phase !== 'MEMORIZE') return;

    const timer = setTimeout(() => {
      setPhase('DISTRACT');
    }, puzzle.flashDurationMs);

    return () => clearTimeout(timer);
  }, [puzzle, phase, currentStep]);

  // Handle symmetry answer in DISTRACT phase
  const handleSymmetryAnswer = useCallback((answer: boolean) => {
    if (!puzzle || phase !== 'DISTRACT') return;
    playClick();

    const currentTask = puzzle.symmetryTasks[currentStep];
    const isCorrect = answer === currentTask.isSymmetric;
    if (!isCorrect) {
      setSymmetryErrors(prev => prev + 1);
    }

    if (currentStep < puzzle.sequenceLength - 1) {
      setCurrentStep(prev => prev + 1);
      setPhase('MEMORIZE');
    } else {
      setPhase('RECALL');
    }
  }, [puzzle, phase, currentStep]);

  // Handle recall grid clicks
  const handleRecallCellClick = useCallback((row: number, col: number) => {
    if (!puzzle || phase !== 'RECALL' || feedback !== null) return;
    playClick();

    // Check if cell already clicked in this recall
    if (userSequence.some(p => p.row === row && p.col === col)) return;

    const nextUserSeq = [...userSequence, { row, col }];
    setUserSequence(nextUserSeq);

    if (nextUserSeq.length === puzzle.sequenceLength) {
      // Validate full sequence match
      const sequenceCorrect = puzzle.sequence.every(
        (target, idx) => target.row === nextUserSeq[idx].row && target.col === nextUserSeq[idx].col
      );

      // Symmetry check: max 1 error allowed to pass dual-task threshold
      const symmetryPass = symmetryErrors <= Math.floor(puzzle.sequenceLength * 0.35);

      if (sequenceCorrect && symmetryPass) {
        setFeedback('correct');
        playCorrect();
        setTimeout(() => submitAnswer(true), 500);
      } else {
        setFeedback('wrong');
        playWrong();
        submitAnswer(false);
        setTimeout(() => {
          setFeedback(null);
          loadPuzzle();
        }, 800);
      }
    }
  }, [puzzle, phase, feedback, userSequence, symmetryErrors, submitAnswer, loadPuzzle]);

  // Hotkeys: S (Symmetric) / N (Non-Symmetric) during DISTRACT
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'DISTRACT') return;
      const key = e.key.toLowerCase();
      if (key === 'y' || key === 's' || key === 'arrowleft' || key === '1') {
        e.preventDefault();
        handleSymmetryAnswer(true);
      } else if (key === 'n' || key === 'arrowright' || key === '2') {
        e.preventDefault();
        handleSymmetryAnswer(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, handleSymmetryAnswer]);

  if (!puzzle) return null;

  const currentTask = puzzle.symmetryTasks[currentStep] || puzzle.symmetryTasks[0];

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Dual-Task Executive Working Memory",
      desc: "Memorize the sequence of flashing dots across the grid while completing interleaved symmetry verification tests.",
    },
    {
      title: "Interleaved Symmetry Test",
      desc: "Verify whether the 6x6 pixel grid is vertically or horizontally symmetric. Submitting incorrect symmetry answers penalizes your score.",
    },
    {
      title: "Final Sequence Recall",
      desc: "In the recall phase, click the remembered cells in the exact order they were presented.",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: 'S / 1 / ←', action: 'Answer "Symmetric"' },
    { key: 'N / 2 / →', action: 'Answer "Asymmetric"' },
  ];

  return (
    <AdaptiveGameShell
      title="Grid Challenge"
      category="Dual-Task Working Memory"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Phase Header Badge */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            {puzzle.gridSize}×{puzzle.gridSize} Grid • Span {puzzle.sequenceLength}
          </span>
          <span className={`px-2.5 py-1 rounded-lg border font-bold ${
            phase === 'MEMORIZE'
              ? 'bg-amber-50 border-amber-300 text-amber-700 animate-pulse'
              : phase === 'DISTRACT'
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-emerald-50 border-emerald-300 text-emerald-700'
          }`}>
            Phase: {phase} ({currentStep + 1}/{puzzle.sequenceLength})
          </span>
        </div>

        {/* Dynamic Display based on Phase */}
        {phase === 'MEMORIZE' && (
          <div className="w-full max-w-[min(90vw,360px)] bg-surface-paper border border-border-hairline rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col items-center gap-3">
            <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted text-center">
              Memorize coordinate location (Dot {currentStep + 1}):
            </span>

            <div
              className="grid gap-2 sm:gap-3 w-full aspect-square p-2 bg-surface-cream/50 rounded-2xl border border-border-hairline"
              style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: puzzle.gridSize }).map((_, r) =>
                Array.from({ length: puzzle.gridSize }).map((_, c) => {
                  const target = puzzle.sequence[currentStep];
                  const isDot = target && target.row === r && target.col === c;

                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-full h-full aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center border-2 transition-all ${
                        isDot
                          ? 'bg-amber-500 border-amber-600 ring-4 ring-amber-300 scale-105 shadow-md'
                          : 'bg-surface-cream border-border-hairline'
                      }`}
                    >
                      {isDot && (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-inner animate-ping" />
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {phase === 'DISTRACT' && (
          <div className="w-full max-w-[min(90vw,380px)] bg-surface-paper border border-border-hairline rounded-3xl p-4 sm:p-6 shadow-xs flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted">
                Distraction Task ({currentTask.axis} Symmetry)
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-muted">
                Is the pattern symmetric along the {currentTask.axis} axis?
              </span>
            </div>

            {/* 6x6 Symmetry Matrix */}
            <div className="p-2 sm:p-3 bg-surface-cream border border-border-hairline rounded-2xl shadow-inner relative max-w-[260px] w-full">
              <div className="grid grid-cols-6 gap-1 sm:gap-1.5 w-full aspect-square">
                {currentTask.matrix.map((row, r) =>
                  row.map((val, c) => (
                    <div
                      key={`${r}-${c}`}
                      className={`w-full h-full aspect-square rounded-sm sm:rounded-md transition-colors ${
                        val ? 'bg-primary shadow-xs' : 'bg-surface-paper border border-border-hairline/60'
                      }`}
                    />
                  ))
                )}
              </div>

              {/* Mirror Axis Guideline */}
              {currentTask.axis === 'vertical' ? (
                <div className="absolute top-2 bottom-2 left-1/2 w-0.5 bg-rose-500/60 -translate-x-1/2 pointer-events-none" />
              ) : (
                <div className="absolute left-2 right-2 top-1/2 h-0.5 bg-rose-500/60 -translate-y-1/2 pointer-events-none" />
              )}
            </div>

            {/* Answer Buttons */}
            <div className="flex items-center gap-2.5 sm:gap-4 w-full justify-center">
              <button
                type="button"
                onClick={() => handleSymmetryAnswer(true)}
                className="flex-1 max-w-[160px] py-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-mono font-bold text-xs sm:text-sm hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>YES, Symmetric</span>
                <span className="text-[9px] opacity-70">(S/1)</span>
              </button>
              <button
                type="button"
                onClick={() => handleSymmetryAnswer(false)}
                className="flex-1 max-w-[160px] py-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-700 font-mono font-bold text-xs sm:text-sm hover:bg-rose-100 active:scale-95 transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>NO, Asymmetric</span>
                <span className="text-[9px] opacity-70">(N/2)</span>
              </button>
            </div>
          </div>
        )}

        {phase === 'RECALL' && (
          <div className="w-full max-w-[min(90vw,360px)] bg-surface-paper border border-border-hairline rounded-3xl p-3 sm:p-5 shadow-xs flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted">
                Recall Phase: Click dots in exact order
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono text-muted">
                Selected: {userSequence.length} / {puzzle.sequenceLength}
              </span>
            </div>

            <div
              className="grid gap-2 sm:gap-3 w-full aspect-square p-2 bg-surface-cream/50 rounded-2xl border border-border-hairline"
              style={{ gridTemplateColumns: `repeat(${puzzle.gridSize}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: puzzle.gridSize }).map((_, r) =>
                Array.from({ length: puzzle.gridSize }).map((_, c) => {
                  const clickIdx = userSequence.findIndex(p => p.row === r && p.col === c);
                  const isSelected = clickIdx !== -1;

                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      onClick={() => handleRecallCellClick(r, c)}
                      disabled={feedback !== null || isSelected}
                      className={`w-full h-full aspect-square rounded-xl sm:rounded-2xl flex items-center justify-center font-mono font-black text-base sm:text-xl transition-all shadow-2xs ${
                        isSelected
                          ? 'bg-secondary text-white border-2 border-secondary scale-103 shadow-md'
                          : 'bg-surface-cream border-2 border-border-hairline hover:border-secondary active:scale-95 cursor-pointer'
                      }`}
                    >
                      {isSelected ? clickIdx + 1 : ''}
                    </button>
                  );
                })
              )}
            </div>

            {feedback === 'correct' && (
              <div className="flex items-center gap-2 text-emerald-600 font-mono font-bold text-sm">
                <Check size={18} />
                <span>Working memory sequence perfectly matched!</span>
              </div>
            )}
            {feedback === 'wrong' && (
              <div className="text-rose-600 font-mono font-bold text-sm">
                Sequence mismatch or failed interference threshold.
              </div>
            )}
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};

export default GridChallengeGame;
