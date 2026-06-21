/**
 * Machine-readable domain-coverage contract (R6 / docs/DOMAIN_COVERAGE.md). The
 * gate in validate-content.mjs asserts every REQUIRED key-idea exists as a concept
 * (FAIL on missing), and surfaces DEFERRED ideas as advisory. This turns the prose
 * coverage map into an enforced contract: the curriculum can't silently lose a core
 * idea, and "won't do yet" is explicit rather than an accidental gap.
 */

/** Tier-A key ideas that MUST exist as concepts (by id). */
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
];

/** Tier-A/B ideas explicitly DEFERRED (advisory, not a gate failure). Each will be
 *  a concept when its branch is built; listing them keeps "missing" ≠ "won't do". */
export const DEFERRED_CONCEPTS: { id: string; note: string }[] = [
  { id: "rdfs", note: "RDFS as a named standard (rdf-graph + subclass cover the substance)" },
  { id: "owl-profiles", note: "OWL 2 EL/QL/RL profiles (description-logic covers the family)" },
  { id: "knowledge-fusion", note: "multi-source fusion / conflict resolution (construction branch)" },
  { id: "link-prediction", note: "KG-ML link prediction / graph completion" },
  { id: "kg-rag", note: "KG-grounded retrieval-augmented generation" },
  { id: "ner-extraction", note: "decompose llm-extraction into NER / entity-linking / relation-extraction" },
];
