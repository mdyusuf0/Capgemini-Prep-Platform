/**
 * Procedural Cognitive Puzzle Generator for Capgemini Games
 * Delegates to the assessment-grade cognitiveEngine modules.
 */

import {
  generateAssessmentPuzzle,
  GeoSudoEngine,
  SpacioEngine,
  GridEngine,
  MotionEngine,
  SwitchEngine,
  DigitEngine,
  ColorGridEngine,
  GeoSudoPuzzle,
  SpacioPuzzle,
  GridPuzzle,
  MotionPuzzle,
  SwitchPuzzle,
  DigitPuzzle,
  ColorTheGridPuzzle
} from './cognitiveEngine/index.js';

export {
  GeoSudoPuzzle,
  SpacioPuzzle,
  GridPuzzle,
  MotionPuzzle,
  SwitchPuzzle,
  DigitPuzzle,
  ColorTheGridPuzzle
};

export class CognitiveGenerator {
  static generateGeoSudo(level: number = 1): GeoSudoPuzzle {
    return GeoSudoEngine.generate(level);
  }

  static generateSpacio(level: number = 1): SpacioPuzzle {
    return SpacioEngine.generate(level);
  }

  static generateGridChallenge(level: number = 1): GridPuzzle {
    return GridEngine.generate(level);
  }

  static generateMotionChallenge(level: number = 1): MotionPuzzle {
    return MotionEngine.generate(level);
  }

  static generateSwitchChallenge(level: number = 1): SwitchPuzzle {
    return SwitchEngine.generate(level);
  }

  static generateDigitChallenge(level: number = 1): DigitPuzzle {
    return DigitEngine.generate(level);
  }

  static generateColorTheGrid(level: number = 1): ColorTheGridPuzzle {
    return ColorGridEngine.generate(level);
  }

  static generate(gameId: string, level: number = 1) {
    return generateAssessmentPuzzle(gameId, level);
  }
}
