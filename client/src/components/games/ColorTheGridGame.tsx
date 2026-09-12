import React, { useState, useEffect, useCallback } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { Check, Info } from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { ColorGridEngine, ColorTheGridPuzzle } from '../../services/cognitiveEngine';

export const ColorTheGridGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const [puzzle, setPuzzle] = useState<ColorTheGridPuzzle | null>(null);
  const [userColors, setUserColors] = useState<{ [cardId: number]: string }>({});
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const loadPuzzle = useCallback(() => {
    setFeedback(null);
    setUserColors({});
    const newPuzzle = ColorGridEngine.generate(level);
    setPuzzle(newPuzzle);
    setSelectedColor(newPuzzle.allowedColors[0]?.id || 'orange');
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  useEffect(() => {
    loadPuzzle();
  }, [level, loadPuzzle]);

  const handleCardClick = useCallback((cardId: number) => {
    if (!puzzle || feedback !== null || !selectedColor) return;
    playClick();

    setUserColors(prev => {
      const updated = { ...prev, [cardId]: selectedColor };

      // Auto-validate if all 4 cards colored
      const allColored = puzzle.cards.every(c => updated[c.id] !== undefined);
      if (allColored) {
        const isAllCorrect = puzzle.cards.every(
          (c, idx) => updated[c.id] === puzzle.expectedColors[idx]
        );

        if (isAllCorrect) {
          setFeedback('correct');
          playCorrect();
          setTimeout(() => submitAnswer(true), 500);
        } else {
          setFeedback('wrong');
          playWrong();
          submitAnswer(false);
          setTimeout(() => {
            setFeedback(null);
            setUserColors({});
          }, 800);
        }
      }

      return updated;
    });
  }, [puzzle, feedback, selectedColor, submitAnswer]);

  // Hotkeys: 1 to N for color palette selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!puzzle || feedback !== null) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= puzzle.allowedColors.length) {
        e.preventDefault();
        playClick();
        setSelectedColor(puzzle.allowedColors[num - 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [puzzle, feedback]);

  if (!puzzle) return null;

  const INSTRUCTIONS: InstructionItem[] = [
    {
      title: "Evaluate the Logical Predicate Rule",
      desc: "Read the active conditional rule carefully. It defines which color to assign based on alphanumeric properties.",
    },
    {
      title: "Select Color & Paint Grids",
      desc: "Choose a color from the palette (or keys 1–3), then click each of the 4 grid cards to assign that color.",
    },
    {
      title: "Adversarial Boundaries",
      desc: "Rules become compound (AND/OR/NOT) at higher levels. Verify each card's numbers and characters precisely.",
    }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1, 2, 3', action: 'Pick Palette Color' },
  ];

  return (
    <AdaptiveGameShell
      title="Color The Grid"
      category="Rule-Based Classification"
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center max-w-xl mx-auto w-full gap-6">

        {/* Tier badge */}
        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <span className="px-2.5 py-1 rounded-lg bg-surface-cream border border-border-hairline font-bold text-foreground">
            Tier {puzzle.ruleTier}: {puzzle.category}
          </span>
        </div>

        {/* Governing Rule Banner Card */}
        <div className="w-full bg-surface-paper border-2 border-secondary/30 rounded-3xl p-5 shadow-xs flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-secondary">
            <Info size={16} />
            <span>Active Classification Rule</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {puzzle.ruleDescription}
          </p>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {puzzle.allowedColors.map((col, idx) => {
            const isSelected = selectedColor === col.id;

            return (
              <button
                key={col.id}
                type="button"
                onClick={() => {
                  playClick();
                  setSelectedColor(col.id);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-foreground ring-3 ring-foreground/20 scale-105'
                    : 'border-border-hairline hover:border-secondary hover:scale-102 active:scale-95 bg-surface-paper'
                }`}
              >
                <div className={`w-5 h-5 rounded-full ${col.bgClass} shadow-2xs`} />
                <span className="text-xs font-mono font-bold text-foreground">
                  {col.name}
                </span>
                <span className="text-[10px] font-mono text-muted">({idx + 1})</span>
              </button>
            );
          })}
        </div>

        {/* 4 Grid Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 w-full">
          {puzzle.cards.map((card, idx) => {
            const assignedColorId = userColors[card.id];
            const colorDef = puzzle.allowedColors.find(c => c.id === assignedColorId);

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.id)}
                disabled={feedback !== null}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-xs flex flex-col items-center gap-3 ${
                  assignedColorId
                    ? `${colorDef?.bgClass} border-transparent text-white ring-2 ring-foreground/10`
                    : 'bg-surface-paper border-border-hairline hover:border-secondary'
                }`}
              >
                <div className="grid grid-cols-2 gap-2 w-full">
                  {card.content.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`h-12 sm:h-14 rounded-xl flex items-center justify-center font-mono font-black text-lg transition-colors ${
                        assignedColorId
                          ? 'bg-black/15 text-white'
                          : 'bg-surface-cream border border-border-hairline text-foreground'
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between w-full px-1">
                  <span className={`text-[11px] font-mono font-bold ${
                    assignedColorId ? 'text-white/80' : 'text-muted'
                  }`}>
                    Card {idx + 1}
                  </span>
                  <span className={`text-xs font-mono font-bold uppercase ${
                    assignedColorId ? 'text-white underline' : 'text-muted'
                  }`}>
                    {colorDef ? colorDef.name : 'Click to Color'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Banner */}
        {feedback === 'correct' && (
          <div className="flex items-center gap-2 text-emerald-600 font-mono font-bold text-sm">
            <Check size={18} />
            <span>All 4 cards correctly classified!</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="text-rose-600 font-mono font-bold text-sm">
            Classification error. Resetting card colors...
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};

export default ColorTheGridGame;
