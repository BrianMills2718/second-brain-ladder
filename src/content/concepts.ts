/**
 * Concept dependency DAG (ADR-0002) for the Second Brain curriculum — the source
 * of truth. Each entry is a first-class *idea* with explicit `prerequisites`
 * (the ideas you must already grasp), a per-edge `PREREQ_WHY` justification, and
 * a `PREREQ_KIND` semantic label. The stage skill-map edges are DERIVED from this
 * (src/content/graph.ts via derive.ts).
 *
 * INVARIANTS (enforced in scripts/validate-content.mjs):
 *   - acyclic over `prerequisites`
 *   - every `@c{id}` in a `short`/`expanded` is a transitive prerequisite
 *   - a prerequisite's `introducedIn` is the same or an earlier stage
 *   - every prerequisite edge has a `PREREQ_WHY` entry (no unjustified edges)
 *
 * MVP slice: knowledge-graph atoms (stage sb-kg) + ontology basics (sb-onto).
 */
import type { Concept, ConceptGraph } from "../types";

const CONCEPTS: Concept[] = [
  // --- stage sb-kg: knowledge graphs ---
  {
    id: "entity",
    term: "entity",
    layer: "data",
    primitive: true,
    short: "A thing your second brain knows about — a person, place, idea, paper, or note. The 'nouns'.",
    example: "`Ada_Lovelace`, `category_theory`, `note_2026_06_21` are entities.",
    prerequisites: [],
    contrasts: ["class"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-entity", type: "true-false", prompt: "True or false: an entity is a specific *thing* (a particular person or note), not a category of things.", correct: true, explanation: "An entity is one individual thing; the *category* it belongs to is a class (next stage)." },
    ],
  },
  {
    id: "relation",
    term: "relation",
    layer: "data",
    short: "A named, directed link from one @c{entity} to another — the 'verbs' connecting your things.",
    example: "`wrote`, `cites`, `is_about`: `Ada wrote note_1`.",
    prerequisites: ["entity"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-relation", type: "true-false", prompt: "True or false: a relation has a direction — `cites` from A to B is not the same as from B to A.", correct: true, explanation: "Relations are directed; `A cites B` ≠ `B cites A`." },
    ],
  },
  {
    id: "triple",
    term: "triple",
    layer: "data",
    short: "The atom of a knowledge graph: a (subject, predicate, object) statement — an @c{entity}, a @c{relation}, and another @c{entity}.",
    example: "`(Ada, wrote, note_1)` is one triple.",
    prerequisites: ["entity", "relation"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-triple", type: "multiple-choice", prompt: "Which is a well-formed triple?", options: ["`Ada`", "`(Ada, wrote, note_1)`", "`wrote`", "`Ada wrote`"], correct: 1, explanation: "A triple is subject–predicate–object: entity, relation, entity." },
    ],
  },
  {
    id: "knowledge-graph",
    term: "knowledge graph",
    layer: "data",
    short: "A set of @c{triple}s — your facts as a graph of @c{entity}s linked by @c{relation}s. The data layer of a second brain.",
    expanded: "A knowledge graph stores *what is true* as connections. It is just data — it does not, by itself, know the *meaning* of those connections; that is the job of an ontology (next stage).",
    example: "All your notes + who/what they reference, as one connected graph.",
    prerequisites: ["triple"],
    contrasts: ["ontology"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-kg", type: "true-false", prompt: "True or false: a knowledge graph is data (facts as links); the *meaning/rules* live in a separate ontology.", correct: true, explanation: "KG = data (ABox-ish); ontology = schema + axioms (TBox)." },
    ],
  },
  {
    id: "property-graph",
    term: "property graph",
    layer: "system",
    short: "A @c{knowledge-graph} model (Neo4j-style) where nodes and edges carry key/value properties — flexible and fast, but with no built-in logical semantics or reasoning.",
    example: "`(:Person {name:'Ada'})-[:WROTE {year:1843}]->(:Note)` in Cypher.",
    prerequisites: ["knowledge-graph"],
    contrasts: ["rdf-graph"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-pg", type: "true-false", prompt: "True or false: a property graph has no formal logical semantics — a reasoner can't derive new facts from it the way it can with RDF/OWL.", correct: true, explanation: "Property graphs are great for storage/queries but carry no model-theoretic semantics; reasoning is not built in." },
    ],
  },
  {
    id: "rdf-graph",
    term: "RDF graph",
    layer: "system",
    short: "A @c{knowledge-graph} model built from @c{triple}s whose @c{entity}s and @c{relation}s are global IRIs — the basis for formal semantics and reasoning (RDF/OWL).",
    example: "Turtle: `:Ada :wrote :note_1 .` where each name is a URI.",
    prerequisites: ["knowledge-graph", "triple"],
    contrasts: ["property-graph"],
    introducedIn: "sb-kg",
    microQuiz: [
      { id: "mq-rdf", type: "true-false", prompt: "True or false: RDF uses global IRIs so the same entity can be referred to and merged across datasets.", correct: true, explanation: "Global identifiers (IRIs) make RDF graphs mergeable and give entailment a well-defined target." },
    ],
  },

  // --- stage sb-onto: ontologies ---
  {
    id: "class",
    term: "class",
    layer: "schema",
    short: "A category of @c{entity}s — the *kind* a thing is. Where an entity is one individual, a class is the type.",
    example: "`Person`, `Note`, `Paper` are classes; `Ada` is an entity.",
    prerequisites: ["entity"],
    contrasts: ["entity"],
    introducedIn: "sb-onto",
    microQuiz: [
      { id: "mq-class", type: "multiple-choice", prompt: "Which is a class, not an entity?", options: ["`Ada_Lovelace`", "`Person`", "`note_1`", "`category_theory`"], correct: 1, explanation: "`Person` is a category (class); the others are individual things (entities)." },
    ],
  },
  {
    id: "instance",
    term: "instance",
    layer: "schema",
    short: "An @c{entity} asserted to be a member of a @c{class} — the link from your data to your schema.",
    example: "`Ada rdf:type Person` makes `Ada` an instance of `Person`.",
    prerequisites: ["entity", "class"],
    introducedIn: "sb-onto",
    microQuiz: [
      { id: "mq-instance", type: "true-false", prompt: "True or false: 'instance of' connects a specific entity to the class it belongs to.", correct: true, explanation: "`Ada : Person` — the entity Ada is an instance of the class Person." },
    ],
  },
  {
    id: "subclass",
    term: "subclass",
    layer: "schema",
    short: "An is-a relationship between @c{class}es: every member of the subclass is also a member of the superclass.",
    example: "`Researcher ⊑ Person`: every Researcher is a Person.",
    prerequisites: ["class"],
    introducedIn: "sb-onto",
    microQuiz: [
      { id: "mq-subclass", type: "true-false", prompt: "True or false: if `Researcher` is a subclass of `Person`, then asserting `Ada : Researcher` also makes `Ada` a `Person` (a reasoner derives it).", correct: true, explanation: "Subclass means membership flows upward — that derivation is reasoning, not lookup." },
    ],
  },
  {
    id: "property-schema",
    term: "property (schema)",
    layer: "schema",
    short: "A @c{relation} declared in the schema with a domain and range — a rule for *what kind of thing can link to what*.",
    example: "`wrote` has domain `Person`, range `Note`: only people write notes.",
    prerequisites: ["relation", "class"],
    introducedIn: "sb-onto",
    microQuiz: [
      { id: "mq-prop", type: "true-false", prompt: "True or false: declaring a property's domain and range constrains which classes of entity it can connect.", correct: true, explanation: "Domain/range typing is how the schema says what a relation is allowed to link." },
    ],
  },
  {
    id: "ontology",
    term: "ontology",
    layer: "schema",
    short: "The schema and axioms (the TBox): the @c{class}es, the @c{subclass} hierarchy, and the @c{property-schema} declarations that give your knowledge graph *meaning*.",
    expanded: "A knowledge graph says *what is connected*; the ontology says *what those connections mean and what follows from them*. That second part is what lets a reasoner derive new facts and catch contradictions.",
    example: "An ontology with `Researcher ⊑ Person` and `wrote: Person→Note` lets a reasoner infer Ada is a Person and flag a `Note wrote Ada` as ill-typed.",
    prerequisites: ["class", "subclass", "property-schema"],
    contrasts: ["knowledge-graph"],
    introducedIn: "sb-onto",
    microQuiz: [
      { id: "mq-onto", type: "multiple-choice", prompt: "What does the ontology add on top of the knowledge graph?", options: ["more entities", "the meaning/rules (classes, hierarchy, property constraints) that support reasoning", "faster queries", "a user interface"], correct: 1, explanation: "The ontology is the TBox: the schema + axioms that give data meaning and enable reasoning." },
    ],
  },
];

