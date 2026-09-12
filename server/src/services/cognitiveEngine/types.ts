/**
 * Universal Types & Interfaces for Assessment-Grade Cognitive Engine
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
  difficultyRating: number; // 0.1 to 1.0
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
  deductiveDepth: number; // 1 = direct row/col, 2 = 2-step intersection, 3 = cross-elimination
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
  code: number[]; // 1-based or 0-based indices e.g. [3, 1, 4, 2]
  codeString: string; // e.g. "3 1 4 2"
}

export interface SwitchPuzzle extends BaseCognitivePuzzle {
  type: 'switch-challenge';
  symbolCount: number; // 4 or 5
  symbols: string[];
  inputSequence: string[];
  layers: number; // 1 or 2
  switch1: SwitchOperator;
  switch2?: SwitchOperator;
  intermediateSequence?: string[];
  outputSequence: string[];
  targetLayer: 1 | 2; // Which switch candidate must deduce
  options: string[]; // e.g. ["3 1 4 2", "3 1 2 4", ...]
  correctAnswerIndex: number;
}

// 4. Digit Challenge
export interface DigitPuzzle extends BaseCognitivePuzzle {
  type: 'digit-challenge';
  target: number;
  operandCount: number; // 3 or 4
  operators: ('+' | '-' | '×' | '÷')[];
  expressionTemplate: string; // e.g. "? × ? + ? = 38"
  availableDigits: number[]; // e.g. [2, 4, 6, 7, 9] (unique, no repetition)
  correctDigits: number[]; // in operand order
  fullFormula: string;
  missingPositions: number[]; // indices of operands to fill
}

// 5. Grid Challenge
export interface GridCoordinate {
  row: number;
  col: number;
}

export interface SymmetryTaskData {
  matrix: boolean[][]; // 6x6
  isSymmetric: boolean;
  axis: 'vertical' | 'horizontal';
  divergentPixelCount: number;
}

export interface GridPuzzle extends BaseCognitivePuzzle {
  type: 'grid-challenge';
  gridSize: number; // 3, 4, 5
  sequenceLength: number; // 3 to 8
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
  content: (string | number)[]; // 4 or 6 items
  displayGrid: (string | number)[][];
}

export interface ColorTheGridPuzzle extends BaseCognitivePuzzle {
  type: 'color-the-grid';
  ruleTier: number; // 1 to 4
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
