/** The rule trail is collected as data while naming happens (each step records the rule it applied) — this just formats it for display, it never invents explanation separately from the algorithm. No
 * Blue Book citation/footer is shown to students — that's purely an internal engineering reference
 * (RULES.md), not something a learner needs to see (explicit user call). */
export function explainRuleTrail(ruleTrail: string[]): string[] {
  return Array.from(new Set(ruleTrail))
}
