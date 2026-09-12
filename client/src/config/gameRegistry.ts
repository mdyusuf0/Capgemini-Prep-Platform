/**
 * Central Cognitive Game Registry
 * Registers 24 cognitive assessment games calibrated for Capgemini recruitment patterns.
 * 7 Active fully playable games + 17 Extended/future cognitive competencies.
 */

export interface GameDefinition {
  id: string;
  name: string;
  category: 'Deductive Logic' | 'Working Memory' | 'Spatial Reasoning' | 'Mental Agility' | 'Inductive Logic' | 'Classification' | 'Attention & Speed';
  skills: string[];
  defaultDurationSeconds: number;
  isPlayable: boolean;
  tag: string;
  shortDesc: string;
  difficultyCurve: {
    startLevel: number;
    recommendedCap: number;
    scalingFactor: string;
  };
}

export const GAME_REGISTRY: Record<string, GameDefinition> = {
  // 1. SWITCH CHALLENGE
  'switch-challenge': {
    id: 'switch-challenge',
    name: 'Switch Challenge',
    category: 'Deductive Logic',
    skills: ['Position Permutation', 'Deductive Elimination', 'Inverse Mapping'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Deduce 4-digit transposition switch codes translating geometric input shapes to output order.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 15,
      scalingFactor: 'Operator complexity & distractor similarity',
    },
  },

  // 2. GRID CHALLENGE
  'grid-challenge': {
    id: 'grid-challenge',
    name: 'Grid Challenge',
    category: 'Working Memory',
    skills: ['Working Memory Capacity', 'Dual-Task Attention', 'Spatial Coordinates'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Dual-task memory test: memorize dot positions while verifying intermediate symmetry tasks.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 12,
      scalingFactor: 'Grid size (3x3 -> 5x5) and sequence recall count (2 -> 7 dots)',
    },
  },

  // 3. MOTION CHALLENGE
  'motion-challenge': {
    id: 'motion-challenge',
    name: 'Motion Challenge',
    category: 'Spatial Reasoning',
    skills: ['Pathfinding', 'Lookahead Planning', 'Topological Navigation'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Navigate the sphere from start to goal within the strictly budgeted optimal move limit.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 14,
      scalingFactor: 'Maze size, obstacle density, and movable blocking gates',
    },
  },

  // 4. DIGIT CHALLENGE
  'digit-challenge': {
    id: 'digit-challenge',
    name: 'Digit Challenge',
    category: 'Mental Agility',
    skills: ['Mental Arithmetic', 'Constraint Satisfaction', 'Rapid Algebra'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Synthesize equations using unique digits to hit the target value at maximum speed.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 18,
      scalingFactor: 'Target magnitude, operator precedence (*, /, +, -), and missing operand count',
    },
  },

  // 5. GEOSUDO
  'geo-sudo': {
    id: 'geo-sudo',
    name: 'GeoSudo (Deductive)',
    category: 'Deductive Logic',
    skills: ['Latin-Square Logic', 'Row-Col Deductive Elimination', 'Pattern Completion'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Deduce the missing geometric symbol in the target cell without repeating in rows or columns.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 12,
      scalingFactor: 'Grid dimension (4x4 to 5x5) and empty cell sparsity',
    },
  },

  // 6. INDUCTIVE REASONING (SPACIO)
  'inductive-reasoning': {
    id: 'inductive-reasoning',
    name: 'Inductive Reasoning (Spacio)',
    category: 'Inductive Logic',
    skills: ['Transformation Inference', 'Geometric Rotation', 'Feature Decomposition'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Infer hidden transformation rules (rotation, fill, shape replacement) and identify the matching figure.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 16,
      scalingFactor: 'Multi-rule combinations (simultaneous rotation + shading + symmetry)',
    },
  },

  // 7. COLOR THE GRID
  'color-the-grid': {
    id: 'color-the-grid',
    name: 'Color the Grid',
    category: 'Classification',
    skills: ['Rule-Based Tagging', 'Conditional Evaluation', 'Perceptual Speed'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Aon cut-e Core',
    shortDesc: 'Evaluate conditional predicate rules against 4 alphanumeric mini-grids and tag correct color classifications.',
    difficultyCurve: {
      startLevel: 1,
      recommendedCap: 15,
      scalingFactor: 'Compound conditions (AND/OR, parity checks, sum thresholds)',
    },
  },

  // --- 17 EXTENDED / FUTURE COMPETENCIES (Pool of 24) ---
  'scale-challenge': {
    id: 'scale-challenge',
    name: 'Scale Challenge (Balancing Weights)',
    category: 'Deductive Logic',
    skills: ['Transitive Inference', 'Inequality Reasoning'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Deduce relative object masses from a series of balanced and unbalanced scale pans.',
    difficultyCurve: { startLevel: 1, recommendedCap: 10, scalingFactor: 'Number of interrelated scales' },
  },
  'n-back-memory': {
    id: 'n-back-memory',
    name: 'N-Back Spatial Memory',
    category: 'Working Memory',
    skills: ['Continuous Updating', 'Working Memory Load'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Identify whether the current stimulus matches the one presented N steps earlier.',
    difficultyCurve: { startLevel: 1, recommendedCap: 5, scalingFactor: 'N-step distance (1-back to 4-back)' },
  },
  'flanker-task': {
    id: 'flanker-task',
    name: 'Eriksen Flanker Task',
    category: 'Attention & Speed',
    skills: ['Inhibitory Control', 'Selective Attention'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Respond to central arrow direction while ignoring conflicting flanker arrows.',
    difficultyCurve: { startLevel: 1, recommendedCap: 15, scalingFactor: 'Congruency ratio and presentation speed' },
  },
  'cube-rotation': {
    id: 'cube-rotation',
    name: '3D Cube Mental Rotation',
    category: 'Spatial Reasoning',
    skills: ['Mental Rotation', '3D Isometric Visualization'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Determine if two perspective renderings represent the same rotated 3D polycube block.',
    difficultyCurve: { startLevel: 1, recommendedCap: 12, scalingFactor: 'Degrees of rotational axis offset' },
  },
  'stroop-test': {
    id: 'stroop-test',
    name: 'Color-Word Interference',
    category: 'Attention & Speed',
    skills: ['Cognitive Inhibition', 'Executive Processing'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Name the ink color of words while overriding semantic automaticity.',
    difficultyCurve: { startLevel: 1, recommendedCap: 15, scalingFactor: 'Interference frequency and pacing' },
  },
  'number-series': {
    id: 'number-series',
    name: 'Number Series Induction',
    category: 'Inductive Logic',
    skills: ['Sequence Extrapolation', 'Mathematical Relations'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Detect the mathematical recurrence relation and provide the missing number.',
    difficultyCurve: { startLevel: 1, recommendedCap: 15, scalingFactor: 'Multi-tiered differential progressions' },
  },
  'reaction-latency': {
    id: 'reaction-latency',
    name: 'Simple & Choice Reaction Sprint',
    category: 'Attention & Speed',
    skills: ['Sensory Latency', 'Motor Speed'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Respond to visual target triggers with sub-250ms reaction accuracy.',
    difficultyCurve: { startLevel: 1, recommendedCap: 20, scalingFactor: 'Random interval delays and distractor flashes' },
  },
  'spatial-span': {
    id: 'spatial-span',
    name: 'Corsi Block Spatial Span',
    category: 'Working Memory',
    skills: ['Visuospatial Sketchpad', 'Sequence Span'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Replicate tapping sequences across unevenly distributed 3D spatial blocks.',
    difficultyCurve: { startLevel: 1, recommendedCap: 9, scalingFactor: 'Span length (3 to 9 blocks)' },
  },
  'matrix-reasoning': {
    id: 'matrix-reasoning',
    name: 'Raven-Style Matrix Reasoning',
    category: 'Inductive Logic',
    skills: ['Fluid Intelligence', 'Abstract Topology'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Select the missing geometric matrix cell obeying vertical and horizontal algebraic relations.',
    difficultyCurve: { startLevel: 1, recommendedCap: 12, scalingFactor: 'Dual-axis feature interactions' },
  },
  'fault-diagnosis': {
    id: 'fault-diagnosis',
    name: 'System Fault Diagnosis',
    category: 'Deductive Logic',
    skills: ['Circuit Tracing', 'Root-Cause Deduction'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Analyze logic gates and component states to isolate malfunctioning nodes.',
    difficultyCurve: { startLevel: 1, recommendedCap: 10, scalingFactor: 'Circuit depth and hidden gate states' },
  },
  'symbol-search': {
    id: 'symbol-search',
    name: 'Rapid Symbol Cross-Search',
    category: 'Attention & Speed',
    skills: ['Visual Scanning', 'Perceptual Discrimination'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Scan dense symbol tables to quickly confirm presence or absence of target glyphs.',
    difficultyCurve: { startLevel: 1, recommendedCap: 18, scalingFactor: 'Cluster size and symbol visual entropy' },
  },
  'target-tracking': {
    id: 'target-tracking',
    name: 'Multiple Object Tracking (MOT)',
    category: 'Attention & Speed',
    skills: ['Distributed Attention', 'Dynamic Tracking'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Track designated moving spheres among distractors through trajectory collisions.',
    difficultyCurve: { startLevel: 1, recommendedCap: 8, scalingFactor: 'Number of tracked targets (2 to 6)' },
  },
  'lexical-decision': {
    id: 'lexical-decision',
    name: 'Lexical Decision Speed',
    category: 'Attention & Speed',
    skills: ['Lexical Retrieval', 'Word Discrimination'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Rapidly classify letter strings as valid technical English words vs pseudowords.',
    difficultyCurve: { startLevel: 1, recommendedCap: 20, scalingFactor: 'Phonological neighbor density' },
  },
  'paper-folding': {
    id: 'paper-folding',
    name: 'Paper Folding & Hole Punch',
    category: 'Spatial Reasoning',
    skills: ['Mental Unfolding', 'Symmetry Reflection'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Predict the final unfolded hole pattern after sequential paper folds and hole punches.',
    difficultyCurve: { startLevel: 1, recommendedCap: 10, scalingFactor: 'Fold sequence (1 to 4 folds, diagonal folds)' },
  },
  'tower-puzzle': {
    id: 'tower-puzzle',
    name: 'Tower Planning Challenge',
    category: 'Spatial Reasoning',
    skills: ['Executive Planning', 'Lookahead Heuristics'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Rearrange stacked discs into the target configuration in the fewest possible moves.',
    difficultyCurve: { startLevel: 1, recommendedCap: 7, scalingFactor: 'Number of discs (3 to 7 discs)' },
  },
  'rule-switch': {
    id: 'rule-switch',
    name: 'Dimensional Shift (Wisconsin Sort)',
    category: 'Classification',
    skills: ['Cognitive Flexibility', 'Rule Discovery'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Sort cards by color, shape, or number and adapt dynamically when the sorting rule changes without warning.',
    difficultyCurve: { startLevel: 1, recommendedCap: 15, scalingFactor: 'Rule shift periodicity' },
  },
  'vessel-water': {
    id: 'vessel-water',
    name: 'Liquid Jug Volume Deduction',
    category: 'Deductive Logic',
    skills: ['Linear Diophantine Deduction', 'State-Space Search'],
    defaultDurationSeconds: 360,
    isPlayable: true,
    tag: 'Extended Pool',
    shortDesc: 'Measure an exact water volume using jugs of discrete unmarked capacities.',
    difficultyCurve: { startLevel: 1, recommendedCap: 10, scalingFactor: 'Capacity GCD ratios and required pours' },
  },
};

export const PLAYABLE_GAMES = Object.values(GAME_REGISTRY).filter(g => g.isPlayable);
export const ALL_GAMES = Object.values(GAME_REGISTRY);
export const CORE_GAMES = Object.values(GAME_REGISTRY).slice(0, 7);

/**
 * Helper to get a random subset of playable games for Assessment Mode (default 4 games)
 */
export const getRandomAssessmentGames = (count: number = 4): GameDefinition[] => {
  const shuffled = [...PLAYABLE_GAMES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
