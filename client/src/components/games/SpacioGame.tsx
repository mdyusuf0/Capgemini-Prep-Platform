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
      {s.shape === 'square' && <div className={`w-8 h-8 rounded-sm ${isSolid ? 'bg-secondary' : 'border-2 border-secondary'}`} />}
      {s.shape === 'circle' && <div className={`w-8 h-8 rounded-full ${isSolid ? 'bg-purple-600' : 'border-2 border-purple-600'}`} />}
      {s.shape === 'triangle' && (
        <div className={`w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] ${isSolid ? 'border-b-amber-500' : 'border-b-amber-500/40'}`} />
      )}
      {s.shape === 'diamond' && <div className={`w-8 h-8 rotate-45 rounded-sm ${isSolid ? 'bg-emerald-600' : 'border-2 border-emerald-600'}`} />}
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
      <div className="flex items-center justify-center p-12 text-on-surface-variant">
        <div className="w-8 h-8 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 text-on-surface">
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
        <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Spacio (Inductive Reasoning)</h2>
        <p className="text-on-surface-variant text-xs">
          Observe how Figure A transforms into Figure B. Determine the underlying geometric rule and apply it to Figure C.
        </p>
      </div>

      {/* Demonstration Row: A -> B and C -> ? */}
      <div className="bg-white border border-border-hairline rounded-2xl p-6 flex flex-col md:flex-row items-center justify-around gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-surface-cream rounded-xl border border-border-hairline flex flex-col items-center">
            <span className="text-xs text-on-surface-variant mb-2 font-mono font-bold">Figure A</span>
            {renderShapeIcon(puzzle.pairA)}
          </div>
          <span className="text-2xl font-bold text-secondary">→</span>
          <div className="p-4 bg-surface-cream rounded-xl border border-border-hairline flex flex-col items-center">
            <span className="text-xs text-on-surface-variant mb-2 font-mono font-bold">Figure B</span>
            {renderShapeIcon(puzzle.pairB)}
          </div>
        </div>

        <div className="w-px h-16 bg-border-hairline hidden md:block" />

        <div className="flex items-center gap-4">
          <div className="p-4 bg-surface-cream rounded-xl border border-border-hairline flex flex-col items-center">
            <span className="text-xs text-on-surface-variant mb-2 font-mono font-bold">Figure C</span>
            {renderShapeIcon(puzzle.queryC)}
          </div>
          <span className="text-2xl font-bold text-secondary">→</span>
          <div className="w-24 h-24 p-4 bg-secondary-fixed/20 border-2 border-dashed border-secondary rounded-xl flex items-center justify-center text-2xl font-bold text-secondary animate-pulse">
            ?
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <span className="text-xs text-on-surface-variant uppercase tracking-wider font-mono font-semibold block text-center">
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
                className={`p-6 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:pointer-events-none cursor-pointer shadow-xs ${
                  selectedOption !== null
                    ? isCorrect
                      ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-900'
                      : isSelected ? 'bg-red-50 border-2 border-red-500 text-red-900' : 'bg-surface-cream opacity-40 border-border-hairline'
                    : 'bg-white hover:bg-surface-cream border-border-hairline hover:border-zinc-400'
                }`}
              >
                <span className="text-xs text-on-surface-variant font-mono font-bold">Option {String.fromCharCode(65 + idx)}</span>
                {renderShapeIcon(opt)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Result feedback */}
      {selectedOption !== null && (
        <div className={`p-4 rounded-xl flex items-center justify-between border shadow-xs animate-in fade-in slide-in-from-bottom-2 ${
          selectedOption === puzzle.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-red-50 border-red-300 text-red-950'
        }`}>
          <div className="flex items-center space-x-3">
            {selectedOption === puzzle.correctAnswer ? <CheckCircle2 className="w-6 h-6 text-emerald-600" /> : <XCircle className="w-6 h-6 text-red-600" />}
            <div>
              <div className="font-bold text-sm">{selectedOption === puzzle.correctAnswer ? 'Pattern Discovered!' : 'Incorrect Transformation'}</div>
              <div className="text-xs text-on-surface-variant font-mono">{puzzle.ruleExplanation}</div>
            </div>
          </div>
          <button
            onClick={() => setRound(r => r + 1)}
            className="px-4 py-2 bg-primary-container hover:bg-black text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            {round >= 5 ? 'Finish Game' : 'Next Puzzle →'}
          </button>
        </div>
      )}
    </div>
  );
};
export default SpacioGame;
