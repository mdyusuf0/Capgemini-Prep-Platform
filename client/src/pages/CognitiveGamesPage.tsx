import React, { useState } from 'react';
import { 
  Brain, Shuffle, Move, Calculator, Search, Lightbulb, Play, 
  History, Trophy, Zap, Award, CheckCircle, Flame, ArrowRight,
  TrendingUp, Users, Target
} from 'lucide-react';
import { motion } from 'framer-motion';
import GeoSudoGame from '../components/games/GeoSudoGame';
import SpacioGame from '../components/games/SpacioGame';
import GridChallengeGame from '../components/games/GridChallengeGame';
import MotionChallengeGame from '../components/games/MotionChallengeGame';
import SwitchChallengeGame from '../components/games/SwitchChallengeGame';
import DigitChallengeGame from '../components/games/DigitChallengeGame';

export default function CognitiveGamesPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  if (activeGame === 'grid') return <GridChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'switch') return <SwitchChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'digit') return <DigitChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'motion') return <MotionChallengeGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'deductive') return <GeoSudoGame onBack={() => setActiveGame(null)} />;
  if (activeGame === 'inductive') return <SpacioGame onBack={() => setActiveGame(null)} />;

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-6 lg:p-8">
      {/* Subtle Ambient Glow */}
      <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6">
        <div className="absolute -top-10 -right-20 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 -left-20 w-80 h-80 bg-accent-yellow/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Page Header & Diagnostic Telemetry */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface font-mono text-[11px] uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
                CapPrep Engine // Evaluator v2.4
              </span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">MOD_ID: COG_SIM_6X</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
              Capgemini Cognitive Games Arena
            </h1>
            <p className="text-sm text-on-surface-variant">
              Procedural assessment battery calibrating working memory, inductive logic, spatial orientation, and reaction velocity for Capgemini Round 1.3.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button 
              onClick={() => setActiveGame('grid')}
              className="h-9 px-4 rounded-lg bg-primary text-on-primary font-mono text-xs font-semibold flex items-center gap-1.5 hover:bg-surface-charcoal transition-colors shadow-xs cursor-pointer" 
              type="button"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Quick Calibration Sprint
            </button>
          </div>
        </section>

        {/* Active Play Stats Ribbon */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Metric 1 */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Algorithmic Rank</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  94<span className="text-secondary text-base">th</span>
                </span>
                <span className="font-mono text-xs text-on-surface-variant">percentile</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-center text-secondary">
              <Trophy className="w-4 h-4 text-secondary" />
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Avg Reaction Latency</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">240</span>
                <span className="font-mono text-xs text-[#1b5e20] font-semibold">ms [OPT]</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-center text-on-surface">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Aggregated High Score</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">9,930</span>
                <span className="font-mono text-xs text-accent-pink font-semibold">pts</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-center text-accent-pink">
              <Award className="w-4 h-4 text-[#9c0032]" />
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Tier Clearance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  6<span className="text-on-surface-variant text-base">/6</span>
                </span>
                <span className="font-mono text-xs text-on-surface-variant">Modules Live</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-center text-on-surface-variant">
              <CheckCircle className="w-4 h-4 text-accent-mint" />
            </div>
          </div>
        </section>

        {/* Main Content Area: 6 Game Cards Grid + Leaderboard Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Interactive Game Matrix (8 Columns) */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wider font-semibold text-on-surface-variant">
                  Cognitive Battery Modules
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-paper border border-border-hairline font-mono text-xs text-on-surface font-semibold shadow-xs">
                  6 ACTIVE
                </span>
              </div>
              <span className="font-mono text-xs text-on-surface-variant">[TEST SCHEMA: Capgemini 2026/27]</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Game 1: Grid Challenge Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Working Memory
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 8</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="grid grid-cols-3 gap-1.5 w-20 h-20">
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-accent-mint animate-pulse"></div>
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-accent-mint"></div>
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-white/10"></div>
                      <div className="rounded-xs bg-accent-yellow"></div>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">MAT: 3x3 → 5x5</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">Grid Challenge Game</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Working memory sequence tracking, 3x3 to 5x5 dynamic flash matrix verification.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">1,420 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('grid')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

              {/* Game 2: Switch Challenge Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Deductive Logic
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 6</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="flex flex-col items-center gap-1 font-mono text-xs text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] font-bold">1</span>
                        <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">2</span>
                        <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">3</span>
                        <span className="w-5 h-5 rounded bg-accent-pink flex items-center justify-center text-[10px] font-bold">4</span>
                      </div>
                      <div className="text-[9px] text-accent-yellow font-mono">OP: [2,4,1,3]</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">2</span>
                        <span className="w-5 h-5 rounded bg-accent-pink flex items-center justify-center text-[10px] font-bold">4</span>
                        <span className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[10px] font-bold">1</span>
                        <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">3</span>
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">PERM_SWAP</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">Switch Challenge Game</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Permutation switch deduction with 4-digit transposition operators.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">980 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('switch')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

              {/* Game 3: Motion Challenge Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Path Planning
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 9</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="relative w-32 h-16 bg-white/5 rounded border border-white/10 p-1.5 flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[9px] font-mono text-accent-mint">
                        <span>S (0,0)</span>
                        <span className="text-accent-pink">E (4,2)</span>
                      </div>
                      <div className="h-0.5 w-full bg-white/20 relative my-auto">
                        <div className="absolute left-0 top-0 h-full w-3/4 bg-accent-mint"></div>
                        <span className="absolute left-3/4 -top-1 w-2.5 h-2.5 rounded-full bg-accent-yellow"></span>
                      </div>
                      <div className="flex justify-between font-mono text-[8px] text-white/60">
                        <span>LIMIT: 7</span>
                        <span className="text-accent-yellow">REM: 3</span>
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">GRAPH_MIN</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">Motion Challenge Game</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Optimal pathfinding maze under step-budget constraints and block shifts.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">2,150 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('motion')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

              {/* Game 4: Digit Challenge Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Mental Agility
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 12</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="flex items-center gap-1.5 font-mono text-sm text-white">
                      <span className="px-2 py-0.5 bg-white/10 rounded font-bold">14</span>
                      <span className="text-accent-pink font-bold">×</span>
                      <span className="px-2 py-0.5 bg-white/10 rounded font-bold">3</span>
                      <span className="text-accent-yellow font-bold">-</span>
                      <span className="px-2 py-0.5 bg-secondary text-white font-bold rounded">?</span>
                      <span className="text-white/60 font-bold">=</span>
                      <span className="px-2 py-0.5 bg-accent-mint text-primary font-bold rounded">35</span>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">LATENCY: 1.2s</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">Digit Challenge Game</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Mental arithmetic sprint, rapid operator fill-in, and rapid algebra deductions.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">3,400 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('digit')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

              {/* Game 5: GeoSudo Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Rule Induction
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 5</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="grid grid-cols-3 gap-1 w-20 h-20 p-1 bg-white/5 rounded">
                      <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
                      <div className="flex items-center justify-center text-accent-mint text-xs">■</div>
                      <div className="flex items-center justify-center text-accent-yellow text-xs">▲</div>
                      <div className="flex items-center justify-center text-accent-yellow text-xs">▲</div>
                      <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
                      <div className="flex items-center justify-center text-accent-mint text-xs">■</div>
                      <div className="flex items-center justify-center text-accent-mint text-xs">■</div>
                      <div className="flex items-center justify-center border border-dashed border-secondary text-secondary font-mono text-xs font-bold">?</div>
                      <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">LATIN_SQR</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">GeoSudo (Deductive)</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Latin-square deductive shape elimination without row/col conflicts.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">860 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('deductive')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

              {/* Game 6: Spacio Game */}
              <article className="bg-surface-paper border border-border-hairline rounded-xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[11px] font-semibold">
                      Spatial Reasoning
                    </span>
                    <span className="font-mono text-xs text-on-surface-variant">LVL 7</span>
                  </div>

                  {/* Blueprint Vector Display */}
                  <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-secondary transform rotate-12 flex items-center justify-center">
                        <span className="w-5 h-5 border border-accent-pink transform -rotate-45"></span>
                      </div>
                      <span className="font-mono text-accent-yellow text-xs">↻</span>
                      <div className="w-10 h-10 border border-dashed border-white/40 flex items-center justify-center">
                        <span className="font-mono text-[10px] text-accent-mint font-semibold">θ=90°</span>
                      </div>
                    </div>
                    <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">3D_PROJ</div>
                  </div>

                  <h2 className="text-base font-bold text-on-surface">Spacio (Inductive)</h2>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                    3D spatial rotation & geometric rule induction under perspective shifts.
                  </p>
                </div>

                <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-4 rounded-b-xl border-t border-border-hairline">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-on-surface-variant">High Score</span>
                    <span className="font-bold text-on-surface">1,120 pts</span>
                  </div>
                  <button 
                    onClick={() => setActiveGame('inductive')}
                    className="w-full h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Play Round
                  </button>
                </div>
              </article>

            </div>
          </section>

          {/* Campus Benchmark & Live Leaderboard (4 Columns) */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Live Leaderboard Card */}
            <div className="bg-surface-paper border border-border-hairline rounded-xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-secondary" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">
                    Live Candidate Cohort
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-secondary font-semibold bg-secondary-fixed/50 px-2 py-0.5 rounded">
                  2026 Drive
                </span>
              </div>

              <div className="space-y-2">
                {/* User Entry */}
                <div className="p-3 rounded-lg bg-surface-charcoal text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-accent-yellow text-primary font-mono font-bold text-xs flex items-center justify-center">
                      1
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-white">Yusuf Khan</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/20 text-white">
                          YOU
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-white/60">99.4%ile • Tier 1</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-accent-mint">9,930 pts</span>
                </div>

                {/* Other Candidates */}
                <div className="p-2.5 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-surface-paper border border-border-hairline font-mono font-semibold text-xs flex items-center justify-center text-on-surface">
                      2
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-on-surface">Priyanshu Sharma</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">98.1%ile • Tier 1</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">9,410 pts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-surface-paper border border-border-hairline font-mono font-semibold text-xs flex items-center justify-center text-on-surface">
                      3
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-on-surface">Ananya Verma</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">96.5%ile • Tier 1</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">9,180 pts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-surface-paper border border-border-hairline font-mono font-semibold text-xs flex items-center justify-center text-on-surface">
                      4
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-on-surface">Rohan Mehta</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">94.0%ile • Tier 1</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">8,850 pts</span>
                </div>

                <div className="p-2.5 rounded-lg bg-surface-cream border border-border-hairline flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-surface-paper border border-border-hairline font-mono font-semibold text-xs flex items-center justify-center text-on-surface">
                      5
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium text-xs text-on-surface">Shreya Iyer</span>
                      <span className="text-[10px] font-mono text-on-surface-variant">92.2%ile • Tier 2</span>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-semibold text-on-surface">8,620 pts</span>
                </div>
              </div>

              {/* Threshold Callout */}
              <div className="mt-2 p-3 rounded-lg bg-secondary-fixed/20 border border-secondary-fixed text-on-secondary-fixed flex items-start gap-2">
                <Target className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Capgemini Cutoff Rule:</span> Candidates must clear the <strong>Top 25%ile</strong> threshold across all 4 assigned cognitive games to proceed to the Technical Coding round.
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>
    </div>
  );
}
