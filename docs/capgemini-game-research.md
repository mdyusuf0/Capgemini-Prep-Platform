# Capgemini & Aon cut-e Cognitive Assessment Architecture & Psychometric Specifications

## Executive Summary
This document outlines the assessment design, psychometric constructs, computational puzzle generation models, deterministic solvers, and distractor mechanics for the Capgemini Exceller recruitment cognitive assessment battery (modeled on Aon cut-e / smartPredict modules).

---

## 1. Battery Overview & Cognitive Constructs

| Assessment Game | Aon cut-e Equivalent | Core Cognitive Construct | Latent Ability Measured | Time Pressure |
|---|---|---|---|---|
| **Geo-Sudo** | scales sx (deductive-logical) | Deductive Logic & Working Memory | Constraint satisfaction, Latin square deduction | High (~15–30s/puzzle) |
| **Spacio / Inductive** | scales cls (inductive-logical) | Fluid Intelligence ($Gf$) | Rule induction, multi-attribute transformation | Moderate (~20–40s/puzzle) |
| **Switch Challenge** | switchChallenge (deductive) | Transposition & Sequence Tracking | Reverse-engineering permutations, visual lookahead | Very High (~10–20s/puzzle) |
| **Digit Challenge** | scales num (numerical) | Mental Calculation & Constraint Velocity | Arithmetic decomposition, operator precedence (BODMAS) | High (~15–25s/puzzle) |
| **Grid Challenge** | gridChallenge (dual-task) | Working Memory Capacity & Task Switching | Visuospatial sketchpad retention + executive interference | Paced (flash + verify + recall) |
| **Motion Challenge** | scales path (spatial planning) | Executive Function & Lookahead Planning | Shortest-path search, sliding block obstacle navigation | High (~30–60s/puzzle) |
| **Color the Grid** | scales cls (rule-based) | Rule-Based Conditional Classification | Compound Boolean logic (AND/OR/NOT), threshold parsing | High (~10–20s/puzzle) |

---

## 2. Mathematical Formalization & Solvers

### 2.1 Geo-Sudo (Latin Square Deductive Solver)
- **Constraint Formulation**:
  Let $G$ be an $N \times N$ matrix where $G_{r,c} \in \{1, \dots, N\}$.
  A valid configuration satisfies:
  $$\forall r, \; \{G_{r,c} \mid 1 \le c \le N\} = \{1, \dots, N\}$$
  $$\forall c, \; \{G_{r,c} \mid 1 \le r \le N\} = \{1, \dots, N\}$$
- **Target Cell Uniqueness Proof**:
  Given a partially completed grid $G_{partial}$ with target coordinate $(r_t, c_t)$ set to unknown:
  Let $S(G_{partial}, r_t, c_t)$ be the set of symbols admissible at $(r_t, c_t)$ such that at least one complete Latin square completion exists.
  **Invariant**: $|S(G_{partial}, r_t, c_t)| = 1$. If $|S| > 1$, the puzzle is mathematically ambiguous and rejected by the generator.
- **Deductive Depth Scaling**:
  - *Depth 1*: Target row or column has $N-1$ filled cells. Symbol is directly obtained by set subtraction:
    $$s = \{1, \dots, N\} \setminus \{G_{r_t, c} \mid c \ne c_t\}$$
  - *Depth 2*: Target cell has $\ge 2$ empty cells in its row and column, but an intersecting cell $(r_t, c_i)$ or $(r_i, c_t)$ has only 1 admissible symbol, whose resolution reduces the target cell to Depth 1.
  - *Depth 3+*: Requires cross-elimination (hidden singles or intersection exclusion).

### 2.2 Spacio / Inductive Reasoning (Multi-Attribute Induction)
- **Attribute Vector Representation**:
  Each visual entity $E$ is a feature tuple:
  $$E = \langle \text{Sides}, \text{Rotation}, \text{Fill}, \text{SatelliteCount}, \text{OrbitPosition}, \text{Scale} \rangle$$
  - $\text{Sides} \in \{3, 4, 5, 6, 8\}$ (Triangle, Square, Pentagon, Hexagon, Octagon)
  - $\text{Rotation} \in \{0^\circ, 45^\circ, 90^\circ, 135^\circ, 180^\circ, 225^\circ, 270^\circ, 315^\circ\}$
  - $\text{Fill} \in \{\text{Solid}, \text{Outline}, \text{Striped}, \text{Hatched}, \text{Dotted}\}$
  - $\text{SatelliteCount} \in \{0, 1, 2, 3, 4, 5\}$
  - $\text{OrbitPosition} \in \{\text{North}, \text{East}, \text{South}, \text{West}, \text{Center}\}$
