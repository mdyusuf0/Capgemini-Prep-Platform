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
      <div className="flex items-center justify-center p-12 text-gray-400">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <button onClick={onBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Game
        </button>
        <div className="flex items-center space-x-6 text-sm">
          <div><span className="text-gray-500">Round:</span> <span className="font-bold text-white">{round}/5</span></div>
          <div><span className="text-gray-500">Score:</span> <span className="font-bold text-purple-400">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Brain className="text-purple-400 w-6 h-6" /> Grid Challenge (Working Memory)
        </h2>
        <p className="text-gray-400 text-sm">
          {phase === 'memorize' && "Observe and remember the sequence of glowing grid cells."}
          {phase === 'symmetry' && "Distractor Task: Is the figure vertically symmetrical?"}
          {phase === 'recall' && `Click the cells in the EXACT order they appeared (${userSequence.length}/${puzzle.sequence.length}).`}
          {phase === 'result' && "Round Summary"}
        </p>
      </div>

      {/* Main Game Surface */}
      {phase === 'memorize' && (
        <div className="flex justify-center my-8">
          <div className="grid grid-cols-4 gap-3 p-4 bg-[#1e1e2e] rounded-2xl border border-gray-800 shadow-xl">
            {Array.from({ length: 16 }).map((_, idx) => {
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const currentLit = puzzle.sequence[activeStep];
              const isLit = currentLit && currentLit.row === r && currentLit.col === c;
              return (
                <div
                  key={idx}
                  className={`w-16 h-16 rounded-xl transition-all duration-300 ${
                    isLit ? 'bg-purple-500 shadow-lg shadow-purple-500/50 scale-105' : 'bg-[#0a0a0a] border border-gray-800'
                  }`}
                />
              );
            })}
          </div>
        </div>
      )}

      {phase === 'symmetry' && (
        <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 text-center space-y-6">
          <div className="grid grid-cols-4 gap-2 w-48 mx-auto p-3 bg-[#0a0a0a] rounded-xl border border-gray-700">
            {puzzle.symmetryTask.grid.flatMap((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className={`w-9 h-9 rounded ${cell ? 'bg-indigo-400' : 'bg-gray-800/40'}`} />
              ))
            )}
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => handleSymmetryAnswer(true)}
              className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-sm"
            >
              Yes, Symmetrical
            </button>
            <button
              onClick={() => handleSymmetryAnswer(false)}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm"
            >
              No, Asymmetrical
            </button>
          </div>
        </div>
      )}

      {phase === 'recall' && (
        <div className="flex justify-center my-8">
          <div className="grid grid-cols-4 gap-3 p-4 bg-[#1e1e2e] rounded-2xl border border-gray-800 shadow-xl">
            {Array.from({ length: 16 }).map((_, idx) => {
              const r = Math.floor(idx / 4);
              const c = idx % 4;
              const clickIndex = userSequence.findIndex(s => s.row === r && s.col === c);
              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(r, c)}
                  className={`w-16 h-16 rounded-xl font-bold text-xl flex items-center justify-center transition-all ${
                    clickIndex !== -1 ? 'bg-purple-600 text-white scale-95' : 'bg-[#0a0a0a] hover:bg-[#2a2a3e] border border-gray-800 text-white'
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
        <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Sequence Completed!</h3>
          <p className="text-sm text-gray-400">
            Symmetry Task: {userSymmetryGuess === puzzle.symmetryTask.isSymmetric ? '✅ Correct (+50 pts)' : '❌ Incorrect'}
          </p>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors"
          >
            {round >= 5 ? 'Finish' : 'Next Level →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default GridChallengeGame;
