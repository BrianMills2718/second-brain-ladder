/**
 * Concept dependency DAG (ADR-0002) for the Second Brain curriculum — the source
 * of truth. Hand-expanded (2026-06-21) from a thin 11-concept chain to a richer,
 * non-linear graph to surface what authoring machinery is needed (see
 * docs/MACHINERY_NEEDED.md). Every prerequisite has a PREREQ_WHY + PREREQ_KIND.
 *
 * Stage order (introducedIn) is load-bearing: a prerequisite must be introduced
 * in the same or an EARLIER stage. Cross-branch edges (e.g. entity-resolution →
 * similarity) forced the stage banding below — a manual ordering pain (R8).
 *   sb-kg(1) → sb-onto(2) → sb-reasoning(3) → sb-neural(4) → sb-neurosymbolic(5)
 */
import type { Concept, ConceptGraph } from "../types";

const CONCEPTS: Concept[] = [
  // ============ sb-kg: knowledge graphs ============
  { id: "entity", term: "entity", layer: "data", primitive: true,
    short: "A thing your second brain knows about — a person, place, idea, paper, or note. The 'nouns'.",
    example: "`Ada_Lovelace`, `category_theory`, `note_2026`.",
    prerequisites: [], contrasts: ["class", "literal"], introducedIn: "sb-kg",
    microQuiz: [{ id: "mq-entity", type: "true-false", prompt: "True or false: an entity is a specific *thing*, not a category of things.", correct: true, explanation: "An entity is one individual; its category is a class." }] },
  { id: "relation", term: "relation", layer: "data",
    short: "A named, directed link from one @c{entity} to another — the 'verbs'.",
    example: "`wrote`, `cites`, `is_about`.",
    prerequisites: ["entity"], introducedIn: "sb-kg" },
  { id: "iri", term: "IRI", layer: "system",
    short: "A global identifier (a URI) for an @c{entity} or @c{relation}, so the same thing means the same thing across datasets.",
    example: "`http://ex.org/Ada` rather than a bare `Ada`.",
    prerequisites: ["entity", "relation"], introducedIn: "sb-kg" },
  { id: "triple", term: "triple", layer: "data",
    short: "The atom of a knowledge graph: a subject, a predicate (@c{relation}), and an object @c{entity}.",
    example: "`(Ada, wrote, note_1)`.",
    prerequisites: ["entity", "relation"], contrasts: ["embedding"], introducedIn: "sb-kg",
    microQuiz: [{ id: "mq-triple", type: "multiple-choice", prompt: "Which is a well-formed triple?", options: ["`Ada`", "`(Ada, wrote, note_1)`", "`wrote`", "`Ada wrote`"], correct: 1, explanation: "Subject–predicate–object." }] },
  { id: "literal", term: "literal", layer: "data", band: "foundations",
    short: "A data *value* at the object end of a @c{triple} — a date, number, or string — rather than another @c{entity}.",
    example: "`(note_1, created, \"2026-06-21\")` — the object is a literal, not an entity.",
    prerequisites: ["triple"], contrasts: ["entity"], introducedIn: "sb-kg" },
  { id: "knowledge-graph", term: "knowledge graph", layer: "data",
    short: "A set of @c{triple}s — your facts as a graph. The data layer; it holds *what is connected*, not what it means.",
    example: "All your notes + their references as one graph.",
    prerequisites: ["triple"], contrasts: ["ontology"], introducedIn: "sb-kg",
    microQuiz: [{ id: "mq-kg", type: "true-false", prompt: "True or false: a knowledge graph is data; the meaning/rules live in a separate ontology.", correct: true, explanation: "KG = data; ontology = schema + axioms." }] },
  { id: "property-graph", term: "property graph", layer: "system",
    short: "A @c{knowledge-graph} model (Neo4j) with key/value properties on nodes & edges — fast, flexible, but no formal logical semantics.",
    example: "Cypher: `(:Person {name:'Ada'})-[:WROTE]->(:Note)`.",
    prerequisites: ["knowledge-graph"], contrasts: ["rdf-graph"], introducedIn: "sb-kg" },
  { id: "rdf-graph", term: "RDF graph", layer: "system",
    short: "A @c{knowledge-graph} model of @c{triple}s named by @c{iri}s — the basis for formal semantics and reasoning.",
    example: "Turtle: `:Ada :wrote :note_1 .`",
    prerequisites: ["knowledge-graph", "triple", "iri"], contrasts: ["property-graph"], introducedIn: "sb-kg" },

  // ============ sb-onto: ontologies ============
  { id: "class", term: "class", layer: "schema",
    short: "A category of @c{entity}s — the *kind* a thing is.",
    example: "`Person`, `Note`, `Paper`.",
    prerequisites: ["entity"], contrasts: ["entity"], introducedIn: "sb-onto" },
  { id: "instance", term: "instance", layer: "schema",
    short: "An @c{entity} asserted to be a member of a @c{class}.",
    example: "`Ada a Person`.",
    prerequisites: ["entity", "class"], introducedIn: "sb-onto" },
  { id: "subclass", term: "subclass", layer: "schema",
    short: "An is-a relationship between @c{class}es: subclass members are superclass members.",
    example: "`Researcher ⊑ Person`.",
    prerequisites: ["class"], contrasts: ["sameas"], introducedIn: "sb-onto" },
  { id: "property-schema", term: "property (schema)", layer: "schema",
    short: "A @c{relation} declared in the schema with a domain and range — what kind of thing can link to what.",
    example: "`wrote: Person → Note`.",
    prerequisites: ["relation", "class"], introducedIn: "sb-onto" },
  { id: "tbox", term: "TBox", layer: "schema",
    short: "The terminology box: the schema — @c{class}es, @c{property-schema} declarations, and axioms.",
    example: "`Researcher ⊑ Person`, `wrote: Person→Note`.",
    prerequisites: ["class", "property-schema"], contrasts: ["abox"], introducedIn: "sb-onto" },
  { id: "abox", term: "ABox", layer: "data",
    short: "The assertion box: the data — facts about specific @c{instance}s.",
    example: "`:Ada a :Researcher .`",
    prerequisites: ["instance"], contrasts: ["tbox"], introducedIn: "sb-onto" },
  { id: "disjointness", term: "disjointness", layer: "schema", band: "practitioner",
    short: "An axiom that two @c{class}es share no members — so claiming something is *both* is a contradiction a reasoner can catch.",
    example: "`Person` and `Note` disjoint ⇒ nothing is both a Person and a Note.",
    prerequisites: ["class"], introducedIn: "sb-onto" },
  { id: "ontology", term: "ontology", layer: "schema",
    short: "The schema + axioms (the @c{tbox} plus the @c{subclass} hierarchy and @c{property-schema} rules) that give your knowledge graph *meaning*.",
    example: "An OWL/RDFS ontology.",
    prerequisites: ["tbox", "subclass", "property-schema"], contrasts: ["knowledge-graph"], introducedIn: "sb-onto" },

  // ============ sb-reasoning: logic & reasoning ============
  { id: "axiom", term: "axiom", layer: "logic",
    short: "A statement taken as given in the schema — a @c{subclass} fact or a @c{property-schema} rule is an axiom.",
    example: "`Researcher ⊑ Person` is an axiom.",
    prerequisites: ["subclass", "property-schema"], introducedIn: "sb-reasoning" },
  { id: "entailment", term: "entailment", layer: "logic",
    short: "A fact that follows logically from your @c{triple}s + @c{ontology} + @c{axiom}s — derivable even though you never stored it.",
    example: "`Ada:Person` from `Ada:Researcher` + `Researcher⊑Person`.",
    prerequisites: ["triple", "ontology", "axiom"], contrasts: ["hallucination", "validation"], introducedIn: "sb-reasoning",
    microQuiz: [{ id: "mq-ent", type: "true-false", prompt: "True or false: entailment is derived (it follows logically), not looked up.", correct: true, explanation: "A reasoner derives entailed facts from data + axioms." }] },
  { id: "reasoner", term: "reasoner", layer: "logic",
    short: "Software that computes @c{entailment}s, classifies entities, and detects contradictions from an @c{ontology} + data.",
    example: "HermiT, ELK, a rules engine.",
    prerequisites: ["entailment", "ontology"], contrasts: ["llm-extraction"], introducedIn: "sb-reasoning" },
  { id: "open-world-assumption", term: "open-world assumption", layer: "logic",
    short: "Absence of a fact means *unknown*, not *false* (RDF/OWL). The #1 modeling gotcha.",
    example: "No `Ada knows Bob` triple ≠ Ada doesn't know Bob.",
    prerequisites: ["entailment"], contrasts: ["closed-world-assumption"], introducedIn: "sb-reasoning" },
  { id: "closed-world-assumption", term: "closed-world assumption", layer: "logic",
    short: "Absence of a fact means *false* (databases, SPARQL `NOT EXISTS`). The opposite default to OWL.",
    example: "A SQL query returns no row ⇒ treated as 'no such fact'.",
    prerequisites: ["entailment"], contrasts: ["open-world-assumption"], introducedIn: "sb-reasoning" },
  { id: "consistency", term: "consistency", layer: "logic",
    short: "Whether your @c{axiom}s + data contain no contradiction — a @c{reasoner} can check it.",
    example: "The bad triple `note_1 wrote Ada` entails `note_1 a Person` (domain of `wrote`); with `Person`/`Note` @c{disjointness} and `note_1 a Note`, that's inconsistent.",
    prerequisites: ["reasoner", "axiom", "disjointness"], introducedIn: "sb-reasoning" },
  { id: "transitive-property", term: "transitive property", layer: "logic", band: "foundations",
    short: "A @c{property-schema} where A→B and B→C @c{entailment}s A→C — chains close automatically.",
    example: "`ancestorOf` transitive: Ada ancestorOf Bob, Bob ancestorOf Cy ⇒ Ada ancestorOf Cy.",
    prerequisites: ["property-schema", "entailment"], introducedIn: "sb-reasoning" },
  { id: "property-chain", term: "property chain", layer: "logic", band: "foundations",
    short: "An @c{axiom} that *composing* two @c{property-schema}s @c{entailment}s a third — 'the father of my father is my grandfather'.",
    example: "`hasParent ∘ hasParent ⊑ hasGrandparent`.",
    prerequisites: ["property-schema", "axiom", "entailment"], introducedIn: "sb-reasoning" },
  { id: "inverse-property", term: "inverse property", layer: "logic", band: "foundations",
    short: "A @c{property-schema} declared the reverse of another, so asserting one @c{entailment}s the other.",
    example: "`hasParent` inverse of `hasChild`: `Ada hasChild Bob` ⇒ `Bob hasParent Ada`.",
    prerequisites: ["property-schema", "entailment"], introducedIn: "sb-reasoning" },
  { id: "symmetric-property", term: "symmetric property", layer: "logic", band: "practitioner",
    short: "A @c{property-schema} that holds both ways: A→B @c{entailment}s B→A.",
    example: "`siblingOf`: `Ada siblingOf Bob` ⇒ `Bob siblingOf Ada`.",
    prerequisites: ["property-schema", "entailment"], introducedIn: "sb-reasoning" },
  { id: "cardinality-restriction", term: "cardinality restriction", layer: "logic", band: "practitioner",
    short: "An @c{axiom} bounding how many values a @c{property-schema} may take — at-least, at-most, or exactly N.",
    example: "A `Person` has exactly one `biologicalMother`.",
    prerequisites: ["property-schema", "axiom"], introducedIn: "sb-reasoning" },
  { id: "functional-property", term: "functional property", layer: "logic", band: "practitioner",
    short: "A @c{cardinality-restriction} of at-most-one. Two values *known to differ* (e.g. distinct literals) are a @c{consistency} violation; two differently-*named* individuals are instead inferred to be the same thing (open-world, no unique names).",
    example: "`hasBirthYear` functional: 1815 and 1816 are distinct literals, so asserting both for one person is inconsistent.",
    prerequisites: ["cardinality-restriction", "property-schema", "consistency"], introducedIn: "sb-reasoning" },
  { id: "description-logic", term: "description logic", layer: "logic",
    short: "The decidable fragment of logic under OWL — @c{class}es as concepts, @c{property-schema} as roles, @c{subclass} as subsumption.",
    example: "OWL 2 EL/DL profiles.",
    prerequisites: ["class", "property-schema", "subclass"], introducedIn: "sb-reasoning" },
  { id: "rule", term: "inference rule (SWRL)", layer: "logic", band: "practitioner",
    short: "An if-then rule that *derives* new @c{triple}s from existing ones — open-world inference (SWRL/Datalog), the opposite of a validation shape, which only flags.",
    example: "`hasParent(x,y) ∧ hasParent(y,z) ⇒ hasGrandparent(x,z)`.",
    prerequisites: ["triple", "ontology"], contrasts: ["validation"], introducedIn: "sb-reasoning" },
  { id: "validation", term: "validation", layer: "logic", band: "practitioner",
    short: "Checking data against constraints (shapes) and *reporting* violations — closed-world, and crucially **not** @c{entailment}: validation never derives new facts, it only flags bad ones.",
    example: "A shape: every `Note` must have a `title`; data without one is reported, not repaired.",
    prerequisites: ["entailment", "closed-world-assumption"], contrasts: ["entailment", "rule"], introducedIn: "sb-reasoning" },

  // ============ sb-neural: the neural side ============
  { id: "embedding", term: "embedding", layer: "neural",
    short: "A learned vector representation of an @c{entity} — captures fuzzy similarity, with no guarantees.",
    example: "A 768-dim vector for `category_theory`.",
    prerequisites: ["entity"], contrasts: ["triple"], introducedIn: "sb-neural" },
  { id: "similarity", term: "similarity", layer: "neural",
    short: "Closeness of two @c{embedding}s — 'these are about the same thing', fuzzily.",
    example: "cosine(`CT_note`, `monad_note`) = 0.81.",
    prerequisites: ["embedding"], introducedIn: "sb-neural" },
  { id: "kg-embedding", term: "KG embedding", layer: "neural",
    short: "An @c{embedding} that encodes @c{knowledge-graph} structure, for similarity and link prediction.",
    example: "TransE, ComplEx.",
    prerequisites: ["embedding", "knowledge-graph"], introducedIn: "sb-neural" },
  { id: "llm-extraction", term: "LLM extraction", layer: "neural",
    short: "Using an LLM to turn unstructured text into @c{triple}s — powerful, but unverified.",
    example: "'Ada wrote a note on CT' → `(Ada, wrote, note)`.",
    prerequisites: ["triple"], contrasts: ["reasoner"], introducedIn: "sb-neural" },
  { id: "hallucination", term: "hallucination", layer: "neural",
    short: "Confident-but-wrong output from @c{llm-extraction} — a fact that looks fine but isn't supported.",
    example: "Inventing a citation that doesn't exist.",
    prerequisites: ["llm-extraction"], contrasts: ["entailment"], introducedIn: "sb-neural" },

  // ============ sb-identity: identity & resolution ============
  { id: "identifier", term: "identifier", layer: "data",
    short: "The name you use for an @c{entity}. Two identifiers may or may not denote the same thing.",
    example: "`:Ada`, `:A_Lovelace`, `wd:Q7259`.",
    prerequisites: ["entity"], introducedIn: "sb-neural" },
  { id: "sameas", term: "sameAs", layer: "schema",
    short: "An assertion that two @c{identifier}s denote the *same* @c{entity}. Not subclass — same individual.",
    example: "`:Ada owl:sameAs wd:Q7259 .`",
    prerequisites: ["identifier", "entity"], contrasts: ["subclass"], introducedIn: "sb-neural" },
  { id: "entity-resolution", term: "entity resolution", layer: "system",
    short: "Deciding when two records are the same @c{entity} — combining exact @c{sameas} links with fuzzy @c{similarity}.",
    example: "Merging `Ada Lovelace` and `A. Lovelace` into one node.",
    prerequisites: ["entity", "sameas", "similarity"], introducedIn: "sb-neural" },

  // ============ sb-neurosymbolic: combine ============
  { id: "neurosymbolic", term: "neurosymbolic", layer: "system",
    short: "Combining learned and explicit: let @c{llm-extraction} (neural) propose, and the @c{ontology} + @c{reasoner} (symbolic) verify and constrain.",
    example: "LLM drafts triples; the reasoner flags contradictions and shape validation rejects ill-shaped ones.",
    prerequisites: ["llm-extraction", "ontology", "reasoner"], introducedIn: "sb-neurosymbolic",
    microQuiz: [{ id: "mq-ns", type: "multiple-choice", prompt: "What does neurosymbolic mean for a second brain?", options: ["only neural", "only logic", "neural proposes, symbolic verifies/constrains", "no AI"], correct: 2, explanation: "Combine: neural proposes; symbolic verifies." }] },
  { id: "ontology-grounded-extraction", term: "ontology-grounded extraction", layer: "system",
    short: "@c{llm-extraction} constrained to the @c{ontology}'s classes & properties, so output is on-schema by construction.",
    example: "Force the LLM to emit only declared relations.",
    prerequisites: ["llm-extraction", "ontology"], introducedIn: "sb-neurosymbolic" },
  { id: "shacl-validation", term: "SHACL validation", layer: "system", band: "practitioner",
    short: "@c{validation} of extracted data against shape constraints — the verify step that catches bad @c{llm-extraction}. It *reports* violations; it does not derive facts.",
    example: "Reject any `Note` missing a `title`.",
    prerequisites: ["validation", "llm-extraction"], introducedIn: "sb-neurosymbolic" },
  { id: "propose-verify", term: "propose & verify", layer: "system",
    short: "The neurosymbolic loop: @c{llm-extraction} proposes; the @c{reasoner} checks consistency and @c{shacl-validation} checks shapes — the heart of @c{neurosymbolic} for a trustworthy brain.",
    example: "Draft → validate → accept/repair → store.",
    prerequisites: ["llm-extraction", "reasoner", "shacl-validation", "neurosymbolic"], introducedIn: "sb-neurosymbolic" },
  { id: "provenance", term: "provenance", layer: "system",
    short: "Recording where each @c{triple} came from (source, extractor, confidence) — essential once neural and symbolic facts mix.",
    example: "`note_1 wasDerivedFrom paper.pdf, by gpt-5-mini`.",
    prerequisites: ["triple"], introducedIn: "sb-neurosymbolic" },
];