- **Transformation Operators**:
  Transformation $T: E \rightarrow E'$ applies component-wise operations:
  $$T = \langle \Delta_{\text{Sides}}, \Delta_{\text{Rot}}, f_{\text{Fill}}, \Delta_{\text{Sat}}, f_{\text{Orbit}}, f_{\text{Scale}} \rangle$$
- **Analogy Verification**:
  Given pair $A \xrightarrow{T} B$, the engine verifies that rule $T$ is fully determined and applies $T(C)$ to produce target $D$.
- **Adversarial Distractor Taxonomy**:
  1. *Partial Rule A*: Applies $\Delta_{\text{Rot}}$ correctly, but leaves $\text{Fill}$ or $\text{SatelliteCount}$ unchanged.
  2. *Partial Rule B*: Applies secondary transformation, ignores primary transformation.
  3. *Inverted Direction*: Applies $-\Delta_{\text{Rot}}$ (counterclockwise instead of clockwise).
  4. *Near-Miss Metric*: Applies $\Delta_{\text{Rot}} \pm 45^\circ$ or $\Delta_{\text{Sat}} \pm 1$.
  5. *Source Bleed*: Transforms $C$ using the base geometry of $A$ rather than $C$.

### 2.3 Switch Challenge (Permutation Transposition)
- **Formal Definition**:
  Given an alphabet sequence $X = [x_1, x_2, \dots, x_k]$ and permutation $\pi \in S_k$,
  $$Y = \pi(X) \quad \text{where} \quad y_i = x_{\pi(i)}$$
- **Two-Stage Switch**:
  For multi-level assessment:
  $$X \xrightarrow{\pi_1} M \xrightarrow{\pi_2} Y$$
  Candidate is given $X, Y$, and either $\pi_1$ (find $\pi_2$) or $\pi_2$ (find $\pi_1$).
