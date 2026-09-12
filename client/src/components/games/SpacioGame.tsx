import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Check, ArrowRight } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { SpacioEngine, SpacioPuzzle, VisualEntity } from '../../services/cognitiveEngine';

/**
 * High-fidelity SVG renderer for multi-attribute geometric figures.
 */
const VisualFigure: React.FC<{ entity: VisualEntity; size?: number; className?: string }> = ({
  entity,
  size = 70,
  className = ''
}) => {
  const { polygon, rotation, fill, satelliteCount, orbitPosition } = entity;
  const center = size / 2;
  const radius = size * 0.32;

  // Polygon vertices generator
  const getPolygonPoints = (sides: number): string => {
    const points: string[] = [];
    const step = (2 * Math.PI) / sides;
    const startAngle = -Math.PI / 2; // Point facing up
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * step;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  let sides = 4;
  if (polygon === 'triangle') sides = 3;
  if (polygon === 'square') sides = 4;
  if (polygon === 'pentagon') sides = 5;
  if (polygon === 'hexagon') sides = 6;
  if (polygon === 'octagon') sides = 8;

  const points = getPolygonPoints(sides);

  // Satellite dot positioning
  const getSatelliteCoordinates = (): { cx: number; cy: number }[] => {
    if (satelliteCount === 0) return [];
    const coords: { cx: number; cy: number }[] = [];
    const orbitDistance = radius * 1.35;

    let baseAngle = -Math.PI / 2;
    if (orbitPosition === 'east') baseAngle = 0;
    if (orbitPosition === 'south') baseAngle = Math.PI / 2;
    if (orbitPosition === 'west') baseAngle = Math.PI;
    if (orbitPosition === 'center') {
      // Clustered inside
      for (let i = 0; i < satelliteCount; i++) {
        const offset = (i - (satelliteCount - 1) / 2) * 6;
        coords.push({ cx: center + offset, cy: center });
      }
      return coords;
    }

    const spreadStep = 0.35;
    for (let i = 0; i < satelliteCount; i++) {
      const angle = baseAngle + (i - (satelliteCount - 1) / 2) * spreadStep;
      coords.push({
        cx: center + orbitDistance * Math.cos(angle),
        cy: center + orbitDistance * Math.sin(angle)
      });
    }
    return coords;
  };

  const satellites = getSatelliteCoordinates();

  // Pattern ID for hatching/stripes
  const patternId = `pattern_${polygon}_${fill}_${rotation}_${size}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`overflow-visible select-none ${className}`}
    >
      <defs>
        {/* Striped Pattern */}
        <pattern id={`${patternId}_striped`} width="6" height="6" patternUnits="userSpaceOnUse">
          <line x1="0" y1="3" x2="6" y2="3" stroke="#2563eb" strokeWidth="1.5" />
        </pattern>
        {/* Hatched Pattern */}
        <pattern id={`${patternId}_hatched`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 0 L 6 6 M 6 0 L 0 6" stroke="#059669" strokeWidth="1.2" />
        </pattern>
        {/* Dotted Pattern */}
        <pattern id={`${patternId}_dotted`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="1.2" fill="#d97706" />
        </pattern>
      </defs>

      {/* Main Rotatable Polygon */}
      <g transform={`rotate(${rotation}, ${center}, ${center})`}>
        <polygon
          points={points}
          fill={
            fill === 'solid'
              ? '#1e293b'
              : fill === 'outline'
              ? 'none'
              : fill === 'striped'
              ? `url(#${patternId}_striped)`
              : fill === 'hatched'
              ? `url(#${patternId}_hatched)`
              : `url(#${patternId}_dotted)`
          }
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Satellite Dots */}
      {satellites.map((sat, i) => (
        <circle
          key={i}
          cx={sat.cx}
          cy={sat.cy}
          r="3.5"
          className="fill-rose-500 stroke-surface-paper"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
};

export const SpacioGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<SpacioPuzzle | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    setSelectedIdx(null);
    const newPuzzle = SpacioEngine.generate(level);
    setPuzzle(newPuzzle);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleOptionSelect = useCallback((idx: number) => {
    if (!puzzle || feedback !== null) return;
    playClick();
    setSelectedIdx(idx);

    if (idx === puzzle.correctAnswerIndex) {
      setFeedback('correct');
      playCorrect();
      setTimeout(() => submitAnswer(true), 500);
    } else {
      setFeedback('wrong');
      playWrong();
      submitAnswer(false);
      setTimeout(() => {
        setFeedback(null);
        setSelectedIdx(null);
      }, 700);
    }
  }, [puzzle, feedback, submitAnswer]);

  // Hotkeys: 1 to 4 or A to D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || feedback !== null) return;
      const keyMap: Record<string, number> = {
        '1': 0, '2': 1, '3': 2, '4': 3,
        'a': 0, 'b': 1, 'c': 2, 'd': 3
      };
      const lower = e.key.toLowerCase();
      if (lower in keyMap && keyMap[lower] < puzzle.options.length) {
        e.preventDefault();
        handleOptionSelect(keyMap[lower]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, feedback, handleOptionSelect]);

  if (!puzzle) return null;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Discover the Governing Rule (A → B)",
      desc: "Observe the transformation occurring between Figure A and Figure B (e.g. rotation, fill texture, satellite dots).",
    },
    {
      title: "Apply Rule to Figure C (C → ?)",
      desc: "Apply the identical compound rule to Figure C to identify the correct completion.",
    },
    {
      title: "Select Correct Option",
      desc: "Click options 1–4 or press keys 1–4 / A–D. Watch out for near-miss distractors!",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3, 4', action: 'Select Option 1 to 4' },
    { key: 'A, B, C, D', action: 'Alternative Selection' },
  ];

  return (
    <AdaptiveGameShell
      title="Spacio"
      category="Inductive Matrix Reasoning"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Analogy Pairs Card */}
        <div className="w-full bg-surface-paper border border-border-hairline rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
          
          {/* Rule Pair A -> B */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Rule Pair (A → B)
            </span>
            <div className="flex items-center justify-around bg-surface-cream/70 border border-border-hairline rounded-2xl p-4">
              <div className="flex flex-col items-center gap-1">
                <VisualFigure entity={puzzle.figureA} size={76} />
                <span className="text-[11px] font-mono font-bold text-muted">A</span>
              </div>
              <ArrowRight size={22} className="text-secondary" />
              <div className="flex flex-col items-center gap-1">
                <VisualFigure entity={puzzle.figureB} size={76} />
                <span className="text-[11px] font-mono font-bold text-muted">B</span>
              </div>
            </div>
          </div>

          {/* Target Query Pair C -> ? */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Apply to Target (C → ?)
            </span>
            <div className="flex items-center justify-around bg-surface-cream/70 border border-border-hairline rounded-2xl p-4">
              <div className="flex flex-col items-center gap-1">
                <VisualFigure entity={puzzle.figureC} size={76} />
                <span className="text-[11px] font-mono font-bold text-muted">C</span>
              </div>
              <ArrowRight size={22} className="text-secondary" />
              <div className="w-18 h-18 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/60 flex items-center justify-center animate-pulse">
                <span className="text-2xl font-black font-mono text-amber-600">?</span>
              </div>
            </div>
          </div>

        </div>

        {/* Options Grid */}
        <div className="w-full flex flex-col gap-3">
          <div className="text-xs font-mono font-bold tracking-wider uppercase text-muted text-center">
            Select matching option:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {puzzle.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleOptionSelect(idx)}
                  disabled={feedback !== null}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                    isSelected && feedback === 'correct'
                      ? 'bg-emerald-50 border-emerald-500 ring-4 ring-emerald-200 scale-103'
                      : isSelected && feedback === 'wrong'
                      ? 'bg-rose-50 border-rose-500 ring-4 ring-rose-200'
                      : 'bg-surface-paper border-border-hairline hover:border-secondary hover:scale-102 active:scale-95'
                  }`}
                >
                  <VisualFigure entity={opt} size={64} />
                  <div className="mt-3 px-2 py-0.5 rounded-md bg-surface-cream border border-border-hairline text-[11px] font-mono font-bold text-foreground">
                    Option {String.fromCharCode(65 + idx)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </AdaptiveGameShell>
  );
};

export default SpacioGame;
