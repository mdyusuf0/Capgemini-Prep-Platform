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
          <div><span className="text-gray-500">Score:</span> <span className="font-bold text-blue-400">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <Shuffle className="text-blue-400 w-6 h-6" /> Switch Challenge (Sequence Permutation)
        </h2>
        <p className="text-gray-400 text-sm">
          The input shapes pass through a transformation switch that reorders positions. Deduce which switch rule produced the output sequence.
        </p>
      </div>

      {/* Demonstration Card */}
      <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 flex flex-col items-center space-y-6 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono w-16">INPUT:</span>
          <div className="flex gap-2">
            {puzzle.inputSequence.map((sym, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-gray-700 flex items-center justify-center text-xl font-bold text-white">
                {sym}
              </div>
            ))}
          </div>
        </div>

        <div className="w-48 py-2 bg-blue-950/40 border border-blue-500/40 rounded-lg text-center text-xs font-mono text-blue-400 animate-pulse">
          ▼ [SWITCH OPERATOR ?] ▼
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-mono w-16">OUTPUT:</span>
          <div className="flex gap-2">
            {puzzle.outputSequence.map((sym, idx) => (
              <div key={idx} className="w-12 h-12 rounded-xl bg-blue-900/20 border border-blue-500/50 flex items-center justify-center text-xl font-bold text-blue-300">
                {sym}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block text-center">
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
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  selectedOption !== null
                    ? isCorrect
                      ? 'bg-green-600/20 border-green-500 text-green-300'
                      : isSelected ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-[#1e1e2e] opacity-40 border-gray-800'
                    : 'bg-[#1e1e2e] hover:bg-[#2a2a3e] border-gray-700 text-white'
                }`}
              >
                <span className="text-xs text-gray-400 font-mono">Switch {String.fromCharCode(65 + idx)}</span>
                <div className="flex gap-1.5 font-mono text-sm font-bold">
                  {rule.map((r, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#0a0a0a] rounded border border-gray-700">
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
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          selectedOption === puzzle.correctAnswer ? 'bg-green-900/20 border-green-500/40 text-green-300' : 'bg-red-900/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center space-x-3">
            {selectedOption === puzzle.correctAnswer ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
            <div>
              <div className="font-bold">{selectedOption === puzzle.correctAnswer ? 'Correct Mapping!' : 'Incorrect Mapping'}</div>
              <div className="text-xs text-gray-400">Position mapping: {puzzle.switchRule.map(r => r + 1).join(' → ')}</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            {round >= 5 ? 'Finish' : 'Next Switch →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default SwitchChallengeGame;
