import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { playCorrect, playWrong, playStreak, playGameOver, playUrgentTick } from '../utils/sound';
import { launchConfetti } from '../utils/confetti';
import { AssessmentConfig } from '../config/assessmentConfig';
import { GameDefinition } from '../config/gameRegistry';
import api from '../services/api';

export type GameState = 'IDLE' | 'INSTRUCTIONS' | 'PLAYING' | 'LEVEL_UP' | 'GAME_OVER' | 'ASSESSMENT_COMPLETE';
export type GameMode = 'PRACTICE' | 'ASSESSMENT' | 'CHALLENGE';

export interface QuestionHistoryEntry {
  level: number;
  isCorrect: boolean;
  timeTaken: number;
  points: number;
  userResponse?: any;
}

export interface LevelHistoryEntry {
  level: number;
  timeTaken: number;
  correct: boolean;
  score: number;
  timestamp?: Date;
}

export interface GameSessionResult {
  gameId: string;
  score: number;
  highestLevel: number;
  accuracy: number;
  totalAnswered: number;
  correctCount: number;
  wrongCount: number;
  avgTimePerQuestion: number;
  duration: number;
  questionHistory: QuestionHistoryEntry[];
}

interface AdaptiveGameContextType {
  gameState: GameState;
  gameMode: GameMode;
  score: number;
  level: number;
  timeLeft: number;
  streak: number;
  currentGameId: string | null;
  targetLevel: number | null; // For Challenge mode ("Beat My Best")
  stats: {
    totalAnswered: number;
    correctCount: number;
    wrongCount: number;
    totalSolveTime: number;
    questionHistory: QuestionHistoryEntry[];
    levelHistory: LevelHistoryEntry[];
  };
  isNewHighScore: boolean;
  isNewHighestLevel: boolean;
  
  // Assessment Battery State
  assessmentSessionId: string | null;
  assessmentGames: GameDefinition[];
  currentAssessmentGameIndex: number;
  allAssessmentResults: GameSessionResult[];

  // Actions
  startGame: (id: string, options?: { mode?: GameMode; duration?: number; targetLevel?: number }) => void;
  startAssessmentSession: (games: GameDefinition[]) => void;
  startNextAssessmentGame: () => void;
  submitAnswer: (isCorrect: boolean, explicitTimeTaken?: number, userResponse?: any) => void;
  endGame: () => void;
  resetGame: () => void;
  resetLevelTimer: () => void;
  setGameState: (state: GameState) => void;
}

const AdaptiveGameContext = createContext<AdaptiveGameContextType | undefined>(undefined);

export const useAdaptiveGame = (): AdaptiveGameContextType => {
  const context = useContext(AdaptiveGameContext);
  if (!context) {
    throw new Error('useAdaptiveGame must be used within an AdaptiveGameProvider');
  }
  return context;
};

