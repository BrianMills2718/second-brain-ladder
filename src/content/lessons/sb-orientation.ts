/**
 * Orientation — Build a Second Brain. Optional, non-gating goal framing. Exempt
 * from the closure check; previews the journey and the thesis.
 */
import type { Lesson } from "../../types";

export const sbOrientation: Lesson = {
  id: "sb-orientation",
  stage: 0,
  title: "Build a Second Brain",
  summary:
    "A short, skippable overview of the goal. A 'second brain' worth the name isn't a pile of notes — it's a knowledge graph you can query AND reason over. The whole skill is choosing the right representation for each piece, and knowing exactly what each one buys and costs.",
  prerequisites: [],
  objectives: [
    "Hold onto the goal: a brain you can both *query* and *reason over*.",
    "Name the lines you'll learn to draw: data vs meaning, lookup vs entailment, symbolic vs neural.",
    "Know you can skip this and come back.",
  ],
  definitions: [],
  sections: [
    {
      heading: "The goal",
      body: `Most "second brain" setups are folders of notes with links. Useful — but they can't *answer* much. The goal here is sharper: a **knowledge graph + ontology** you can **query** (ask precise questions) and **reason over** (have a machine derive facts and catch contradictions you'd miss).

You don't need any of the tools yet. Just the target: **queryable + reasoning-capable.**`,
    },
    {
      heading: "The lines you'll learn to draw",
      body: `Almost every mistake in building a second brain is blurring two different things. You'll learn to keep these apart:

- **data vs meaning** — the facts (a knowledge graph) vs the schema that interprets them (an ontology).
- **lookup vs entailment** — what you stored vs what *follows logically* (a reasoner derives the rest).
- **open-world vs closed-world** — "not stored" means *unknown* (RDF/OWL), not *false* (databases). The #1 gotcha.
- **symbolic vs neural** — explicit & verifiable (ontologies, rules) vs learned & fuzzy (embeddings, LLM extraction) — and **neurosymbolic**: let the neural side propose and the symbolic side verify.`,
    },
    {
      heading: "Where we're headed",
      body: `Knowledge graphs → ontologies → just-enough logic → reasoning → identity → the neural side → neurosymbolic → and the capstone: **design your own second brain** (what to store, what to make symbolic, what to leave neural).

It's a map, not a lesson. **Start with "Knowledge Graphs"** (the highlighted node) and come back here whenever you lose the thread.`,
    },
  ],
  visualizations: [
    {
      id: "orient-overview",
      kind: "typed-graph",
      title: "Data, meaning, reasoning",
      textualSummary:
        "A knowledge graph (data) sits under an ontology (schema/meaning); a reasoner sits over both and entails new facts. The arc of the course is to build all three and then decide what should be symbolic vs neural.",
      layers: ["data", "schema", "logic"],
      nodes: [
        { id: "kg", type: "System", layer: "data", label: "knowledge graph (data)", position: { x: 40, y: 220 } },
        { id: "onto", type: "Ontology", layer: "schema", label: "ontology (meaning)", position: { x: 320, y: 120 } },
        { id: "reasoner", type: "Reasoner", layer: "logic", label: "reasoner (derives facts)", position: { x: 600, y: 30 } },
      ],
      edges: [
        { id: "interp", source: "onto", target: "kg", type: "relates", label: "interprets", layer: "schema" },
        { id: "ent", source: "reasoner", target: "onto", type: "entails", label: "reasons over", layer: "logic" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "A second brain is just well-linked notes.",
      correction:
        "Links help, but notes alone can't answer questions or derive facts. The goal here is a queryable, reasoning-capable knowledge graph + ontology.",
    },
    {
      misconception: "More AI/embeddings automatically makes a better brain.",
      correction:
        "Neural pieces are powerful but unverifiable. The win is *neurosymbolic*: let the neural side propose (extraction, similarity) and the symbolic side (ontology, reasoner) verify and constrain.",
    },
  ],
  quiz: [
    {
      id: "or-q1",
      type: "multiple-choice",
      prompt: "What's the goal of a 'second brain' here?",
      options: [
        "the most notes possible",
        "a knowledge graph you can query AND reason over",
        "the prettiest note app",
        "a single giant document",
      ],
      correct: 1,
      explanation: "Queryable + reasoning-capable — data plus an ontology a reasoner can work over.",
    },
    {
      id: "or-q2",
      type: "true-false",
      prompt: "True or false: in RDF/OWL, a fact you didn't store is treated as *unknown*, not *false*.",
      correct: true,
      explanation: "Yes — the open-world assumption. It's the biggest modeling gotcha; you'll meet it in Reasoning.",
    },
    {
      id: "or-q3",
      type: "multiple-choice",
      prompt: "What does 'neurosymbolic' mean for a second brain?",
      options: [
        "use only neural networks",
        "use only logic",
        "let the neural side propose and the symbolic side verify/constrain",
        "avoid AI entirely",
      ],
      correct: 2,
      explanation: "Combine them: neural proposes (extraction, similarity); symbolic verifies (ontology, reasoner, rules).",
    },
  ],
  masteryCheckpoint:
    "You can state the goal (a queryable + reasoning-capable knowledge graph) and name the key lines: data vs meaning, lookup vs entailment, open- vs closed-world, symbolic vs neural.",
};
