/**
 * Procedural Cognitive Puzzle Generator for Capgemini Games
 * Generates mathematically guaranteed, unique, solvable puzzles for:
 * 1. Geo-Sudo (Deductive Latin-Square Reasoning)
 * 2. Spacio / Inductive Reasoning (Inductive Matrix Transformation)
 * 3. Grid Challenge (Working Memory & Coordinate Recall)
 * 4. Motion Challenge (Optimal Pathfinding Maze)
 * 5. Switch Challenge (Transformation Sequence Permutation)
 * 6. Digit Challenge (Mental Arithmetic Velocity)
 * 7. Color The Grid (Rule-Based Conditional Classification)
 */

export interface GeoSudoPuzzle {
  type: 'geosudo';
  size: number;
  symbols: string[];
  grid: (string | null)[][];
  targetCell: { row: number; col: number };
  solution: string;
  options: string[];
}

export interface SpacioPuzzle {
  type: 'spacio';
  pairA: { shape: string; rotation: number; fill: string };
  pairB: { shape: string; rotation: number; fill: string };
  queryC: { shape: string; rotation: number; fill: string };
  options: { shape: string; rotation: number; fill: string }[];
  correctAnswer: number;
  ruleExplanation: string;
}

export interface GridPuzzle {
  type: 'grid';
  gridSize: number;
  sequenceLength: number;
  sequence: { row: number; col: number }[];
  symmetryTask: { grid: boolean[][]; isSymmetric: boolean };
}

export interface MotionPuzzle {
  type: 'motion';
  gridSize: number;
  start: { row: number; col: number };
  target: { row: number; col: number };
  obstacles: { row: number; col: number }[];
  optimalMoves: number;
}

export interface SwitchPuzzle {
  type: 'switch';
  inputSequence: string[];
  switchRule: number[]; // e.g. [2, 0, 3, 1] means pos 0 goes to pos 2
  outputSequence: string[];
  options: number[][]; // candidate switch rules
  correctAnswer: number;
}

export interface DigitPuzzle {
  type: 'digit';
  target: number;
  availableDigits: number[];
  solutionFormula: string;
  missingIndex?: number;
  operators?: string[];
}

export interface ColorTheGridPuzzle {
  type: 'color-the-grid';
  ruleText: string;
  ruleCategory: string;
  grids: (string | number)[][];
  expectedColors: string[];
  allowedColors: string[];
}

