import { DigitPuzzle } from './types';
import { PuzzleDeduplicator } from './deduplicator';

export class DigitEngine {
  static generate(level: number = 1, sessionId?: string): DigitPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): DigitPuzzle {
    const operandCount = level >= 6 ? 4 : 3;

    let operators: ('+' | '-' | '×' | '÷')[] = [];
    let digits: number[] = [];
    let target = 0;
    let found = false;

    for (let trial = 0; trial < 100 && !found; trial++) {
      if (operandCount === 3) {
        if (level <= 2) {
          operators = Math.random() > 0.5 ? ['+', '-'] : ['-', '+'];
        } else if (level <= 4) {
          operators = Math.random() > 0.5 ? ['×', '+'] : ['×', '-'];
        } else {
          operators = Math.random() > 0.5 ? ['+', '×'] : ['-', '×'];
        }
      } else {
        if (level <= 7) {
          operators = ['×', '+', '-'].sort(() => Math.random() - 0.5) as any;
        } else {
          operators = Math.random() > 0.5 ? ['×', '-', '÷'] : ['×', '+', '÷'];
        }
      }

      const allDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
      const testDigits = allDigits.slice(0, operandCount);

      const divIdx = operators.indexOf('÷');
      if (divIdx !== -1) {
        const dividend = testDigits[divIdx];
        const divisor = testDigits[divIdx + 1];
        if (divisor === 0 || dividend % divisor !== 0) {
          const validMultiples = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(
            n => n % divisor === 0 && n !== divisor && !testDigits.slice(0, divIdx).includes(n)
          );
          if (validMultiples.length === 0) continue;
          testDigits[divIdx] = validMultiples[Math.floor(Math.random() * validMultiples.length)];
        }
      }

      const res = this.evaluateBODMAS(testDigits, operators);
      if (res !== null && res > 0 && res <= (operandCount === 3 ? 80 : 120)) {
        digits = testDigits;
        target = res;
        found = true;
      }
    }

    if (!found) {
      if (operandCount === 3) {
        digits = [6, 7, 4];
        operators = ['×', '-'];
        target = 38;
      } else {
        digits = [8, 5, 6, 2];
        operators = ['×', '+', '÷'];
        target = 43;
      }
    }

    const missingCount = level <= 2 ? 1 : (level <= 5 ? 2 : Math.min(operandCount, 3));
    const indices = Array.from({ length: operandCount }, (_, i) => i);
    const missingPositions = [...indices].sort(() => Math.random() - 0.5).slice(0, missingCount).sort((a, b) => a - b);

    const parts: string[] = [];
    for (let i = 0; i < operandCount; i++) {
      if (missingPositions.includes(i)) {
        parts.push('?');
      } else {
        parts.push(digits[i].toString());
      }
      if (i < operators.length) {
        parts.push(operators[i]);
      }
    }
    const expressionTemplate = `${parts.join(' ')} = ${target}`;

    const fullFormulaParts: string[] = [];
    for (let i = 0; i < operandCount; i++) {
      fullFormulaParts.push(digits[i].toString());
      if (i < operators.length) fullFormulaParts.push(operators[i]);
    }
    const fullFormula = `${fullFormulaParts.join(' ')} = ${target}`;

    const usedSet = new Set(digits);
    const unusedDigits = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(d => !usedSet.has(d)).sort(() => Math.random() - 0.5);
    const distractors = unusedDigits.slice(0, 2);
    const availableDigits = [...digits, ...distractors].sort(() => Math.random() - 0.5);

    const canonicalState = {
      formula: fullFormula,
      missing: missingPositions
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('digit-challenge', level, canonicalState);

    return {
      id: `digit_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'digit-challenge',
      type: 'digit-challenge',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
      timeLimitMs: Math.max(12000, 30000 - level * 1200),
      expectedSolveTimeMs: Math.max(6000, 16000 - level * 800),
      cognitiveLoadFactors: [
        `operands_${operandCount}`,
        `missing_slots_${missingCount}`,
        `bodmas_precedence`
      ],
      target,
      operandCount,
      operators,
      expressionTemplate,
      availableDigits,
      correctDigits: digits,
      fullFormula,
      missingPositions,
      solutionExplanation: `Under standard operator precedence (BODMAS), ${fullFormula} evaluates to ${target}.`
    };
  }

  public static evaluateBODMAS(operands: number[], operators: ('+' | '-' | '×' | '÷')[]): number | null {
    if (operands.length !== operators.length + 1) return null;

    const numList: number[] = [operands[0]];
    const opList: ('+' | '-')[] = [];

    for (let i = 0; i < operators.length; i++) {
      const op = operators[i];
      const nextNum = operands[i + 1];

      if (op === '×') {
        const prev = numList.pop()!;
        numList.push(prev * nextNum);
      } else if (op === '÷') {
        const prev = numList.pop()!;
        if (nextNum === 0 || prev % nextNum !== 0) return null;
        numList.push(prev / nextNum);
      } else {
        numList.push(nextNum);
        opList.push(op);
      }
    }

    let total = numList[0];
    for (let i = 0; i < opList.length; i++) {
      const op = opList[i];
      const val = numList[i + 1];
      if (op === '+') total += val;
      if (op === '-') total -= val;
    }

    return total;
  }
}
