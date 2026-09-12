import React, { useState, useEffect } from 'react';
import {
  Brain, Shuffle, Move, Calculator, Search, Lightbulb, Play,
  Trophy, Zap, Award, CheckCircle, Flame, ArrowRight,
  TrendingUp, Users, Target, Shield, Clock, BarChart2, Star,
  Compass, Palette, Layers, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdaptiveGameProvider, useAdaptiveGame, GameMode } from '../context/AdaptiveGameContext';
import { GAME_REGISTRY, PLAYABLE_GAMES, ALL_GAMES, CORE_GAMES, getRandomAssessmentGames, GameDefinition } from '../config/gameRegistry';
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
import { ExtendedCognitiveGame } from '../components/games/ExtendedCognitiveGame';

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

// Visual Blueprint Thumbnail previews for each playable game
const GAME_THUMBNAILS: Record<string, React.ReactNode> = {
  'grid-challenge': (
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
  ),
  'switch-challenge': (
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
  ),
  'motion-challenge': (
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
  ),
  'digit-challenge': (
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
  ),
  'geo-sudo': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="grid grid-cols-3 gap-1 w-20 h-20 p-1 bg-white/5 rounded">
        <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
        <div className="flex items-center justify-center text-accent-mint text-xs">▲</div>
        <div className="flex items-center justify-center text-accent-yellow text-xs">■</div>
        <div className="flex items-center justify-center text-accent-yellow text-xs">■</div>
        <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
        <div className="flex items-center justify-center text-accent-mint text-xs">▲</div>
        <div className="flex items-center justify-center text-accent-mint text-xs">▲</div>
        <div className="flex items-center justify-center border border-dashed border-secondary text-secondary font-mono text-xs font-bold">?</div>
        <div className="flex items-center justify-center text-accent-pink text-xs">●</div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">LATIN_SQR</div>
    </div>
  ),
  'inductive-reasoning': (
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
  ),
  'color-the-grid': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="grid grid-cols-2 gap-1 w-16 h-16">
          <div className="rounded-sm bg-accent-mint flex items-center justify-center text-primary text-[10px] font-bold">A</div>
          <div className="rounded-sm bg-accent-pink flex items-center justify-center text-white text-[10px] font-bold">B</div>
          <div className="rounded-sm bg-accent-yellow flex items-center justify-center text-primary text-[10px] font-bold">C</div>
          <div className="rounded-sm border border-dashed border-white/50 flex items-center justify-center text-white/60 text-[10px] font-bold">?</div>
        </div>
        <div className="text-[9px] font-mono text-white/60">IF A=mint → D≠pink</div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">COND_CLR</div>
    </div>
  ),
  'scale-challenge': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 font-mono text-xs text-white">
          <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center text-[10px] font-bold">1x■</div>
          <span className="text-accent-yellow font-bold">&gt;</span>
          <div className="w-7 h-7 rounded bg-accent-mint text-primary flex items-center justify-center text-[10px] font-bold">2x●</div>
        </div>
        <div className="w-28 h-0.5 bg-white/40 relative">
          <div className="w-1.5 h-3 bg-accent-yellow mx-auto -mt-1.5" />
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">BAL_SCALE</div>
    </div>
  ),
  'n-back-memory': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-1.5">
        <div className="grid grid-cols-3 gap-1 w-16 h-16 bg-white/5 p-1 rounded-lg">
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-accent-mint" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
          <div className="rounded-xs bg-white/10" />
        </div>
        <span className="font-mono text-[9px] text-accent-yellow">N=2 RECALL</span>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">N_BACK_2</div>
    </div>
  ),
  'flanker-task': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-1.5 font-mono text-lg font-extrabold text-white">
        <span className="text-white/40">←</span>
        <span className="text-white/40">←</span>
        <span className="text-accent-mint text-2xl font-black scale-125 px-1 bg-white/10 rounded">→</span>
        <span className="text-white/40">←</span>
        <span className="text-white/40">←</span>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">FLANKER</div>
    </div>
  ),
  'cube-rotation': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 border-2 border-secondary rotate-12 flex items-center justify-center">
          <div className="w-4 h-4 bg-accent-mint/40 border border-accent-mint" />
        </div>
        <span className="font-mono text-accent-yellow text-xs">⟳ 90°</span>
        <div className="w-9 h-9 border-2 border-dashed border-white/40 flex items-center justify-center">
          <div className="w-4 h-4 bg-accent-pink/40 border border-accent-pink" />
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">CUBE_ROT</div>
    </div>
  ),
  'stroop-test': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-1">
        <span className="font-black text-xl tracking-wider text-rose-500">BLUE</span>
        <span className="font-mono text-[9px] text-white/60">INK ≠ TEXT</span>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">STROOP</div>
    </div>
  ),
  'number-series': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
        <span>3</span>
        <span className="text-white/40">→</span>
        <span>6</span>
        <span className="text-white/40">→</span>
        <span>12</span>
        <span className="text-white/40">→</span>
        <span>24</span>
        <span className="text-white/40">→</span>
        <span className="text-accent-yellow bg-white/10 px-1 rounded">[?]</span>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">NUM_SERIES</div>
    </div>
  ),
  'reaction-latency': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-500/50 animate-pulse">
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
        <div className="flex flex-col font-mono">
          <span className="text-xs font-bold text-white">184 ms</span>
          <span className="text-[9px] text-accent-mint">OPTIMAL SPEED</span>
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">REACT_MS</div>
    </div>
  ),
  'spatial-span': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="grid grid-cols-3 gap-1.5 w-20 h-20 p-1">
        <div className="rounded-md bg-white/10" />
        <div className="rounded-md bg-accent-yellow flex items-center justify-center text-[9px] font-bold text-primary">1</div>
        <div className="rounded-md bg-white/10" />
        <div className="rounded-md bg-accent-yellow flex items-center justify-center text-[9px] font-bold text-primary">3</div>
        <div className="rounded-md bg-white/10" />
        <div className="rounded-md bg-accent-yellow flex items-center justify-center text-[9px] font-bold text-primary">2</div>
        <div className="rounded-md bg-white/10" />
        <div className="rounded-md bg-white/10" />
        <div className="rounded-md bg-white/10" />
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">CORSI_SPAN</div>
    </div>
  ),
  'matrix-reasoning': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="grid grid-cols-3 gap-1 w-20 h-20 p-1 bg-white/5 rounded">
        <div className="flex items-center justify-center text-xs text-white">●</div>
        <div className="flex items-center justify-center text-xs text-white">●●</div>
        <div className="flex items-center justify-center text-xs text-white">●●●</div>
        <div className="flex items-center justify-center text-xs text-white">■</div>
        <div className="flex items-center justify-center text-xs text-white">■■</div>
        <div className="flex items-center justify-center text-xs text-white">■■■</div>
        <div className="flex items-center justify-center text-xs text-white">▲</div>
        <div className="flex items-center justify-center text-xs text-white">▲▲</div>
        <div className="flex items-center justify-center border border-dashed border-accent-yellow text-accent-yellow font-mono text-xs font-bold">?</div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">RAVEN_MAT</div>
    </div>
  ),
  'fault-diagnosis': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-2 font-mono text-[10px] text-white">
        <div className="p-1 rounded bg-white/10">IN: 1,0</div>
        <span>→</span>
        <div className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-400 text-rose-300 font-bold">OR [X]</div>
        <span>→</span>
        <div className="text-accent-pink font-bold">FAULT!</div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">FAULT_CIR</div>
    </div>
  ),
  'symbol-search': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-1.5">
        <span className="font-mono text-[9px] text-accent-yellow">TARGET: Ω</span>
        <div className="grid grid-cols-4 gap-1 font-mono text-[11px] text-white/80">
          <span>Ψ</span>
          <span>λ</span>
          <span className="text-accent-mint font-bold">Ω</span>
          <span>θ</span>
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">SYM_SRCH</div>
    </div>
  ),
  'target-tracking': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="relative w-28 h-14 bg-white/5 rounded-xl flex items-center justify-around px-2">
        <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow shadow-md shadow-amber-500/50 animate-ping" />
        <div className="w-3.5 h-3.5 rounded-full bg-white/30" />
        <div className="w-3.5 h-3.5 rounded-full bg-accent-yellow shadow-md shadow-amber-500/50" />
        <div className="w-3.5 h-3.5 rounded-full bg-white/30" />
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">MOT_TRACK</div>
    </div>
  ),
  'lexical-decision': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex flex-col items-center gap-1">
        <span className="font-mono text-sm font-black text-accent-mint">RECURSION</span>
        <span className="text-[9px] font-mono text-white/60">[WORD] vs [PSEUDO]</span>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">LEX_DEC</div>
    </div>
  ),
  'paper-folding': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 border border-dashed border-white/60 relative flex items-center justify-center">
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-pink" />
        </div>
        <span className="font-mono text-xs text-accent-yellow">⤹</span>
        <div className="w-10 h-10 border border-white/30 relative flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-mint" />
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">FOLD_PUNCH</div>
    </div>
  ),
  'tower-puzzle': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-end gap-3 h-14">
        <div className="flex flex-col-reverse items-center gap-0.5">
          <div className="w-9 h-2 bg-secondary rounded-xs" />
          <div className="w-6 h-2 bg-secondary-fixed rounded-xs" />
          <div className="w-3 h-2 bg-accent-yellow rounded-xs" />
          <div className="w-1 h-8 bg-white/30" />
        </div>
        <div className="w-1 h-12 bg-white/30" />
        <div className="w-1 h-12 bg-white/30" />
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">TOWER_DISC</div>
    </div>
  ),
  'rule-switch': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-center gap-2 font-mono text-[10px]">
        <div className="p-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">COLOR</div>
        <span>↔</span>
        <div className="p-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">SHAPE</div>
        <span>↔</span>
        <div className="p-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">COUNT</div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">RULE_WCST</div>
    </div>
  ),
  'vessel-water': (
    <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
      <div className="flex items-end gap-3 font-mono text-[9px] text-white">
        <div className="flex flex-col items-center">
          <div className="w-7 h-10 border border-white/50 rounded-b flex flex-col justify-end overflow-hidden">
            <div className="h-3/4 w-full bg-secondary" />
          </div>
          <span>5L</span>
        </div>
        <span className="text-accent-yellow">⮂</span>
        <div className="flex flex-col items-center">
          <div className="w-7 h-8 border border-white/50 rounded-b flex flex-col justify-end overflow-hidden">
            <div className="h-1/2 w-full bg-accent-mint" />
          </div>
          <span>3L</span>
        </div>
      </div>
      <div className="absolute bottom-1.5 right-2 font-mono text-[9px] text-white/50 tracking-wider">JUG_WATER</div>
    </div>
  ),
};

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
        return <ExtendedCognitiveGame gameId={currentGameId} onBack={handleBack} />;
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
                  24<span className="text-on-surface-variant text-base">/24</span>
                </span>
                <span className="font-mono text-xs text-accent-mint font-semibold">All Playable</span>
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
                  Core Assessment Battery (7)
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
                  Complete 24-Game Cognitive Pool (All Playable)
                </button>
              </div>

              <span className="font-mono text-[11px] text-on-surface-variant hidden sm:inline-block">
                [6 Min Timer • Level² Scoring • All 24 Active]
              </span>
            </div>

            {/* Playable Games List */}
            {selectedTab === 'playable' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CORE_GAMES.map((game) => {
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

                        {/* Blueprint Visual Thumbnail */}
                        {GAME_THUMBNAILS[game.id]}

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
              /* 24-Game Cognitive Pool Catalog - All with Thumbnails & Play Action */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_GAMES.map((game) => {
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
                            {record ? `Peak: LVL ${record.highestLevel}` : `Cap: LVL ${game.difficultyCurve.recommendedCap}`}
                          </span>
                        </div>

                        {/* Visual Blueprint Thumbnail */}
                        {GAME_THUMBNAILS[game.id] || (
                          <div className="h-28 w-full bg-surface-charcoal rounded-lg p-3 flex items-center justify-center relative overflow-hidden mb-3">
                            <span className="font-mono text-xs text-white/50">{game.name}</span>
                          </div>
                        )}

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
                            {record ? `${record.maxScore} pts (${record.bestAccuracy}% Acc)` : 'Ready to Test'}
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