export const CONCEPT_GRAPH: ConceptGraph = { concepts: CONCEPTS };

export const CONCEPT_BY_ID: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

/** Per-edge justification for every prerequisite, keyed `"concept>prerequisite"`. */
export const PREREQ_WHY: Record<string, string> = {
  "relation>entity": "a relation links entities",
  "iri>entity": "an IRI is a global name for an entity",
  "iri>relation": "an IRI also names relations, not just entities",
  "triple>entity": "a triple's subject and object are entities",
  "triple>relation": "a triple's predicate is a relation",
  "literal>triple": "a literal is the object value of a triple",
  "knowledge-graph>triple": "a knowledge graph is a set of triples",
  "property-graph>knowledge-graph": "a property graph is one model of a knowledge graph",
  "rdf-graph>knowledge-graph": "an RDF graph is one model of a knowledge graph",
  "rdf-graph>triple": "RDF is built from triples",
  "rdf-graph>iri": "RDF names every node/edge with an IRI",
  "class>entity": "a class is a category of entities",
  "instance>entity": "an instance is an entity",
  "instance>class": "an instance is a member of a class",
  "subclass>class": "subclass is a relationship between two classes",
  "property-schema>relation": "a schema property is a declared relation",
  "property-schema>class": "a property's domain and range are classes",
  "tbox>class": "the TBox declares the classes",
  "tbox>property-schema": "the TBox declares the properties",
  "abox>instance": "the ABox is the set of instance assertions",
  "disjointness>class": "disjointness is an axiom about two classes",
  "ontology>tbox": "an ontology is the TBox plus axioms",
  "ontology>subclass": "an ontology includes the subclass hierarchy",
  "ontology>property-schema": "an ontology declares the properties",
  "axiom>subclass": "a subclass statement is a kind of axiom",
  "axiom>property-schema": "a property declaration is a kind of axiom",
  "entailment>triple": "entailment produces new triples",
  "entailment>ontology": "entailment is relative to the ontology's meaning",
  "entailment>axiom": "entailment follows from the axioms",
  "reasoner>entailment": "a reasoner's job is to compute entailments",
  "reasoner>ontology": "a reasoner works over an ontology",
  "open-world-assumption>entailment": "OWA shapes what counts as entailed (unknown vs false)",
  "closed-world-assumption>entailment": "CWA shapes what counts as entailed (unknown vs false)",
  "consistency>reasoner": "a reasoner checks consistency",
  "consistency>axiom": "consistency is about the axioms not contradicting",
  "consistency>disjointness": "a disjointness axiom is what makes the example contradiction detectable",
  "validation>entailment": "validation is defined by contrast with inference/entailment",
  "validation>closed-world-assumption": "validation is closed-world (missing = violation)",
  "transitive-property>property-schema": "a transitive property is a property with an axiom",
  "transitive-property>entailment": "transitivity licenses entailments (chains close)",
  "property-chain>property-schema": "a chain composes properties",
  "property-chain>axiom": "a property-chain rule is an axiom",
  "property-chain>entailment": "the chain entails the composed relation",
  "inverse-property>property-schema": "an inverse relates two properties",
  "inverse-property>entailment": "the inverse entails the reverse direction",
  "symmetric-property>property-schema": "symmetry is a property characteristic",
  "symmetric-property>entailment": "symmetry entails the reverse direction",
  "cardinality-restriction>property-schema": "cardinality bounds a property's values",
  "cardinality-restriction>axiom": "a cardinality bound is an axiom",
  "functional-property>cardinality-restriction": "functional is at-most-one cardinality",
  "functional-property>property-schema": "functional is a property characteristic",
  "functional-property>consistency": "two known-distinct values violate consistency",
  "description-logic>class": "DL concepts are classes",
  "description-logic>property-schema": "DL roles are properties",
  "description-logic>subclass": "DL subsumption is the subclass relation",
  "rule>triple": "rules fire over and produce triples",
  "rule>ontology": "rules complement the ontology's axioms",
  "embedding>entity": "an embedding represents an entity",
  "similarity>embedding": "similarity compares embeddings",
  "kg-embedding>embedding": "a KG embedding is an embedding",
  "kg-embedding>knowledge-graph": "a KG embedding encodes graph structure",
  "llm-extraction>triple": "extraction produces triples",
  "hallucination>llm-extraction": "hallucination is a failure mode of extraction",
  "identifier>entity": "an identifier names an entity",
  "sameas>identifier": "sameAs relates two identifiers",
  "sameas>entity": "sameAs says they denote the same entity",
  "entity-resolution>entity": "entity resolution decides entity identity",
  "entity-resolution>sameas": "resolution produces sameAs links",
  "entity-resolution>similarity": "resolution uses fuzzy similarity to find candidates",
  "neurosymbolic>llm-extraction": "neurosymbolic uses neural extraction to propose",
  "neurosymbolic>ontology": "neurosymbolic uses the ontology to constrain/verify",
  "neurosymbolic>reasoner": "neurosymbolic uses the reasoner to verify",
  "ontology-grounded-extraction>llm-extraction": "it is extraction, constrained",
  "ontology-grounded-extraction>ontology": "the ontology supplies the constraints",
  "shacl-validation>validation": "SHACL is a concrete validation language",
  "shacl-validation>llm-extraction": "validation checks extracted data",
  "propose-verify>llm-extraction": "the propose step is extraction",
  "propose-verify>reasoner": "the verify step uses the reasoner for consistency",
  "propose-verify>shacl-validation": "the verify step uses shape validation",
  "propose-verify>neurosymbolic": "propose-verify is the core neurosymbolic loop",
  "provenance>triple": "provenance annotates triples with their source",
};

