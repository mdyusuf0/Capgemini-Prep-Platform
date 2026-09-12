/**
 * Capgemini Cognitive Assessment Configuration
 * Configurable parameters for game count, durations, scoring models, and difficulty progression.
 * Adheres to Capgemini / Aon cut-e 2026/2027 assessment patterns.
 */

export type IncorrectPolicy = 
  | 'RETRY' 
  | 'STAY_ON_LEVEL' 
  | 'DROP_LEVEL' 
  | 'END_SESSION' 
  | 'CONTINUE_WITH_PENALTY';

export interface ScoringModelConfig {
  baseFormula: 'LEVEL_SQUARED_DIV_TIME' | 'LINEAR_SPEED_ACCURACY';
  levelWeight: number;
  speedWeight: number;
  streakMultipliers: { [streakCount: number]: number };
  minSolveSeconds: number; // Floor for time divisor to prevent division by near-zero
}

export interface AssessmentConfigType {
  name: string;
  version: string;
  organization: string;
  totalGamesPerSession: number;
  totalGamePoolSize: number;
  defaultGameDurationSeconds: number; // 360 seconds = 6 minutes per game
  defaultPracticeDurationSeconds: number; // 180 seconds or customizable
  allowUntimedPractice: boolean;
  isAdaptive: boolean;
  negativeMarking: boolean;
  incorrectPolicy: IncorrectPolicy;
  scoringModel: ScoringModelConfig;
  scoringModelDisclaimer: string;
}

export const AssessmentConfig: AssessmentConfigType = {
  name: 'Capgemini Exceller Adaptive Cognitive Battery',
  version: '2026/2027 Revision',
  organization: 'Capgemini Recruitment Simulation',
  totalGamesPerSession: 4, // Exactly 4 games in actual exam flow
  totalGamePoolSize: 24,   // Comprehensive pool of 24 cognitive competencies
  defaultGameDurationSeconds: 360, // 6 minutes standard test window
  defaultPracticeDurationSeconds: 180,
  allowUntimedPractice: true,
  isAdaptive: true,
  negativeMarking: false,
  incorrectPolicy: 'STAY_ON_LEVEL', // Incorrect answers do not advance level, resets streak
  scoringModel: {
    baseFormula: 'LEVEL_SQUARED_DIV_TIME',
    levelWeight: 1.0,
    speedWeight: 1.0,
    streakMultipliers: {
      1: 1.0,
      2: 1.25,
      4: 1.5,
      6: 2.0,
    },
    minSolveSeconds: 1, // Math.max(1, elapsedSeconds)
  },
  scoringModelDisclaimer: 'Capgemini-style practice scoring model calibrated to reward rapid accurate deductions.',
};
