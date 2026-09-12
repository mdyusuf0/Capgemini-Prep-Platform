import { ColorTheGridPuzzle, GridCardContent } from './types';
import { PuzzleDeduplicator } from './deduplicator';

interface ColorRuleDef {
  tier: number;
  category: string;
  description: string;
  allowedColors: { id: string; name: string; bgClass: string; textClass: string }[];
  evaluate: (content: (string | number)[]) => string;
}

export class ColorGridEngine {
  private static COLOR_PALETTE = {
    orange: { id: 'orange', name: 'Orange', bgClass: 'bg-amber-500', textClass: 'text-amber-600' },
    blue: { id: 'blue', name: 'Blue', bgClass: 'bg-blue-600', textClass: 'text-blue-600' },
    green: { id: 'green', name: 'Green', bgClass: 'bg-emerald-500', textClass: 'text-emerald-600' },
    grey: { id: 'grey', name: 'Grey', bgClass: 'bg-slate-500', textClass: 'text-slate-600' },
    purple: { id: 'purple', name: 'Purple', bgClass: 'bg-purple-600', textClass: 'text-purple-600' }
  };

  static generate(level: number = 1, sessionId?: string): ColorTheGridPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): ColorTheGridPuzzle {
    const tier = level <= 2 ? 1 : (level <= 5 ? 2 : (level <= 8 ? 3 : 4));

    const ruleDefs: ColorRuleDef[] = [
      {
        tier: 1,
        category: 'Character Presence',
        description: "If grid contains letter 'Z', mark Orange. Otherwise mark Blue.",
        allowedColors: [this.COLOR_PALETTE.orange, this.COLOR_PALETTE.blue],
        evaluate: (c) => c.includes('Z') ? 'orange' : 'blue'
      },
      {
        tier: 1,
        category: 'Number Parity',
        description: "If ALL numbers in the grid are Even, mark Green. Otherwise mark Grey.",
        allowedColors: [this.COLOR_PALETTE.green, this.COLOR_PALETTE.grey],
        evaluate: (c) => {
          const nums = c.filter((x): x is number => typeof x === 'number');
          return nums.length > 0 && nums.every(n => n % 2 === 0) ? 'green' : 'grey';
        }
      },
      {
        tier: 1,
        category: 'Sum Threshold',
        description: "If the sum of all numbers is greater than 10, mark Green. Otherwise mark Grey.",
        allowedColors: [this.COLOR_PALETTE.green, this.COLOR_PALETTE.grey],
        evaluate: (c) => {
          const sum = c.filter((x): x is number => typeof x === 'number').reduce((a, b) => a + b, 0);
          return sum > 10 ? 'green' : 'grey';
        }
      },
      {
        tier: 2,
        category: 'Compound AND',
        description: "If grid contains at least two Even numbers AND contains letter 'A' or 'E', mark Orange. Otherwise mark Blue.",
        allowedColors: [this.COLOR_PALETTE.orange, this.COLOR_PALETTE.blue],
        evaluate: (c) => {
          const evens = c.filter(x => typeof x === 'number' && x % 2 === 0).length;
          const hasVowel = c.some(x => typeof x === 'string' && 'AE'.includes(x));
          return evens >= 2 && hasVowel ? 'orange' : 'blue';
        }
      },
      {
        tier: 2,
        category: 'Threshold Disjunction (OR)',
        description: "If the sum of numbers exceeds 12 OR grid contains at least 3 numbers, mark Green. Otherwise mark Grey.",
        allowedColors: [this.COLOR_PALETTE.green, this.COLOR_PALETTE.grey],
        evaluate: (c) => {
          const nums = c.filter((x): x is number => typeof x === 'number');
          const sum = nums.reduce((a, b) => a + b, 0);
          return sum > 12 || nums.length >= 3 ? 'green' : 'grey';
        }
      },
      {
        tier: 3,
        category: 'Positional Relational',
        description: "If Top Row sum (items 1 & 2) is strictly greater than Bottom Row sum (items 3 & 4), mark Orange. Otherwise mark Blue.",
        allowedColors: [this.COLOR_PALETTE.orange, this.COLOR_PALETTE.blue],
        evaluate: (c) => {
          const topSum = (typeof c[0] === 'number' ? c[0] : 0) + (typeof c[1] === 'number' ? c[1] : 0);
          const botSum = (typeof c[2] === 'number' ? c[2] : 0) + (typeof c[3] === 'number' ? c[3] : 0);
          return topSum > botSum ? 'orange' : 'blue';
        }
      },
      {
        tier: 3,
        category: 'Negation & Parity',
        description: "If grid does NOT contain any Odd numbers AND contains at least one letter, mark Green. Otherwise mark Grey.",
        allowedColors: [this.COLOR_PALETTE.green, this.COLOR_PALETTE.grey],
        evaluate: (c) => {
          const hasOdd = c.some(x => typeof x === 'number' && x % 2 !== 0);
          const hasLetter = c.some(x => typeof x === 'string');
          return !hasOdd && hasLetter ? 'green' : 'grey';
        }
      },
      {
        tier: 4,
        category: 'Multi-Condition Ternary',
        description: "If sum of numbers exceeds 14, mark Green. Else if grid contains letter 'Z' or 'X', mark Orange. Otherwise mark Grey.",
        allowedColors: [this.COLOR_PALETTE.green, this.COLOR_PALETTE.orange, this.COLOR_PALETTE.grey],
        evaluate: (c) => {
          const sum = c.filter((x): x is number => typeof x === 'number').reduce((a, b) => a + b, 0);
          if (sum > 14) return 'green';
          if (c.some(x => typeof x === 'string' && 'ZX'.includes(x))) return 'orange';
          return 'grey';
        }
      }
    ];

    const matchingRules = ruleDefs.filter(r => r.tier === tier);
    const chosenRule = matchingRules[Math.floor(Math.random() * matchingRules.length)] || ruleDefs[0];

    const chars = 'ABEZXYK';
    const cards: GridCardContent[] = [];
    const expectedColors: string[] = [];

    for (let i = 0; i < 4; i++) {
      const content: (string | number)[] = [];
      for (let j = 0; j < 4; j++) {
        if (Math.random() > 0.45) {
          content.push(Math.floor(Math.random() * 9) + 1);
        } else {
          content.push(chars[Math.floor(Math.random() * chars.length)]);
        }
      }

      const displayGrid = [
        [content[0], content[1]],
        [content[2], content[3]]
      ];

      const expected = chosenRule.evaluate(content);
      cards.push({ id: i + 1, content, displayGrid });
      expectedColors.push(expected);
    }

    const canonicalState = {
      rule: chosenRule.description,
      cards: cards.map(c => c.content.join(',')).join(';')
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('color-the-grid', level, canonicalState);

    return {
      id: `colorgrid_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'color-the-grid',
      type: 'color-the-grid',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.2 + level * 0.08).toFixed(2)),
      timeLimitMs: Math.max(15000, 35000 - level * 1200),
      expectedSolveTimeMs: Math.max(8000, 18000 - level * 800),
      cognitiveLoadFactors: [
        `rule_tier_${tier}`,
        `category_${chosenRule.category.toLowerCase().replace(/\s+/g, '_')}`,
        `multi_card_eval`
      ],
      ruleTier: tier,
      ruleDescription: chosenRule.description,
      category: chosenRule.category,
      cards,
      expectedColors,
      allowedColors: chosenRule.allowedColors,
      solutionExplanation: `Predicate evaluation according to: "${chosenRule.description}". Card outcomes: [${expectedColors.join(', ')}].`
    };
  }
}
