import { SpacioPuzzle, VisualEntity, PolygonType, FillPattern, OrbitPosition } from './types';
import { PuzzleDeduplicator } from './deduplicator';

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
    const polyA = this.POLYGONS[Math.floor(Math.random() * this.POLYGONS.length)];
    const rotA = (Math.floor(Math.random() * 8) * 45) % 360;
    const fillA = this.FILLS[Math.floor(Math.random() * 3)];
    const satCountA = Math.floor(Math.random() * 3) + 1;
    const orbitA = this.ORBITS[Math.floor(Math.random() * 4)];

    const figureA: VisualEntity = {
      polygon: polyA,
      rotation: rotA,
      fill: fillA,
      satelliteCount: satCountA,
      orbitPosition: orbitA
    };

    const activeTransformations: string[] = [];

    const rotDeltas = [45, 90, 135, 180, 270];
    const rotDelta = rotDeltas[Math.floor(Math.random() * (level <= 2 ? 2 : rotDeltas.length))];
    activeTransformations.push(`Rotate ${rotDelta}° CW`);

    let fillTransform = false;
    let targetFill = fillA;
    if (level >= 3) {
      fillTransform = true;
      const otherFills = this.FILLS.filter(f => f !== fillA);
      targetFill = otherFills[Math.floor(Math.random() * otherFills.length)];
      activeTransformations.push(`Fill changes from ${fillA} to ${targetFill}`);
    }

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

    let orbitTransform = false;
    if (level >= 7) {
      orbitTransform = true;
      activeTransformations.push('Satellite orbits 90° CW');
    }

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

    const polyC = this.POLYGONS.filter(p => p !== polyA)[Math.floor(Math.random() * (this.POLYGONS.length - 1))];
    const rotC = (Math.floor(Math.random() * 8) * 45) % 360;
    const fillC = figureA.fill;
    const satCountC = Math.floor(Math.random() * 3) + 1;
    const orbitC = this.ORBITS[Math.floor(Math.random() * 4)];

    const figureC: VisualEntity = {
      polygon: polyC,
      rotation: rotC,
      fill: fillC,
      satelliteCount: satCountC,
      orbitPosition: orbitC
    };

    const correctD = transformEntity(figureC);

    const distractors: VisualEntity[] = [];
    distractors.push({
      ...correctD,
      fill: figureC.fill,
      satelliteCount: figureC.satelliteCount
    });
    distractors.push({
      ...correctD,
      rotation: (figureC.rotation - rotDelta + 360) % 360
    });
    distractors.push({
      ...correctD,
      rotation: (correctD.rotation + 45) % 360
    });
    distractors.push({
      ...correctD,
      satelliteCount: correctD.satelliteCount > 1 ? correctD.satelliteCount - 1 : correctD.satelliteCount + 2
    });
    distractors.push({
      ...correctD,
      polygon: figureB.polygon
    });

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

    const allOptions = [correctD, ...uniqueDistractors].sort(() => Math.random() - 0.5);
    const correctAnswerIndex = allOptions.findIndex(opt => isSame(opt, correctD));

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
