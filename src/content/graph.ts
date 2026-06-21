/**
 * The skill DAG. Concept nodes carry lesson content; achievement nodes are
 * capstones. The concept→concept prerequisite backbone is DERIVED from the
 * concept graph (concepts.ts) via deriveStageEdges() — edit concepts.ts, not
 * here. Only the achievement overlay and the non-gating orientation link are
 * hand-authored.
 */
import type { SkillGraph, SkillNode, SkillEdge } from "../types";
import { deriveStageEdges, transitiveReduction } from "./derive";

const concept = (
  id: string,
  branch: SkillNode["branch"],
  lessonId: string,
  title: string,
  shortDescription: string,
  position: { x: number; y: number },
): SkillNode => ({ id, kind: "concept", branch, lessonId, title, shortDescription, position });

const achievement = (
  id: string,
  branch: SkillNode["branch"],
  title: string,
  shortDescription: string,
  assessmentIds: string[],
  position: { x: number; y: number },
): SkillNode => ({ id, kind: "achievement", branch, title, shortDescription, assessmentIds, position });

const NODES: SkillNode[] = [
  concept("c-orientation", "foundations", "sb-orientation", "Build a Second Brain", "A 2-min overview you can skip and return to.", { x: 320, y: -160 }),
  concept("c-kg", "knowledge-graphs", "sb-kg", "Knowledge Graphs", "Entities, relations, triples; RDF vs property graphs.", { x: 80, y: 80 }),
  concept("c-onto", "ontologies", "sb-onto", "Ontologies", "Classes, subclass, properties; TBox vs ABox.", { x: 360, y: 80 }),
  concept("c-reasoning", "reasoning", "sb-reasoning", "Meaning & Reasoning", "Entailment, reasoners, the open-world gotcha.", { x: 640, y: 40 }),
  concept("c-neural", "neural", "sb-neural", "The Neural Side & Identity", "Embeddings, LLM extraction, entity resolution.", { x: 360, y: 320 }),
  concept("c-neurosymbolic", "neurosymbolic", "sb-neurosymbolic", "Neurosymbolic: Propose & Verify", "Neural proposes, symbolic verifies.", { x: 760, y: 300 }),

  achievement("a-model", "second-brain", "Model a Domain", "Design a small KG + ontology of your own.", ["cap-model"], { x: 220, y: 540 }),
  achievement("a-reason", "reasoning", "Reason Over Your Brain", "Use disjointness, property chains, and classification.", ["cap-reason"], { x: 640, y: 540 }),
  achievement("a-pipeline", "second-brain", "Design a Propose→Verify Brain", "Spec a neurosymbolic second brain.", ["cap-pipeline"], { x: 1040, y: 300 }),
];

const STAGE_TO_NODE: Record<string, string> = {};
for (const n of NODES) if (n.lessonId) STAGE_TO_NODE[n.lessonId] = n.id;

const DERIVED_PREREQS: [string, string][] = deriveStageEdges()
  .map(([a, b]) => [STAGE_TO_NODE[a], STAGE_TO_NODE[b]] as [string, string])
  .filter(([a, b]) => !!a && !!b);

const PEDAGOGICAL_PREREQS: [string, string][] = [];

const CONCEPT_PREREQS: [string, string][] = transitiveReduction(
  Array.from(
    new Map([...DERIVED_PREREQS, ...PEDAGOGICAL_PREREQS].map((e) => [`${e[0]}>${e[1]}`, e])).values(),
  ),
);

const ACHIEVEMENT_PREREQS: [string, string][] = [
  ["c-kg", "a-model"],
  ["c-onto", "a-model"],
  ["c-onto", "a-reason"],
  ["c-reasoning", "a-reason"],
  ["c-reasoning", "a-pipeline"],
  ["c-neural", "a-pipeline"],
  ["c-neurosymbolic", "a-pipeline"],
];

const PREREQS: [string, string][] = [...CONCEPT_PREREQS, ...ACHIEVEMENT_PREREQS];

/** Soft, non-gating link: the orientation map points to the starting atom. */
const ORIENTS: [string, string][] = [["c-orientation", "c-kg"]];

const EDGES: SkillEdge[] = [
  ...PREREQS.map(([source, target], i) => ({ id: `e${i}`, source, target, kind: "prerequisite_for" as const })),
  ...ORIENTS.map(([source, target], i) => ({ id: `o${i}`, source, target, kind: "orients" as const })),
];

export const SKILL_GRAPH: SkillGraph = { nodes: NODES, edges: EDGES };

export const ROOT_GOAL_ID = "a-pipeline";

export function nodeById(id: string): SkillNode | undefined {
  return SKILL_GRAPH.nodes.find((n) => n.id === id);
}

export function nodeForLesson(lessonId: string): SkillNode | undefined {
  return SKILL_GRAPH.nodes.find((n) => n.lessonId === lessonId);
}

export function achievements(): SkillNode[] {
  return SKILL_GRAPH.nodes.filter((n) => n.kind === "achievement");
}

export function prereqsOf(id: string): string[] {
  return SKILL_GRAPH.edges
    .filter((e) => e.kind === "prerequisite_for" && e.target === id)
    .map((e) => e.source);
}

export function ancestorsOf(id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...prereqsOf(id)];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    stack.push(...prereqsOf(n));
  }
  return seen;
}
