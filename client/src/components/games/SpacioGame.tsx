import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import api from '@/services/api';

interface SpacioShape {
  shape: string;
  rotation: number;
  fill: string;
}

interface SpacioPuzzle {
  pairA: SpacioShape;
  pairB: SpacioShape;
  queryC: SpacioShape;
  options: SpacioShape[];
  correctAnswer: number;
  ruleExplanation: string;
}

const renderShapeIcon = (s: SpacioShape) => {
  const isSolid = s.fill === 'solid';
  const rotationStyle = { transform: `rotate(${s.rotation}deg)` };

  return (
    <div className="w-12 h-12 flex items-center justify-center transition-transform" style={rotationStyle}>
      {s.shape === 'square' && <div className={`w-8 h-8 rounded-sm ${isSolid ? 'bg-indigo-400' : 'border-2 border-indigo-400'}`} />}
      {s.shape === 'circle' && <div className={`w-8 h-8 rounded-full ${isSolid ? 'bg-purple-400' : 'border-2 border-purple-400'}`} />}
      {s.shape === 'triangle' && (
        <div className={`w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] ${isSolid ? 'border-b-amber-400' : 'border-b-amber-400/30'}`} />
      )}
      {s.shape === 'diamond' && <div className={`w-8 h-8 rotate-45 rounded-sm ${isSolid ? 'bg-emerald-400' : 'border-2 border-emerald-400'}`} />}
    </div>
  );
};

export const SpacioGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [puzzle, setPuzzle] = useState<SpacioPuzzle | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPuzzle = async () => {
    setLoading(true);
    setSelectedOption(null);
    try {
      const { data } = await api.get('/games/generate/spacio');
      setPuzzle(data);
    } catch {
      setPuzzle({
        pairA: { shape: 'square', rotation: 0, fill: 'solid' },
        pairB: { shape: 'square', rotation: 90, fill: 'outline' },
        queryC: { shape: 'triangle', rotation: 0, fill: 'solid' },
        options: [
          { shape: 'triangle', rotation: 90, fill: 'outline' },
          { shape: 'triangle', rotation: 180, fill: 'outline' },
          { shape: 'triangle', rotation: 90, fill: 'solid' },
          { shape: 'square', rotation: 90, fill: 'outline' }
        ],
        correctAnswer: 0,
        ruleExplanation: "The object rotates 90 degrees clockwise and its interior fill changes from solid to outline."
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <button onClick={onBack} className="flex items-center text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Exit Game
        </button>
        <div className="flex items-center space-x-6 text-sm">
          <div><span className="text-gray-500">Round:</span> <span className="font-bold text-white">{round}/5</span></div>
          <div><span className="text-gray-500">Score:</span> <span className="font-bold text-cyan-400">{score}</span></div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Spacio (Inductive Reasoning)</h2>
        <p className="text-gray-400 text-sm">
          Observe how Figure A transforms into Figure B. Determine the underlying geometric rule and apply it to Figure C.
        </p>
      </div>

      {/* Demonstration Row: A -> B and C -> ? */}
      <div className="bg-[#1e1e2e] border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-gray-700 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-2 font-mono">Figure A</span>
            {renderShapeIcon(puzzle.pairA)}
          </div>
          <span className="text-2xl font-bold text-indigo-400">→</span>
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-gray-700 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-2 font-mono">Figure B</span>
            {renderShapeIcon(puzzle.pairB)}
          </div>
        </div>

        <div className="w-px h-16 bg-gray-800 hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#0a0a0a] rounded-xl border border-gray-700 flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-2 font-mono">Figure C</span>
            {renderShapeIcon(puzzle.queryC)}
          </div>
          <span className="text-2xl font-bold text-cyan-400">→</span>
          <div className="w-24 h-24 p-4 bg-cyan-950/20 border-2 border-dashed border-cyan-500/50 rounded-xl flex items-center justify-center text-2xl font-bold text-cyan-400 animate-pulse">
            ?
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold block text-center">
          Choose the transformed figure:
        </span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {puzzle.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === puzzle.correctAnswer;
            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleSelect(idx)}
                className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:pointer-events-none ${
                  selectedOption !== null
                    ? isCorrect
                      ? 'bg-green-600/20 border-green-500 text-green-300'
                      : isSelected ? 'bg-red-600/20 border-red-500 text-red-300' : 'bg-[#1e1e2e] opacity-40 border-gray-800'
                    : 'bg-[#1e1e2e] hover:bg-[#2a2a3e] border-gray-700'
                }`}
              >
                <span className="text-xs text-gray-400 font-mono">Option {String.fromCharCode(65 + idx)}</span>
                {renderShapeIcon(opt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result feedback */}
      {selectedOption !== null && (
        <div className={`p-4 rounded-xl flex items-center justify-between border ${
          selectedOption === puzzle.correctAnswer ? 'bg-green-900/20 border-green-500/40 text-green-300' : 'bg-red-900/20 border-red-500/40 text-red-300'
        }`}>
          <div className="flex items-center space-x-3">
            {selectedOption === puzzle.correctAnswer ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <XCircle className="w-6 h-6 text-red-400" />}
            <div>
              <div className="font-bold">{selectedOption === puzzle.correctAnswer ? 'Pattern Discovered!' : 'Incorrect Transformation'}</div>
              <div className="text-xs text-gray-300">{puzzle.ruleExplanation}</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {round >= 5 ? 'Finish' : 'Next Puzzle →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default SpacioGame;
