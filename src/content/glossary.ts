/**
 * Glossary — a browseable reference for the drawer. (Lessons drive their inline
 * definitions through the concept panels + `@n{}` chips; these entries are for
 * look-up, not closure.)
 */
import type { GlossaryEntry } from "../types";
import { CONCEPT_GRAPH, CONCEPT_BY_ID } from "./concepts";

/** Hand-curated entries (better-worded than the auto-derived, or with extra
 *  cross-links). These OVERRIDE the derived entry for the same term. */
const CURATED: GlossaryEntry[] = [
  { term: "knowledge graph", definition: "Facts represented as a graph of entities connected by named relations (triples). The data layer of a second brain.", example: "Your notes + who/what they reference.", related: ["triple", "ontology"] },
  { term: "triple", definition: "A (subject, predicate, object) statement — the atom of a knowledge graph.", example: "`(Ada, wrote, note_1)`.", related: ["knowledge graph", "RDF"] },
  { term: "entity", definition: "An individual thing the graph knows about — a person, note, or idea.", example: "`Ada_Lovelace`.", related: ["class"] },
  { term: "class", definition: "A category of entities — the kind a thing is (vs the individual thing).", example: "`Person`, `Note`.", related: ["entity", "subclass"] },
  { term: "subclass", definition: "An is-a relationship between classes; subclass members are superclass members.", example: "`Researcher ⊑ Person`.", related: ["class", "ontology"] },
  { term: "ontology", definition: "The schema + axioms (TBox): classes, the class hierarchy, and property rules that give data meaning and enable reasoning.", example: "OWL/RDFS schema.", related: ["TBox", "knowledge graph"] },
  { term: "TBox", definition: "The terminology box — the schema/ontology (classes, properties, axioms).", example: "`Researcher ⊑ Person`.", related: ["ABox", "ontology"] },
  { term: "ABox", definition: "The assertion box — the data: facts about specific individuals.", example: "`:Ada a :Researcher .`", related: ["TBox"] },
  { term: "RDF", definition: "A knowledge-graph model of triples whose names are global IRIs; the basis of OWL semantics and reasoning.", example: "Turtle, SPARQL.", related: ["triple", "property graph"] },
  { term: "property graph", definition: "A KG model (Neo4j-style) with key/value properties on nodes and edges; fast, flexible, no built-in logical semantics.", example: "Cypher.", related: ["RDF"] },
  { term: "entailment", definition: "A fact that follows logically from a graph + ontology — derivable by a reasoner even if never stored.", example: "`Ada:Person` from `Ada:Researcher` + `Researcher⊑Person`.", related: ["reasoner", "open-world assumption"] },
  { term: "reasoner", definition: "Software that computes entailments, classifies entities, and detects contradictions from an ontology + data.", example: "HermiT, ELK, a SHACL/rules engine.", related: ["entailment"] },
  { term: "open-world assumption", definition: "Absence of a fact means 'unknown', not 'false' (RDF/OWL). Contrast the closed-world assumption of databases.", example: "No `Ada knows Bob` triple ≠ Ada doesn't know Bob.", related: ["entailment"] },
  { term: "embedding", definition: "A learned vector representation of an entity/relation; supports similarity & link prediction, but carries no guarantees.", example: "node2vec, TransE, text embeddings.", related: ["neurosymbolic"] },
  { term: "neurosymbolic", definition: "Combining learned (neural) and explicit (symbolic) representations — e.g. LLM extracts triples, the ontology/reasoner validates them.", example: "LLM proposes, SHACL/reasoner verifies.", related: ["embedding", "ontology"] },
];

/** Strip inline chips to plain text for the lookup drawer. */
const plain = (s: string): string => s.replace(/@[cnt]\{([^}|]+)(?:\|[^}]+)?\}/g, "$1");

/** One entry per concept, derived from its definition. Guarantees the glossary
 *  covers every concept (R4) and can't drift from concepts.ts — the gate in
 *  validate-content.mjs enforces this. Curated entries override by term. */
const curatedTerms = new Set(CURATED.map((e) => e.term.toLowerCase()));
const DERIVED: GlossaryEntry[] = CONCEPT_GRAPH.concepts
  .filter((c) => !curatedTerms.has(c.term.toLowerCase()))
  .map((c) => ({
    term: c.term,
    definition: plain(c.short),
    example: c.example ? plain(c.example) : undefined,
    related: [...new Set([...(c.prerequisites ?? []), ...(c.contrasts ?? [])])]
      .map((id) => CONCEPT_BY_ID[id]?.term)
      .filter((t): t is string => !!t)
      .slice(0, 5),
  }));

export const GLOSSARY: GlossaryEntry[] = [...CURATED, ...DERIVED].sort((a, b) =>
  a.term.localeCompare(b.term),
);

export const GLOSSARY_INDEX: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((e) => [e.term.toLowerCase(), e]),
);
