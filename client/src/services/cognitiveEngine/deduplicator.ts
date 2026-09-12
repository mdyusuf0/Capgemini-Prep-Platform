/**
 * Deterministic fingerprinting and deduplication cache for the browser client.
 */

function fastHash(str: string): string {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c64e6d;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
}

export class PuzzleDeduplicator {
  private static globalSeen = new Set<string>();
  private static sessionCaches = new Map<string, Set<string>>();

  static computeFingerprint(gameId: string, level: number, canonicalState: any): string {
    const rawString = typeof canonicalState === 'string'
      ? canonicalState
      : JSON.stringify(canonicalState, Object.keys(canonicalState || {}).sort());
    return fastHash(`${gameId}:L${level}:${rawString}`);
  }

  static hasSeen(fingerprint: string, sessionId?: string): boolean {
    if (sessionId) {
      const sessionSet = this.sessionCaches.get(sessionId);
      if (sessionSet && sessionSet.has(fingerprint)) return true;
    }
    return this.globalSeen.has(fingerprint);
  }

  static register(fingerprint: string, sessionId?: string): void {
    if (sessionId) {
      if (!this.sessionCaches.has(sessionId)) {
        this.sessionCaches.set(sessionId, new Set());
      }
      this.sessionCaches.get(sessionId)!.add(fingerprint);
    }
    this.globalSeen.add(fingerprint);

    if (this.globalSeen.size > 5000) {
      const iter = this.globalSeen.values();
      for (let i = 0; i < 1000; i++) {
        const val = iter.next().value;
        if (val) this.globalSeen.delete(val);
      }
    }
  }

  static clearSession(sessionId: string): void {
    this.sessionCaches.delete(sessionId);
  }

  static generateUnique<T extends { fingerprint: string }>(
    generatorFn: (attempt: number) => T,
    sessionId?: string,
    maxAttempts: number = 40
  ): T {
    let lastCandidate: T | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const candidate = generatorFn(attempt);
      lastCandidate = candidate;

      if (!this.hasSeen(candidate.fingerprint, sessionId)) {
        this.register(candidate.fingerprint, sessionId);
        return candidate;
      }
    }

    if (lastCandidate) {
      const saltedFingerprint = `${lastCandidate.fingerprint}_alt_${Date.now()}`;
      lastCandidate.fingerprint = saltedFingerprint;
      this.register(saltedFingerprint, sessionId);
      return lastCandidate;
    }

    throw new Error('Puzzle generation failed after max deduplication attempts.');
  }
}