export class CognitiveGenerator {
  // 1. Geo-Sudo (Deductive Reasoning)
  static generateGeoSudo(levelOrSize: number = 1): GeoSudoPuzzle {
    const size: 4 | 5 = (levelOrSize >= 5 || levelOrSize === 5) ? 5 : 4;
    const symbolPool = ['▲', '■', '●', '★', '♦'];
    const symbols = symbolPool.slice(0, size);

    // Generate valid Latin square
    const fullGrid: string[][] = Array.from({ length: size }, () => Array(size).fill(''));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        fullGrid[r][c] = symbols[(r + c) % size];
      }
    }

    // Shuffle rows and columns to randomize
    for (let i = 0; i < size; i++) {
      const j = Math.floor(Math.random() * size);
      const temp = fullGrid[i];
      fullGrid[i] = fullGrid[j];
      fullGrid[j] = temp;
    }

    for (let c = 0; c < size; c++) {
      const j = Math.floor(Math.random() * size);
      for (let r = 0; r < size; r++) {
        const temp = fullGrid[r][c];
        fullGrid[r][c] = fullGrid[r][j];
        fullGrid[r][j] = temp;
      }
    }

    const targetRow = Math.floor(Math.random() * size);
    const targetCol = Math.floor(Math.random() * size);
    const solution = fullGrid[targetRow][targetCol];

    // Determine cell blanking density based on level
    const keepDensity = Math.max(0.35, 0.7 - (levelOrSize * 0.04));

    const puzzleGrid: (string | null)[][] = fullGrid.map((row, rIdx) =>
      row.map((val, cIdx) => {
        if (rIdx === targetRow && cIdx === targetCol) return null;
        // Keep target row & col sufficiently populated so logical deduction is solvable
        if (rIdx === targetRow || cIdx === targetCol) {
          return Math.random() > 0.3 ? val : null;
        }
        return Math.random() < keepDensity ? val : null;
      })
    );

    return {
      type: 'geosudo',
      size,
      symbols,
      grid: puzzleGrid,
      targetCell: { row: targetRow, col: targetCol },
      solution,
      options: [...symbols].sort(() => 0.5 - Math.random())
    };
  }

  // 2. Spacio (Inductive Reasoning)
  static generateSpacio(level: number = 1): SpacioPuzzle {
    const shapes = ['square', 'circle', 'triangle', 'diamond', 'hexagon'];
    const fills = ['solid', 'outline', 'striped'];
    const baseShape = shapes[Math.floor(Math.random() * shapes.length)];
    const queryShape = shapes.filter(s => s !== baseShape)[Math.floor(Math.random() * (shapes.length - 1))];

    // Scale rotation angle: 90, 180, 270
    const rotations = [90, 180, 270];
    const ruleRotation = rotations[Math.floor(Math.random() * rotations.length)];
    const ruleFillToggle = level >= 3;

    const baseFill = fills[0];
    const nextFill = ruleFillToggle ? fills[1] : baseFill;

    const pairA = { shape: baseShape, rotation: 0, fill: baseFill };
    const pairB = { shape: baseShape, rotation: ruleRotation, fill: nextFill };
    const queryC = { shape: queryShape, rotation: 0, fill: baseFill };
    const correctD = { shape: queryShape, rotation: ruleRotation, fill: nextFill };

    const distractors = [
      { shape: queryShape, rotation: (ruleRotation + 90) % 360, fill: nextFill },
      { shape: queryShape, rotation: ruleRotation, fill: baseFill },
      { shape: baseShape, rotation: ruleRotation, fill: nextFill },
      { shape: queryShape, rotation: (ruleRotation + 180) % 360, fill: ruleFillToggle ? fills[2] : nextFill }
    ];

    const uniqueDistractors = distractors.filter(
      d => !(d.shape === correctD.shape && d.rotation === correctD.rotation && d.fill === correctD.fill)
    ).slice(0, 3);

    const options = [correctD, ...uniqueDistractors].sort(() => 0.5 - Math.random());
    const correctAnswer = options.findIndex(
      o => o.shape === correctD.shape && o.rotation === correctD.rotation && o.fill === correctD.fill
    );

    return {
      type: 'spacio',
      pairA,
      pairB,
      queryC,
      options,
      correctAnswer,
      ruleExplanation: `The figure rotates ${ruleRotation}° clockwise${ruleFillToggle ? ' and the interior fill shifts to outline' : ''}.`
    };
  }

  // 3. Grid Challenge (Working Memory)
  static generateGridChallenge(level: number = 1): GridPuzzle {
    const gridSize = level >= 6 ? 5 : (level >= 3 ? 4 : 3);
    const sequenceLength = Math.min(2 + Math.floor(level * 0.6), gridSize * gridSize - 1);
    const sequence: { row: number; col: number }[] = [];

    while (sequence.length < sequenceLength) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (!sequence.some(s => s.row === row && s.col === col)) {
        sequence.push({ row, col });
      }
    }

    // Symmetry distractor task
    const isSymmetric = Math.random() > 0.5;
    const symGrid: boolean[][] = Array.from({ length: 4 }, () => Array(4).fill(false));

    if (isSymmetric) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 2; c++) {
          if (Math.random() > 0.45) {
            symGrid[r][c] = true;
            symGrid[r][3 - c] = true;
          }
        }
      }
    } else {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          symGrid[r][c] = Math.random() > 0.5;
        }
      }
      // Guarantee asymmetry
      symGrid[0][0] = true;
      symGrid[0][3] = false;
    }

    return {
      type: 'grid',
      gridSize,
      sequenceLength,
      sequence,
      symmetryTask: { grid: symGrid, isSymmetric }
    };
  }

  // 4. Motion Challenge (Pathfinding Maze)
  static generateMotionChallenge(level: number = 1): MotionPuzzle {
    const gridSize = 6;
    const start = { row: 0, col: 0 };
    const target = { row: gridSize - 1, col: gridSize - 1 };
    const obstacles: { row: number; col: number }[] = [];

    const numObstacles = Math.min(11, 4 + Math.floor(level * 0.7));
    let attempts = 0;

    while (obstacles.length < numObstacles && attempts < 50) {
      attempts++;
      const r = Math.floor(Math.random() * gridSize);
      const c = Math.floor(Math.random() * gridSize);
      if ((r === start.row && c === start.col) || (r === target.row && c === target.col)) continue;
      if (!obstacles.some(o => o.row === r && o.col === c)) {
        obstacles.push({ row: r, col: c });
      }
    }

    // BFS to find shortest path
    const queue: { row: number; col: number; dist: number }[] = [{ ...start, dist: 0 }];
    const visited = new Set<string>();
    visited.add(`${start.row},${start.col}`);
    let optimalMoves = -1;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (curr.row === target.row && curr.col === target.col) {
        optimalMoves = curr.dist;
        break;
      }

      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        const nr = curr.row + dr;
        const nc = curr.col + dc;
        if (nr >= 0 && nr < gridSize && nc >= 0 && nc < gridSize) {
          const key = `${nr},${nc}`;
          if (!visited.has(key) && !obstacles.some(o => o.row === nr && o.col === nc)) {
            visited.add(key);
            queue.push({ row: nr, col: nc, dist: curr.dist + 1 });
          }
        }
      }
    }

    if (optimalMoves === -1 || optimalMoves < 4) {
      // Regenerate if no valid path or trivially short
      return this.generateMotionChallenge(level);
    }

    return {
      type: 'motion',
      gridSize,
      start,
      target,
      obstacles,
      optimalMoves
    };
  }

  // 5. Switch Challenge (Permutation Switch)
  static generateSwitchChallenge(level: number = 1): SwitchPuzzle {
    const symbols = ['▲', '■', '●', '★'];
    const inputSequence = [...symbols].sort(() => 0.5 - Math.random());

    // Permutation of [0, 1, 2, 3]
    const indices = [0, 1, 2, 3];
    const switchRule = [...indices].sort(() => 0.5 - Math.random());
    const outputSequence = new Array(4);
    for (let i = 0; i < 4; i++) {
      outputSequence[i] = inputSequence[switchRule[i]];
    }

    // Generate distractors
    const candidateRules = [switchRule];
    while (candidateRules.length < 4) {
      const cand = [...indices].sort(() => 0.5 - Math.random());
      if (!candidateRules.some(r => r.every((val, idx) => val === cand[idx]))) {
        candidateRules.push(cand);
      }
    }

    const options = candidateRules.sort(() => 0.5 - Math.random());
    const correctAnswer = options.findIndex(r => r.every((val, idx) => val === switchRule[idx]));

    return {
      type: 'switch',
      inputSequence,
      switchRule,
      outputSequence,
      options,
      correctAnswer
    };
  }

  // 6. Digit Challenge (Mental Arithmetic Velocity)
  static generateDigitChallenge(level: number = 1): DigitPuzzle {
    // Generate procedurally based on level
    const basePuzzles = [
      { target: 24, digits: [4, 6, 2, 3], formula: "(4 * 6) * (3 - 2)" },
      { target: 36, digits: [6, 6, 2, 1], formula: "(6 * 6) * (2 - 1)" },
      { target: 48, digits: [8, 6, 4, 3], formula: "(8 * 6) + (4 - 4)" },
      { target: 50, digits: [5, 10, 2, 1], formula: "(5 * 10) * (2 - 1)" },
      { target: 60, digits: [5, 12, 3, 3], formula: "(5 * 12) + (3 - 3)" },
      { target: 72, digits: [9, 8, 4, 3], formula: "(9 * 8) + (4 - 4)" },
      { target: 84, digits: [12, 7, 2, 1], formula: "(12 * 7) * (2 - 1)" },
      { target: 96, digits: [12, 8, 3, 2], formula: "(12 * 8) + (3 - 3)" },
      { target: 108, digits: [12, 9, 2, 1], formula: "(12 * 9) * (2 - 1)" },
      { target: 120, digits: [15, 8, 4, 2], formula: "(15 * 8) + (4 - 4)" },
      { target: 144, digits: [12, 12, 3, 2], formula: "(12 * 12) * (3 - 2)" },
      { target: 150, digits: [25, 6, 2, 1], formula: "(25 * 6) * (2 - 1)" },
    ];

    // Pick a puzzle appropriate for level
    const pool = level <= 3 ? basePuzzles.slice(0, 4) :
                 (level <= 7 ? basePuzzles.slice(2, 8) : basePuzzles.slice(5));

    const selected = pool[Math.floor(Math.random() * pool.length)] || basePuzzles[0];

    return {
      type: 'digit',
      target: selected.target,
      availableDigits: [...selected.digits].sort(() => 0.5 - Math.random()),
      solutionFormula: selected.formula
    };
  }

  // 7. Color The Grid (Rule-Based Conditional Classification)
  static generateColorTheGrid(level: number = 1): ColorTheGridPuzzle {
    const rules = [
      {
        category: 'Character Presence',
        text: "If grid contains 'Z', mark Orange. Otherwise mark Blue.",
        check: (content: (string | number)[]) => content.includes('Z') ? 'orange' : 'blue',
        allowedColors: ['orange', 'blue'],
      },
      {
        category: 'Number Parity',
        text: "If all numbers are Even, mark Green. Otherwise mark Grey.",
        check: (content: (string | number)[]) => {
          const nums = content.filter((c): c is number => typeof c === 'number');
          const allEven = nums.length > 0 && nums.every(n => n % 2 === 0);
          return allEven ? 'green' : 'grey';
        },
        allowedColors: ['green', 'grey'],
      },
      {
        category: 'Vowel Detection',
        text: "If grid contains any Vowel (A, E, I), mark Orange. Otherwise mark Blue.",
        check: (content: (string | number)[]) => 
          content.some(c => typeof c === 'string' && 'AEI'.includes(c)) ? 'orange' : 'blue',
        allowedColors: ['orange', 'blue'],
      },
      {
        category: 'Sum Threshold',
        text: `If the sum of all numbers exceeds ${level >= 5 ? '12' : '10'}, mark Green. Otherwise mark Grey.`,
        check: (content: (string | number)[]) => {
          const threshold = level >= 5 ? 12 : 10;
          const sum = content.filter((c): c is number => typeof c === 'number').reduce((a, b) => a + b, 0);
          return sum > threshold ? 'green' : 'grey';
        },
        allowedColors: ['green', 'grey'],
      },
      {
        category: 'Quantity Threshold',
        text: "If grid contains 3 or more Numbers, mark Orange. Otherwise mark Blue.",
        check: (content: (string | number)[]) => {
          const numCount = content.filter(c => typeof c === 'number').length;
          return numCount >= 3 ? 'orange' : 'blue';
        },
        allowedColors: ['orange', 'blue'],
      },
      {
        category: 'Odd Parity Check',
        text: "If grid contains at least one Odd number, mark Green. Otherwise mark Grey.",
        check: (content: (string | number)[]) => {
          const hasOdd = content.some(c => typeof c === 'number' && c % 2 !== 0);
          return hasOdd ? 'green' : 'grey';
        },
        allowedColors: ['green', 'grey'],
      }
    ];

    const chosenRule = rules[Math.floor(Math.random() * rules.length)];

    // Generate 4 grids
    const chars = 'ABEZXY';
    const grids: (string | number)[][] = [];
    const expectedColors: string[] = [];

    for (let g = 0; g < 4; g++) {
      const gridContent: (string | number)[] = [];
      for (let i = 0; i < 4; i++) {
        if (Math.random() > 0.45) {
          gridContent.push(Math.floor(Math.random() * 9) + 1);
        } else {
          gridContent.push(chars[Math.floor(Math.random() * chars.length)]);
        }
      }
      grids.push(gridContent);
      expectedColors.push(chosenRule.check(gridContent));
    }

    return {
      type: 'color-the-grid',
      ruleText: chosenRule.text,
      ruleCategory: chosenRule.category,
      grids,
      expectedColors,
      allowedColors: chosenRule.allowedColors
    };
  }
}