- **Hamming Distance $\le 2$ Distractors**:
  Let the true switch code be $\pi^* = [\pi^*(1), \dots, \pi^*(k)]$.
  Candidate options must contain permutations $\pi'$ such that:
  $$\text{HammingDistance}(\pi^*, \pi') = 2 \quad \text{or} \quad \text{EditDistance} = 1$$
  This forces candidates to resolve the entire permutation; eliminating based on first-digit matching is prevented.

### 2.4 Digit Challenge (Numerical Constraint Satisfaction)
- **Constraint Model**:
  Find digits $d_1, d_2, \dots, d_m \in \{1, \dots, 9\}$ such that:
  $$\forall i \ne j, \; d_i \ne d_j$$
  $$\text{EvaluateBODMAS}(d_1, \text{op}_1, d_2, \text{op}_2, \dots, d_m) = T$$
  $$\forall \text{op}_i = \div, \quad \text{OperandLeft} \pmod{\text{OperandRight}} = 0$$
- **Solvability & Uniqueness**:
  A permutation backtracking solver tests all choices of $m$ distinct digits from candidate pool $P$. Puzzles are generated such that the target integer $T$ is reached with no division by zero and strict integer arithmetic.

### 2.5 Grid Challenge (Dual-Task Spatial Working Memory)
- **Working Memory Span**:
  Sequence length $L \in \{3, 4, 5, 6, 7, 8\}$ over $N \times N$ spatial coordinates.
- **Interleaved Interference Task**:
  Between coordinate exposures, an interference display (6x6 matrix) is presented.
  Matrix $M \in \{0, 1\}^{6 \times 6}$ is tested for vertical or horizontal symmetry:
  $$M_{r, c} = M_{r, 5 - c} \quad \forall r \in [0, 5], c \in [0, 2]$$
  For asymmetric matrices, exactly 1 or 2 pixels are inverted across the mirror axis.
- **Dual-Task Scoring**:
  $$\text{CompositeScore} = \text{SequenceAccuracy} \times \max\left(0, \frac{\text{SymmetryAccuracy} - 0.5}{0.5}\right)$$
  Candidate cannot achieve points by ignoring the interference task.

### 2.6 Motion Challenge (Breadth-First Search State-Space Planning)
- **State Representation**:
  State $s = (p_{\text{ball}}, \{p_{b_1}, \dots, p_{b_k}\})$ on grid with fixed walls $W$.
- **Transition Graph**:
  In each step, player can push the ball or an adjacent block into an empty cell.
- **Minimal Optimal Move Computation**:
  Let $G = (V, E)$ be the transition graph. BFS computes:
  $$M_{opt} = \text{ShortestPath}(s_{initial}, s_{\text{goal}})$$
  The generated puzzle guarantees $M_{opt} \ge M_{target}(level)$ and that no trivial direct line exists.

### 2.7 Color the Grid (Rule-Based Conditional Logic)
- **Predicate Grammar**:
  $$\text{Rule} ::= \text{Predicate} \implies \text{Color}_1 \mid \text{Color}_2$$
  $$\text{Predicate} ::= \text{Atom} \mid \text{Predicate} \land \text{Predicate} \mid \text{Predicate} \lor \text{Predicate} \mid \neg \text{Predicate}$$
  $$\text{Atom} ::= \text{HasChar}(c) \mid \text{Count}(\text{Type}) \ge k \mid \text{Sum}(\text{Numbers}) > T \mid \text{Parity}(\text{Numbers})$$
- **Adversarial Boundary Instance Generation**:
  Test cards are synthesized specifically at $T-1, T, T+1$ and with partial truth values across conjunctions to test genuine predicate evaluation.

---

## 3. Adaptive Difficulty Parameters (Levels 1 to 10+)

| Level | Geo-Sudo | Spacio (Inductive) | Switch | Digit | Grid (Memory) | Motion (Path) | Color the Grid |
|---|---|---|---|---|---|---|---|
| **1** | 4x4, 4 clues missing, depth 1 | 1 feature (Rot 90°) | 4 symbols, 1 layer | 3 digits, + and - | 3x3, length 3 | 5x5, 1 block, opt 4-5 | Single predicate |
| **2** | 4x4, 5 clues missing, depth 1 | 1 feature (Rot 45°/90°) | 4 symbols, 1 layer | 3 digits, + and - | 3x3, length 3 | 5x5, 1 block, opt 5-6 | Single predicate |
| **3** | 4x4, 6 clues missing, depth 2 | 2 features (Rot + Fill) | 4 symbols, 1 layer (near-miss) | 3 digits, $\times, +$ | 4x4, length 4 | 6x6, 2 blocks, opt 7-8 | Conjunction (AND) |
| **4** | 4x4, 7 clues missing, depth 2 | 2 features (Rot + Dots) | 4 symbols, 2 layers (known+?) | 3 digits, $\times, -$ | 4x4, length 4 | 6x6, 2 blocks, opt 8-9 | Conjunction (AND) |
| **5** | 5x5, 8 clues missing, depth 2 | 2 features (Sides + Rot) | 4 symbols, 2 layers (?+known) | 3 digits, $\times, \div$ | 4x4, length 5 | 6x6, 3 blocks, opt 10-11 | Disjunction (OR) |
| **6** | 5x5, 10 clues missing, depth 2 | 3 features (Sides+Rot+Fill) | 5 symbols, 1 layer | 4 digits, $\times, +, -$ | 4x4, length 5 | 6x6, 3 blocks, opt 11-13 | Compound AND/OR |
| **7** | 5x5, 11 clues missing, depth 3 | 3 features (Rot+Fill+Orbit) | 5 symbols, 1 layer (near-miss) | 4 digits, mixed BODMAS | 5x5, length 6 | 7x7, 3 blocks, opt 14-15 | Position relational |
| **8** | 5x5, 12 clues missing, depth 3 | 3 features + symmetry | 5 symbols, 2 layers | 4 digits, mixed BODMAS | 5x5, length 6 | 7x7, 4 blocks, opt 16-17 | Negation (NOT) + Sum |
| **9** | 5x5, 13 clues missing, depth 3 | 4 features composite | 5 symbols, 2 layers (?+known) | 4 digits, strict division | 5x5, length 7 | 7x7, 4 blocks, opt 18-19 | Multi-class 3-tier |
| **10+**| 5x5, min clue set, depth 3+ | 4 features + parity rule | 5 symbols, double inversion | 4 digits, unique constraint | 5x5, length 8+ | 7x7, 5 blocks, opt $\ge$ 20 | Multi-class 4-tier |

---

## 4. Canonical Fingerprinting & Deduplication Guarantee

To guarantee that duplicate or structurally equivalent puzzles are never presented:
1. Each puzzle's essential semantic state is canonicalized into a normalized string $S_{canonical}$.
2. A cryptographic SHA-256 hash is computed:
   $$\text{Fingerprint} = \text{SHA256}(\text{gameId} \parallel \text{level} \parallel S_{canonical} \parallel \text{solution})$$
3. A session-level deduplication set $\mathcal{D}_{session}$ tracks all served fingerprints.
4. If $\text{Fingerprint} \in \mathcal{D}_{session}$, the generator rejects the instance and perturbatively re-samples up to $\text{MAX\_ATTEMPTS} = 50$, guaranteeing complete novelty.
