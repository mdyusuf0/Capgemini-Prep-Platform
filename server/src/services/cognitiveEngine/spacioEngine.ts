import { SpacioPuzzle, VisualEntity, PolygonType, FillPattern, OrbitPosition } from './types.js';
import { PuzzleDeduplicator } from './deduplicator.js';

export class SpacioEngine {
  private static POLYGONS: PolygonType[] = ['triangle', 'square', 'pentagon', 'hexagon', 'octagon'];
  private static FILLS: FillPattern[] = ['solid', 'outline', 'striped', 'hatched', 'dotted'];
  private static ORBITS: OrbitPosition[] = ['north', 'east', 'south', 'west', 'center'];

  static generate(level: number = 1, sessionId?: string): SpacioPuzzle {
    return PuzzleDeduplicator.generateUnique(
      (attempt) => this.generateCandidate(level, attempt),
      sessionId,
      40
    );
  }

  private static generateCandidate(level: number, attempt: number): SpacioPuzzle {
    // 1. Select base figure A
    const polyA = this.POLYGONS[Math.floor(Math.random() * this.POLYGONS.length)];
    const rotA = (Math.floor(Math.random() * 8) * 45) % 360;
    const fillA = this.FILLS[Math.floor(Math.random() * 3)]; // solid, outline, striped
    const satCountA = Math.floor(Math.random() * 3) + 1; // 1 to 3
    const orbitA = this.ORBITS[Math.floor(Math.random() * 4)]; // north, east, south, west

    const figureA: VisualEntity = {
      polygon: polyA,
      rotation: rotA,
      fill: fillA,
      satelliteCount: satCountA,
      orbitPosition: orbitA
    };

    // 2. Select transformation operations based on level
    // Level 1-2: 1 transformation (Rotation)
    // Level 3-4: 2 transformations (Rotation + Fill)
    // Level 5-6: 2-3 transformations (Sides + Rotation + Satellites)
    // Level 7-8: 3 transformations (Rotation + Fill + Orbit)
    // Level 9+: 4 transformations
    const activeTransformations: string[] = [];

    // Transformation 1: Rotation
    const rotDeltas = [45, 90, 135, 180, 270];
    const rotDelta = rotDeltas[Math.floor(Math.random() * (level <= 2 ? 2 : rotDeltas.length))];
    activeTransformations.push(`Rotate ${rotDelta}° CW`);

    // Transformation 2: Fill change
    let fillTransform = false;
    let targetFill = fillA;
    if (level >= 3) {
      fillTransform = true;
      const otherFills = this.FILLS.filter(f => f !== fillA);
      targetFill = otherFills[Math.floor(Math.random() * otherFills.length)];
      activeTransformations.push(`Fill changes from ${fillA} to ${targetFill}`);
    }

    // Transformation 3: Satellite Count or Sides
    let satDelta = 0;
    let sideDelta = 0;
    if (level >= 5) {
      if (Math.random() > 0.5) {
        satDelta = Math.random() > 0.5 ? 1 : -1;
        if (satCountA + satDelta < 0) satDelta = 1;
        activeTransformations.push(`Satellite dot count ${satDelta > 0 ? '+1' : '-1'}`);
      } else {
        sideDelta = Math.random() > 0.5 ? 1 : -1;
        activeTransformations.push(`Polygon sides ${sideDelta > 0 ? '+1' : '-1'}`);
      }
    }

    // Transformation 4: Orbit Position CW shift
    let orbitTransform = false;
    if (level >= 7) {
      orbitTransform = true;
      activeTransformations.push('Satellite orbits 90° CW');
    }

    // Helper to transform any entity by the rule vector
    const transformEntity = (src: VisualEntity, invert: boolean = false): VisualEntity => {
      const mult = invert ? -1 : 1;
      const nextRot = (src.rotation + mult * rotDelta + 360) % 360;
      const nextFill = fillTransform ? (invert ? src.fill : targetFill) : src.fill;

      let nextPoly = src.polygon;
      if (sideDelta !== 0) {
        const polyIdx = this.POLYGONS.indexOf(src.polygon);
        const nextIdx = Math.max(0, Math.min(this.POLYGONS.length - 1, polyIdx + mult * sideDelta));
        nextPoly = this.POLYGONS[nextIdx];
      }

      let nextSat = src.satelliteCount;
      if (satDelta !== 0) {
        nextSat = Math.max(0, Math.min(5, src.satelliteCount + mult * satDelta));
      }

      let nextOrbit = src.orbitPosition;
      if (orbitTransform) {
        const orbitOrder: OrbitPosition[] = ['north', 'east', 'south', 'west'];
        const oIdx = orbitOrder.indexOf(src.orbitPosition);
        if (oIdx !== -1) {
          nextOrbit = orbitOrder[(oIdx + mult + 4) % 4];
        }
      }

      return {
        polygon: nextPoly,
        rotation: nextRot,
        fill: nextFill,
        satelliteCount: nextSat,
        orbitPosition: nextOrbit
      };
    };

    const figureB = transformEntity(figureA);

    // 3. Select Figure C (distinct from A)
    const polyC = this.POLYGONS.filter(p => p !== polyA)[Math.floor(Math.random() * (this.POLYGONS.length - 1))];
    const rotC = (Math.floor(Math.random() * 8) * 45) % 360;
    const fillC = figureA.fill; // start from same initial fill style for clarity
    const satCountC = Math.floor(Math.random() * 3) + 1;
    const orbitC = this.ORBITS[Math.floor(Math.random() * 4)];

    const figureC: VisualEntity = {
      polygon: polyC,
      rotation: rotC,
      fill: fillC,
      satelliteCount: satCountC,
      orbitPosition: orbitC
    };

    // 4. Correct answer D: transform Figure C using the exact same rule vector
    const correctD = transformEntity(figureC);

    // 5. Generate plausible cognitive near-miss distractors
    const distractors: VisualEntity[] = [];

    // Trap 1: Primary rotation only (ignored secondary fill / sat rules)
    distractors.push({
      ...correctD,
      fill: figureC.fill,
      satelliteCount: figureC.satelliteCount
    });

    // Trap 2: Inverted rotation direction (CCW instead of CW)
    distractors.push({
      ...correctD,
      rotation: (figureC.rotation - rotDelta + 360) % 360
    });

    // Trap 3: Rotation offset by 45° (near-miss metric)
    distractors.push({
      ...correctD,
      rotation: (correctD.rotation + 45) % 360
    });

    // Trap 4: Satellite count offset by 1 or wrong orbit
    distractors.push({
      ...correctD,
      satelliteCount: correctD.satelliteCount > 1 ? correctD.satelliteCount - 1 : correctD.satelliteCount + 2
    });

    // Trap 5: Source figure bleed (used figure B's polygon instead of C's)
    distractors.push({
      ...correctD,
      polygon: figureB.polygon
    });

    // Deduplicate distractors and filter out exact match with correctD
    const isSame = (x: VisualEntity, y: VisualEntity) =>
      x.polygon === y.polygon &&
      x.rotation === y.rotation &&
      x.fill === y.fill &&
      x.satelliteCount === y.satelliteCount &&
      x.orbitPosition === y.orbitPosition;

    const uniqueDistractors: VisualEntity[] = [];
    for (const d of distractors) {
      if (!isSame(d, correctD) && !uniqueDistractors.some(u => isSame(u, d))) {
        uniqueDistractors.push(d);
      }
      if (uniqueDistractors.length === 3) break;
    }

    // Fill remaining if needed with perturbed angle
    let perturbAngle = 90;
    while (uniqueDistractors.length < 3) {
      const filler: VisualEntity = {
        ...correctD,
        rotation: (correctD.rotation + perturbAngle) % 360
      };
      if (!isSame(filler, correctD) && !uniqueDistractors.some(u => isSame(u, filler))) {
        uniqueDistractors.push(filler);
      }
      perturbAngle = (perturbAngle + 45) % 360;
    }

    // Assemble and shuffle options
    const allOptions = [correctD, ...uniqueDistractors].sort(() => Math.random() - 0.5);
    const correctAnswerIndex = allOptions.findIndex(opt => isSame(opt, correctD));

    // Canonical fingerprint
    const canonicalState = {
      rule: activeTransformations.sort(),
      c: `${figureC.polygon}_${figureC.rotation}_${figureC.fill}_${figureC.satelliteCount}`,
      d: `${correctD.polygon}_${correctD.rotation}_${correctD.fill}_${correctD.satelliteCount}`
    };
    const fingerprint = PuzzleDeduplicator.computeFingerprint('spacio', level, canonicalState);

    return {
      id: `spacio_${level}_${fingerprint.substring(0, 8)}`,
      fingerprint,
      gameId: 'spacio',
      type: 'spacio',
      level,
      difficultyRating: parseFloat(Math.min(1.0, 0.25 + level * 0.075).toFixed(2)),
      timeLimitMs: Math.max(15000, 40000 - level * 1500),
      expectedSolveTimeMs: Math.max(8000, 22000 - level * 1000),
      cognitiveLoadFactors: [
        `rule_count_${activeTransformations.length}`,
        `geometric_induction`,
        `near_miss_distractors`
      ],
      figureA,
      figureB,
      figureC,
      correctD,
      options: allOptions,
      correctAnswerIndex,
      activeTransformations,
      solutionExplanation: `Rule induction from Pair (A → B): ${activeTransformations.join('; ')}. Applying this compound transformation to Figure C uniquely produces Option ${String.fromCharCode(65 + correctAnswerIndex)}.`
    };
  }
}
