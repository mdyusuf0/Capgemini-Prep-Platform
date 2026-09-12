import { MotionPuzzle } from './types';
import { PuzzleDeduplicator } from './deduplicator';

export class MotionEngine {
  static generate(level: number = 1, sessionId?: string): MotionPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): MotionPuzzle {
    const gridSize = level <= 2 ? 5 : (level <= 6 ? 6 : 7);
    const blockCount = level <= 2 ? 1 : (level <= 4 ? 2 : (level <= 8 ? 3 : 4));
    const minRequiredMoves = Math.min(15, 4 + Math.floor(level * 1.1));

    let bestPuzzle: MotionPuzzle | null = null;
    let maxFoundMoves = -1;

    for (let trial = 0; trial < 40; trial++) {
      const start = { row: 1, col: 1 };
      const target = { row: gridSize - 2, col: gridSize - 2 };

      const walls: { row: number; col: number }[] = [];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (r === 0 || r === gridSize - 1 || c === 0 || c === gridSize - 1) {
            walls.push({ row: r, col: c });
          }
        }
      }

      const interiorWallCount = Math.min(gridSize, 2 + Math.floor(level * 0.5));
      let wallAttempts = 0;
      while (walls.length < (gridSize * 4 - 4) + interiorWallCount && wallAttempts < 40) {
        wallAttempts++;
        const wr = Math.floor(Math.random() * (gridSize - 2)) + 1;
        const wc = Math.floor(Math.random() * (gridSize - 2)) + 1;
        if ((wr === start.row && wc === start.col) || (wr === target.row && wc === target.col)) continue;
        if (!walls.some(w => w.row === wr && w.col === wc)) {
          walls.push({ row: wr, col: wc });
        }
      }

      const blocks: { row: number; col: number }[] = [];
      let blockAttempts = 0;
      while (blocks.length < blockCount && blockAttempts < 40) {
        blockAttempts++;
        const br = Math.floor(Math.random() * (gridSize - 2)) + 1;
        const bc = Math.floor(Math.random() * (gridSize - 2)) + 1;
        if ((br === start.row && bc === start.col) || (br === target.row && bc === target.col)) continue;
        if (walls.some(w => w.row === br && w.col === bc)) continue;
        if (blocks.some(b => b.row === br && b.col === bc)) continue;
        blocks.push({ row: br, col: bc });
      }

      const optMoves = this.solveBFS(gridSize, start, target, walls, blocks);
      if (optMoves >= minRequiredMoves) {
        const canonicalState = {
          size: gridSize,
          walls: walls.map(w => `${w.row},${w.col}`).sort(),
          blocks: blocks.map(b => `${b.row},${b.col}`).sort(),
          opt: optMoves
        };
        const fingerprint = PuzzleDeduplicator.computeFingerprint('motion-challenge', level, canonicalState);

        return {
          id: `motion_${level}_${fingerprint.substring(0, 8)}`,
          fingerprint,
          gameId: 'motion-challenge',
          type: 'motion-challenge',
          level,
          difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
          timeLimitMs: Math.max(20000, 45000 - level * 1500),
          expectedSolveTimeMs: Math.max(10000, 25000 - level * 1000),
          cognitiveLoadFactors: [
            `grid_${gridSize}x${gridSize}`,
            `blocks_${blockCount}`,
            `optimal_moves_${optMoves}`
          ],
          gridSize,
          start,
          target,
          walls,
          blocks,
          optimalMoves: optMoves,
          maxAllowedMoves: optMoves + 4,
          solutionExplanation: `Minimum path requires ${optMoves} optimal moves navigating around ${blockCount} movable blocks and walls.`
        };
      }

      if (optMoves > maxFoundMoves && optMoves >= 4) {
        maxFoundMoves = optMoves;
        const clonedWalls = walls.map(w => ({ ...w }));
        const clonedBlocks = blocks.map(b => ({ ...b }));
        const canonicalState = {
          size: gridSize,
          walls: clonedWalls.map(w => `${w.row},${w.col}`).sort(),
          blocks: clonedBlocks.map(b => `${b.row},${b.col}`).sort(),
          opt: optMoves
        };
        const fingerprint = PuzzleDeduplicator.computeFingerprint('motion-challenge', level, canonicalState);

        bestPuzzle = {
          id: `motion_${level}_${fingerprint.substring(0, 8)}`,
          fingerprint,
          gameId: 'motion-challenge',
          type: 'motion-challenge',
          level,
          difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
          timeLimitMs: 35000,
          expectedSolveTimeMs: 18000,
          cognitiveLoadFactors: [`grid_${gridSize}x${gridSize}`, `optimal_moves_${optMoves}`],
          gridSize,
          start,
          target,
          walls: clonedWalls,
          blocks: clonedBlocks,
          optimalMoves: optMoves,
          maxAllowedMoves: optMoves + 4,
          solutionExplanation: `Optimal shortest path requires ${optMoves} moves.`
        };
      }
    }

    return bestPuzzle || this.getGuaranteedFallback(level);
  }

  public static solveBFS(
    gridSize: number,
    start: { row: number; col: number },
    target: { row: number; col: number },
    walls: { row: number; col: number }[],
    blocks: { row: number; col: number }[]
  ): number {
    const wallSet = new Set(walls.map(w => `${w.row},${w.col}`));

    interface State {
      br: number;
      bc: number;
      blocks: { row: number; col: number }[];
      dist: number;
    }

    const serializeState = (s: State) => {
      const sortedBlocks = s.blocks.map(b => `${b.row},${b.col}`).sort().join('|');
      return `${s.br},${s.bc}#${sortedBlocks}`;
    };

    const initial: State = {
      br: start.row,
      bc: start.col,
      blocks: blocks.map(b => ({ ...b })),
      dist: 0
    };

    const queue: State[] = [initial];
    const visited = new Set<string>();
    visited.add(serializeState(initial));

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.br === target.row && curr.bc === target.col) {
        return curr.dist;
      }

      for (const [dr, dc] of dirs) {
        const nbr = curr.br + dr;
        const nbc = curr.bc + dc;

        if (nbr < 0 || nbr >= gridSize || nbc < 0 || nbc >= gridSize) continue;
        if (wallSet.has(`${nbr},${nbc}`)) continue;

        const blockIdx = curr.blocks.findIndex(b => b.row === nbr && b.col === nbc);
        if (blockIdx !== -1) {
          const nextBlockR = nbr + dr;
          const nextBlockC = nbc + dc;

          if (nextBlockR < 0 || nextBlockR >= gridSize || nextBlockC < 0 || nextBlockC >= gridSize) continue;
          if (wallSet.has(`${nextBlockR},${nextBlockC}`)) continue;
          if (curr.blocks.some(b => b.row === nextBlockR && b.col === nextBlockC)) continue;
          if (nextBlockR === target.row && nextBlockC === target.col) continue;

          const nextBlocks = curr.blocks.map((b, idx) =>
            idx === blockIdx ? { row: nextBlockR, col: nextBlockC } : { ...b }
          );
          const nextState: State = {
            br: nbr,
            bc: nbc,
            blocks: nextBlocks,
            dist: curr.dist + 1
          };
          const key = serializeState(nextState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push(nextState);
          }
        } else {
          const nextState: State = {
            br: nbr,
            bc: nbc,
            blocks: curr.blocks,
            dist: curr.dist + 1
          };
          const key = serializeState(nextState);
          if (!visited.has(key)) {
            visited.add(key);
            queue.push(nextState);
          }
        }
      }
    }

    return -1;
  }

  private static getGuaranteedFallback(level: number): MotionPuzzle {
    const gridSize = 6;
    const start = { row: 1, col: 1 };
    const target = { row: 4, col: 4 };
    const walls: { row: number; col: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (r === 0 || r === gridSize - 1 || c === 0 || c === gridSize - 1) {
          walls.push({ row: r, col: c });
        }
      }
    }
    walls.push({ row: 2, col: 2 }, { row: 3, col: 2 });
    const blocks = [{ row: 2, col: 3 }];
    const optMoves = this.solveBFS(gridSize, start, target, walls, blocks);

    return {
      id: `motion_fallback_${level}`,
      fingerprint: `motion_fb_${level}`,
      gameId: 'motion-challenge',
      type: 'motion-challenge',
      level,
      difficultyRating: 0.5,
      timeLimitMs: 35000,
      expectedSolveTimeMs: 15000,
      cognitiveLoadFactors: ['grid_6x6', `optimal_moves_${optMoves}`],
      gridSize,
      start,
      target,
      walls,
      blocks,
      optimalMoves: optMoves,
      maxAllowedMoves: optMoves + 4,
      solutionExplanation: `Optimal shortest path requires ${optMoves} moves.`
    };
  }
}