export const AdaptiveGameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [gameMode, setGameMode] = useState<GameMode>('PRACTICE');
  const [score, setScore] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [targetLevel, setTargetLevel] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isNewHighestLevel, setIsNewHighestLevel] = useState<boolean>(false);

  // Multi-game assessment orchestrator state
  const [assessmentSessionId, setAssessmentSessionId] = useState<string | null>(null);
  const [assessmentGames, setAssessmentGames] = useState<GameDefinition[]>([]);
  const [currentAssessmentGameIndex, setCurrentAssessmentGameIndex] = useState<number>(0);
  const [allAssessmentResults, setAllAssessmentResults] = useState<GameSessionResult[]>([]);

  const [stats, setStats] = useState<{
    totalAnswered: number;
    correctCount: number;
    wrongCount: number;
    totalSolveTime: number;
    questionHistory: QuestionHistoryEntry[];
    levelHistory: LevelHistoryEntry[];
  }>({
    totalAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    totalSolveTime: 0,
    questionHistory: [],
    levelHistory: [],
  });

  const levelStartTimeRef = useRef<number>(Date.now());
  const sessionStartTimeRef = useRef<number>(Date.now());
  const lastTickRef = useRef<number>(0);

  const resetLevelTimer = useCallback(() => {
    levelStartTimeRef.current = Date.now();
  }, []);

  const endGame = useCallback(() => {
    setGameState('GAME_OVER');
    playGameOver();
  }, []);

  // Save attempt to backend and update personal bests
  const syncAttemptToBackend = useCallback(async (
    gid: string,
    finalScore: number,
    finalLevel: number,
    finalStats: typeof stats,
    mode: GameMode,
    sessId: string | null
  ) => {
    try {
      const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));
      const accuracy = finalStats.totalAnswered > 0
        ? Math.round((finalStats.correctCount / finalStats.totalAnswered) * 100)
        : 100;
      const avgResponseTime = finalStats.totalAnswered > 0
        ? parseFloat((finalStats.totalSolveTime / finalStats.totalAnswered).toFixed(2))
        : 0;

      const payload = {
        gameId: gid,
        assessmentMode: mode.toLowerCase(),
        assessmentSessionId: sessId || `sess_${Date.now()}`,
        startedAt: new Date(sessionStartTimeRef.current).toISOString(),
        endedAt: new Date().toISOString(),
        duration: durationSeconds,
        highestLevel: finalLevel,
        questionsAttempted: finalStats.totalAnswered,
        correctAnswers: finalStats.correctCount,
        incorrectAnswers: finalStats.wrongCount,
        accuracy,
        totalScore: finalScore,
        averageResponseTime: avgResponseTime,
        streakMax: streak,
        levelHistory: finalStats.levelHistory,
        questionHistory: finalStats.questionHistory,
      };

      const response = await api.post('/games/attempt', payload);
      if (response.data) {
        if (response.data.isNewHighScore) setIsNewHighScore(true);
        if (response.data.isNewHighestLevel) setIsNewHighestLevel(true);

        if (response.data.isNewHighScore || finalScore >= 800 || finalLevel >= 8) {
          setTimeout(() => launchConfetti(), 300);
        }
      }
    } catch (err: any) {
      console.warn('Could not sync cognitive attempt to server:', err.message);
    }
  }, [streak]);

  // Handle GAME_OVER persistence and assessment sequence chaining
  useEffect(() => {
    if (gameState === 'GAME_OVER' && currentGameId) {
      const accuracy = stats.totalAnswered > 0
        ? Math.round((stats.correctCount / stats.totalAnswered) * 100)
        : 100;
      const avgTime = stats.totalAnswered > 0
        ? parseFloat((stats.totalSolveTime / stats.totalAnswered).toFixed(1))
        : 0;
      const duration = Math.max(1, Math.round((Date.now() - sessionStartTimeRef.current) / 1000));

      const sessionResult: GameSessionResult = {
        gameId: currentGameId,
        score,
        highestLevel: level,
        accuracy,
        totalAnswered: stats.totalAnswered,
        correctCount: stats.correctCount,
        wrongCount: stats.wrongCount,
        avgTimePerQuestion: avgTime,
        duration,
        questionHistory: stats.questionHistory,
      };

      // Append to assessment accumulator if in assessment mode
      if (gameMode === 'ASSESSMENT') {
        setAllAssessmentResults(prev => [...prev, sessionResult]);
      }

      // Sync attempt to database
      syncAttemptToBackend(currentGameId, score, level, stats, gameMode, assessmentSessionId);
    }
  }, [gameState, currentGameId]);

  // Live Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'PLAYING' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          // Audio tick during final 15 seconds
          if (prev <= 15 && Date.now() - lastTickRef.current > 900) {
            playUrgentTick();
            lastTickRef.current = Date.now();
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, endGame]);

  // Start a single game in practice or challenge mode
  const startGame = useCallback((id: string, options: { mode?: GameMode; duration?: number; targetLevel?: number } = {}) => {
    const selectedMode = options.mode || 'PRACTICE';
    setCurrentGameId(id);
    setScore(0);
    setLevel(1);
    setStreak(0);
    setIsNewHighScore(false);
    setIsNewHighestLevel(false);
    setGameMode(selectedMode);
    setTargetLevel(options.targetLevel || null);

    setStats({
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      totalSolveTime: 0,
      questionHistory: [],
      levelHistory: [],
    });

    const duration = options.duration !== undefined 
      ? options.duration 
      : AssessmentConfig.defaultGameDurationSeconds;

    setTimeLeft(duration);
    sessionStartTimeRef.current = Date.now();
    levelStartTimeRef.current = Date.now();
    setGameState('PLAYING');
  }, []);

  // Start a multi-game assessment battery (default 4 games)
  const startAssessmentSession = useCallback((games: GameDefinition[]) => {
    if (games.length === 0) return;
    const sessId = `asmt_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    setAssessmentSessionId(sessId);
    setAssessmentGames(games);
    setCurrentAssessmentGameIndex(0);
    setAllAssessmentResults([]);

    const firstGame = games[0];
    setCurrentGameId(firstGame.id);
    setScore(0);
    setLevel(1);
    setStreak(0);
    setIsNewHighScore(false);
    setIsNewHighestLevel(false);
    setGameMode('ASSESSMENT');
    setTargetLevel(null);

    setStats({
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      totalSolveTime: 0,
      questionHistory: [],
      levelHistory: [],
    });

    setTimeLeft(firstGame.defaultDurationSeconds || AssessmentConfig.defaultGameDurationSeconds);
    sessionStartTimeRef.current = Date.now();
    levelStartTimeRef.current = Date.now();
    setGameState('PLAYING');
  }, []);

  // Advance to next game in assessment battery
  const startNextAssessmentGame = useCallback(() => {
    const nextIndex = currentAssessmentGameIndex + 1;
    if (nextIndex >= assessmentGames.length) {
      setGameState('ASSESSMENT_COMPLETE');
      launchConfetti();
      return;
    }

    const nextGame = assessmentGames[nextIndex];
    setCurrentAssessmentGameIndex(nextIndex);
    setCurrentGameId(nextGame.id);
    setScore(0);
    setLevel(1);
    setStreak(0);
    setIsNewHighScore(false);
    setIsNewHighestLevel(false);

    setStats({
      totalAnswered: 0,
      correctCount: 0,
      wrongCount: 0,
      totalSolveTime: 0,
      questionHistory: [],
      levelHistory: [],
    });

    setTimeLeft(nextGame.defaultDurationSeconds || AssessmentConfig.defaultGameDurationSeconds);
    sessionStartTimeRef.current = Date.now();
    levelStartTimeRef.current = Date.now();
    setGameState('PLAYING');
  }, [currentAssessmentGameIndex, assessmentGames]);

  // Core Submit Answer logic: handles level advancement, scoring, and telemetry
  const submitAnswer = useCallback((isCorrect: boolean, explicitTimeTaken?: number, userResponse?: any) => {
    const now = Date.now();
    const elapsedSeconds = explicitTimeTaken !== undefined
      ? explicitTimeTaken
      : Math.max(1, Math.round((now - levelStartTimeRef.current) / 1000));

    levelStartTimeRef.current = now;

    if (isCorrect) {
      const currentStreak = streak + 1;
      setStreak(currentStreak);

      // Multiplier from config
      let multiplier = 1.0;
      const { streakMultipliers, minSolveSeconds } = AssessmentConfig.scoringModel;
      if (currentStreak >= 6) multiplier = streakMultipliers[6] || 2.0;
      else if (currentStreak >= 4) multiplier = streakMultipliers[4] || 1.5;
      else if (currentStreak >= 2) multiplier = streakMultipliers[2] || 1.25;

      // Capgemini-style practice scoring model: (level^2 / max(minSolveSeconds, elapsedSeconds)) * 100 * multiplier
      const basePoints = Math.round((Math.pow(level, 2) / Math.max(minSolveSeconds, elapsedSeconds)) * 100);
      const pointsAwarded = Math.round(basePoints * multiplier);

      setScore(prev => prev + pointsAwarded);
      setLevel(prev => prev + 1); // Immediate advancement to next harder level

      if (currentStreak >= 3) {
        playStreak();
      } else {
        playCorrect();
      }

      setStats(prev => ({
        totalAnswered: prev.totalAnswered + 1,
        correctCount: prev.correctCount + 1,
        wrongCount: prev.wrongCount,
        totalSolveTime: prev.totalSolveTime + elapsedSeconds,
        questionHistory: [
          ...prev.questionHistory,
          { level, isCorrect: true, timeTaken: elapsedSeconds, points: pointsAwarded, userResponse },
        ],
        levelHistory: [
          ...prev.levelHistory,
          { level, timeTaken: elapsedSeconds, correct: true, score: pointsAwarded, timestamp: new Date() },
        ],
      }));
    } else {
      setStreak(0);
      playWrong();

      // Handle incorrect policy
      const policy = AssessmentConfig.incorrectPolicy;
      if (policy === 'DROP_LEVEL') {
        setLevel(prev => Math.max(1, prev - 1));
      } else if (policy === 'END_SESSION') {
        endGame();
      }
      // 'STAY_ON_LEVEL' or 'RETRY' keeps level unchanged

      setStats(prev => ({
        totalAnswered: prev.totalAnswered + 1,
        correctCount: prev.correctCount,
        wrongCount: prev.wrongCount + 1,
        totalSolveTime: prev.totalSolveTime + elapsedSeconds,
        questionHistory: [
          ...prev.questionHistory,
          { level, isCorrect: false, timeTaken: elapsedSeconds, points: 0, userResponse },
        ],
        levelHistory: [
          ...prev.levelHistory,
          { level, timeTaken: elapsedSeconds, correct: false, score: 0, timestamp: new Date() },
        ],
      }));
    }
  }, [level, streak, endGame]);

  const resetGame = useCallback(() => {
    setGameState('IDLE');
    setScore(0);
    setLevel(1);
    setTimeLeft(0);
    setStreak(0);
    setCurrentGameId(null);
    setTargetLevel(null);
    setAssessmentSessionId(null);
    setAssessmentGames([]);
    setCurrentAssessmentGameIndex(0);
    setAllAssessmentResults([]);
  }, []);

  const value: AdaptiveGameContextType = {
    gameState,
    gameMode,
    score,
    level,
    timeLeft,
    streak,
    currentGameId,
    targetLevel,
    stats,
    isNewHighScore,
    isNewHighestLevel,
    assessmentSessionId,
    assessmentGames,
    currentAssessmentGameIndex,
    allAssessmentResults,
    startGame,
    startAssessmentSession,
    startNextAssessmentGame,
    submitAnswer,
    endGame,
    resetGame,
    resetLevelTimer,
    setGameState,
  };

  return (
    <AdaptiveGameContext.Provider value={value}>
      {children}
    </AdaptiveGameContext.Provider>
  );
};