export const CONCEPT_GRAPH: ConceptGraph = { concepts: CONCEPTS };

export const CONCEPT_BY_ID: Record<string, Concept> = Object.fromEntries(
  CONCEPTS.map((c) => [c.id, c]),
);

/** Per-edge justification for every prerequisite, keyed `"concept>prerequisite"`. */
export const PREREQ_WHY: Record<string, string> = {
  "relation>entity": "a relation links entities",
  "triple>entity": "a triple's subject and object are entities",
  "triple>relation": "a triple's predicate is a relation",
  "knowledge-graph>triple": "a knowledge graph is a set of triples",
  "property-graph>knowledge-graph": "a property graph is one model of a knowledge graph",
  "rdf-graph>knowledge-graph": "an RDF graph is one model of a knowledge graph",
  "rdf-graph>triple": "RDF is built from triples (with IRIs)",
  "class>entity": "a class is a category of entities",
  "instance>entity": "an instance is an entity",
  "instance>class": "an instance is a member of a class",
  "subclass>class": "subclass is a relationship between two classes",
  "property-schema>relation": "a schema property is a declared relation",
  "property-schema>class": "a property's domain and range are classes",
  "ontology>class": "an ontology declares the classes",
  "ontology>subclass": "an ontology includes the class hierarchy",
  "ontology>property-schema": "an ontology declares the properties",
};

export function prereqWhy(concept: string, prereq: string): string | undefined {
  return PREREQ_WHY[`${concept}>${prereq}`];
}

/** Semantic KIND of each prerequisite edge (ADR-0005). Annotation only. */
export const PREREQ_KINDS = ["is-a", "part-of", "defined-via", "operates-on", "refines", "assumes"] as const;
export type PrereqKind = (typeof PREREQ_KINDS)[number];

export const PREREQ_KIND: Record<string, PrereqKind> = {
  "relation>entity": "operates-on",
  "triple>entity": "defined-via",
  "triple>relation": "defined-via",
  "knowledge-graph>triple": "part-of",
  "property-graph>knowledge-graph": "is-a",
  "rdf-graph>knowledge-graph": "is-a",
  "rdf-graph>triple": "defined-via",
  "class>entity": "operates-on",
  "instance>entity": "is-a",
  "instance>class": "defined-via",
  "subclass>class": "operates-on",
  "property-schema>relation": "is-a",
  "property-schema>class": "defined-via",
  "ontology>class": "part-of",
  "ontology>subclass": "part-of",
  "ontology>property-schema": "part-of",
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
