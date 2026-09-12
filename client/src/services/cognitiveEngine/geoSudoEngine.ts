import { GeoSudoPuzzle } from './types';
import { PuzzleDeduplicator } from './deduplicator';

export class GeoSudoEngine {
  private static SYMBOLS_4 = ['▲', '■', '●', '★'];
  private static SYMBOLS_5 = ['▲', '■', '●', '★', '♦'];

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

    const fullGrid = this.createRandomLatinSquare(size, symbols);

    const targetRow = Math.floor(Math.random() * size);
    const targetCol = Math.floor(Math.random() * size);
    const correctSymbol = fullGrid[targetRow][targetCol];

    let targetBlanks: number;
    if (size === 4) {
      targetBlanks = level <= 2 ? 3 + (level % 2) : 5 + Math.min(2, level - 3);
    } else {
      targetBlanks = Math.min(size * size - 8, 7 + Math.floor((level - 5) * 1.5));
    }

    const puzzleGrid: (string | null)[][] = fullGrid.map(row => [...row]);
    puzzleGrid[targetRow][targetCol] = null;

    const positions: { r: number; c: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (r !== targetRow || c !== targetCol) {
          positions.push({ r, c });
        }
      }
    }
    positions.sort(() => Math.random() - 0.5);

    let blanksCount = 1;
    for (const pos of positions) {
      if (blanksCount >= targetBlanks) break;

      const saved = puzzleGrid[pos.r][pos.c];
      puzzleGrid[pos.r][pos.c] = null;

      const validSymbols = this.getValidSymbolsForTarget(puzzleGrid, size, symbols, targetRow, targetCol);
      if (validSymbols.length === 1 && validSymbols[0] === correctSymbol) {
        blanksCount++;
      } else {
        puzzleGrid[pos.r][pos.c] = saved;
      }
    }

    const computedDepth = this.computeDeductiveDepth(puzzleGrid, size, targetRow, targetCol, symbols);

    const canonicalState = {
      size,
      grid: puzzleGrid.map(row => row.map(v => v ? symbols.indexOf(v) : -1)),
      target: [targetRow, targetCol],
      ans: symbols.indexOf(correctSymbol)
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('geo-sudo', level, canonicalState);

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

  private static createRandomLatinSquare(size: number, symbols: string[]): string[][] {
    const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        grid[r][c] = symbols[(r + c) % size];
      }
    }

    for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * size);
      const temp = grid[i];
      grid[i] = grid[j];
      grid[j] = temp;
    }

    for (let c1 = 0; c1 < size; c1++) {
      const c2 = Math.floor(Math.random() * size);
      for (let r = 0; r < size; r++) {
        const temp = grid[r][c1];
        grid[r][c1] = grid[r][c2];
        grid[r][c2] = temp;
      }
    }

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

  public static getValidSymbolsForTarget(
    grid: (string | null)[][],
    size: number,
    symbols: string[],
    targetRow: number,
    targetCol: number
  ): string[] {
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

  private static canCompleteLatinSquare(
    grid: (string | null)[][],
    size: number,
    symbols: string[]
  ): boolean {
    let emptyR = -1;
    let emptyC = -1;

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

    if (emptyR === -1) return true;

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

    if (emptyInRow === 1 || emptyInCol === 1) return 1;

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
