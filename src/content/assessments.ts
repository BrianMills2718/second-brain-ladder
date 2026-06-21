/**
 * Achievement capstones. Each achievement node is earned by passing one of these
 * — a deterministic component (Quiz engine) + an open-ended design graded by the
 * LLM judge (self-assess if no backend). Fatal misconceptions fail regardless and
 * route to remediation.
 */
import type { AssessmentTask, Misconception, Rubric } from "../types";

const M: Record<string, Misconception> = {
  dataMeaning: { id: "data-meaning", description: "Puts the meaning/rules in the data instead of the ontology (TBox), or treats the KG as already knowing what its links mean.", remediationNodeIds: ["c-onto"], fatal: true },
  closedWorld: { id: "closed-world", description: "Assumes a fact not stored is false (closed-world) where RDF/OWL is open-world.", remediationNodeIds: ["c-onto"], fatal: true },
  pgReasons: { id: "pg-reasons", description: "Claims a property graph supports logical reasoning/entailment the way RDF/OWL does.", remediationNodeIds: ["c-kg"], fatal: true },
};

export const RUBRICS: Record<string, Rubric> = {
  "rub-model": {
    id: "rub-model",
    criteria: [
      { id: "triples", description: "Gives concrete entities/relations and at least a few well-formed triples for a chosen domain.", maxScore: 30 },
      { id: "schema", description: "Separates a small TBox (classes, a subclass, a typed property) from the ABox data.", maxScore: 35 },
      { id: "reasoning", description: "Identifies one fact a reasoner would entail (e.g. via subclass) — derivation, not lookup.", maxScore: 25 },
      { id: "choice", description: "Makes a defensible RDF-vs-property-graph choice for the use case.", maxScore: 10 },
    ],
  },
};

const T = (t: AssessmentTask): AssessmentTask => t;

export const ASSESSMENTS: AssessmentTask[] = [
  T({
    id: "cap-model",
    nodeId: "a-model",
    kind: "hybrid",
    title: "Model a domain",
    prompt: "Design a tiny second brain for a domain you care about (your reading, a project, your notes).",
    deterministic: [
      {
        id: "model-q1", type: "classification",
        prompt: "Sort each statement into schema (TBox) or data (ABox).",
        buckets: ["TBox (schema)", "ABox (data)"],
        items: [
          { id: "a", label: "`Paper ⊑ Document`", correctBucket: "TBox (schema)" },
          { id: "b", label: "`:GEB a :Book`", correctBucket: "ABox (data)" },
          { id: "c", label: "`cites: domain Document, range Document`", correctBucket: "TBox (schema)" },
          { id: "d", label: "`:note_1 :cites :GEB`", correctBucket: "ABox (data)" },
        ],
        explanation: "Class/subclass axioms and property typing are schema; specific facts about individuals are data.",
      },
    ],
    openEnded: { prompt: "For your chosen domain: (1) list a few entities and relations and write 3–4 triples; (2) give a tiny TBox (a class, a subclass, a typed property); (3) name one fact a reasoner would *entail* (not stored); (4) say whether you'd use RDF or a property graph, and why.", rubricId: "rub-model" },
    requiredConcepts: ["triple", "ontology", "subclass", "entailment"],
    fatalMisconceptions: [M.dataMeaning, M.closedWorld, M.pgReasons],
    passThreshold: 0.8,
  }),
];

export const ASSESSMENT_BY_ID: Record<string, AssessmentTask> = Object.fromEntries(
  ASSESSMENTS.map((a) => [a.id, a]),
);
