/**
 * Facts about facts — when a binary triple isn't enough. Concept panels carry the
 * definitions; this is the narrative + a worked reification.
 */
import type { Lesson } from "../../types";

export const sbModeling: Lesson = {
  id: "sb-modeling",
  stage: 6,
  title: "Facts About Facts",
  summary:
    "Real notes need more than flat binary triples: events relate more than two things, and a trustworthy brain has to record where a fact came from, when it held, and which source it's from. These are the modeling moves — n-ary relations, reification, named graphs, temporal validity — that make a second brain trustworthy rather than a pile of context-free assertions.",
  prerequisites: ["sb-kg"],
  objectives: [
    "Model a fact relating more than two things with an intermediate entity.",
    "Reify a statement so you can attach source, time, or confidence to it.",
    "Separate sources/contexts with named graphs; bound a fact in time.",
  ],
  definitions: [],
  sections: [
    {
      heading: "When a triple isn't enough",
      body: `- **@c{n-ary-relation}** — "Ada gave note_1 to Bob in 1843" relates *four* things; a binary @c{triple} can't, so you introduce an intermediate event @c{entity} with a link to each role.
- **@c{reification}** — turn a @c{triple} into a node so you can describe the *statement itself*:

\`\`\`turtle
:stmt1 rdf:subject :Ada ; rdf:predicate :wrote ; rdf:object :note_1 .
:stmt1 :confidence 0.9 ; :source :paper_pdf .
\`\`\`

This is how **@c{provenance}** attaches — to the statement, not the entity.`,
    },
    {
      heading: "Context and time",
      body: `- **@c{named-graph}** — give a sub-graph its own @c{iri} so extracted facts, your own assertions, and different sources stay separate and trust-able (\`:fromPaper\` vs \`:mine\`).
- **@c{temporal-validity}** — a fact true only for a while (\`Ada livesIn London\`, 1843–1852) lives on a reified statement or a named graph, not a bare triple.

Together these let your brain hold *contested, sourced, time-bounded* knowledge instead of flat assertions.`,
    },
  ],
  visualizations: [
    {
      id: "reify",
      kind: "typed-graph",
      title: "Reifying a statement to attach provenance",
      textualSummary:
        "The triple (Ada, wrote, note_1) is turned into a node :stmt1 carrying subject/predicate/object; provenance (confidence 0.9, source paper.pdf) is then attached to :stmt1 — the statement itself becomes describable.",
      layers: ["data", "system"],
      nodes: [
        { id: "stmt", type: "Entity", layer: "data", label: ":stmt1 (the statement)", position: { x: 60, y: 90 } },
        { id: "src", type: "System", layer: "system", label: "source: paper.pdf, conf 0.9", position: { x: 420, y: 90 } },
      ],
      edges: [
        { id: "prov", source: "stmt", target: "src", type: "relates", label: "provenance", layer: "system" },
      ],
    },
  ],
  confusions: [
    { misconception: "Every fact fits in one subject–predicate–object triple.", correction: "Events relating 3+ things need an n-ary pattern (an intermediate entity); and to attach source/time/confidence you reify the statement into a node." },
    { misconception: "Provenance is a property of the entity.", correction: "Provenance describes the *statement* — that THIS claim came from THAT source. You attach it via reification or a named graph, not to the subject entity." },
  ],
  quiz: [
    { id: "m-q1", type: "true-false", prompt: "True or false: a binary @c{triple} can't directly hold a fact relating four things.", correct: true, explanation: "n-ary relations need an intermediate event entity." },
    { id: "m-q2", type: "multiple-choice", prompt: "@c{reification} lets you…", options: ["query faster", "describe a statement (its source, time, confidence)", "delete triples", "train an embedding"], correct: 1, explanation: "It turns a statement into a describable node." },
    { id: "m-q3", type: "true-false", prompt: "True or false: a @c{named-graph} keeps facts from different sources separate and queryable.", correct: true, explanation: "Each named graph has its own IRI and contents." },
  ],
  masteryCheckpoint:
    "You can model an n-ary fact, reify a statement to attach provenance, and use named graphs / temporal validity to keep knowledge sourced and time-bounded.",
};
