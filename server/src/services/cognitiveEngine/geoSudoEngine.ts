import { GeoSudoPuzzle } from './types.js';
import { PuzzleDeduplicator } from './deduplicator.js';

export class GeoSudoEngine {
  private static SYMBOLS_4 = ['▲', '■', '●', '★'];
  private static SYMBOLS_5 = ['▲', '■', '●', '★', '♦'];

  /**
   * Generates a fully verified assessment-grade Geo-Sudo puzzle.
   */
  static generate(level: number = 1, sessionId?: string): GeoSudoPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): GeoSudoPuzzle {
    const size = level >= 5 ? 5 : 4;
    const symbols = size === 5 ? [...this.SYMBOLS_5] : [...this.SYMBOLS_4];

    // 1. Generate a valid randomized full Latin Square
    const fullGrid = this.createRandomLatinSquare(size, symbols);

    // 2. Select target cell
    const targetRow = Math.floor(Math.random() * size);
    const targetCol = Math.floor(Math.random() * size);
    const correctSymbol = fullGrid[targetRow][targetCol];

    // 3. Determine blanking density and required deductive depth
    // Level 1-2: 3-4 blanks (depth 1)
    // Level 3-4: 5-7 blanks (depth 2)
    // Level 5-6: 7-9 blanks (5x5, depth 2)
    // Level 7-8: 10-12 blanks (5x5, depth 2-3)
    // Level 9+: 13-15 blanks (5x5, depth 3)
    let targetBlanks: number;
    let requiredDepth: number;

    if (size === 4) {
      targetBlanks = level <= 2 ? 3 + (level % 2) : 5 + Math.min(2, level - 3);
      requiredDepth = level <= 2 ? 1 : 2;
    } else {
      targetBlanks = Math.min(size * size - 8, 7 + Math.floor((level - 5) * 1.5));
      requiredDepth = level <= 6 ? 2 : 3;
    }

    // 4. Blank cells strategically while maintaining unique solvability
    const puzzleGrid: (string | null)[][] = fullGrid.map(row => [...row]);
    puzzleGrid[targetRow][targetCol] = null;

    // Collect all candidate cell positions to blank (excluding target)
    const positions: { r: number; c: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r !== targetRow || c !== targetCol) {
          positions.push({ r, c });
        }
      }
    }
    // Shuffle positions
    positions.sort(() => Math.random() - 0.5);

    let blanksCount = 1; // target cell already blanked
    for (const pos of positions) {
      if (blanksCount >= targetBlanks) break;

      const saved = puzzleGrid[pos.r][pos.c];
      puzzleGrid[pos.r][pos.c] = null;

      // Check if target cell remains uniquely solvable
      const validSymbols = this.getValidSymbolsForTarget(puzzleGrid, size, symbols, targetRow, targetCol);
      if (validSymbols.length === 1 && validSymbols[0] === correctSymbol) {
        blanksCount++;
      } else {
        // Revert blanking to maintain uniqueness
        puzzleGrid[pos.r][pos.c] = saved;
      }
    }

    // 5. Compute actual deductive depth of the target cell
    const computedDepth = this.computeDeductiveDepth(puzzleGrid, size, targetRow, targetCol, symbols);

    // 6. Generate canonical fingerprint
    const canonicalState = {
      size,
      grid: puzzleGrid.map(row => row.map(v => v ? symbols.indexOf(v) : -1)),
      target: [targetRow, targetCol],
      ans: symbols.indexOf(correctSymbol)
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('geo-sudo', level, canonicalState);

    // Shuffled options
    const options = [...symbols].sort(() => Math.random() - 0.5);

    return {
      id: `geosudo_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'geo-sudo',
      type: 'geo-sudo',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
      timeLimitMs: Math.max(15000, 35000 - level * 1500),
      expectedSolveTimeMs: Math.max(8000, 20000 - level * 1000),
      cognitiveLoadFactors: [
        `latin_square_${size}x${size}`,
        `deductive_depth_${computedDepth}`,
        `missing_clues_${blanksCount}`
      ],
      size,
      symbols,
      grid: puzzleGrid,
      targetCell: { row: targetRow, col: targetCol },
      solution: correctSymbol,
      options,
      deductiveDepth: computedDepth,
      solutionExplanation: `At row ${targetRow + 1}, column ${targetCol + 1}, only '${correctSymbol}' satisfies the Latin square constraint (unique symbol per row and column). Deductive depth: ${computedDepth}.`
    };
  }

  /**
   * Generates a randomized full Latin Square of size N.
   */
  private static createRandomLatinSquare(size: number, symbols: string[]): string[][] {
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));

    // Base cyclic Latin square
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = symbols[(r + c) % size];
      }
    }

    // Permute rows
    for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * size);
      const temp = grid[i];
      grid[i] = grid[j];
      grid[j] = temp;
    }

    // Permute columns
    for (let c1 = 0; c1 < size; c1++) {
      const c2 = Math.floor(Math.random() * size);
      for (let r = 0; r < size; r++) {
        const temp = grid[r][c1];
        grid[r][c1] = grid[r][c2];
        grid[r][c2] = temp;
      }
    }

    // Symbol permutation
    const symMap = new Map<string, string>();
    const shuffledSyms = [...symbols].sort(() => Math.random() - 0.5);
    symbols.forEach((s, idx) => symMap.set(s, shuffledSyms[idx]));

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = symMap.get(grid[r][c])!;
      }
    }

    return grid;
  }

  /**
   * Determines which symbols are mathematically admissible at (targetRow, targetCol)
   * that can lead to at least one valid full Latin Square completion.
   */
  public static getValidSymbolsForTarget(
    grid: (string | null)[][],
    size: number,
    symbols: string[],
    targetRow: number,
    targetCol: number
  ): string[] {
    // 1. Direct row and column exclusion
    const usedInRow = new Set<string>();
    const usedInCol = new Set<string>();

    for (let c = 0; c < size; c++) {
      const val = grid[targetRow][c];
      if (val) usedInRow.add(val);
    }
    for (let r = 0; r < size; r++) {
      const val = grid[r][targetCol];
      if (val) usedInCol.add(val);
    }

    const directCandidates = symbols.filter(s => !usedInRow.has(s) && !usedInCol.has(s));
    if (directCandidates.length <= 1) {
      return directCandidates;
    }

    // 2. Deep verification: For each candidate, verify whether the rest of the grid is completable
    const validSymbols: string[] = [];
    for (const cand of directCandidates) {
      const testGrid = grid.map(row => [...row]);
      testGrid[targetRow][targetCol] = cand;
      if (this.canCompleteLatinSquare(testGrid, size, symbols)) {
        validSymbols.push(cand);
      }
    }

    return validSymbols;
  }

  /**
   * Backtracking solver to check if grid has at least one valid Latin Square completion.
   */
  private static canCompleteLatinSquare(
    grid: (string | null)[][],
    size: number,
    symbols: string[]
  ): boolean {
    let emptyR = -1;
    let emptyC = -1;

    // Find first empty cell
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === null) {
          emptyR = r;
          emptyC = c;
          break;
        }
      }
      if (emptyR !== -1) break;
    }

    // If no empty cells, valid completion found
    if (emptyR === -1) return true;

    // Find valid choices for this empty cell
    const used = new Set<string>();
    for (let c = 0; c < size; c++) if (grid[emptyR][c]) used.add(grid[emptyR][c]!);
    for (let r = 0; r < size; r++) if (grid[r][emptyC]) used.add(grid[r][emptyC]!);

    for (const sym of symbols) {
      if (!used.has(sym)) {
        grid[emptyR][emptyC] = sym;
        if (this.canCompleteLatinSquare(grid, size, symbols)) {
          grid[emptyR][emptyC] = null;
          return true;
        }
        grid[emptyR][emptyC] = null;
      }
    }

    return false;
  }

  /**
   * Computes deductive depth:
   * 1 = Directly solved by looking at target row or target col
   * 2 = Solved after eliminating at least one intersecting cell
   * 3 = Requires cross-elimination
   */
  private static computeDeductiveDepth(
    grid: (string | null)[][],
    size: number,
    targetRow: number,
    targetCol: number,
    symbols: string[]
  ): number {
    let emptyInRow = 0;
    let emptyInCol = 0;
    for (let c = 0; c < size; c++) if (grid[targetRow][c] === null) emptyInRow++;
    for (let r = 0; r < size; r++) if (grid[r][targetCol] === null) emptyInCol++;

    // If target is the only empty cell in row or col, depth is 1
    if (emptyInRow === 1 || emptyInCol === 1) return 1;

    // Check if any empty cell in target row/col has depth 1
    for (let c = 0; c < size; c++) {
      if (c !== targetCol && grid[targetRow][c] === null) {
        let colBlanks = 0;
        for (let r = 0; r < size; r++) if (grid[r][c] === null) colBlanks++;
        if (colBlanks === 1) return 2;
      }
    }
    for (let r = 0; r < size; r++) {
      if (r !== targetRow && grid[r][targetCol] === null) {
        let rowBlanks = 0;
        for (let c = 0; c < size; c++) if (grid[r][c] === null) rowBlanks++;
        if (rowBlanks === 1) return 2;
      }
    }

    return 3;
  }
}
