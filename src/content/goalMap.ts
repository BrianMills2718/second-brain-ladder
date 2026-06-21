/**
 * Personalized goals (MVP): map free-text to an achievement node via a static
 * keyword ruleset. Selecting it highlights that achievement's prerequisite sub-DAG.
 */
import { nodeById } from "./graph";

interface Rule { match: RegExp; goal: string; }

const RULES: Rule[] = [
  { match: /second brain|model|design|ontolog|schema|class|reason|build/i, goal: "a-model" },
];

export interface ResolvedGoal { goal: string; title: string; }

export function resolveGoal(text: string): ResolvedGoal | null {
  const t = text.trim();
  if (!t) return null;
  for (const r of RULES) {
    if (r.match.test(t)) {
      const node = nodeById(r.goal);
      if (node) return { goal: r.goal, title: node.title };
    }
  }
  return null;
}
