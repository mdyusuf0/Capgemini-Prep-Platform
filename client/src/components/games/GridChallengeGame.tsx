import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Brain } from 'lucide-react';
import api from '@/services/api';

interface GridPuzzle {
  gridSize: number;
  sequenceLength: number;
  sequence: { row: number; col: number }[];
  symmetryTask: { grid: boolean[][]; isSymmetric: boolean };
}

export const GridChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<GridPuzzle | null>(null);
  const [phase, setPhase] = useState<'memorize' | 'symmetry' | 'recall' | 'result'>('memorize');
  const [activeStep, setActiveStep] = useState(0);
  const [userSequence, setUserSequence] = useState<{ row: number; col: number }[]>([]);
  const [userSymmetryGuess, setUserSymmetryGuess] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const fetchPuzzle = async () => {
    setPhase('memorize');
    setActiveStep(0);
    setUserSequence([]);
    setUserSymmetryGuess(null);
    try {
      const { data } = await api.get(`/games/generate/grid?level=${round}`);
      setPuzzle(data);
    } catch {
      setPuzzle({
        gridSize: 4,
        sequenceLength: 3,
        sequence: [{ row: 0, col: 1 }, { row: 2, col: 3 }, { row: 3, col: 0 }],
        symmetryTask: {
          grid: [[true, false, false, true], [false, true, true, false], [false, false, false, false], [true, true, true, true]],
          isSymmetric: true
        }
      });
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [round]);

  // Handle Memorization Playback
  useEffect(() => {
    if (phase === 'memorize' && puzzle) {
      if (activeStep < puzzle.sequence.length) {
        const timer = setTimeout(() => {
          setActiveStep(s => s + 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Sequence playback complete, transition to distractor symmetry task
        const timer = setTimeout(() => {
          setPhase('symmetry');
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [phase, activeStep, puzzle]);

  const handleSymmetryAnswer = (guess: boolean) => {
    setUserSymmetryGuess(guess);
    setTimeout(() => {
      setPhase('recall');
    }, 500);
  };

  const handleCellClick = (r: number, c: number) => {
    if (phase !== 'recall' || !puzzle) return;
    const nextSeq = [...userSequence, { row: r, col: c }];
    setUserSequence(nextSeq);

    if (nextSeq.length === puzzle.sequence.length) {
      // Evaluate result
      let correctPositions = 0;
      for (let i = 0; i < puzzle.sequence.length; i++) {
        if (puzzle.sequence[i].row === nextSeq[i].row && puzzle.sequence[i].col === nextSeq[i].col) {
          correctPositions++;
        }
      }
      const symBonus = userSymmetryGuess === puzzle.symmetryTask.isSymmetric ? 50 : 0;
      const roundScore = (correctPositions * 50) + symBonus;
      setScore(s => s + roundScore);
      setPhase('result');
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
          <div><span className="text-on-surface-variant">Round:</span> <span className="font-bold text-on-surface">{round}/5</span></div>
          <div><span className="text-on-surface-variant">Velocity Score:</span> <span className="font-bold text-secondary">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-extrabold text-on-surface flex items-center justify-center gap-2 tracking-tight">
          <Brain className="text-secondary w-6 h-6" /> Grid Challenge (Working Memory)
        </h2>
        <p className="text-on-surface-variant text-xs">
          {phase === 'memorize' && "Observe and remember the sequence of glowing grid cells."}
          {phase === 'symmetry' && "Distractor Task: Is the figure vertically symmetrical?"}
          {phase === 'recall' && `Click the cells in the EXACT order they appeared (${userSequence.length}/${puzzle.sequence.length}).`}
          {phase === 'result' && "Round Summary"}
        </p>
      </div>

      {/* Main Game Surface */}
      {phase === 'memorize' && (
        <div className="flex justify-center my-8">
          <div className="grid grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-border-hairline shadow-sm">
            {Array.from({ length: 16 }).map((_, idx) => {
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const currentLit = puzzle.sequence[activeStep];
              const isLit = currentLit && currentLit.row === r && currentLit.col === c;
              return (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-xl transition-all duration-300 ${
                    isLit ? 'bg-secondary text-white shadow-md scale-105' : 'bg-surface-cream border border-border-hairline'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {phase === 'symmetry' && (
        <div className="bg-white border border-border-hairline rounded-2xl p-6 text-center space-y-6 shadow-sm">
          <div className="grid grid-cols-4 gap-2 w-48 mx-auto p-3 bg-surface-cream rounded-xl border border-border-hairline">
            {puzzle.symmetryTask.grid.flatMap((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className={`w-9 h-9 rounded ${cell ? 'bg-secondary' : 'bg-white border border-border-hairline/60'}`} />
              ))
            )}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSymmetryAnswer(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              Yes, Symmetrical
            </button>
            <button
              onClick={() => handleSymmetryAnswer(false)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold rounded-xl text-xs cursor-pointer shadow-xs"
            >
              No, Asymmetrical
            </button>
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div className="flex justify-center my-8">
          <div className="grid grid-cols-4 gap-3 p-4 bg-white rounded-2xl border border-border-hairline shadow-sm">
            {Array.from({ length: 16 }).map((_, idx) => {
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const clickIndex = userSequence.findIndex(s => s.row === r && s.col === c);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-16 h-16 rounded-xl font-bold font-mono text-xl flex items-center justify-center transition-all ${
                    clickIndex !== -1 ? 'bg-secondary text-white scale-95 shadow-xs' : 'bg-surface-cream hover:bg-white border border-border-hairline text-on-surface hover:border-zinc-400 cursor-pointer shadow-xs'
                  }`}
                >
                  {clickIndex !== -1 ? clickIndex + 1 : ''}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {phase === 'result' && (
        <div className="bg-white border border-border-hairline rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-extrabold text-on-surface tracking-tight">Sequence Completed!</h3>
          <p className="text-xs font-mono text-on-surface-variant">
            Symmetry Task: {userSymmetryGuess === puzzle.symmetryTask.isSymmetric ? '✅ Correct (+50 pts)' : '❌ Incorrect'}
          </p>
          <button
            onClick={async () => {
              if (round >= 5) {
                try {
                  await api.post('/games/score', {
                    gameType: 'grid',
                    level: round,
                    score,
                    accuracy: 95,
                    timeSpent: 60
                  });
                } catch (e) {}
                onBack();
              } else {
                setRound(r => r + 1);
              }
            }}
            className="px-6 py-2.5 bg-primary-container hover:bg-black text-white font-mono font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-sm"
          >
            {round >= 5 ? 'Finish & Record Score' : 'Next Level →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default GridChallengeGame;
