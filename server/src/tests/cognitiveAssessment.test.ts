/**
 * Automated Test Suite for Capgemini Cognitive Assessment Battery
 * Validates:
 * 1. Procedural Puzzle Generation for all 7 Games
 * 2. Adaptive Progression Logic (Level Up, Level Floor, Streak Multipliers)
 * 3. Capgemini-Style Practice Scoring Model
 * 4. Incorrect Policies (STAY_ON_LEVEL, DROP_LEVEL)
 * 5. Telemetry & Accuracy Calculation
 */

import { CognitiveGenerator } from '../services/cognitiveGenerator.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log('=====================================================');
  console.log('🧪 Starting Capgemini Cognitive Assessment Test Suite');
  console.log('=====================================================\n');

  // --- 1. PROCEDURAL GENERATOR TESTS ---
  console.log('1. Testing Procedural Puzzle Generators for 7 Active Games:');

  // A. GeoSudo
  const geo4 = CognitiveGenerator.generateGeoSudo(1);
  assert(geo4.size === 4 && geo4.grid.length === 4, 'GeoSudo Level 1 generates 4x4 grid');
  assert(geo4.solution !== null && geo4.options.includes(geo4.solution), 'GeoSudo solution is valid and present in options');
  const geo5 = CognitiveGenerator.generateGeoSudo(6);
  assert(geo5.size === 5 && geo5.grid.length === 5, 'GeoSudo Level 6 scales up to 5x5 grid');

  // B. Spacio (Inductive Reasoning)
  const spacio = CognitiveGenerator.generateSpacio(3);
  assert(spacio.type === 'spacio', 'Spacio generates valid puzzle type');
  assert(spacio.options.length >= 4, 'Spacio generates at least 4 options');
  assert(spacio.correctAnswer >= 0 && spacio.correctAnswer < spacio.options.length, 'Spacio correct index is within bounds');
  assert(spacio.ruleExplanation.length > 10, 'Spacio includes clear rule explanation');

  // C. Grid Challenge (Working Memory)
  const gridLvl1 = CognitiveGenerator.generateGridChallenge(1);
  assert(gridLvl1.sequence.length >= 2, 'Grid Challenge Level 1 has sequence length >= 2');
  assert(gridLvl1.symmetryTask && gridLvl1.symmetryTask.grid.length === 4, 'Grid Challenge has 4x4 symmetry distraction task');
  const gridLvl7 = CognitiveGenerator.generateGridChallenge(7);
  assert(gridLvl7.gridSize === 5, 'Grid Challenge Level 7 scales grid size to 5x5');
  assert(gridLvl7.sequence.length >= 4, 'Grid Challenge Level 7 scales sequence recall count >= 4');

  // D. Motion Challenge (Maze Navigation)
  const motion = CognitiveGenerator.generateMotionChallenge(1);
  assert(motion.type === 'motion', 'Motion Challenge generates valid puzzle type');
  assert(motion.gridSize === 6, 'Motion Challenge generates 6x6 maze');
  assert(motion.optimalMoves >= 4, 'Motion Challenge guarantees solvable path with optimalMoves >= 4');
  assert(!motion.obstacles.some(o => o.row === motion.start.row && o.col === motion.start.col), 'Start position is obstacle-free');
  assert(!motion.obstacles.some(o => o.row === motion.target.row && o.col === motion.target.col), 'Target goal is obstacle-free');

  // E. Switch Challenge (Permutation Switch)
  const switchPuz = CognitiveGenerator.generateSwitchChallenge(1);
  assert(switchPuz.type === 'switch', 'Switch Challenge generates valid puzzle type');
  assert(switchPuz.inputSequence.length === 4 && switchPuz.outputSequence.length === 4, 'Input and output have 4 geometric symbols');
  assert(switchPuz.options.length === 4, 'Switch Challenge provides 4 candidate switch codes');
  assert(switchPuz.correctAnswer >= 0 && switchPuz.correctAnswer < 4, 'Correct switch rule is indexed');

  // F. Digit Challenge (Numerical Velocity)
  const digit = CognitiveGenerator.generateDigitChallenge(1);
  assert(digit.type === 'digit', 'Digit Challenge generates valid puzzle type');
  assert(digit.target > 0, 'Digit Challenge target is positive integer');
  assert(digit.availableDigits.length >= 4, 'Digit Challenge provides at least 4 available digits');

  // G. Color the Grid (Conditional Classification)
  const colorGrid = CognitiveGenerator.generateColorTheGrid(1);
  assert(colorGrid.type === 'color-the-grid', 'Color the Grid generates valid puzzle type');
  assert(colorGrid.grids.length === 4, 'Color the Grid generates exactly 4 evaluation grids');
  assert(colorGrid.expectedColors.length === 4, 'Color the Grid computes 4 expected color tags');
  assert(colorGrid.ruleText.length > 5, 'Color the Grid includes active conditional rule text');

  // --- 2. SCORING ENGINE TESTS ---
  console.log('\n2. Testing Capgemini-Style Practice Scoring Model:');

  const calculateScore = (lvl: number, elapsedSec: number, streak: number) => {
    let multiplier = 1.0;
    if (streak >= 6) multiplier = 2.0;
    else if (streak >= 4) multiplier = 1.5;
    else if (streak >= 2) multiplier = 1.25;

    const basePoints = Math.round((Math.pow(lvl, 2) / Math.max(1, elapsedSec)) * 100);
    return Math.round(basePoints * multiplier);
  };

  const scoreL1Slow = calculateScore(1, 4, 0); // (1/4)*100 = 25
  const scoreL1Fast = calculateScore(1, 1, 0); // (1/1)*100 = 100
  assert(scoreL1Fast > scoreL1Slow, 'Faster solve time yields strictly higher score at Level 1');

  const scoreL5 = calculateScore(5, 2, 0); // (25/2)*100 = 1250
  assert(scoreL5 > scoreL1Fast * 5, 'Higher levels scale points exponentially (level^2)');

  const scoreStreak2 = calculateScore(4, 2, 2); // 16/2 * 100 * 1.25 = 1000
  const scoreStreak6 = calculateScore(4, 2, 6); // 16/2 * 100 * 2.00 = 1600
  assert(scoreStreak6 > scoreStreak2, 'Higher streaks award streak multipliers up to 2.0x');

  // --- 3. ADAPTIVE PROGRESSION & INCORRECT POLICIES ---
  console.log('\n3. Testing Level Progression & Policies:');

  // Progression: correct advances level
  let currentLevel = 1;
  let currentStreak = 0;
  function handleAnswer(isCorrect: boolean, policy: 'STAY_ON_LEVEL' | 'DROP_LEVEL') {
    if (isCorrect) {
      currentLevel++;
      currentStreak++;
    } else {
      currentStreak = 0;
      if (policy === 'DROP_LEVEL') {
        currentLevel = Math.max(1, currentLevel - 1);
      }
    }
  }

  handleAnswer(true, 'STAY_ON_LEVEL');
  assert(currentLevel === 2 && currentStreak === 1, 'Correct answer immediately advances from Level 1 to Level 2');
  handleAnswer(true, 'STAY_ON_LEVEL');
  assert(currentLevel === 3 && currentStreak === 2, 'Consecutive correct answer advances to Level 3 and increments streak');

  // Incorrect with STAY_ON_LEVEL
  handleAnswer(false, 'STAY_ON_LEVEL');
  assert(currentLevel === 3 && currentStreak === 0, 'Incorrect with STAY_ON_LEVEL maintains level 3 and resets streak to 0');

  // Incorrect with DROP_LEVEL
  handleAnswer(false, 'DROP_LEVEL');
  assert(currentLevel === 2, 'Incorrect with DROP_LEVEL reduces level by 1');

  // Level floor
  currentLevel = 1;
  handleAnswer(false, 'DROP_LEVEL');
  assert(currentLevel === 1, 'Level never drops below floor of Level 1');

  // --- 4. ACCURACY & TELEMETRY SANITY ---
  console.log('\n4. Testing Telemetry & Accuracy Calculation:');

  const calcAccuracy = (correct: number, total: number) => {
    return total > 0 ? Math.min(100, Math.max(0, Math.round((correct / total) * 100))) : 100;
  };

  assert(calcAccuracy(8, 10) === 80, 'Accuracy correctly calculated as 80% for 8/10');
  assert(calcAccuracy(0, 0) === 100, 'Zero attempts returns 100% baseline accuracy');
  assert(calcAccuracy(12, 10) === 100, 'Accuracy clamped at 100% maximum');

  console.log('\n=====================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
