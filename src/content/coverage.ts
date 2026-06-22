/**
 * Machine-readable domain-coverage contract (R6 / docs/DOMAIN_COVERAGE.md). The
 * gate in validate-content.mjs asserts every REQUIRED key-idea exists as a concept
 * (FAIL on missing), and surfaces DEFERRED ideas as advisory. This turns the prose
 * coverage map into an enforced contract: the curriculum can't silently lose a core
 * idea, and "won't do yet" is explicit rather than an accidental gap.
 */

// RESCOPE MIGRATION (2026-06-22, docs/RESCOPE_PLAN.md / DOMAIN_COVERAGE.md): the contract
// is being re-pointed off the 2018 symbolic-KG scope onto the decision-first, three-paradigm
// scope. REQUIRED_CONCEPTS below is still the LEGACY set (so `npm run check` stays green);
// R1 migrates it to the new Tier-A target concept-by-concept as those concepts are authored
// (the ratchet) — add a new id here only once its concept exists in concepts.ts.

/** Tier-A key ideas that MUST exist as concepts (by id). [legacy set — migrating in R1] */
export const REQUIRED_CONCEPTS: string[] = [
  // modeling
  "literal", "object-property", "datatype-property", "n-ary-relation", "reification",
  "named-graph", "temporal-validity",
  // querying (the "queryable" promise)
  "query", "basic-graph-pattern", "sparql", "cypher",
  // ontology engineering & reuse
  "taxonomy", "thesaurus", "competency-question", "ontology-reuse",
  // OWL expressivity / reasoning
  "disjointness", "validation", "cardinality-restriction", "existential-restriction",
  "universal-restriction", "property-chain", "defined-class",
  // neurosymbolic spine
  "entailment", "reasoner", "open-world-assumption", "closed-world-assumption",
  "consistency", "llm-extraction", "hallucination", "entity-resolution",
  "neurosymbolic", "propose-verify", "provenance",
  // retrieval decision ladder (R1 rescope, sb-retrieve — Slice 1)
  "retrieval", "keyword-search", "vector-search", "hybrid-search",
  "rag", "graphrag", "agentic-retrieval", "llm-wiki",
  // framing: three ways to build a second brain + how to choose (R1 rescope, sb-framing — Slice 3)
  "second-brain", "pkm-bridge", "second-brain-paradigms",
  "representation-choice", "schema-valid-vs-true",
];

/** Tier-A/B ideas explicitly DEFERRED (advisory, not a gate failure). Each will be
 *  a concept when its branch is built; listing them keeps "missing" ≠ "won't do". */
export const DEFERRED_CONCEPTS: { id: string; note: string }[] = [
  { id: "rdfs", note: "RDFS as a named standard (rdf-graph + subclass cover the substance)" },
  { id: "owl-profiles", note: "OWL 2 EL/QL/RL profiles (description-logic covers the family)" },
  { id: "gnn", note: "graph neural networks (message passing, R-GCN) — Frontier track" },
  { id: "evaluation-metrics", note: "precision/recall/F1, MRR, Hits@K, calibration — eval module (UPCOMING)" },
  { id: "reasoning-families", note: "Datalog, forward/backward chaining, non-monotonic — module (UPCOMING)" },
  { id: "governance-fair", note: "FAIR, lineage, access control, epistemic status — module (UPCOMING)" },
];