export function prereqWhy(concept: string, prereq: string): string | undefined {
  return PREREQ_WHY[`${concept}>${prereq}`];
}

/** Semantic KIND of each prerequisite edge (ADR-0005). Annotation only. */
export const PREREQ_KINDS = ["is-a", "part-of", "defined-via", "operates-on", "refines", "assumes"] as const;
export type PrereqKind = (typeof PREREQ_KINDS)[number];

export const PREREQ_KIND: Record<string, PrereqKind> = {
  "relation>entity": "operates-on",
  "iri>entity": "operates-on",
  "iri>relation": "operates-on",
  "triple>entity": "defined-via",
  "triple>relation": "defined-via",
  "literal>triple": "part-of",
  "knowledge-graph>triple": "part-of",
  "property-graph>knowledge-graph": "is-a",
  "rdf-graph>knowledge-graph": "is-a",
  "rdf-graph>triple": "defined-via",
  "rdf-graph>iri": "defined-via",
  "class>entity": "operates-on",
  "instance>entity": "is-a",
  "instance>class": "defined-via",
  "subclass>class": "operates-on",
  "property-schema>relation": "is-a",
  "property-schema>class": "defined-via",
  "tbox>class": "part-of",
  "tbox>property-schema": "part-of",
  "abox>instance": "part-of",
  "disjointness>class": "operates-on",
  "ontology>tbox": "part-of",
  "ontology>subclass": "part-of",
  "ontology>property-schema": "part-of",
  "axiom>subclass": "is-a",
  "axiom>property-schema": "is-a",
  "entailment>triple": "operates-on",
  "entailment>ontology": "defined-via",
  "entailment>axiom": "defined-via",
  "reasoner>entailment": "operates-on",
  "reasoner>ontology": "operates-on",
  "open-world-assumption>entailment": "refines",
  "closed-world-assumption>entailment": "refines",
  "consistency>reasoner": "defined-via",
  "consistency>axiom": "operates-on",
  "consistency>disjointness": "operates-on",
  "validation>entailment": "defined-via",
  "validation>closed-world-assumption": "assumes",
  "transitive-property>property-schema": "refines",
  "transitive-property>entailment": "operates-on",
  "property-chain>property-schema": "operates-on",
  "property-chain>axiom": "is-a",
  "property-chain>entailment": "operates-on",
  "inverse-property>property-schema": "refines",
  "inverse-property>entailment": "operates-on",
  "symmetric-property>property-schema": "refines",
  "symmetric-property>entailment": "operates-on",
  "cardinality-restriction>property-schema": "operates-on",
  "cardinality-restriction>axiom": "is-a",
  "functional-property>cardinality-restriction": "is-a",
  "functional-property>property-schema": "refines",
  "functional-property>consistency": "operates-on",
  "description-logic>class": "defined-via",
  "description-logic>property-schema": "defined-via",
  "description-logic>subclass": "defined-via",
  "rule>triple": "operates-on",
  "rule>ontology": "assumes",
  "embedding>entity": "operates-on",
  "similarity>embedding": "operates-on",
  "kg-embedding>embedding": "is-a",
  "kg-embedding>knowledge-graph": "operates-on",
  "llm-extraction>triple": "operates-on",
  "hallucination>llm-extraction": "refines",
  "identifier>entity": "operates-on",
  "sameas>identifier": "operates-on",
  "sameas>entity": "defined-via",
  "entity-resolution>entity": "operates-on",
  "entity-resolution>sameas": "defined-via",
  "entity-resolution>similarity": "assumes",
  "neurosymbolic>llm-extraction": "part-of",
  "neurosymbolic>ontology": "part-of",
  "neurosymbolic>reasoner": "part-of",
  "ontology-grounded-extraction>llm-extraction": "refines",
  "ontology-grounded-extraction>ontology": "assumes",
  "shacl-validation>validation": "is-a",
  "shacl-validation>llm-extraction": "operates-on",
  "propose-verify>llm-extraction": "part-of",
  "propose-verify>reasoner": "part-of",
  "propose-verify>shacl-validation": "part-of",
  "propose-verify>neurosymbolic": "refines",
  "provenance>triple": "operates-on",
};

