export * from './types.js';
export * from './deduplicator.js';
export * from './geoSudoEngine.js';
export * from './spacioEngine.js';
export * from './switchEngine.js';
export * from './digitEngine.js';
export * from './gridEngine.js';
export * from './motionEngine.js';
export * from './colorGridEngine.js';

import { AnyCognitivePuzzle } from './types.js';
import { GeoSudoEngine } from './geoSudoEngine.js';
import { SpacioEngine } from './spacioEngine.js';
import { SwitchEngine } from './switchEngine.js';
import { DigitEngine } from './digitEngine.js';
import { GridEngine } from './gridEngine.js';
import { MotionEngine } from './motionEngine.js';
import { ColorGridEngine } from './colorGridEngine.js';

/**
 * Universal dispatcher for generating assessment-grade cognitive puzzles.
 */
export function generateAssessmentPuzzle(gameId: string, level: number = 1, sessionId?: string): AnyCognitivePuzzle {
  const normalized = gameId.toLowerCase().replace(/-/g, '');

  switch (normalized) {
    case 'geosudo':
    case 'deductive':
      return GeoSudoEngine.generate(level, sessionId);

    case 'spacio':
    case 'inductivereasoning':
    case 'inductive':
      return SpacioEngine.generate(level, sessionId);

    case 'switch':
    case 'switchchallenge':
      return SwitchEngine.generate(level, sessionId);

    case 'digit':
    case 'digitchallenge':
      return DigitEngine.generate(level, sessionId);

    case 'grid':
    case 'gridchallenge':
      return GridEngine.generate(level, sessionId);

    case 'motion':
    case 'motionchallenge':
      return MotionEngine.generate(level, sessionId);

    case 'colorthegrid':
    case 'colorgrid':
      return ColorGridEngine.generate(level, sessionId);

    default:
      throw new Error(`Unsupported cognitive game ID: '${gameId}'`);
  }
}
