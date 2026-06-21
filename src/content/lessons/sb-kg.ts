/**
 * Knowledge Graphs — entities, relations, triples; property-graph vs RDF.
 * Build-first: Turtle + Cypher. The concept panel (concepts.ts) carries the
 * authoritative definitions; this lesson is the narrative + tooling.
 */
import type { Lesson } from "../../types";

export const sbKg: Lesson = {
  id: "sb-kg",
  stage: 1,
  title: "Knowledge Graphs",
  summary:
    "A second brain starts as a knowledge graph: your things (entities) connected by named links (relations), one fact at a time (triples). Two concrete models — property graphs and RDF — and when to reach for each.",
  prerequisites: [],
  objectives: [
    "Write a fact as a triple (subject, predicate, object).",
    "Read the same small graph as Turtle (RDF) and as Cypher (property graph).",
    "Say what a property graph gives up that RDF keeps: formal semantics for reasoning.",
  ],
  definitions: [
    { term: "triple", short: "A @n{triple} — subject, predicate, object. The atom of the graph.", example: "`(Ada, wrote, note_1)`." },
    { term: "property graph", short: "A KG model (Neo4j-style) with key/value properties on nodes & edges; no built-in logical semantics." },
    { term: "RDF graph", short: "A KG model of triples named by global @n{iri}s — the basis for reasoning." },
  ],
  sections: [
    {
      heading: "Everything is a triple",
      body: `A second brain's data layer is just facts, and every fact is a @n{triple}: a **subject**, a **predicate** (the relation), and an **object**.

\`\`\`text
(Ada,  wrote,   note_1)
(note_1, is_about, category_theory)
(Ada,  cites,   Peano)
\`\`\`

Collect enough triples and you have a **knowledge graph** — your things, connected. Nothing here yet says what \`wrote\` *means* or what kinds of thing can \`write\`; that's the ontology (next stage). Right now it's pure data.`,
    },
    {
      heading: "Model 1 — RDF (Turtle)",
      body: `In RDF, every name is a global @n{iri}, so the same entity means the same thing everywhere. The text format is **Turtle**:

\`\`\`turtle
@prefix : <http://me.org/brain#> .

:Ada    :wrote    :note_1 .
:note_1 :is_about :category_theory .
:Ada    :cites    :Peano .
\`\`\`

Because names are global and the model is logical, RDF is what you build on when you want a **reasoner** to derive new facts and catch contradictions.`,
    },
    {
      heading: "Model 2 — property graph (Cypher)",
      body: `A **property graph** (Neo4j) attaches key/value **properties** directly to nodes and edges — great when facts have lots of attributes and you mainly want fast queries:

\`\`\`cypher
CREATE (ada:Person {name:'Ada'})
CREATE (n:Note {title:'CT notes'})
CREATE (ada)-[:WROTE {year:1843}]->(n)
\`\`\`

The trade-off: a property graph has **no formal logical semantics**. It's a fast, flexible store, but a reasoner can't *derive* new facts from it the way it can from RDF/OWL. Pick property graphs for storage + traversal; pick RDF when meaning and inference matter.`,
    },
    {
      heading: "Querying — the point of a *queryable* second brain",
      body: `A second brain is only as good as your ability to *ask it things*. A **@c{query}** retrieves the matches to a pattern instead of making you read the whole graph; the core is the **@c{basic-graph-pattern}** — triples with variables:

\`\`\`sparql
SELECT ?note WHERE { :Ada :wrote ?note . ?note :is_about :category_theory }
\`\`\`

That's **@c{sparql}** (for @c{rdf-graph}s). The property-graph world uses **@c{cypher}**:

\`\`\`cypher
MATCH (:Person {name:'Ada'})-[:WROTE]->(n:Note)-[:IS_ABOUT]->(:Topic {name:'CT'}) RETURN n
\`\`\`

Same question, two syntaxes. And a **@c{property-path}** lets you follow a link repeatedly — \`:Ada (:knows)+ ?p\` finds everyone reachable from Ada — something flat lookups can't do.`,
    },
    {
      heading: "Facts about facts (when a triple isn't enough)",
      body: `Real notes need more than flat binary triples:

- **@c{n-ary-relation}** — "Ada gave note_1 to Bob in 1843" relates *four* things; a binary triple can't, so you make an intermediate event @c{entity}.
- **@c{reification}** — turn a @c{triple} into a node so you can describe the *statement itself*: its source, confidence, or time. This is how @c{provenance} attaches.
- **@c{named-graph}** — give a sub-graph its own @c{iri} so extracted facts, asserted facts, and different sources stay separate and trust-able.
- **@c{temporal-validity}** — a fact true only for a while (\`Ada livesIn London\`, 1843–1852) lives on a reified statement or a named graph, not a bare triple.

These are what make a second brain trustworthy rather than a pile of context-free assertions.`,
    },
  ],
  visualizations: [
    {
      id: "kg-diagram",
      kind: "typed-graph",
      title: "A tiny knowledge graph",
      textualSummary:
        "Three entities — Ada, note_1, category_theory — connected by relations: Ada 'wrote' note_1, and note_1 'is_about' category_theory. The whole picture is a set of triples; the nodes are entities and the labelled arrows are relations.",
      layers: ["data"],
      nodes: [
        { id: "ada", type: "Entity", layer: "data", label: "Ada", position: { x: 40, y: 60 } },
        { id: "note", type: "Entity", layer: "data", label: "note_1", position: { x: 260, y: 60 } },
        { id: "ct", type: "Entity", layer: "data", label: "category_theory", position: { x: 500, y: 60 } },
      ],
      edges: [
        { id: "wrote", source: "ada", target: "note", type: "relation", label: "wrote", layer: "data" },
        { id: "about", source: "note", target: "ct", type: "relation", label: "is_about", layer: "data" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "A knowledge graph already 'knows' what its links mean.",
      correction:
        "No — the graph is just data (which things link to which). The *meaning* of `wrote`, what can write, and what follows from a link, all live in the ontology (the schema). Keep data and meaning apart.",
    },
    {
      misconception: "Property graphs and RDF are basically the same.",
      correction:
        "They store similar shapes, but RDF has formal model-theoretic semantics (so a reasoner can derive entailments); a property graph does not. That difference decides whether you can *reason* over your brain.",
    },
  ],
  quiz: [
    {
      id: "kg-q1",
      type: "multiple-choice",
      prompt: "Which is a well-formed triple?",
      options: ["`Ada`", "`(Ada, wrote, note_1)`", "`wrote note_1`", "`{name: Ada}`"],
      correct: 1,
      explanation: "A triple is subject–predicate–object: an entity, a relation, and another entity/value.",
    },
    {
      id: "kg-q2",
      type: "true-false",
      prompt: "True or false: a property graph (Neo4j) has formal logical semantics, so a reasoner can derive new facts from it.",
      correct: false,
      explanation: "False. Property graphs have no built-in logical semantics; RDF/OWL is the model you use when you want entailment.",
    },
    {
      id: "kg-q3",
      type: "matching",
      prompt: "Match the model to its text format.",
      left: [{ id: "rdf", label: "RDF graph" }, { id: "pg", label: "property graph" }],
      right: [{ id: "r1", label: "Turtle / SPARQL" }, { id: "r2", label: "Cypher" }],
      pairs: { rdf: "r1", pg: "r2" },
      explanation: "RDF ↔ Turtle/SPARQL; property graphs ↔ Cypher (Neo4j).",
    },
  ],
  masteryCheckpoint:
    "You can write a fact as a triple, express a small graph in both Turtle and Cypher, and explain why RDF (not a property graph) is the basis for reasoning.",
};
