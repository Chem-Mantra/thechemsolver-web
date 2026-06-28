// Pure spaced-repetition bookkeeping for the practice quiz — no React, no localStorage access (the
// component owns persistence; this file only knows how to fold an answer into a stats map, read
// accuracy back out, and turn accuracy into a sampling weight). Kept separate and dependency-free so
// the weighting logic itself can be unit-tested directly, the same discipline used throughout this
// lab for anything chirality/correctness-sensitive.
export interface StatEntry {
  correct: number
  total: number
}

export type StatsMap = Record<string, StatEntry>

export function recordAnswer(stats: StatsMap, key: string, wasCorrect: boolean): StatsMap {
  const prev = stats[key] ?? { correct: 0, total: 0 }
  return { ...stats, [key]: { correct: prev.correct + (wasCorrect ? 1 : 0), total: prev.total + 1 } }
}

/** Accuracy across every entry whose key starts with `${prefix}:` (e.g. all `cip-rank:*` sub-keys
 * folded into one "how is the student doing on CIP-rank questions overall" number) — `null` when
 * there's no data yet, so callers can tell "never attempted" apart from "0% accuracy". */
export function aggregateAccuracy(stats: StatsMap, prefix: string): number | null {
  let correct = 0
  let total = 0
  for (const [key, entry] of Object.entries(stats)) {
    if (key === prefix || key.startsWith(`${prefix}:`)) {
      correct += entry.correct
      total += entry.total
    }
  }
  return total > 0 ? correct / total : null
}

/** Weighted random pick among `items`, biased toward whichever category the student is WEAKEST at —
 * the actual "spaced repetition" behavior: struggle more on X, see more X. Unseen categories (no
 * accuracy data) get their plain base weight, unchanged. Seen categories get a multiplier that grows
 * as accuracy drops, floored at 0.3x so even a perfect-so-far category never disappears entirely (you
 * can still get unlucky, or rust). `accuracyOf` is injected so the picker has zero knowledge of the
 * `kind:subkey` key format — it just asks "how's this item doing?" */
export function weightedPick<T extends string>(items: readonly T[], baseWeight: Record<T, number>, accuracyOf: (item: T) => number | null): T {
  const weights = items.map((item) => {
    const acc = accuracyOf(item)
    const factor = acc === null ? 1 : Math.max(0.3, 1 - acc) + 0.15
    return baseWeight[item] * factor
  })
  const total = weights.reduce((a, b) => a + b, 0)
  let roll = Math.random() * total
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i]
    if (roll <= 0) return items[i]
  }
  return items[items.length - 1]
}

export interface WeakEntry {
  key: string
  correct: number
  total: number
  accuracy: number
}

/** The `minAttempts`-or-more entries with the LOWEST accuracy, for a "here's what you keep missing"
 * display — entries with too few attempts are excluded so a single unlucky guess doesn't headline the
 * list. */
export function weakestEntries(stats: StatsMap, minAttempts: number, limit: number): WeakEntry[] {
  return Object.entries(stats)
    .map(([key, { correct, total }]) => ({ key, correct, total, accuracy: correct / total }))
    .filter((e) => e.total >= minAttempts)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit)
}
