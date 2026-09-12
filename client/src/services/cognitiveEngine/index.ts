export * from './types';
export * from './deduplicator';
export * from './geoSudoEngine';
export * from './spacioEngine';
export * from './switchEngine';
export * from './digitEngine';
export * from './gridEngine';
export * from './motionEngine';
export * from './colorGridEngine';

import { AnyCognitivePuzzle } from './types';
import { GeoSudoEngine } from './geoSudoEngine';
import { SpacioEngine } from './spacioEngine';
import { SwitchEngine } from './switchEngine';
import { DigitEngine } from './digitEngine';
import { GridEngine } from './gridEngine';
import { MotionEngine } from './motionEngine';
import { ColorGridEngine } from './colorGridEngine';

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
