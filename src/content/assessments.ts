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
  trustNeural: { id: "trust-neural", description: "Treats LLM-extracted triples or embedding similarity as trusted facts, skipping the verify step.", remediationNodeIds: ["c-neural"], fatal: true },
  noVerify: { id: "no-verify", description: "Assumes ontology-grounded extraction removes the need to verify (reasoner/SHACL), or drops provenance once facts mix.", remediationNodeIds: ["c-neurosymbolic"], fatal: true },
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
  "rub-pipeline": {
    id: "rub-pipeline",
    criteria: [
      { id: "loop", description: "Describes a concrete propose→verify loop: neural proposes (extraction/similarity), symbolic verifies (reasoner/SHACL), survivors stored.", maxScore: 35 },
      { id: "grounding", description: "Uses ontology-grounded extraction so candidates are on-schema by construction.", maxScore: 20 },
      { id: "validation", description: "Names a real verification step (SHACL shape or reasoner consistency check) that would reject a bad candidate.", maxScore: 25 },
      { id: "provenance", description: "Tracks provenance (source + extractor + confidence) once asserted/derived/extracted facts mix.", maxScore: 20 },
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
  T({
    id: "cap-pipeline",
    nodeId: "a-pipeline",
    kind: "hybrid",
    title: "Design a propose→verify brain",
    prompt: "Spec a neurosymbolic second brain that turns your prose into a trustworthy knowledge graph.",
    deterministic: [
      {
        id: "pipeline-q1", type: "classification",
        prompt: "Sort each step into the propose (neural) or verify (symbolic) half.",
        buckets: ["Propose (neural)", "Verify (symbolic)"],
        items: [
          { id: "a", label: "LLM extracts candidate triples from a note", correctBucket: "Propose (neural)" },
          { id: "b", label: "Reasoner checks the triples are type-consistent", correctBucket: "Verify (symbolic)" },
          { id: "c", label: "Embedding similarity suggests two notes are about the same thing", correctBucket: "Propose (neural)" },
          { id: "d", label: "A SHACL shape rejects a `Note` with no `title`", correctBucket: "Verify (symbolic)" },
        ],
        explanation: "Neural methods propose candidates; symbolic methods (reasoner, shapes) verify them before they're trusted.",
      },
    ],
    openEnded: { prompt: "For a domain you care about: (1) describe the propose→verify loop end-to-end; (2) say how you'd ground extraction in your ontology so candidates are on-schema; (3) name one SHACL shape or reasoner check that would reject a bad candidate; (4) say what provenance you'd record on each stored fact and why.", rubricId: "rub-pipeline" },
    requiredConcepts: ["propose-verify", "ontology-grounded-extraction", "shacl-validation", "provenance"],
    fatalMisconceptions: [M.trustNeural, M.noVerify],
    passThreshold: 0.8,
  }),
];

export const ASSESSMENT_BY_ID: Record<string, AssessmentTask> = Object.fromEntries(
  ASSESSMENTS.map((a) => [a.id, a]),
);
