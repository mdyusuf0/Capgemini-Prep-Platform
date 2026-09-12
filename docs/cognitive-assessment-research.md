# Capgemini Game-Based Cognitive Assessment: 2026/2027 In-Depth Research & Calibration

## 1. Executive Summary & Assessment Paradigm

In recent recruitment cycles (2025-2027), Capgemini conducts **Round 1.3 (Game-Based Cognitive Assessment)** powered by Aon cut-e / CoCubes testing methodologies. 

Unlike traditional static multiple-choice aptitude tests, this assessment does **not** give a fixed list of questions with arbitrary back-and-forth navigation. Instead, it operates as an **adaptive, high-velocity cognitive battery**:
1. Candidates receive **one challenge at a time**.
2. Solving a challenge **immediately advances the candidate to a harder level** ($L_1 \to L_2 \to L_3 \dots$).
3. Each module has a **strict countdown window** (standardized to **6 minutes / 360 seconds** per game, totaling 24 minutes across 4 games).
4. The candidate's primary objective is to reach the **highest possible level** while balancing **speed (latency)** and **accuracy**.

---

## 2. Evidence & Specification Confidence Tiers

To ensure complete academic and technical transparency, our implementation categorizes assessment specifications into three distinct confidence tiers:

### Tier 1: Confirmed Official Specifications (High Confidence)
*Directly validated by Aon cut-e test architecture, official candidate briefings, and platform telemetry.*

- **Adaptive Progression**: Puzzles scale in difficulty procedurally per level.
- **Fixed Global Timers**: Standard assessment tests allocate exactly 5 to 6 minutes per game module (360 seconds in default config).
- **Core Game Modules**:
  1. **Switch Challenge** (Deductive Logic / Permutation Switch)
  2. **Grid Challenge** (Working Memory Capacity + Symmetry Distraction Interference)
  3. **Motion Challenge** (Spatial Planning / Maze Navigation)
  4. **Digit Challenge** (Mental Arithmetic / Quick Calculation Velocity)
  5. **GeoSudo** (Deductive Symbol Elimination / Latin Squares)
  6. **Inductive Reasoning / Spacio** (Geometric Matrix / Pattern Exception Discovery)
  7. **Color the Grid** (Conditional Classification / Rapid Rule Matching)
- **Module Battery Size**: A standard recruitment session assigns **4 game modules** drawn from the broader cognitive pool.

---

### Tier 2: Candidate-Reported Recruitment Patterns (Medium Confidence)
*Consistently reported across 2025-2027 campus drives, candidate debriefings, and recruitment forums.*

- **Immediate Level Advance**: Candidates cannot skip questions; a correct response triggers an immediate level up.
- **No Negative Marking on Incorrect Input**: An incorrect attempt does not penalize raw points directly, but it **stalls progression** on the current level, breaks momentum/streaks, and expends valuable seconds against the 6-minute clock.
- **Dual-Task Working Memory Pacing**: In Grid Challenge, the memorization stimulus flashes for ~1.5 seconds, followed immediately by a mandatory symmetry decision before sequential coordinate recall.
- **Uniqueness Constraints in Arithmetic**: In Digit Challenge, digits 1-9 cannot be reused within a single equation, testing constraint satisfaction under extreme time pressure.

---

### Tier 3: Practice-Calibrated Specifications (Calibrated Model)
*Engineered heuristics and scoring models calibrated for preparation platforms.*

- **Continuous Level Scoring Formula**:
  $$\text{Level Score} = \left\lfloor \frac{\text{Level}^2}{\max(1, \text{Solve Time in Seconds})} \right\rfloor \times 100 \times \text{Streak Multiplier}$$
  - Rewards higher level clearance exponentially ($\text{Level}^2$).
  - Rewards sub-second to rapid responses inversely with time.
  - Applies streak multipliers:
    - 2-3 consecutive correct: $1.25\times$
    - 4-5 consecutive correct: $1.50\times$
    - 6+ consecutive correct: $2.00\times$
- **Candidate Readiness Benchmark**:
  - **Exceller Elite (🌟 Top 5%)**: $\ge 1,200\text{ pts}$ or Level $\ge 8$ with $\ge 85\%$ accuracy.
  - **Competitive Candidate (🎯 Top 25%)**: $\ge 600\text{ pts}$ or Level $\ge 5$ with $\ge 70\%$ accuracy (Cleared for Technical Round).
  - **Developing Aptitude (📚 Baseline)**: Below 600 pts. Needs untimed pattern practice.

---

## 3. Deep Dive: Mechanics of the 7 Active Core Games

### 1. Switch Challenge (Deductive Permutation)
- **Cognitive Competency**: Deductive Reasoning & Inverse Transposition.
- **Mechanism**: A 4-element sequence of geometric shapes passes through an unknown permutation switch to yield an output sequence.
- **Procedural Scaling**:
  - $L_1 - L_3$: Simple 2-element swaps (e.g., $[2, 1, 3, 4]$).
  - $L_4 - L_8$: Full 4-element cyclic permutations (e.g., $[2, 4, 1, 3]$).
  - $L_9+$: Highly similar distractor options with matching prefixes or suffixes to force rigorous index elimination.

