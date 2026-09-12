import { GridPuzzle, GridCoordinate, SymmetryTaskData } from './types';
import { PuzzleDeduplicator } from './deduplicator';

export class GridEngine {
  static generate(level: number = 1, sessionId?: string): GridPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): GridPuzzle {
    let gridSize: number;
    let sequenceLength: number;
    let flashDurationMs: number;

    if (level <= 2) {
      gridSize = 3;
      sequenceLength = 3;
      flashDurationMs = 1200;
    } else if (level <= 4) {
      gridSize = 4;
      sequenceLength = 4;
      flashDurationMs = 1000;
    } else if (level <= 6) {
      gridSize = 4;
      sequenceLength = 5;
      flashDurationMs = 900;
    } else if (level <= 8) {
      gridSize = 5;
      sequenceLength = 6;
      flashDurationMs = 800;
    } else {
      gridSize = 5;
      sequenceLength = Math.min(8, 7 + (level - 9));
      flashDurationMs = 700;
    }

    const totalCells = gridSize * gridSize;
    const availableIndices = Array.from({ length: totalCells }, (_, i) => i).sort(() => Math.random() - 0.5);
    const chosenIndices = availableIndices.slice(0, sequenceLength);

    const sequence: GridCoordinate[] = chosenIndices.map(idx => ({
      row: Math.floor(idx / gridSize),
      col: idx % gridSize
    }));

    const symmetryTasks: SymmetryTaskData[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      symmetryTasks.push(this.generateSymmetryTask(level));
    }

    const canonicalState = {
      gridSize,
      seq: sequence.map(s => `${s.row},${s.col}`).join(';')
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('grid-challenge', level, canonicalState);

    return {
      id: `grid_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'grid-challenge',
      type: 'grid-challenge',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
      timeLimitMs: 45000,
      expectedSolveTimeMs: sequenceLength * (flashDurationMs + 2000) + 5000,
      cognitiveLoadFactors: [
        `grid_size_${gridSize}x${gridSize}`,
        `span_${sequenceLength}`,
        `dual_task_interference`
      ],
      gridSize,
      sequenceLength,
      sequence,
      flashDurationMs,
      symmetryTasks,
      solutionExplanation: `Target sequence recalled across ${sequenceLength} positions on a ${gridSize}x${gridSize} grid with ${sequenceLength} interleaved symmetry verification tasks.`
    };
  }

  public static generateSymmetryTask(level: number): SymmetryTaskData {
    const matrixSize = 6;
    const isSymmetric = Math.random() > 0.5;
    const axis: 'vertical' | 'horizontal' = Math.random() > 0.5 ? 'vertical' : 'horizontal';

    const matrix: boolean[][] = Array.from({ length: matrixSize }, () => Array(matrixSize).fill(false));

    if (axis === 'vertical') {
      for (let r = 0; r < matrixSize; r++) {
        for (let c = 0; c < 3; c++) {
          const filled = Math.random() > 0.5;
          matrix[r][c] = filled;
          matrix[r][matrixSize - 1 - c] = filled;
        }
      }

      let divergentPixelCount = 0;
      if (!isSymmetric) {
        const flips = level >= 5 ? 1 : (Math.random() > 0.5 ? 1 : 2);
        divergentPixelCount = flips;
        for (let f = 0; f < flips; f++) {
          const flipR = Math.floor(Math.random() * matrixSize);
          const flipC = matrixSize - 1 - Math.floor(Math.random() * 3);
          matrix[flipR][flipC] = !matrix[flipR][flipC];
        }
      }

      return { matrix, isSymmetric, axis, divergentPixelCount };
    } else {
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < matrixSize; c++) {
          const filled = Math.random() > 0.5;
          matrix[r][c] = filled;
          matrix[matrixSize - 1 - r][c] = filled;
        }
      }

      let divergentPixelCount = 0;
      if (!isSymmetric) {
        const flips = level >= 5 ? 1 : (Math.random() > 0.5 ? 1 : 2);
        divergentPixelCount = flips;
        for (let f = 0; f < flips; f++) {
          const flipR = matrixSize - 1 - Math.floor(Math.random() * 3);
          const flipC = Math.floor(Math.random() * matrixSize);
          matrix[flipR][flipC] = !matrix[flipR][flipC];
        }
      }

      return { matrix, isSymmetric, axis, divergentPixelCount };
    }
  }
}
