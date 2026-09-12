/**
 * Universal Types & Interfaces for Assessment-Grade Cognitive Engine (Client)
 */

export type CognitiveGameId =
  | 'geo-sudo'
  | 'spacio'
  | 'inductive-reasoning'
  | 'switch-challenge'
  | 'digit-challenge'
  | 'grid-challenge'
  | 'motion-challenge'
  | 'color-the-grid';

export interface BaseCognitivePuzzle {
  id: string;
  fingerprint: string;
  gameId: string;
  level: number;
  difficultyRating: number;
  timeLimitMs: number;
  expectedSolveTimeMs: number;
  cognitiveLoadFactors: string[];
  solutionExplanation: string;
}

// 1. Geo-Sudo
export interface GeoSudoCell {
  row: number;
  col: number;
  val: string | null;
  isGiven: boolean;
  isTarget: boolean;
}

export interface GeoSudoPuzzle extends BaseCognitivePuzzle {
  type: 'geo-sudo';
  size: number;
  symbols: string[];
  grid: (string | null)[][];
  targetCell: { row: number; col: number };
  solution: string;
  options: string[];
  deductiveDepth: number;
}

// 2. Spacio / Inductive Reasoning
export type PolygonType = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'octagon';
export type FillPattern = 'solid' | 'outline' | 'striped' | 'hatched' | 'dotted';
export type OrbitPosition = 'north' | 'east' | 'south' | 'west' | 'center';

export interface VisualEntity {
  polygon: PolygonType;
  rotation: number; // 0, 45, 90, 135, 180, 225, 270, 315
  fill: FillPattern;
  satelliteCount: number; // 0 to 5
  orbitPosition: OrbitPosition;
  scale?: number;
}

export interface SpacioPuzzle extends BaseCognitivePuzzle {
  type: 'spacio';
  figureA: VisualEntity;
  figureB: VisualEntity;
  figureC: VisualEntity;
  correctD: VisualEntity;
  options: VisualEntity[];
  correctAnswerIndex: number;
  activeTransformations: string[];
}

// 3. Switch Challenge
export interface SwitchOperator {
  code: number[];
  codeString: string;
}

export interface SwitchPuzzle extends BaseCognitivePuzzle {
  type: 'switch-challenge';
  symbolCount: number;
  symbols: string[];
  inputSequence: string[];
  layers: number;
  switch1: SwitchOperator;
  switch2?: SwitchOperator;
  intermediateSequence?: string[];
  outputSequence: string[];
  targetLayer: 1 | 2;
  options: string[];
  correctAnswerIndex: number;
}

// 4. Digit Challenge
export interface DigitPuzzle extends BaseCognitivePuzzle {
  type: 'digit-challenge';
  target: number;
  operandCount: number;
  operators: ('+' | '-' | '×' | '÷')[];
  expressionTemplate: string;
  availableDigits: number[];
  correctDigits: number[];
  fullFormula: string;
  missingPositions: number[];
}

// 5. Grid Challenge
export interface GridCoordinate {
  row: number;
  col: number;
}

export interface SymmetryTaskData {
  matrix: boolean[][];
  isSymmetric: boolean;
  axis: 'vertical' | 'horizontal';
  divergentPixelCount: number;
}

export interface GridPuzzle extends BaseCognitivePuzzle {
  type: 'grid-challenge';
  gridSize: number;
  sequenceLength: number;
  sequence: GridCoordinate[];
  flashDurationMs: number;
  symmetryTasks: SymmetryTaskData[];
}

// 6. Motion Challenge
export interface MotionPuzzle extends BaseCognitivePuzzle {
  type: 'motion-challenge';
  gridSize: number;
  start: { row: number; col: number };
  target: { row: number; col: number };
  walls: { row: number; col: number }[];
  blocks: { row: number; col: number }[];
  optimalMoves: number;
  maxAllowedMoves: number;
}

// 7. Color The Grid
export interface GridCardContent {
  id: number;
  content: (string | number)[];
  displayGrid: (string | number)[][];
}

export interface ColorTheGridPuzzle extends BaseCognitivePuzzle {
  type: 'color-the-grid';
  ruleTier: number;
  ruleDescription: string;
  category: string;
  cards: GridCardContent[];
  expectedColors: string[];
  allowedColors: { id: string; name: string; bgClass: string; textClass: string }[];
}

export type AnyCognitivePuzzle =
  | GeoSudoPuzzle
  | SpacioPuzzle
  | SwitchPuzzle
  | DigitPuzzle
  | GridPuzzle
  | MotionPuzzle
  | ColorTheGridPuzzle;
