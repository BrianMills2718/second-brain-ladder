/**
 * Querying — the point of a *queryable* second brain. Concept panels carry the
 * authoritative definitions; this is the narrative + a worked pattern.
 */
import type { Lesson } from "../../types";

export const sbQuery: Lesson = {
  id: "sb-query",
  stage: 5,
  title: "Querying Your Graph",
  summary:
    "A second brain is only as good as your ability to ask it things. A query retrieves the matches to a pattern instead of making you read the whole graph; the core idea — a basic graph pattern of triples-with-variables — is the same whether you write SPARQL over RDF or Cypher over a property graph.",
  prerequisites: ["sb-kg"],
  objectives: [
    "Say what a query buys you over reading the whole graph.",
    "Read a basic graph pattern (triples with variables) and a SPARQL/Cypher version.",
    "Use a property path to follow a link an unbounded number of times.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Ask, don't read",
      body: `A **@c{query}** retrieves the @c{triple}s or @c{entity}s matching a pattern. The core is the **@c{basic-graph-pattern}** — triples with variables that match subgraphs of your @c{knowledge-graph}:

\`\`\`sparql
SELECT ?note WHERE { :Ada :wrote ?note . ?note :is_about :category_theory }
\`\`\`

That's **@c{sparql}** (for @c{rdf-graph}s). The property-graph world uses **@c{cypher}** — same question, ASCII-art syntax:

\`\`\`cypher
MATCH (:Person {name:'Ada'})-[:WROTE]->(n:Note)-[:IS_ABOUT]->(:Topic {name:'CT'}) RETURN n
\`\`\``,
    },
    {
      heading: "Following paths",
      body: `Some questions are about *paths*, not single hops. A **@c{property-path}** follows a link repeatedly — \`*\`/\`+\` give unbounded length:

\`\`\`sparql
SELECT ?p WHERE { :Ada (:knows)+ ?p }   # everyone reachable from Ada via knows
\`\`\`

A flat lookup can't express "reachable in any number of steps"; a path can.`,
    },
  ],
  visualizations: [
    {
      id: "query-match",
      kind: "typed-graph",
      title: "A basic graph pattern matching the graph",
      textualSummary:
        "The pattern (?x wrote ?note) (?note is_about category_theory) matches the stored subgraph Ada→note_1→category_theory, binding ?x=Ada and ?note=note_1. A query returns those bindings instead of the whole graph.",
      layers: ["data"],
      nodes: [
        { id: "ada", type: "Entity", layer: "data", label: "Ada (?x)", position: { x: 40, y: 80 } },
        { id: "note", type: "Entity", layer: "data", label: "note_1 (?note)", position: { x: 320, y: 80 } },
        { id: "ct", type: "Entity", layer: "data", label: "category_theory", position: { x: 620, y: 80 } },
      ],
      edges: [
        { id: "w", source: "ada", target: "note", type: "relation", label: "wrote", layer: "data" },
        { id: "ab", source: "note", target: "ct", type: "relation", label: "is_about", layer: "data" },
      ],
    },
  ],
  confusions: [
    { misconception: "A query language is tied to one database.", correction: "The *pattern* (triples with variables) is the shared idea; SPARQL expresses it for RDF, Cypher for property graphs. Learn the pattern, not just the syntax." },
    { misconception: "You can ask 'reachable in any number of steps' with a normal pattern.", correction: "Only a property path (`*`/`+`) expresses unbounded-length paths; a basic graph pattern matches a fixed shape." },
  ],
  quiz: [
    { id: "q-q1", type: "true-false", prompt: "True or false: a @c{query} returns the matches to a pattern rather than the whole graph.", correct: true, explanation: "That's the point of querying — targeted retrieval." },
    { id: "q-q2", type: "multiple-choice", prompt: "A @c{basic-graph-pattern} is…", options: ["a single triple", "triples with variables that match subgraphs", "an ontology", "an embedding"], correct: 1, explanation: "Variables over triples — the core of SPARQL/Cypher." },
    { id: "q-q3", type: "true-false", prompt: "True or false: a property path with `+` can follow a relation an unbounded number of times.", correct: true, explanation: "`*`/`+` give unbounded-length paths." },
  ],
  masteryCheckpoint:
    "You can read a basic graph pattern, write the SPARQL or Cypher for a simple question, and use a property path for unbounded reachability.",
};
