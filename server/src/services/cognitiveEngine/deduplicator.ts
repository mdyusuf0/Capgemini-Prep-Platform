import crypto from 'crypto';

export class PuzzleDeduplicator {
  private static globalSeen = new Set<string>();
  private static sessionCaches = new Map<string, Set<string>>();

  /**
   * Generates a deterministic SHA-256 fingerprint for a canonical puzzle state.
   */
  static computeFingerprint(gameId: string, level: number, canonicalState: any): string {
    const rawString = typeof canonicalState === 'string'
      ? canonicalState
      : JSON.stringify(canonicalState, Object.keys(canonicalState || {}).sort());
    return crypto
      .createHash('sha256')
      .update(`${gameId}:L${level}:${rawString}`)
      .digest('hex')
      .substring(0, 24);
  }

  /**
   * Checks if a fingerprint has been seen in a session or globally.
   */
  static hasSeen(fingerprint: string, sessionId?: string): boolean {
    if (sessionId) {
      const sessionSet = this.sessionCaches.get(sessionId);
      if (sessionSet && sessionSet.has(fingerprint)) return true;
    }
    return this.globalSeen.has(fingerprint);
  }

  /**
   * Marks a fingerprint as seen.
   */
  static register(fingerprint: string, sessionId?: string): void {
    if (sessionId) {
      if (!this.sessionCaches.has(sessionId)) {
        this.sessionCaches.set(sessionId, new Set());
      }
      this.sessionCaches.get(sessionId)!.add(fingerprint);
    }
    this.globalSeen.add(fingerprint);

    // Bound memory
    if (this.globalSeen.size > 10000) {
      const iter = this.globalSeen.values();
      for (let i = 0; i < 2000; i++) {
        const val = iter.next().value;
        if (val) this.globalSeen.delete(val);
      }
    }
  }

  /**
   * Clears session deduplication cache.
   */
  static clearSession(sessionId: string): void {
    this.sessionCaches.delete(sessionId);
  }

  /**
   * Clears global deduplication cache (useful for tests).
   */
  static clearAll(): void {
    this.globalSeen.clear();
    this.sessionCaches.clear();
  }

  /**
   * Wrapper to execute a procedural generator with deduplication guarantees.
   */
  static generateUnique<T extends { fingerprint: string }>(
    generatorFn: (attempt: number) => T,
    sessionId?: string,
    maxAttempts: number = 50
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

    // If max attempts reached, fallback to last candidate with a deterministic salt
    if (lastCandidate) {
      const saltedFingerprint = `${lastCandidate.fingerprint}_alt_${Date.now()}`;
      lastCandidate.fingerprint = saltedFingerprint;
      this.register(saltedFingerprint, sessionId);
      return lastCandidate;
    }

    throw new Error('Puzzle generation failed after max deduplication attempts.');
  }
}
