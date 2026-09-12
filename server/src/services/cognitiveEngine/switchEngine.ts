import { SwitchPuzzle, SwitchOperator } from './types.js';
import { PuzzleDeduplicator } from './deduplicator.js';

export class SwitchEngine {
  private static SYMBOLS_4 = ['▲', '■', '●', '★'];
  private static SYMBOLS_5 = ['▲', '■', '●', '★', '♦'];

  static generate(level: number = 1, sessionId?: string): SwitchPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): SwitchPuzzle {
    const symbolCount = level >= 6 ? 5 : 4;
    const symbols = symbolCount === 5 ? [...this.SYMBOLS_5] : [...this.SYMBOLS_4];

    // Layers: 1 layer for levels 1-3 & 6-7; 2 layers for levels 4-5 & 8-10+
    const isTwoLayer = (level >= 4 && level <= 5) || level >= 8;
    const layers = isTwoLayer ? 2 : 1;

    // 1. Generate distinct input sequence
    const inputSequence = [...symbols].sort(() => Math.random() - 0.5);

    // 2. Generate switch 1 (1-based permutation indices, e.g. [3, 1, 4, 2])
    const indices = Array.from({ length: symbolCount }, (_, i) => i + 1);
    const code1 = [...indices].sort(() => Math.random() - 0.5);
    const switch1: SwitchOperator = {
      code: code1,
      codeString: code1.join(' ')
    };

    // Intermediate sequence after switch 1: output[i] = input[code[i] - 1]
    const seqAfter1 = code1.map(pos => inputSequence[pos - 1]);

    let switch2: SwitchOperator | undefined;
    let finalOutput = seqAfter1;
    let targetCode: number[];
    let targetLayer: 1 | 2 = 1;

    if (layers === 2) {
      // Generate switch 2
      const code2 = [...indices].sort(() => Math.random() - 0.5);
      switch2 = {
        code: code2,
        codeString: code2.join(' ')
      };
      finalOutput = code2.map(pos => seqAfter1[pos - 1]);
      targetCode = code2;
      targetLayer = 2; // candidate must deduce the 2nd switch
    } else {
      targetCode = code1;
      targetLayer = 1;
    }

    const correctCodeString = targetCode.join(' ');

    // 3. Generate adversarial near-miss distractors with minimal Hamming distance
    // Invert/swap 2 adjacent or arbitrary indices (Hamming distance 2)
    const distractorCodes: number[][] = [];

    // Swap adjacent pairs to preserve prefix/suffix
    for (let i = 0; i < symbolCount - 1; i++) {
      const swapped = [...targetCode];
      const temp = swapped[i];
      swapped[i] = swapped[i + 1];
      swapped[i + 1] = temp;
      if (swapped.join(' ') !== correctCodeString && !distractorCodes.some(d => d.join(' ') === swapped.join(' '))) {
        distractorCodes.push(swapped);
      }
    }

    // Reverse non-adjacent pairs
    if (distractorCodes.length < 3) {
      const swapped = [...targetCode];
      const temp = swapped[0];
      swapped[0] = swapped[symbolCount - 1];
      swapped[symbolCount - 1] = temp;
      if (swapped.join(' ') !== correctCodeString && !distractorCodes.some(d => d.join(' ') === swapped.join(' '))) {
        distractorCodes.push(swapped);
      }
    }

    // Cyclically shifted variant
    if (distractorCodes.length < 3) {
      const shifted = [...targetCode.slice(1), targetCode[0]];
      if (shifted.join(' ') !== correctCodeString && !distractorCodes.some(d => d.join(' ') === shifted.join(' '))) {
        distractorCodes.push(shifted);
      }
    }

    // Ensure we have at least 3 distinct distractors
    while (distractorCodes.length < 3) {
      const rand = [...indices].sort(() => Math.random() - 0.5);
      if (rand.join(' ') !== correctCodeString && !distractorCodes.some(d => d.join(' ') === rand.join(' '))) {
        distractorCodes.push(rand);
      }
    }

    const chosenDistractors = distractorCodes.slice(0, 3).map(d => d.join(' '));
    const allOptions = [correctCodeString, ...chosenDistractors].sort(() => Math.random() - 0.5);
    const correctAnswerIndex = allOptions.indexOf(correctCodeString);

    // Canonical fingerprint
    const canonicalState = {
      input: inputSequence.join(''),
      output: finalOutput.join(''),
      layers,
      code: correctCodeString
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('switch-challenge', level, canonicalState);

    let explanation = `The correct permutation is ${correctCodeString}. `;
    if (layers === 2) {
      explanation += `Switch 1 rearranged the input to [${seqAfter1.join(' ')}]. Switch 2 then transposed positions according to ${correctCodeString} to reach [${finalOutput.join(' ')}].`;
    } else {
      explanation += `Positions [${correctCodeString}] map input elements to the output sequence.`;
    }

    return {
      id: `switch_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'switch-challenge',
      type: 'switch-challenge',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
      timeLimitMs: Math.max(12000, 30000 - level * 1200),
      expectedSolveTimeMs: Math.max(6000, 16000 - level * 800),
      cognitiveLoadFactors: [
        `symbols_${symbolCount}`,
        `layers_${layers}`,
        `hamming_dist_2_distractors`
      ],
      symbolCount,
      symbols,
      inputSequence,
      layers,
      switch1,
      switch2,
      intermediateSequence: isTwoLayer ? seqAfter1 : undefined,
      outputSequence: finalOutput,
      targetLayer,
      options: allOptions,
      correctAnswerIndex,
      solutionExplanation: explanation
    };
  }
}
