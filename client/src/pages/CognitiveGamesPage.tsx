import React, { useState, useEffect } from 'react';
import {
  Brain, Shuffle, Move, Calculator, Search, Lightbulb, Play,
  Trophy, Zap, Award, CheckCircle, Flame, ArrowRight,
  TrendingUp, Users, Target, Shield, Clock, BarChart2, Star,
  Compass, Palette, Layers, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdaptiveGameProvider, useAdaptiveGame, GameMode } from '../context/AdaptiveGameContext';
import { GAME_REGISTRY, PLAYABLE_GAMES, ALL_GAMES, getRandomAssessmentGames, GameDefinition } from '../config/gameRegistry';
import { AssessmentConfig } from '../config/assessmentConfig';
import api from '../services/api';

// Game Components
import GeoSudoGame from '../components/games/GeoSudoGame';
import SpacioGame from '../components/games/SpacioGame';
import GridChallengeGame from '../components/games/GridChallengeGame';
import MotionChallengeGame from '../components/games/MotionChallengeGame';
import SwitchChallengeGame from '../components/games/SwitchChallengeGame';
import DigitChallengeGame from '../components/games/DigitChallengeGame';
import ColorTheGridGame from '../components/games/ColorTheGridGame';

interface PersonalRecord {
  gameId: string;
  maxScore: number;
  highestLevel: number;
  bestAccuracy: number;
  lowestAvgResponseTime: number;
  totalAttempts: number;
  lastPlayed: string;
}

interface RecordsSummary {
  totalGamesPlayed: number;
  totalSessions: number;
  aggregateScore: number;
  avgAccuracy: number;
}

