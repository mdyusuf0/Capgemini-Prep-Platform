import React, { useState } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import {
  Timer,
  Trophy,
  Activity,
  Volume2,
  VolumeX,
  Flame,
  RotateCcw,
  Target,
  Award,
  Clock,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  XCircle,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSoundMuted, toggleSoundMuted, playClick } from '../../utils/sound';
import { AssessmentConfig } from '../../config/assessmentConfig';

export interface InstructionItem {
  title: string;
  desc: string;
  visual?: React.ReactNode;
}

export interface ShortcutItem {
  key: string;
  action: string;
}

interface AdaptiveGameShellProps {
  title: string;
  category?: string;
  instructions: InstructionItem[];
  shortcuts?: ShortcutItem[];
  onBack: () => void;
  children: React.ReactNode;
}

export const AdaptiveGameShell: React.FC<AdaptiveGameShellProps> = ({
  title,
  category,
  instructions,
  shortcuts = [],
  onBack,
  children,
}) => {
  const {
    gameState,
    gameMode,
    score,
    level,
    timeLeft,
    streak,
    stats,
    targetLevel,
    isNewHighScore,
    isNewHighestLevel,
    assessmentSessionId,
    assessmentGames,
    currentAssessmentGameIndex,
    allAssessmentResults,
    endGame,
    startGame,
    startNextAssessmentGame,
    currentGameId,
    resetGame,
  } = useAdaptiveGame();

  const [showInstructions, setShowInstructions] = useState(false);
  const [muted, setMuted] = useState(getSoundMuted());

  const handleSoundToggle = () => {
    const nextMuted = toggleSoundMuted();
    setMuted(nextMuted);
    if (!nextMuted) playClick();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracyRate = stats.totalAnswered > 0
    ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
    : 100;

  const avgTimePerQuestion = stats.totalAnswered > 0
    ? (stats.totalSolveTime / stats.totalAnswered).toFixed(1)
    : '0.0';

  const getReadinessTier = (customScore = score, customLevel = level, customAccuracy = accuracyRate) => {
    if (customScore >= 1200 || (customLevel >= 8 && customAccuracy >= 85)) {
      return {
        title: 'Exceller Elite 🌟',
        badgeClass: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/30',
        desc: 'Top 5% candidate capability. High accuracy and deductive velocity calibrated for Round 1.3 clearance.',
      };
    }
    if (customScore >= 600 || (customLevel >= 5 && customAccuracy >= 70)) {
      return {
        title: 'Competitive Candidate 🎯',
        badgeClass: 'bg-blue-500/10 text-blue-800 border-blue-500/30',
        desc: 'Solid deductive foundation meeting expected Capgemini cutoff benchmarks. Advancing speed will unlock elite ranking.',
      };
    }
    return {
      title: 'Developing Aptitude 📚',
      badgeClass: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
      desc: 'Foundational baseline. Target pattern decoding in untimed practice mode before high-pressure assessment sprints.',
    };
  };

  // 1. FINAL MULTI-GAME ASSESSMENT REPORT SCREEN
  if (gameState === 'ASSESSMENT_COMPLETE') {
    const totalScore = allAssessmentResults.reduce((sum, r) => sum + r.score, 0);
    const avgAccuracy = allAssessmentResults.length > 0
      ? Math.round(allAssessmentResults.reduce((sum, r) => sum + r.accuracy, 0) / allAssessmentResults.length)
      : 100;
    const maxLevel = Math.max(...allAssessmentResults.map(r => r.highestLevel), 1);
    const overallTier = getReadinessTier(totalScore, maxLevel, avgAccuracy);

    return (
      <div className="min-h-screen bg-surface-cream text-on-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-paper border border-border-hairline p-6 md:p-8 rounded-3xl shadow-xl max-w-3xl w-full"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-fixed/50 text-secondary mb-3 shadow-md">
              <Trophy className="w-8 h-8" />
            </div>
            <span className="inline-block mb-1 px-3 py-1 bg-secondary text-on-secondary rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              Official Assessment Battery Summary
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              Capgemini Cognitive Battery Report
            </h2>
            <p className="text-on-surface-variant text-xs mt-1 font-mono">
              Session ID: {assessmentSessionId} • 4 Modules Completed
            </p>
          </div>

          {/* Composite Readiness Card */}
          <div className={`p-4 rounded-2xl border mb-6 ${overallTier.badgeClass}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Composite Readiness Tier</span>
              <span className="text-sm font-extrabold">{overallTier.title}</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">{overallTier.desc}</p>
          </div>

          {/* Aggregate Metrics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-surface-cream p-3.5 rounded-xl border border-border-hairline text-center">
              <div className="text-[11px] font-mono text-on-surface-variant mb-0.5">Aggregate Score</div>
              <div className="text-xl font-bold text-secondary">{totalScore}</div>
            </div>
            <div className="bg-surface-cream p-3.5 rounded-xl border border-border-hairline text-center">
              <div className="text-[11px] font-mono text-on-surface-variant mb-0.5">Max Level Achieved</div>
              <div className="text-xl font-bold text-primary">LVL {maxLevel}</div>
            </div>
            <div className="bg-surface-cream p-3.5 rounded-xl border border-border-hairline text-center">
              <div className="text-[11px] font-mono text-on-surface-variant mb-0.5">Mean Accuracy</div>
              <div className="text-xl font-bold text-accent-mint">{avgAccuracy}%</div>
            </div>
            <div className="bg-surface-cream p-3.5 rounded-xl border border-border-hairline text-center">
              <div className="text-[11px] font-mono text-on-surface-variant mb-0.5">Modules Cleared</div>
              <div className="text-xl font-bold text-on-surface">{allAssessmentResults.length}/4</div>
            </div>
          </div>

          {/* Per-Game Breakdown Table */}
          <div className="mb-6 border border-border-hairline rounded-2xl overflow-hidden">
            <div className="bg-surface-cream p-3 border-b border-border-hairline font-mono text-xs font-bold text-on-surface flex justify-between">
              <span>Assessment Battery Modules</span>
              <span>Individual Clearance</span>
            </div>
            <div className="divide-y divide-border-hairline">
              {allAssessmentResults.map((res, idx) => (
                <div key={idx} className="p-3 bg-surface-paper flex items-center justify-between text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface capitalize">{res.gameId.replace(/-/g, ' ')}</span>
                    <span className="text-[10px] text-on-surface-variant font-mono">
                      {res.totalAnswered} challenges attempted • Avg {res.avgTimePerQuestion}s
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-mono">
                    <div className="text-right">
                      <span className="font-bold text-secondary">{res.score} pts</span>
                      <span className="block text-[10px] text-on-surface-variant">LVL {res.highestLevel}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.accuracy >= 80 ? 'bg-accent-mint/20 text-accent-mint' : 'bg-amber-500/20 text-amber-700'
                    }`}>
                      {res.accuracy}% Acc
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                resetGame();
                onBack();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-charcoal transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft size={16} /> Return to Games Arena
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. SINGLE GAME OVER SCREEN (Or Transition to Next Game in Assessment)
  if (gameState === 'GAME_OVER') {
    const isAssessmentMode = gameMode === 'ASSESSMENT';
    const hasNextAssessmentGame = isAssessmentMode && (currentAssessmentGameIndex < assessmentGames.length - 1);
    const nextGame = hasNextAssessmentGame ? assessmentGames[currentAssessmentGameIndex + 1] : null;
    const tier = getReadinessTier();

    return (
      <div className="min-h-screen bg-surface-cream text-on-surface flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-surface-paper border border-border-hairline p-6 md:p-8 rounded-3xl shadow-xl max-w-xl w-full"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary-fixed/50 text-secondary mb-3 shadow-md">
              <Trophy className="w-8 h-8" />
            </div>

            {isNewHighScore && (
              <span className="inline-block mb-2 px-3 py-1 bg-amber-500/20 text-amber-800 rounded-full text-xs font-bold border border-amber-500/30 uppercase tracking-widest animate-pulse">
                ★ New Personal High Score! ★
              </span>
            )}
            {isNewHighestLevel && !isNewHighScore && (
              <span className="inline-block mb-2 px-3 py-1 bg-emerald-500/20 text-emerald-800 rounded-full text-xs font-bold border border-emerald-500/30 uppercase tracking-widest animate-pulse">
                ★ New Personal Best Level! ★
              </span>
            )}

            <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">
              {isAssessmentMode ? `Module ${currentAssessmentGameIndex + 1} Complete` : 'Session Performance Summary'}
            </h2>
            <p className="text-on-surface-variant text-xs mt-1 font-mono">
              {title} • {gameMode === 'ASSESSMENT' ? 'Assessment Battery Mode' : (gameMode === 'CHALLENGE' ? 'Challenge Sprint' : 'Adaptive Practice')}
            </p>
          </div>

          {/* Challenge Mode Feedback */}
          {gameMode === 'CHALLENGE' && targetLevel && (
            <div className={`p-3.5 rounded-xl border mb-4 text-xs font-mono ${
              level >= targetLevel
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="font-bold flex items-center gap-1.5">
                {level >= targetLevel ? <CheckCircle size={16} className="text-emerald-600" /> : <Activity size={16} className="text-amber-600" />}
                {level >= targetLevel ? 'Challenge Goal Beaten!' : 'Challenge Goal Incomplete'}
              </div>
              <p className="mt-1">
                Target: Level {targetLevel} • Reached: Level {level}
              </p>
            </div>
          )}

          {/* Readiness Tier Card */}
          <div className={`p-4 rounded-2xl border mb-6 ${tier.badgeClass}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Module Readiness Rating</span>
              <span className="text-sm font-extrabold">{tier.title}</span>
            </div>
            <p className="text-xs text-on-surface leading-relaxed">{tier.desc}</p>
          </div>

          {/* Core Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-surface-cream p-3 rounded-xl border border-border-hairline text-center">
              <div className="text-[10px] font-mono text-on-surface-variant mb-0.5 flex items-center justify-center gap-1">
                <Award size={12} className="text-secondary" /> Points
              </div>
              <div className="text-xl font-bold text-secondary">{score}</div>
            </div>

            <div className="bg-surface-cream p-3 rounded-xl border border-border-hairline text-center">
              <div className="text-[10px] font-mono text-on-surface-variant mb-0.5 flex items-center justify-center gap-1">
                <Activity size={12} className="text-primary" /> Max Level
              </div>
              <div className="text-xl font-bold text-primary">LVL {level}</div>
            </div>

            <div className="bg-surface-cream p-3 rounded-xl border border-border-hairline text-center">
              <div className="text-[10px] font-mono text-on-surface-variant mb-0.5 flex items-center justify-center gap-1">
                <Target size={12} className="text-accent-mint" /> Accuracy
              </div>
              <div className="text-xl font-bold text-on-surface">{accuracyRate}%</div>
            </div>

            <div className="bg-surface-cream p-3 rounded-xl border border-border-hairline text-center">
              <div className="text-[10px] font-mono text-on-surface-variant mb-0.5 flex items-center justify-center gap-1">
                <Clock size={12} className="text-on-surface-variant" /> Speed
              </div>
              <div className="text-xl font-bold text-on-surface">{avgTimePerQuestion}s</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {hasNextAssessmentGame ? (
              <button
                onClick={startNextAssessmentGame}
                className="w-full py-3 px-4 rounded-xl bg-secondary text-on-secondary font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-secondary-hover transition-colors cursor-pointer shadow-md"
              >
                Proceed to Game {currentAssessmentGameIndex + 2} of {assessmentGames.length}: {nextGame?.name}
                <ArrowRight size={16} />
              </button>
            ) : isAssessmentMode ? (
              <button
                onClick={startNextAssessmentGame}
                className="w-full py-3 px-4 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-surface-charcoal transition-colors cursor-pointer shadow-md"
              >
                <BarChart3 size={16} /> View Final Assessment Battery Report
              </button>
            ) : (
              <>
                <button
                  onClick={() => currentGameId && startGame(currentGameId, { mode: gameMode, targetLevel: targetLevel || undefined })}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-mono text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-secondary-hover transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw size={14} /> Play Again
                </button>
                <button
                  onClick={() => {
                    resetGame();
                    onBack();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-surface-cream border border-border-hairline text-on-surface font-mono text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-surface-paper transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Return to Arena
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // 3. ACTIVE GAME PLAYING HUD & CONTENT
  return (
    <div className="min-h-screen bg-surface-cream text-on-surface flex flex-col justify-between">
      {/* Top Header HUD - Responsive Dual-Tier */}
      <header className="sticky top-0 z-40 bg-surface-paper/95 backdrop-blur-md border-b border-border-hairline px-3 py-2 sm:px-6 sm:py-3 pt-safe">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-3">
          
          {/* Row 1: Back, Title, Mode & Action Controls */}
          <div className="flex items-center justify-between gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => {
                  if (window.confirm('Leave assessment session and return to games arena?')) {
                    resetGame();
                    onBack();
                  }
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-cream active:scale-95 transition-all cursor-pointer shrink-0"
                title="Return to Arena"
                aria-label="Back to Games"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-xs sm:text-base font-bold text-on-surface tracking-tight leading-none truncate max-w-[140px] sm:max-w-none">
                    {title}
                  </h1>
                  {category && (
                    <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[10px] font-semibold truncate">
                      {category}
                    </span>
                  )}
                  <span className={`px-1.5 py-0.5 rounded font-mono text-[9px] sm:text-[10px] font-bold uppercase shrink-0 ${
                    gameMode === 'ASSESSMENT' 
                      ? 'bg-primary text-on-primary' 
                      : (gameMode === 'CHALLENGE' ? 'bg-amber-500 text-white' : 'bg-surface-cream border border-border-hairline text-on-surface-variant')
                  }`}>
                    {gameMode === 'ASSESSMENT' 
                      ? `${currentAssessmentGameIndex + 1}/${assessmentGames.length}` 
                      : gameMode}
                  </span>
                </div>
              </div>
            </div>

            {/* Right on mobile Row 1: Audio & Rules toggles */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleSoundToggle}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl border text-xs transition-all active:scale-95 cursor-pointer ${
                  muted
                    ? 'bg-surface-cream border-border-hairline text-on-surface-variant'
                    : 'bg-secondary-fixed/50 border-secondary text-secondary'
                }`}
                title={muted ? 'Unmute audio' : 'Mute audio'}
                aria-label={muted ? 'Unmute audio' : 'Mute audio'}
              >
                {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-surface-cream border border-border-hairline text-on-surface-variant hover:text-on-surface hover:bg-surface-paper active:scale-95 transition-all cursor-pointer"
                title="View Rules & Instructions"
                aria-label="View Rules"
              >
                <HelpCircle size={15} />
              </button>
            </div>
          </div>

          {/* Row 2 (Mobile) / Center (Desktop): Live Metrics HUD Ribbon */}
          <div className="flex items-center justify-between md:justify-center gap-2 sm:gap-4 font-mono w-full md:w-auto pt-1 md:pt-0 border-t md:border-t-0 border-border-hairline/60">
            {/* Level Pill */}
            <div className="flex-1 md:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1 bg-surface-cream rounded-xl border border-border-hairline shadow-2xs">
              <Activity size={13} className="text-secondary shrink-0" />
              <span className="text-[10px] sm:text-xs text-on-surface-variant">LVL</span>
              <span className="text-xs sm:text-sm font-black text-on-surface">{level}</span>
              {targetLevel && (
                <span className="text-[9px] sm:text-[10px] text-amber-600 font-bold">
                  /{targetLevel}
                </span>
              )}
            </div>

            {/* Live Score */}
            <div className="flex-1 md:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1 bg-surface-cream rounded-xl border border-border-hairline shadow-2xs">
              <Award size={13} className="text-amber-500 shrink-0" />
              <span className="text-xs sm:text-sm font-black text-on-surface">{score}</span>
              {streak >= 2 && (
                <span className="flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-amber-600 bg-amber-50 px-1 rounded animate-pulse">
                  <Flame size={9} className="fill-current" />
                  {streak >= 6 ? '2x' : (streak >= 4 ? '1.5x' : '1.2x')}
                </span>
              )}
            </div>

            {/* Live Countdown Timer */}
            {timeLeft > 0 && (
              <div className={`flex-1 md:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-xl border font-mono font-bold text-xs sm:text-sm shadow-2xs ${
                timeLeft <= 30
                  ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                  : 'bg-surface-cream border-border-hairline text-on-surface'
              }`}>
                <Timer size={13} className={`shrink-0 ${timeLeft <= 30 ? 'text-rose-600' : 'text-on-surface-variant'}`} />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Game Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Bottom Footer Ribbon with Disclaimer & Shortcuts */}
      <footer className="border-t border-border-hairline bg-surface-paper/70 px-4 py-2 text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-on-surface-variant">
          <span>{AssessmentConfig.scoringModelDisclaimer}</span>
          {shortcuts.length > 0 && (
            <div className="flex items-center gap-3">
              {shortcuts.map((sc, i) => (
                <span key={i} className="inline-flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface-cream border border-border-hairline text-[10px] font-bold text-on-surface">
                    {sc.key}
                  </kbd>
                  <span>{sc.action}</span>
                </span>
              ))}
            </div>
          )}
        </div>
      </footer>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface-paper border border-border-hairline rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <h3 className="font-bold text-base text-on-surface">How to Play: {title}</h3>
                </div>
                <button
                  onClick={() => setShowInstructions(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                {instructions.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-surface-cream border border-border-hairline text-xs">
                    <h4 className="font-bold text-on-surface mb-1">{idx + 1}. {item.title}</h4>
                    <p className="text-on-surface-variant leading-relaxed">{item.desc}</p>
                    {item.visual && <div className="mt-2">{item.visual}</div>}
                  </div>
                ))}

                {/* Scoring Logic Explainer */}
                <div className="p-3 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed text-xs font-mono">
                  <div className="font-bold text-secondary flex items-center gap-1 mb-1">
                    <Sparkles size={13} /> Adaptive Velocity Scoring
                  </div>
                  <p className="text-on-surface text-[11px] leading-relaxed">
                    Points = (Level² / Solve Seconds) × Streak Multiplier.
                    Higher levels completed rapidly yield exponential score returns!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-mono text-xs font-bold hover:bg-surface-charcoal transition-colors cursor-pointer"
              >
                Resume Assessment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