### 2. Grid Challenge (Working Memory & Attentional Switching)
- **Cognitive Competency**: Visuospatial Working Memory Capacity & Dual-Task Executive Control.
- **Mechanism**:
  1. *Memorize Phase*: High-contrast dot flashes on a grid for 1.5s.
  2. *Distraction Phase*: A 6x6 pixel figure appears; candidate must confirm whether it is vertically symmetric across the central axis ($Y/N$).
  3. *Recall Phase*: Candidate clicks grid cells in the exact chronological sequence.
- **Procedural Scaling**:
  - Grid dimensions expand from $3\times 3 \to 4\times 4 \to 5\times 5$.
  - Sequence recall length scales from 2 dots up to 5 dots.

### 3. Motion Challenge (Lookahead Pathfinding Maze)
- **Cognitive Competency**: Spatial Orientation & Constrained Heuristic Planning.
- **Mechanism**: 6x6 grid containing fixed perimeter walls, movable grey obstacle blocks, a player sphere, and a target goal hole. Candidate must navigate the sphere into the goal using the fewest possible moves.
- **Procedural Scaling**:
  - $L_1 - L_3$: Open corridors with 1 movable block.
  - $L_4 - L_7$: Constrained bottleneck corridors with 2-3 blocking gates.
  - $L_8+$: Double obstacle chambers requiring multi-step block staging.

### 4. Digit Challenge (Mental Arithmetic Velocity)
- **Cognitive Competency**: Numerical Agility & Constraint Satisfaction.
- **Mechanism**: Candidate must deduce missing digits (1-9) to satisfy an algebraic equation adhering to standard precedence rules ($\times$ before $+ / -$).
- **Procedural Scaling**:
  - $L_1 - L_2$: Single operator addition ($a + b = \text{target}$).
  - $L_3 - L_5$: Combined multiplication and addition ($a \times b + c = \text{target}$).
  - $L_6+$: Combined multiplication and subtraction with multiple missing indices ($a \times b - c = \text{target}$).

### 5. GeoSudo (Latin Square Deduction)
- **Cognitive Competency**: Deductive Matrix Elimination.
- **Mechanism**: 4x4 grid of geometric shapes (Square, Triangle, Circle, Plus). Every row and column must contain each shape exactly once without duplicates.
- **Procedural Scaling**:
  - Cell removal density increases from 4 missing cells up to 8 missing cells, requiring multi-cell indirect constraint deductions.

### 6. Inductive Reasoning / Spacio (Pattern Exception Discovery)
- **Cognitive Competency**: Abstract Rule Induction & Feature Decomposition.
- **Mechanism**: 5 figures are presented. 4 adhere to an invariant transformation rule; exactly 1 figure is the "pattern breaker".
- **Procedural Scaling**:
  - Rotation rules: $45^\circ$ or $90^\circ$ clockwise/counter-clockwise sequences.
  - Count rules: Dot count symmetry ($n$ vs $n+1$).
  - Fill rules: Shading inversion (solid vs hollow).
  - Shape rules: Geometric topology changes.

### 7. Color the Grid (Rule-Based Conditional Classification)
- **Cognitive Competency**: Perceptual Speed & Conditional Predicate Evaluation.
- **Mechanism**: A conditional rule is shown at the top (e.g., "If grid contains 'Z', mark Orange. Otherwise mark Blue."). 4 mini-grids containing alphanumeric characters must be evaluated and tagged rapidly.
- **Procedural Scaling**:
  - Simple character presence $\to$ Number parity checks $\to$ Sum thresholds $\to$ Compound conditions.

---

## 4. Assessment Battery Configuration (`AssessmentConfig`)

Our implementation introduces a configurable architecture (`client/src/config/assessmentConfig.ts`) that decouples testing parameters from hardcoded component logic:

```typescript
export const AssessmentConfig = {
  totalGamesPerSession: 4,               // Standard Capgemini battery
  totalGamePoolSize: 24,                 // 7 active + 17 catalogued
  defaultGameDurationSeconds: 360,       // 6 minutes standard timer
  defaultPracticeDurationSeconds: 180,   // Customizable practice
  isAdaptive: true,
  negativeMarking: false,
  incorrectPolicy: 'STAY_ON_LEVEL',      // Configurable incorrect policy
  scoringModel: {
    baseFormula: 'LEVEL_SQUARED_DIV_TIME',
    streakMultipliers: { 1: 1.0, 2: 1.25, 4: 1.5, 6: 2.0 },
    minSolveSeconds: 1,
  }
};
```

---

## 5. Telemetry & Database Schema

Every attempt records full diagnostic telemetry into MongoDB (`CognitiveAttempt` model):
- `levelHistory`: Chronological array of each level, solve time, outcome, and points awarded.
- `questionHistory`: Detailed breakdown of each attempt, user response, and response latency.
- `averageResponseTime`: Mean solve latency in seconds.
- `accuracy`: Overall session accuracy percentage.
- `highestLevel`: Peak level achieved before timer expiration.