const CognitiveArenaContent: React.FC = () => {
  const {
    currentGameId,
    startGame,
    startAssessmentSession,
    resetGame,
    gameState,
  } = useAdaptiveGame();

  const [selectedTab, setSelectedTab] = useState<'playable' | 'catalog'>('playable');
  const [personalRecords, setPersonalRecords] = useState<Record<string, PersonalRecord>>({});
  const [summary, setSummary] = useState<RecordsSummary | null>(null);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(true);

  // Fetch personal records from server
  const fetchRecords = async () => {
    try {
      setLoadingRecords(true);
      const { data } = await api.get('/games/records');
      if (data && data.records) {
        const map: Record<string, PersonalRecord> = {};
        data.records.forEach((r: PersonalRecord) => {
          map[r.gameId] = r;
        });
        setPersonalRecords(map);
        setSummary(data.summary);
      }
    } catch (err) {
      console.warn('Could not load cognitive records from API');
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [gameState]);

  // If a game is active or running, render the appropriate game component
  if (currentGameId) {
    const handleBack = () => {
      resetGame();
      fetchRecords();
    };

    switch (currentGameId) {
      case 'grid-challenge':
      case 'grid':
        return <GridChallengeGame onBack={handleBack} />;
      case 'switch-challenge':
      case 'switch':
        return <SwitchChallengeGame onBack={handleBack} />;
      case 'digit-challenge':
      case 'digit':
        return <DigitChallengeGame onBack={handleBack} />;
      case 'motion-challenge':
      case 'motion':
        return <MotionChallengeGame onBack={handleBack} />;
      case 'geo-sudo':
      case 'geosudo':
      case 'deductive':
        return <GeoSudoGame onBack={handleBack} />;
      case 'inductive-reasoning':
      case 'spacio':
      case 'inductive':
        return <SpacioGame onBack={handleBack} />;
      case 'color-the-grid':
      case 'colorthegrid':
        return <ColorTheGridGame onBack={handleBack} />;
      default:
        return <GridChallengeGame onBack={handleBack} />;
    }
  }

  // Handle Launching Full 4-Game Assessment
  const handleStartFullAssessment = () => {
    const selected4Games = getRandomAssessmentGames(AssessmentConfig.totalGamesPerSession);
    startAssessmentSession(selected4Games);
  };

  // Handle Launching Single Game in Practice Mode
  const handleStartPractice = (gameId: string) => {
    startGame(gameId, { mode: 'PRACTICE', duration: AssessmentConfig.defaultGameDurationSeconds });
  };

  // Handle Launching Challenge Mode ("Beat My Best")
  const handleStartChallenge = (gameId: string) => {
    const record = personalRecords[gameId];
    const targetLvl = record ? record.highestLevel + 1 : 5;
    startGame(gameId, { mode: 'CHALLENGE', duration: AssessmentConfig.defaultGameDurationSeconds, targetLevel: targetLvl });
  };

  return (
    <div className="min-h-screen bg-surface-cream text-on-surface p-4 md:p-6 lg:p-8">
      <div className="relative w-full max-w-7xl mx-auto flex flex-col gap-6">

        {/* Ambient Glow */}
        <div className="absolute -top-10 -right-20 w-96 h-96 bg-secondary-fixed/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-80 -left-20 w-80 h-80 bg-accent-yellow/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

        {/* Page Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-surface-paper border border-border-hairline text-on-surface font-mono text-[11px] uppercase shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
                Capgemini Prep • A platform by Yusuf
              </span>
              <span className="font-mono text-xs text-on-surface-variant font-medium">MOD_ID: COG_SIM_ADAPTIVE_2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface">
              Capgemini Cognitive Games Arena
            </h1>
            <p className="text-sm text-on-surface-variant">
              Adaptive, high-speed cognitive battery simulating the 2026/2027 Capgemini Aon cut-e round. One challenge at a time with instant continuous level scaling.
            </p>
          </div>

          {/* Assessment Primary CTA */}
          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleStartFullAssessment}
              className="h-10 px-5 rounded-xl bg-secondary text-on-secondary font-mono text-xs font-bold flex items-center gap-2 hover:bg-secondary-hover transition-all shadow-md cursor-pointer"
              type="button"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Start Full 4-Game Assessment (24m)</span>
            </button>
          </div>
        </section>

        {/* Hero Personal Bests & Diagnostic Telemetry Ribbon */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Card 1: Aggregate Score */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Candidate Score Bank</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-secondary tracking-tight">
                  {summary ? summary.aggregateScore.toLocaleString() : '0'}
                </span>
                <span className="font-mono text-xs text-on-surface-variant">pts</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-center text-secondary">
              <Award className="w-4 h-4 text-secondary" />
            </div>
          </div>

          {/* Card 2: Highest Level Achieved */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Top Level Peak</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">
                  LVL {Object.values(personalRecords).length > 0 ? Math.max(...Object.values(personalRecords).map(r => r.highestLevel), 1) : 1}
                </span>
                <span className="font-mono text-xs text-accent-mint font-semibold">[PEAK]</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-center text-primary">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Card 3: Average Accuracy */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Mean Accuracy</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-accent-mint tracking-tight">
                  {summary ? summary.avgAccuracy : 100}%
                </span>
                <span className="font-mono text-xs text-on-surface-variant">target ≥ 80%</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-center text-accent-mint">
              <Target className="w-4 h-4 text-accent-mint" />
            </div>
          </div>

          {/* Card 4: Assessment Clearance */}
          <div className="bg-surface-paper border border-border-hairline p-4 rounded-2xl shadow-xs flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Active Modules Ready</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">
                  7<span className="text-on-surface-variant text-base">/24</span>
                </span>
                <span className="font-mono text-xs text-secondary font-semibold">Playable</span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-center text-on-surface">
              <CheckCircle className="w-4 h-4 text-secondary" />
            </div>
          </div>
        </section>

        {/* Assessment Mode Explainer Callout Card */}
        <section className="bg-gradient-to-r from-secondary-fixed/30 via-surface-paper to-surface-paper border border-secondary/30 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-mono text-[10px] font-bold uppercase">
                2026 Recruitment Engine
              </span>
              <span className="text-xs font-mono font-bold text-on-surface">
                Adaptive Assessment Mode vs Practice
              </span>
            </div>
            <p className="text-xs text-on-surface-variant max-w-3xl leading-relaxed">
              In <strong>Assessment Mode</strong>, 4 randomized games run consecutively with 6-minute hard timers, strict telemetry tracking, and a final combined Capgemini Readiness Report. In <strong>Practice Mode</strong>, pick any game to hone speed and pattern recognition.
            </p>
          </div>
          <button
            onClick={handleStartFullAssessment}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-surface-charcoal font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            Launch Assessment Battery <ArrowRight size={14} />
          </button>
        </section>

        {/* Main Content Area: 7 Games Grid (8 Cols) + Sidebar Records / Cohort (4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Interactive Games */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Tab Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTab('playable')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedTab === 'playable'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-paper border border-border-hairline text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Playable Games (7)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTab('catalog')}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    selectedTab === 'catalog'
                      ? 'bg-primary text-on-primary shadow-xs'
                      : 'bg-surface-paper border border-border-hairline text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  24-Game Cognitive Pool (17 Extended)
                </button>
              </div>

              <span className="font-mono text-[11px] text-on-surface-variant hidden sm:inline-block">
                [6 Min Timer • Level² Scoring]
              </span>
            </div>

            {/* Playable Games List */}
            {selectedTab === 'playable' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PLAYABLE_GAMES.map((game) => {
                  const record = personalRecords[game.id];

                  return (
                    <article
                      key={game.id}
                      className="bg-surface-paper border border-border-hairline rounded-2xl p-4 shadow-xs flex flex-col justify-between group transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2.5">
                          <span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-mono text-[10px] font-bold">
                            {game.category}
                          </span>
                          <span className="font-mono text-xs font-bold text-secondary">
                            {record ? `Peak: LVL ${record.highestLevel}` : 'Unplayed'}
                          </span>
                        </div>

                        <h2 className="text-base font-bold text-on-surface group-hover:text-secondary transition-colors">
                          {game.name}
                        </h2>
                        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                          {game.shortDesc}
                        </p>

                        {/* Skill Tags */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {game.skills.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-surface-cream border border-border-hairline font-mono text-[10px] text-on-surface-variant"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="mt-4 pt-3 flex flex-col gap-2 bg-surface-cream -mx-4 -mb-4 p-3.5 rounded-b-2xl border-t border-border-hairline">
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-on-surface-variant text-[11px]">Best Record</span>
                          <span className="font-bold text-on-surface">
                            {record ? `${record.maxScore} pts (${record.bestAccuracy}% Acc)` : '0 pts'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => handleStartPractice(game.id)}
                            className="h-8 bg-primary hover:bg-surface-charcoal text-on-primary font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Practice
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartChallenge(game.id)}
                            className="h-8 bg-secondary hover:bg-secondary-hover text-on-secondary font-mono text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                            title="Target your personal best level"
                          >
                            <Flame className="w-3 h-3 fill-current" />
                            Beat Best
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* 24-Game Cognitive Pool Catalog */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {ALL_GAMES.map((game) => (
                  <div
                    key={game.id}
                    className="p-3.5 bg-surface-paper border border-border-hairline rounded-2xl flex flex-col justify-between gap-2 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-cream border border-border-hairline text-on-surface-variant">
                          {game.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          game.isPlayable ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-cream text-on-surface-variant'
                        }`}>
                          {game.isPlayable ? 'Active Ready' : 'Extensible Pool'}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-on-surface">{game.name}</h3>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{game.shortDesc}</p>
                    </div>

                    <div className="text-[10px] font-mono text-on-surface-variant flex justify-between border-t border-border-hairline pt-2">
                      <span>Scaling: {game.difficultyCurve.scalingFactor}</span>
                      <span>Cap: LVL {game.difficultyCurve.recommendedCap}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

          {/* Right Column: "My Cognitive Records" & Live Cohort Leaderboard */}
          <aside className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Card 1: My Cognitive Records (Personal Bests) */}
            <div className="bg-surface-paper border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-hairline">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-secondary" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface">
                    My Cognitive Records
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant font-semibold">
                  Personal Best
                </span>
              </div>

              <div className="space-y-2">
                {PLAYABLE_GAMES.map((game) => {
                  const record = personalRecords[game.id];
                  return (
                    <div
                      key={game.id}
                      className="p-2.5 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-between text-xs"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface text-[11px]">{game.name}</span>
                        <span className="text-[10px] text-on-surface-variant font-mono">
                          {record ? `Accuracy: ${record.bestAccuracy}% • Speed: ${record.lowestAvgResponseTime}s` : 'No attempts logged'}
                        </span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-secondary text-xs">
                          {record ? `${record.maxScore} pts` : '—'}
                        </span>
                        <span className="block text-[10px] text-on-surface-variant font-semibold">
                          {record ? `LVL ${record.highestLevel}` : 'LVL 1'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card 2: Live Candidate Cohort */}
            <div className="bg-surface-paper border border-border-hairline rounded-2xl p-5 shadow-xs flex flex-col gap-4">
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
                <div className="p-3 rounded-xl bg-surface-charcoal text-white flex items-center justify-between shadow-xs">
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
                  <span className="font-mono text-xs font-bold text-accent-mint">
                    {summary ? summary.aggregateScore.toLocaleString() : '9,930'} pts
                  </span>
                </div>

                {/* Cohort Candidates */}
                <div className="p-2.5 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-between">
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

                <div className="p-2.5 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-between">
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

                <div className="p-2.5 rounded-xl bg-surface-cream border border-border-hairline flex items-center justify-between">
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
              </div>

              {/* Threshold Callout */}
              <div className="p-3 rounded-xl bg-secondary-fixed/20 border border-secondary-fixed text-on-secondary-fixed flex items-start gap-2">
                <Target className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Capgemini Benchmark Rule:</span> Candidates must achieve at least <strong>Competitive Tier</strong> across all 4 assigned modules to ensure Round 1 clearance.
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>
    </div>
  );
};

export default function CognitiveGamesPage() {
  return (
    <AdaptiveGameProvider>
      <CognitiveArenaContent />
    </AdaptiveGameProvider>
  );
}
