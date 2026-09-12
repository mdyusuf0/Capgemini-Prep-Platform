import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAdaptiveGame } from '../../context/AdaptiveGameContext';
import { AdaptiveGameShell, InstructionItem, ShortcutItem } from './AdaptiveGameShell';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale, Brain, ArrowRight, ArrowLeft, Eye, Clock, Layers,
  Compass, Search, Target, CheckCircle2, XCircle, RotateCcw,
  Sparkles, ShieldCheck, Zap, Activity, HelpCircle, Shuffle
} from 'lucide-react';
import { playClick, playCorrect, playWrong } from '../../utils/sound';
import { GAME_REGISTRY } from '../../config/gameRegistry';

interface Props {
  gameId: string;
  onBack: () => void;
}

export const ExtendedCognitiveGame: React.FC<Props> = ({ gameId, onBack }) => {
  const { level, submitAnswer, resetLevelTimer } = useAdaptiveGame();
  const gameDef = GAME_REGISTRY[gameId] || {
    name: 'Cognitive Challenge',
    category: 'General Cognitive',
    shortDesc: 'Complete the cognitive evaluation task.',
    skills: ['Cognitive Processing']
  };

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Common response handler
  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (feedback !== null) return;
    playClick();

    if (isCorrect) {
      setFeedback('correct');
      playCorrect();
      setTimeout(() => submitAnswer(true), 450);
    } else {
      setFeedback('wrong');
      playWrong();
      submitAnswer(false);
      setTimeout(() => setFeedback(null), 650);
    }
  }, [feedback, submitAnswer]);

  // ==========================================
  // 1. SCALE CHALLENGE (Balancing Weights)
  // ==========================================
  const [scalePuzzle, setScalePuzzle] = useState<{
    facts: string[];
    question: string;
    options: string[];
    correctIndex: number;
  }>({ facts: [], question: '', options: [], correctIndex: 0 });

  const genScaleChallenge = useCallback(() => {
    const shapes = ['Cylinder', 'Cone', 'Cube', 'Sphere'];
    // Shuffle shapes
    const perm = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    const s = [shapes[perm[0]], shapes[perm[1]], shapes[perm[2]], shapes[perm[3]]];

    const facts = [
      `1 ${s[0]} is heavier than 1 ${s[1]}`,
      `1 ${s[1]} is heavier than 1 ${s[2]}`,
      `1 ${s[2]} is heavier than 1 ${s[3]}`,
    ];
    if (Math.random() > 0.5) facts.reverse();

    const askHeaviest = Math.random() > 0.5;
    const question = askHeaviest
      ? 'Which geometric object is the HEAVIEST?'
      : 'Which geometric object is the LIGHTEST?';

    const correctAnswer = askHeaviest ? s[0] : s[3];
    const options = [...s].sort(() => Math.random() - 0.5);
    setScalePuzzle({
      facts,
      question,
      options,
      correctIndex: options.indexOf(correctAnswer)
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 2. FLANKER TASK (Eriksen Flanker)
  // ==========================================
  const [flankerPuzzle, setFlankerPuzzle] = useState<{
    string: string;
    centerDir: 'left' | 'right';
  }>({ string: '<<<<<', centerDir: 'left' });

  const genFlankerTask = useCallback(() => {
    const isCongruent = Math.random() > (level > 4 ? 0.3 : 0.6);
    const centerLeft = Math.random() > 0.5;
    const centerChar = centerLeft ? '←' : '→';
    let flankerChar = centerChar;
    if (!isCongruent) {
      flankerChar = centerLeft ? '→' : '←';
    }
    const fullStr = `${flankerChar}  ${flankerChar}  ${centerChar}  ${flankerChar}  ${flankerChar}`;
    setFlankerPuzzle({
      string: fullStr,
      centerDir: centerLeft ? 'left' : 'right'
    });
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  // ==========================================
  // 3. STROOP TEST (Color-Word Interference)
  // ==========================================
  const [stroopPuzzle, setStroopPuzzle] = useState<{
    word: string;
    colorName: string;
    colorClass: string;
    options: { name: string; class: string }[];
  }>({ word: 'RED', colorName: 'Blue', colorClass: 'text-blue-500', options: [] });

  const genStroopTest = useCallback(() => {
    const colorDefs = [
      { name: 'Red', class: 'text-rose-500 border-rose-400 hover:bg-rose-50' },
      { name: 'Blue', class: 'text-sky-500 border-sky-400 hover:bg-sky-50' },
      { name: 'Green', class: 'text-emerald-500 border-emerald-400 hover:bg-emerald-50' },
      { name: 'Yellow', class: 'text-amber-500 border-amber-400 hover:bg-amber-50' },
    ];
    const wordIdx = Math.floor(Math.random() * colorDefs.length);
    let colorIdx = Math.floor(Math.random() * colorDefs.length);
    while (colorIdx === wordIdx) {
      colorIdx = Math.floor(Math.random() * colorDefs.length);
    }
    setStroopPuzzle({
      word: colorDefs[wordIdx].name.toUpperCase(),
      colorName: colorDefs[colorIdx].name,
      colorClass: colorDefs[colorIdx].class.split(' ')[0],
      options: [...colorDefs].sort(() => Math.random() - 0.5)
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 4. NUMBER SERIES (Sequence Induction)
  // ==========================================
  const [seriesPuzzle, setSeriesPuzzle] = useState<{
    sequence: string[];
    options: number[];
    correctIndex: number;
    rule: string;
  }>({ sequence: [], options: [], correctIndex: 0, rule: '' });

  const genNumberSeries = useCallback(() => {
    const patterns = [
      // Arithmetic
      () => {
        const start = Math.floor(Math.random() * 20) + 1;
        const diff = Math.floor(Math.random() * 8) + 2;
        const seq = [start, start + diff, start + diff * 2, start + diff * 3, start + diff * 4];
        return { seq, next: start + diff * 5, rule: `+${diff}` };
      },
      // Multiplier
      () => {
        const start = Math.floor(Math.random() * 5) + 2;
        const mul = Math.floor(Math.random() * 2) + 2; // 2 or 3
        const seq = [start, start * mul, start * mul * mul, start * mul ** 3];
        return { seq, next: start * mul ** 4, rule: `×${mul}` };
      },
      // Increasing difference (+2, +4, +6, +8)
      () => {
        const start = Math.floor(Math.random() * 10) + 1;
        let cur = start;
        const seq = [cur];
        for (let i = 1; i <= 4; i++) {
          cur += i * 2;
          seq.push(cur);
        }
        const next = cur + 10;
        return { seq, next, rule: `+2, +4, +6, +8, +10` };
      },
    ];

    const chosen = patterns[Math.floor(Math.random() * patterns.length)]();
    const seqDisplay = [...chosen.seq.map(n => String(n)), '?'];
    const correctVal = chosen.next;
    const opts = new Set<number>([correctVal]);
    while (opts.size < 4) {
      const offset = (Math.floor(Math.random() * 9) - 4) * 2 || 2;
      opts.add(correctVal + offset);
    }
    const finalOpts = Array.from(opts).sort((a, b) => a - b);

    setSeriesPuzzle({
      sequence: seqDisplay,
      options: finalOpts,
      correctIndex: finalOpts.indexOf(correctVal),
      rule: chosen.rule
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 5. N-BACK MEMORY (Spatial 2-Back / 1-Back)
  // ==========================================
  const [nBackState, setNBackState] = useState<{
    n: number;
    history: number[];
    currentPos: number;
    step: number;
  }>({ n: 2, history: [], currentPos: 4, step: 0 });

  const genNBackStep = useCallback(() => {
    setNBackState(prev => {
      const nVal = level >= 4 ? 2 : 1;
      let nextPos = Math.floor(Math.random() * 9);
      if (prev.history.length >= nVal && Math.random() < 0.45) {
        nextPos = prev.history[prev.history.length - nVal];
      }
      return {
        n: nVal,
        history: [...prev.history, nextPos],
        currentPos: nextPos,
        step: prev.step + 1
      };
    });
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  // ==========================================
  // 6. REACTION SPRINT (Sensory Latency)
  // ==========================================
  const [reactionState, setReactionState] = useState<'WAIT' | 'READY' | 'CLICK' | 'DONE'>('WAIT');
  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const reactStartRef = useRef<number>(0);
  const reactTimeoutRef = useRef<any>(null);

  const startReactionRound = useCallback(() => {
    setReactionState('WAIT');
    setReactionTimeMs(null);
    clearTimeout(reactTimeoutRef.current);

    const delay = 1400 + Math.random() * 2200;
    reactTimeoutRef.current = setTimeout(() => {
      reactStartRef.current = performance.now();
      setReactionState('CLICK');
    }, delay);
  }, []);

  const handleReactionClick = () => {
    if (reactionState === 'WAIT') {
      clearTimeout(reactTimeoutRef.current);
      setReactionState('DONE');
      handleAnswer(false);
      setTimeout(startReactionRound, 1000);
      return;
    }
    if (reactionState === 'CLICK') {
      const elapsed = Math.round(performance.now() - reactStartRef.current);
      setReactionTimeMs(elapsed);
      setReactionState('DONE');
      const passThreshold = Math.max(380 - level * 10, 220);
      handleAnswer(elapsed <= passThreshold);
      setTimeout(startReactionRound, 1200);
    }
  };

  // ==========================================
  // 7. SPATIAL SPAN (Corsi Block Span)
  // ==========================================
  const [corsiState, setCorsiState] = useState<{
    sequence: number[];
    activeHighlight: number | null;
    userSequence: number[];
    phase: 'SHOW' | 'INPUT';
  }>({ sequence: [], activeHighlight: null, userSequence: [], phase: 'SHOW' });

  const genCorsiSpan = useCallback(() => {
    const spanLen = Math.min(3 + Math.floor(level / 2), 7);
    const seq: number[] = [];
    for (let i = 0; i < spanLen; i++) {
      let next = Math.floor(Math.random() * 9);
      while (seq.length > 0 && seq[seq.length - 1] === next) {
        next = Math.floor(Math.random() * 9);
      }
      seq.push(next);
    }

    setCorsiState({ sequence: seq, activeHighlight: null, userSequence: [], phase: 'SHOW' });

    seq.forEach((nodeId, idx) => {
      setTimeout(() => {
        setCorsiState(c => ({ ...c, activeHighlight: nodeId }));
        setTimeout(() => {
          setCorsiState(c => ({ ...c, activeHighlight: null }));
        }, 500);
      }, (idx + 1) * 700);
    });

    setTimeout(() => {
      setCorsiState(c => ({ ...c, phase: 'INPUT' }));
      resetLevelTimer();
    }, (seq.length + 1) * 700);
  }, [level, resetLevelTimer]);

  const handleCorsiClick = (nodeId: number) => {
    if (corsiState.phase !== 'INPUT' || feedback !== null) return;
    playClick();
    const nextUser = [...corsiState.userSequence, nodeId];
    const currentIndex = nextUser.length - 1;

    if (corsiState.sequence[currentIndex] !== nodeId) {
      handleAnswer(false);
      setTimeout(genCorsiSpan, 700);
      return;
    }

    if (nextUser.length === corsiState.sequence.length) {
      setCorsiState(c => ({ ...c, userSequence: nextUser }));
      handleAnswer(true);
      setTimeout(genCorsiSpan, 700);
    } else {
      setCorsiState(c => ({ ...c, userSequence: nextUser }));
    }
  };

  // ==========================================
  // 8. MATRIX REASONING (Raven Abstract Matrix)
  // ==========================================
  const [matrixPuzzle, setMatrixPuzzle] = useState<{
    grid: string[];
    options: string[];
    correctIndex: number;
  }>({ grid: [], options: [], correctIndex: 0 });

  const genMatrixReasoning = useCallback(() => {
    const row0 = ['●', '●●', '●●●'];
    const row1 = ['■', '■■', '■■■'];
    const row2 = ['▲', '▲▲', '?'];
    const correct = '▲▲▲';
    const opts = ['▲▲▲', '▲▲', '■■■', '●●●'].sort(() => Math.random() - 0.5);

    setMatrixPuzzle({
      grid: [...row0, ...row1, ...row2],
      options: opts,
      correctIndex: opts.indexOf(correct)
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 9. CUBE ROTATION (3D Isometric Visualization)
  // ==========================================
  const [cubePuzzle, setCubePuzzle] = useState<{
    isSame: boolean;
    rotationAngle: number;
  }>({ isSame: true, rotationAngle: 90 });

  const genCubeRotation = useCallback(() => {
    const isSame = Math.random() > 0.5;
    const angles = [90, 180, 270];
    const rot = angles[Math.floor(Math.random() * angles.length)];
    setCubePuzzle({ isSame, rotationAngle: rot });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 10. FAULT DIAGNOSIS (Logic Circuit Tracing)
  // ==========================================
  const [circuitPuzzle, setCircuitPuzzle] = useState<{
    inA: number;
    inB: number;
    gate: 'AND' | 'OR' | 'XOR';
    outputIsFaulty: boolean;
  }>({ inA: 1, inB: 0, gate: 'OR', outputIsFaulty: false });

  const genFaultDiagnosis = useCallback(() => {
    const inA = Math.random() > 0.5 ? 1 : 0;
    const inB = Math.random() > 0.5 ? 1 : 0;
    const gates: ('AND' | 'OR' | 'XOR')[] = ['AND', 'OR', 'XOR'];
    const gate = gates[Math.floor(Math.random() * gates.length)];
    const isFaulty = Math.random() > 0.5;
    setCircuitPuzzle({ inA, inB, gate, outputIsFaulty: isFaulty });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 11. SYMBOL SEARCH (Rapid Glyph Cross-Search)
  // ==========================================
  const [symbolPuzzle, setSymbolPuzzle] = useState<{
    target: string;
    grid: string[];
    isPresent: boolean;
  }>({ target: 'Ω', grid: [], isPresent: true });

  const genSymbolSearch = useCallback(() => {
    const GLYPHS = ['Ω', 'Ψ', 'λ', 'θ', 'Σ', 'Δ', 'π', 'β', 'α', 'γ', 'μ', 'φ', 'ξ', 'δ'];
    const target = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    const isPresent = Math.random() > 0.45;
    const pool = GLYPHS.filter(g => g !== target);
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5).slice(0, 11);
    if (isPresent) {
      shuffledPool[Math.floor(Math.random() * shuffledPool.length)] = target;
    }
    setSymbolPuzzle({ target, grid: shuffledPool, isPresent });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 12. LEXICAL DECISION (Word Discrimination)
  // ==========================================
  const [lexicalPuzzle, setLexicalPuzzle] = useState<{
    word: string;
    isReal: boolean;
  }>({ word: 'ALGORITHM', isReal: true });

  const genLexicalDecision = useCallback(() => {
    const REAL_WORDS = [
      'ALGORITHM', 'DATABASE', 'PROTOCOL', 'VARIABLE', 'FUNCTION',
      'COMPILER', 'MUTEX', 'BINARY', 'THREAD', 'INTERFACE',
      'ASYNC', 'RECURSION', 'KEYWORD', 'STACK', 'POINTER'
    ];
    const PSEUDO_WORDS = [
      'ALGORIST', 'DATABISE', 'PROTOCUL', 'VERIABLE', 'FUNCTAIN',
      'COMPYLER', 'MUTAX', 'BINERY', 'THRAED', 'INTERFICE',
      'ASYNT', 'RECURZION', 'KAYWORD', 'STECK', 'POINTOR'
    ];
    const isReal = Math.random() > 0.5;
    const list = isReal ? REAL_WORDS : PSEUDO_WORDS;
    const word = list[Math.floor(Math.random() * list.length)];
    setLexicalPuzzle({ word, isReal });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 13. PAPER FOLDING & HOLE PUNCH
  // ==========================================
  const [paperPuzzle, setPaperPuzzle] = useState<{
    fold: 'Vertical Half' | 'Horizontal Half' | 'Quarter Diagonal';
    punchLocation: string;
    options: number[];
    correctCount: number;
  }>({ fold: 'Vertical Half', punchLocation: 'Top-Right Corner', options: [1, 2, 3, 4], correctCount: 2 });

  const genPaperFolding = useCallback(() => {
    const foldTypes: ('Vertical Half' | 'Horizontal Half' | 'Quarter Diagonal')[] = [
      'Vertical Half', 'Horizontal Half', 'Quarter Diagonal'
    ];
    const chosenFold = foldTypes[Math.floor(Math.random() * foldTypes.length)];
    const correctCount = chosenFold === 'Quarter Diagonal' ? 4 : 2;
    setPaperPuzzle({
      fold: chosenFold,
      punchLocation: 'Outer Edge',
      options: [1, 2, 4, 8],
      correctCount
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  // ==========================================
  // 14. TOWER OF HANOI (Planning Challenge)
  // ==========================================
  const [towerPegs, setTowerPegs] = useState<number[][]>([[3, 2, 1], [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);

  const initTower = useCallback(() => {
    const diskCount = Math.min(3 + Math.floor(level / 3), 5);
    const d: number[] = [];
    for (let i = diskCount; i >= 1; i--) d.push(i);
    setTowerPegs([d, [], []]);
    setSelectedPeg(null);
    resetLevelTimer();
  }, [level, resetLevelTimer]);

  const handlePegClick = (pegIdx: number) => {
    if (selectedPeg === null) {
      if (towerPegs[pegIdx].length > 0) {
        setSelectedPeg(pegIdx);
        playClick();
      }
    } else {
      if (selectedPeg === pegIdx) {
        setSelectedPeg(null);
        return;
      }
      const sourcePeg = [...towerPegs[selectedPeg]];
      const destPeg = [...towerPegs[pegIdx]];
      const movingDisk = sourcePeg[sourcePeg.length - 1];
      const targetTop = destPeg[destPeg.length - 1];

      if (targetTop === undefined || movingDisk < targetTop) {
        sourcePeg.pop();
        destPeg.push(movingDisk);
        const newPegs = [...towerPegs];
        newPegs[selectedPeg] = sourcePeg;
        newPegs[pegIdx] = destPeg;
        setTowerPegs(newPegs);
        setSelectedPeg(null);
        playClick();

        const totalDisks = Math.min(3 + Math.floor(level / 3), 5);
        if (destPeg.length === totalDisks && pegIdx === 2) {
          handleAnswer(true);
          setTimeout(initTower, 800);
        }
      } else {
        playWrong();
        setSelectedPeg(null);
      }
    }
  };

  // ==========================================
  // 15. RULE SWITCH (Wisconsin Card Sort)
  // ==========================================
  const [ruleDimension, setRuleDimension] = useState<'COLOR' | 'SHAPE' | 'COUNT'>('COLOR');
  const [currentDrawCard, setCurrentDrawCard] = useState<{ color: string; shape: string; count: number }>({
    color: 'rose', shape: '■', count: 1
  });
  const ruleStreakRef = useRef<number>(0);

  const genRuleCard = useCallback(() => {
    const colors = ['rose', 'sky', 'emerald', 'amber'];
    const shapes = ['▲', '■', '●', '★'];
    const counts = [1, 2, 3, 4];
    setCurrentDrawCard({
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      count: counts[Math.floor(Math.random() * counts.length)]
    });
    resetLevelTimer();
  }, [resetLevelTimer]);

  const handleRuleMatch = (targetIdx: number) => {
    const REF_CARDS = [
      { color: 'rose', shape: '▲', count: 1 },
      { color: 'sky', shape: '■', count: 2 },
      { color: 'emerald', shape: '●', count: 3 },
      { color: 'amber', shape: '★', count: 4 },
    ];
    const chosen = REF_CARDS[targetIdx];
    let isMatch = false;
    if (ruleDimension === 'COLOR' && chosen.color === currentDrawCard.color) isMatch = true;
    if (ruleDimension === 'SHAPE' && chosen.shape === currentDrawCard.shape) isMatch = true;
    if (ruleDimension === 'COUNT' && chosen.count === currentDrawCard.count) isMatch = true;

    if (isMatch) {
      ruleStreakRef.current += 1;
      if (ruleStreakRef.current >= 4) {
        const dims: ('COLOR' | 'SHAPE' | 'COUNT')[] = ['COLOR', 'SHAPE', 'COUNT'];
        const remaining = dims.filter(d => d !== ruleDimension);
        setRuleDimension(remaining[Math.floor(Math.random() * remaining.length)]);
        ruleStreakRef.current = 0;
      }
      handleAnswer(true);
      setTimeout(genRuleCard, 500);
    } else {
      ruleStreakRef.current = 0;
      handleAnswer(false);
      setTimeout(genRuleCard, 600);
    }
  };

  // ==========================================
  // 16. LIQUID JUG VOLUME (Vessel Water)
  // ==========================================
  const [jugA, setJugA] = useState<{ cur: number; cap: number }>({ cur: 0, cap: 5 });
  const [jugB, setJugB] = useState<{ cur: number; cap: number }>({ cur: 0, cap: 3 });
  const [targetVolume, setTargetVolume] = useState<number>(4);

  const initJugs = useCallback(() => {
    setJugA({ cur: 0, cap: 5 });
    setJugB({ cur: 0, cap: 3 });
    setTargetVolume(4);
    resetLevelTimer();
  }, [resetLevelTimer]);

  const checkJugWin = (a: number, b: number) => {
    if (a === targetVolume || b === targetVolume) {
      handleAnswer(true);
      setTimeout(initJugs, 900);
    }
  };

  // ==========================================
  // 17. MULTIPLE OBJECT TRACKING (MOT)
  // ==========================================
  const [motPhase, setMotPhase] = useState<'HIGHLIGHT' | 'MOVING' | 'PICK'>('HIGHLIGHT');
  const [motTargets, setMotTargets] = useState<number[]>([0, 2]);
  const [motSelected, setMotSelected] = useState<number[]>([]);

  const startMotRound = useCallback(() => {
    const t1 = Math.floor(Math.random() * 6);
    let t2 = Math.floor(Math.random() * 6);
    while (t2 === t1) t2 = Math.floor(Math.random() * 6);
    setMotTargets([t1, t2]);
    setMotSelected([]);
    setMotPhase('HIGHLIGHT');

    setTimeout(() => {
      setMotPhase('MOVING');
      setTimeout(() => {
        setMotPhase('PICK');
        resetLevelTimer();
      }, 3000);
    }, 1800);
  }, [resetLevelTimer]);

  const handleMotNodeClick = (nodeIdx: number) => {
    if (motPhase !== 'PICK' || motSelected.includes(nodeIdx)) return;
    playClick();
    const next = [...motSelected, nodeIdx];
    setMotSelected(next);
    if (next.length === 2) {
      const win = next.every(n => motTargets.includes(n));
      handleAnswer(win);
      setTimeout(startMotRound, 1000);
    }
  };

  // Master Generator Init
  useEffect(() => {
    switch (gameId) {
      case 'scale-challenge': genScaleChallenge(); break;
      case 'flanker-task': genFlankerTask(); break;
      case 'stroop-test': genStroopTest(); break;
      case 'number-series': genNumberSeries(); break;
      case 'n-back-memory': genNBackStep(); break;
      case 'reaction-latency': startReactionRound(); break;
      case 'spatial-span': genCorsiSpan(); break;
      case 'matrix-reasoning': genMatrixReasoning(); break;
      case 'cube-rotation': genCubeRotation(); break;
      case 'fault-diagnosis': genFaultDiagnosis(); break;
      case 'symbol-search': genSymbolSearch(); break;
      case 'lexical-decision': genLexicalDecision(); break;
      case 'paper-folding': genPaperFolding(); break;
      case 'tower-puzzle': initTower(); break;
      case 'rule-switch': genRuleCard(); break;
      case 'vessel-water': initJugs(); break;
      case 'target-tracking': startMotRound(); break;
      default: genScaleChallenge(); break;
    }
  }, [gameId, level]);

  const INSTRUCTIONS: InstructionItem[] = [
    { title: 'Core Objective', desc: gameDef.shortDesc },
    { title: 'Adaptive Scaling', desc: 'Reach the highest level within the 6-minute window.' }
  ];

  const SHORTCUTS: ShortcutItem[] = [
    { key: '1 - 4', action: 'Select Option / Column' },
    { key: 'Space', action: 'Trigger Primary Action' }
  ];

  return (
    <AdaptiveGameShell
      title={gameDef.name}
      category={gameDef.category}
      instructions={INSTRUCTIONS}
      shortcuts={SHORTCUTS}
      onBack={onBack}
    >
      <div className="flex flex-col items-center justify-center p-4 max-w-xl mx-auto w-full min-h-[380px]">

        {/* FEEDBACK OVERLAY */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`absolute z-30 px-6 py-2.5 rounded-2xl font-mono text-sm font-bold shadow-lg flex items-center gap-2 ${
                feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}
            >
              {feedback === 'correct' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              {feedback === 'correct' ? 'CORRECT +LEVEL' : 'INCORRECT'}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 1. SCALE CHALLENGE */}
        {gameId === 'scale-challenge' && (
          <div className="w-full flex flex-col items-center gap-5">
            <div className="bg-surface-charcoal text-white rounded-2xl p-5 w-full shadow-sm flex flex-col gap-2.5 border border-border-hairline">
              <span className="font-mono text-[10px] text-accent-yellow uppercase tracking-wider">Weight Balance Evidence:</span>
              <div className="space-y-1.5 font-mono text-xs">
                {scalePuzzle.facts.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-white/90">
                    <span className="text-secondary font-bold">•</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <h3 className="font-bold text-sm text-center text-on-surface">{scalePuzzle.question}</h3>

            <div className="grid grid-cols-2 gap-3 w-full">
              {scalePuzzle.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i === scalePuzzle.correctIndex)}
                  className="p-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl text-sm font-bold font-mono transition-all shadow-xs cursor-pointer text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. FLANKER TASK */}
        {gameId === 'flanker-task' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Indicate the direction of the <strong>CENTER</strong> arrow. Ignore surrounding flankers.
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-center border border-border-hairline">
              <span className="text-3xl md:text-4xl font-mono font-extrabold tracking-widest text-accent-mint">
                {flankerPuzzle.string}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <button
                onClick={() => handleAnswer(flankerPuzzle.centerDir === 'left')}
                className="py-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <ArrowLeft size={16} /> LEFT
              </button>
              <button
                onClick={() => handleAnswer(flankerPuzzle.centerDir === 'right')}
                className="py-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                RIGHT <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* 3. STROOP TEST */}
        {gameId === 'stroop-test' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Select the <strong>INK COLOR</strong> of the text. Do NOT read the word itself!
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-center border border-border-hairline">
              <span className={`text-4xl font-extrabold tracking-wider ${stroopPuzzle.colorClass}`}>
                {stroopPuzzle.word}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {stroopPuzzle.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt.name === stroopPuzzle.colorName)}
                  className={`py-3 bg-surface-paper border border-border-hairline rounded-xl font-mono text-xs font-bold transition-all shadow-xs cursor-pointer ${opt.class}`}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. NUMBER SERIES */}
        {gameId === 'number-series' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Discover the recurrence progression and deduce the value for <strong>?</strong>
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-center gap-3 px-4 border border-border-hairline">
              {seriesPuzzle.sequence.map((item, idx) => (
                <span
                  key={idx}
                  className={`font-mono text-lg md:text-xl font-bold ${
                    item === '?' ? 'text-accent-yellow bg-white/10 px-2.5 py-1 rounded-lg animate-pulse' : 'text-white'
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full">
              {seriesPuzzle.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i === seriesPuzzle.correctIndex)}
                  className="py-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-sm font-bold transition-all shadow-xs cursor-pointer text-center"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 5. N-BACK MEMORY */}
        {gameId === 'n-back-memory' && (
          <div className="w-full flex flex-col items-center gap-5">
            <div className="flex items-center justify-between w-full text-xs font-mono">
              <span className="text-on-surface-variant">Active Rule: <strong>{nBackState.n}-Back Spatial</strong></span>
              <span className="text-secondary font-bold">Step #{nBackState.step}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 w-48 h-48 bg-surface-charcoal p-3 rounded-2xl border border-border-hairline">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl transition-all duration-200 ${
                    nBackState.currentPos === i
                      ? 'bg-accent-mint shadow-md shadow-emerald-500/40 scale-105'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <button
                onClick={() => {
                  const history = nBackState.history;
                  const n = nBackState.n;
                  const isMatch = history.length > n && history[history.length - 1] === history[history.length - 1 - n];
                  handleAnswer(isMatch);
                  genNBackStep();
                }}
                className="py-3 bg-secondary text-on-secondary rounded-xl font-mono text-xs font-bold hover:bg-secondary-hover transition-colors shadow-xs cursor-pointer"
              >
                MATCH ({nBackState.n}-Back)
              </button>
              <button
                onClick={() => {
                  const history = nBackState.history;
                  const n = nBackState.n;
                  const isMatch = history.length > n && history[history.length - 1] === history[history.length - 1 - n];
                  handleAnswer(!isMatch);
                  genNBackStep();
                }}
                className="py-3 bg-surface-paper border border-border-hairline hover:bg-surface-cream rounded-xl font-mono text-xs font-bold text-on-surface transition-colors shadow-xs cursor-pointer"
              >
                NO MATCH
              </button>
            </div>
          </div>
        )}

        {/* 6. REACTION SPRINT */}
        {gameId === 'reaction-latency' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Wait for the signal to turn <strong>GREEN</strong>, then click or press Space immediately!
            </p>

            <button
              onClick={handleReactionClick}
              className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all shadow-md cursor-pointer select-none ${
                reactionState === 'WAIT'
                  ? 'bg-rose-500/10 border-rose-500 text-rose-600 hover:scale-95'
                  : reactionState === 'CLICK'
                  ? 'bg-emerald-500 border-emerald-400 text-white animate-bounce scale-110 shadow-emerald-500/50'
                  : 'bg-surface-charcoal border-border-hairline text-white'
              }`}
            >
              <Zap size={32} className="mb-1" />
              <span className="font-mono text-sm font-bold">
                {reactionState === 'WAIT' && 'WAIT FOR GREEN...'}
                {reactionState === 'CLICK' && 'CLICK NOW!'}
                {reactionState === 'DONE' && (reactionTimeMs ? `${reactionTimeMs} ms` : 'TOO EARLY!')}
              </span>
            </button>
          </div>
        )}

        {/* 7. SPATIAL SPAN (Corsi Blocks) */}
        {gameId === 'spatial-span' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              {corsiState.phase === 'SHOW'
                ? 'Watch the sequence flash across the blocks...'
                : 'Now TAP the blocks in the EXACT sequence you observed!'}
            </p>

            <div className="grid grid-cols-3 gap-3 w-56 h-56 bg-surface-charcoal p-3.5 rounded-2xl border border-border-hairline">
              {Array.from({ length: 9 }).map((_, i) => (
                <button
                  key={i}
                  disabled={corsiState.phase !== 'INPUT'}
                  onClick={() => handleCorsiClick(i)}
                  className={`rounded-xl font-mono text-sm font-bold transition-all duration-150 cursor-pointer ${
                    corsiState.activeHighlight === i
                      ? 'bg-accent-yellow scale-110 shadow-lg'
                      : corsiState.userSequence.includes(i)
                      ? 'bg-secondary text-white'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 8. MATRIX REASONING */}
        {gameId === 'matrix-reasoning' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              Analyze the row/column progression and select the missing matrix tile.
            </p>

            <div className="grid grid-cols-3 gap-2 w-56 h-56 bg-surface-charcoal p-3 rounded-2xl border border-border-hairline">
              {matrixPuzzle.grid.map((cell, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl flex items-center justify-center font-mono text-base font-bold ${
                    cell === '?' ? 'bg-white/15 text-accent-yellow border border-dashed border-accent-yellow' : 'bg-white/10 text-white'
                  }`}
                >
                  {cell}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs">
              {matrixPuzzle.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i === matrixPuzzle.correctIndex)}
                  className="py-3 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-sm font-bold text-center cursor-pointer shadow-xs"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 9. CUBE ROTATION */}
        {gameId === 'cube-rotation' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Is Shape B an identical shape rotated, or is it a mirrored shape?
            </p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="h-32 bg-surface-charcoal rounded-2xl flex flex-col items-center justify-center border border-border-hairline p-3">
                <span className="text-[10px] font-mono text-white/50 mb-1">REFERENCE SHAPE A</span>
                <div className="w-12 h-12 border-2 border-secondary rotate-12 flex items-center justify-center">
                  <div className="w-6 h-6 bg-accent-mint/30 border border-accent-mint" />
                </div>
              </div>

              <div className="h-32 bg-surface-charcoal rounded-2xl flex flex-col items-center justify-center border border-border-hairline p-3">
                <span className="text-[10px] font-mono text-white/50 mb-1">TARGET SHAPE B</span>
                <div
                  style={{ transform: `rotate(${cubePuzzle.rotationAngle}deg) scaleX(${cubePuzzle.isSame ? 1 : -1})` }}
                  className="w-12 h-12 border-2 border-secondary flex items-center justify-center"
                >
                  <div className="w-6 h-6 bg-accent-mint/30 border border-accent-mint" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <button
                onClick={() => handleAnswer(cubePuzzle.isSame)}
                className="py-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-xs font-bold cursor-pointer shadow-xs"
              >
                IDENTICAL (Rotated)
              </button>
              <button
                onClick={() => handleAnswer(!cubePuzzle.isSame)}
                className="py-3.5 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-xs font-bold cursor-pointer shadow-xs"
              >
                DIFFERENT (Mirrored)
              </button>
            </div>
          </div>
        )}

        {/* 10. FAULT DIAGNOSIS */}
        {gameId === 'fault-diagnosis' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              Circuit input A={circuitPuzzle.inA}, B={circuitPuzzle.inB}. Is the gate output valid or faulty?
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-around px-6 border border-border-hairline">
              <div className="flex flex-col gap-2 font-mono text-xs text-white">
                <span>IN A: {circuitPuzzle.inA}</span>
                <span>IN B: {circuitPuzzle.inB}</span>
              </div>
              <span className="font-mono text-base font-extrabold text-accent-yellow border border-accent-yellow px-3 py-1.5 rounded-lg">
                GATE: {circuitPuzzle.gate}
              </span>
              <div className="font-mono text-xs text-accent-mint font-bold">
                OUT: {circuitPuzzle.outputIsFaulty ? '0 (DISCORDANT)' : '1 (NOMINAL)'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <button
                onClick={() => handleAnswer(!circuitPuzzle.outputIsFaulty)}
                className="py-3 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-xs font-bold cursor-pointer shadow-xs"
              >
                NOMINAL (Gate Normal)
              </button>
              <button
                onClick={() => handleAnswer(circuitPuzzle.outputIsFaulty)}
                className="py-3 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-rose-400 rounded-xl font-mono text-xs font-bold text-rose-600 cursor-pointer shadow-xs"
              >
                FAULTY (Component Defect)
              </button>
            </div>
          </div>
        )}

        {/* 11. SYMBOL SEARCH */}
        {gameId === 'symbol-search' && (
          <div className="w-full flex flex-col items-center gap-5">
            <div className="flex items-center gap-3 bg-surface-charcoal text-white px-5 py-2.5 rounded-xl font-mono text-xs">
              <span>TARGET GLYPH:</span>
              <span className="text-2xl font-bold text-accent-yellow">{symbolPuzzle.target}</span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 w-full bg-surface-charcoal p-4 rounded-2xl border border-border-hairline">
              {symbolPuzzle.grid.map((glyph, i) => (
                <div
                  key={i}
                  className="h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-mono font-bold text-white"
                >
                  {glyph}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              <button
                onClick={() => handleAnswer(symbolPuzzle.isPresent)}
                className="py-3 bg-secondary text-on-secondary rounded-xl font-mono text-xs font-bold hover:bg-secondary-hover cursor-pointer shadow-xs"
              >
                GLYPH PRESENT
              </button>
              <button
                onClick={() => handleAnswer(!symbolPuzzle.isPresent)}
                className="py-3 bg-surface-paper border border-border-hairline hover:bg-surface-cream rounded-xl font-mono text-xs font-bold text-on-surface cursor-pointer shadow-xs"
              >
                NOT IN TABLE
              </button>
            </div>
          </div>
        )}

        {/* 12. LEXICAL DECISION */}
        {gameId === 'lexical-decision' && (
          <div className="w-full flex flex-col items-center gap-6">
            <p className="text-xs text-on-surface-variant text-center">
              Quickly judge whether this is a <strong>REAL TECHNICAL ENGLISH WORD</strong> or a pseudoword.
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-center border border-border-hairline">
              <span className="text-3xl font-mono font-extrabold tracking-widest text-accent-mint">
                {lexicalPuzzle.word}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <button
                onClick={() => handleAnswer(lexicalPuzzle.isReal)}
                className="py-3.5 bg-secondary text-on-secondary rounded-xl font-mono text-xs font-bold hover:bg-secondary-hover cursor-pointer shadow-xs"
              >
                REAL WORD (W)
              </button>
              <button
                onClick={() => handleAnswer(!lexicalPuzzle.isReal)}
                className="py-3.5 bg-surface-paper border border-border-hairline hover:bg-surface-cream rounded-xl font-mono text-xs font-bold text-on-surface cursor-pointer shadow-xs"
              >
                PSEUDOWORD (N)
              </button>
            </div>
          </div>
        )}

        {/* 13. PAPER FOLDING */}
        {gameId === 'paper-folding' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              A square paper underwent <strong>{paperPuzzle.fold}</strong> with a hole punched on the edge. How many holes appear unfolded?
            </p>

            <div className="h-28 w-full bg-surface-charcoal rounded-2xl flex items-center justify-center gap-4 border border-border-hairline">
              <div className="w-16 h-16 border-2 border-dashed border-white/60 flex items-center justify-center relative">
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-accent-pink" />
              </div>
              <span className="font-mono text-xs text-white/60">→ UNPUNCH & UNFOLD</span>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {paperPuzzle.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt === paperPuzzle.correctCount)}
                  className="py-3 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-sm font-bold text-center cursor-pointer shadow-xs"
                >
                  {opt} Hole{opt > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 14. TOWER OF HANOI */}
        {gameId === 'tower-puzzle' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              Move all disks to <strong>PEG 3</strong>. Larger disks cannot sit on smaller disks!
            </p>

            <div className="grid grid-cols-3 gap-3 w-full bg-surface-charcoal p-4 rounded-2xl border border-border-hairline min-h-[160px] items-end">
              {towerPegs.map((peg, pegIdx) => (
                <button
                  key={pegIdx}
                  onClick={() => handlePegClick(pegIdx)}
                  className={`flex flex-col items-center justify-end h-36 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPeg === pegIdx ? 'border-secondary bg-white/10' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="flex flex-col-reverse items-center gap-1 w-full pb-2">
                    {peg.map((diskVal, diskIdx) => (
                      <div
                        key={diskIdx}
                        style={{ width: `${30 + diskVal * 15}%` }}
                        className="h-4 rounded-md bg-secondary border border-secondary-fixed"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-white/50 border-t border-white/20 w-full pt-1 text-center">
                    PEG {pegIdx + 1}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 15. RULE SWITCH (Wisconsin Sort) */}
        {gameId === 'rule-switch' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              Match the draw card to one of the 4 reference cards below. Deduce the hidden sorting rule!
            </p>

            {/* Current Draw Card */}
            <div className="p-4 bg-surface-charcoal rounded-2xl flex items-center justify-center gap-2 border border-border-hairline w-40">
              <span className={`text-2xl font-bold text-${currentDrawCard.color}-400`}>
                {Array.from({ length: currentDrawCard.count }).map(() => currentDrawCard.shape).join(' ')}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5 w-full">
              {[
                { label: '1 ▲ Red', color: 'text-rose-500' },
                { label: '2 ■ Blue', color: 'text-sky-500' },
                { label: '3 ● Green', color: 'text-emerald-500' },
                { label: '4 ★ Yellow', color: 'text-amber-500' }
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() => handleRuleMatch(i)}
                  className={`p-3 bg-surface-paper hover:bg-surface-cream border border-border-hairline hover:border-secondary rounded-xl font-mono text-xs font-bold text-center cursor-pointer shadow-xs ${card.color}`}
                >
                  {card.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 16. LIQUID JUG VOLUME */}
        {gameId === 'vessel-water' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              Measure exactly <strong>{targetVolume} Liters</strong> in either jug!
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <div className="bg-surface-charcoal p-3.5 rounded-2xl flex flex-col items-center border border-border-hairline">
                <span className="text-[10px] font-mono text-white/60 mb-2">JUG A (Cap: {jugA.cap}L)</span>
                <div className="w-20 h-28 border-2 border-white/40 rounded-b-xl flex flex-col justify-end overflow-hidden relative">
                  <div
                    style={{ height: `${(jugA.cur / jugA.cap) * 100}%` }}
                    className="w-full bg-secondary/80 transition-all duration-300"
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
                    {jugA.cur}L
                  </span>
                </div>
              </div>

              <div className="bg-surface-charcoal p-3.5 rounded-2xl flex flex-col items-center border border-border-hairline">
                <span className="text-[10px] font-mono text-white/60 mb-2">JUG B (Cap: {jugB.cap}L)</span>
                <div className="w-20 h-28 border-2 border-white/40 rounded-b-xl flex flex-col justify-end overflow-hidden relative">
                  <div
                    style={{ height: `${(jugB.cur / jugB.cap) * 100}%` }}
                    className="w-full bg-accent-mint/80 transition-all duration-300"
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-white">
                    {jugB.cur}L
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
              <button
                onClick={() => { setJugA(j => ({ ...j, cur: j.cap })); checkJugWin(jugA.cap, jugB.cur); }}
                className="py-2 bg-surface-paper border border-border-hairline rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Fill A
              </button>
              <button
                onClick={() => { setJugB(j => ({ ...j, cur: j.cap })); checkJugWin(jugA.cur, jugB.cap); }}
                className="py-2 bg-surface-paper border border-border-hairline rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Fill B
              </button>
              <button
                onClick={() => { setJugA(j => ({ ...j, cur: 0 })); checkJugWin(0, jugB.cur); }}
                className="py-2 bg-surface-paper border border-border-hairline rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Empty A
              </button>
              <button
                onClick={() => { setJugB(j => ({ ...j, cur: 0 })); checkJugWin(jugA.cur, 0); }}
                className="py-2 bg-surface-paper border border-border-hairline rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Empty B
              </button>
              <button
                onClick={() => {
                  const spaceInB = jugB.cap - jugB.cur;
                  const transfer = Math.min(jugA.cur, spaceInB);
                  const newA = jugA.cur - transfer;
                  const newB = jugB.cur + transfer;
                  setJugA(j => ({ ...j, cur: newA }));
                  setJugB(j => ({ ...j, cur: newB }));
                  checkJugWin(newA, newB);
                }}
                className="py-2 bg-secondary text-on-secondary rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Pour A → B
              </button>
              <button
                onClick={() => {
                  const spaceInA = jugA.cap - jugA.cur;
                  const transfer = Math.min(jugB.cur, spaceInA);
                  const newA = jugA.cur + transfer;
                  const newB = jugB.cur - transfer;
                  setJugA(j => ({ ...j, cur: newA }));
                  setJugB(j => ({ ...j, cur: newB }));
                  checkJugWin(newA, newB);
                }}
                className="py-2 bg-secondary text-on-secondary rounded-lg font-mono text-[11px] font-bold cursor-pointer"
              >
                Pour B → A
              </button>
            </div>
          </div>
        )}

        {/* 17. MULTIPLE OBJECT TRACKING (MOT) */}
        {gameId === 'target-tracking' && (
          <div className="w-full flex flex-col items-center gap-5">
            <p className="text-xs text-on-surface-variant text-center">
              {motPhase === 'HIGHLIGHT' && 'Memorize the highlighted targets!'}
              {motPhase === 'MOVING' && 'Tracking targets across the field...'}
              {motPhase === 'PICK' && 'Select the 2 original targets you tracked!'}
            </p>

            <div className="grid grid-cols-3 gap-4 w-60 h-44 bg-surface-charcoal p-4 rounded-2xl border border-border-hairline">
              {Array.from({ length: 6 }).map((_, idx) => {
                const isTarget = motTargets.includes(idx);
                const isSelected = motSelected.includes(idx);
                return (
                  <button
                    key={idx}
                    disabled={motPhase !== 'PICK'}
                    onClick={() => handleMotNodeClick(idx)}
                    className={`rounded-full w-12 h-12 flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer ${
                      motPhase === 'HIGHLIGHT' && isTarget
                        ? 'bg-accent-yellow scale-110 shadow-lg'
                        : isSelected
                        ? 'bg-secondary text-white'
                        : 'bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </AdaptiveGameShell>
  );
};
