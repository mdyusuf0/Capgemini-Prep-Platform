import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Shuffle } from 'lucide-react';
import api from '@/services/api';

interface SwitchPuzzle {
  inputSequence: string[];
  switchRule: number[];
  outputSequence: string[];
  options: number[][];
  correctAnswer: number;
}

export const SwitchChallengeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<SwitchPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPuzzle = async () => {
    setLoading(true);
    setSelectedOption(null);
    try {
      const { data } = await api.get('/games/generate/switch');
      setPuzzle(data);
    } catch {
      setPuzzle({
        inputSequence: ['▲', '■', '●', '★'],
        switchRule: [3, 2, 1, 0],
        outputSequence: ['★', '●', '■', '▲'],
        options: [
          [3, 2, 1, 0],
          [2, 1, 0, 3],
          [2, 3, 1, 0],
          [1, 2, 3, 0]
        ],
        correctAnswer: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPuzzle();
  }, [round]);

  const handleSelect = (idx: number) => {
    if (selectedOption !== null || !puzzle) return;
    setSelectedOption(idx);
    if (idx === puzzle.correctAnswer) {
      setScore(s => s + 100);
    }
  };

  if (loading || !puzzle) {
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
          <Shuffle className="text-secondary w-6 h-6" /> Switch Challenge (Sequence Permutation)
        </h2>
        <p className="text-on-surface-variant text-xs">
          The input shapes pass through a transformation switch that reorders positions. Deduce which switch rule produced the output sequence.
        </p>
      </div>

      {/* Demonstration Card */}
      <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col items-center space-y-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant font-mono w-16 font-bold">INPUT:</span>
          <div className="flex gap-2">
            {puzzle.inputSequence.map((sym, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-center text-xl font-bold text-on-surface shadow-xs">
                {sym}
              </div>
            ))}
          </div>
        </div>

        <div className="w-48 py-2 bg-secondary-fixed/40 border border-secondary/30 rounded-lg text-center text-xs font-mono font-bold text-secondary tracking-wider animate-pulse">
          ▼ [SWITCH OPERATOR ?] ▼
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant font-mono w-16 font-bold">OUTPUT:</span>
          <div className="flex gap-2">
            {puzzle.outputSequence.map((sym, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl bg-secondary-fixed/20 border border-secondary flex items-center justify-center text-xl font-bold text-secondary shadow-xs">
                {sym}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold block text-center">
          Which position mapping rule is correct?
        </span>
        <div className="grid grid-cols-2 gap-4">
          {puzzle.options.map((rule, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === puzzle.correctAnswer;
            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleSelect(idx)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                  selectedOption !== null
                    ? isCorrect
                      ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950'
                      : isSelected ? 'bg-red-50 border-2 border-red-500 text-red-950' : 'bg-surface-cream opacity-40 border-border-hairline'
                    : 'bg-white hover:bg-surface-cream border-border-hairline hover:border-zinc-400 text-on-surface'
                }`}
              >
                <span className="text-xs text-on-surface-variant font-mono font-bold">Switch {String.fromCharCode(65 + idx)}</span>
                <div className="flex gap-1.5 font-mono text-sm font-bold">
                  {rule.map((r, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-surface-cream rounded border border-border-hairline text-on-surface">
                      {r + 1}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback banner */}
      {selectedOption !== null && (
        <div className={`p-4 rounded-xl flex items-center justify-between border shadow-xs animate-in fade-in slide-in-from-bottom-2 ${
          selectedOption === puzzle.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-center space-x-3">
            {selectedOption === puzzle.correctAnswer ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
            <div>
              <div className="font-bold text-sm">{selectedOption === puzzle.correctAnswer ? 'Correct Mapping!' : 'Incorrect Mapping'}</div>
              <div className="text-xs text-on-surface-variant font-mono">Position mapping: {puzzle.switchRule.map(r => r + 1).join(' → ')}</div>
            </div>
          </div>
          <button
            onClick={async () => {
              if (round >= 5) {
                try {
                  await api.post('/games/score', {
                    gameType: 'switch',
                    level: round,
                    score: score + (selectedOption === puzzle.correctAnswer ? 100 : 0),
                    accuracy: 80,
                    timeSpent: 45
                  });
                } catch (e) {}
                onBack();
              } else {
                setRound(r => r + 1);
              }
            }}
            className="px-4 py-2 bg-primary-container hover:bg-black text-white rounded-lg text-xs font-mono font-bold transition-colors cursor-pointer shadow-xs"
          >
            {round >= 5 ? 'Finish & Record Score' : 'Next Switch →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default SwitchChallengeGame;