export function prereqKindOf(concept: string, prereq: string): PrereqKind | undefined {
  return PREREQ_KIND[`${concept}>${prereq}`];
}

/** Direct prerequisite ids of a concept. */
export function conceptPrereqs(id: string): string[] {
  return CONCEPT_BY_ID[id]?.prerequisites ?? [];
}

/** All transitive prerequisites of a concept. */
export function conceptAncestors(id: string): Set<string> {
  const seen = new Set<string>();
  const stack = [...conceptPrereqs(id)];
  while (stack.length) {
    const n = stack.pop()!;
    if (seen.has(n)) continue;
    seen.add(n);
    stack.push(...conceptPrereqs(n));
  }
  return seen;
}

/** Concepts a given stage formally introduces. */
export function conceptsForStage(lessonId: string): Concept[] {
  return CONCEPTS.filter((c) => c.introducedIn === lessonId);
}

/** Out-of-page prerequisite concepts for a stage (ADR-0007). */
export function prerequisiteConceptsForStage(lessonId: string): Concept[] {
  const own = new Set(conceptsForStage(lessonId).map((c) => c.id));
  const prereqIds = new Set<string>();
  for (const c of conceptsForStage(lessonId))
    for (const p of c.prerequisites) if (!own.has(p)) prereqIds.add(p);
  return conceptTopoOrder()
    .filter((id) => prereqIds.has(id))
    .map((id) => CONCEPT_BY_ID[id])
    .filter(Boolean);
}

/** Concept ids in a dependency-respecting (simplest-first) order. */
export function conceptTopoOrder(): string[] {
  const visited = new Set<string>();
  const order: string[] = [];
  const visit = (id: string) => {
    if (visited.has(id)) return;
    visited.add(id);
    for (const p of CONCEPT_BY_ID[id]?.prerequisites ?? []) visit(p);
    order.push(id);
  };
  for (const c of CONCEPTS) visit(c.id);
  return order;
}
