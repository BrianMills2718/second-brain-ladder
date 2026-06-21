/**
 * Learning over the graph — KG embeddings, scoring, and link prediction (Expert).
 * Concept panels carry the definitions; this is the narrative.
 */
import type { Lesson } from "../../types";

export const sbKgml: Lesson = {
  id: "sb-kgml",
  stage: 12,
  title: "Learning Over the Graph",
  summary:
    "Beyond symbolic reasoning, you can *learn* from the graph's structure: embed entities and relations as vectors, score how plausible a triple is, and predict the links you never stored — completing your brain with statistics where logic is silent. (Expert track.)",
  prerequisites: ["sb-neural"],
  objectives: [
    "Explain a scoring function as a triple-plausibility score.",
    "Read TransE: a relation as a translation h + r ≈ t.",
    "Use link prediction + triple classification to complete and check the graph.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Score a triple",
      body: `A @c{kg-embedding} learns a vector for every @c{entity} and @c{relation}; a **@c{scoring-function}** turns a @c{triple} into a plausibility number — high for likely-true, low for likely-false.

**@c{transe}** is the classic: a relation is a *translation* in vector space, so a true triple satisfies \`h + r ≈ t\`:

\`\`\`text
Ada + wrote  ≈  note_1      (score high)
Ada + wrote  ≈  Babbage     (score low)
\`\`\`

You train it with **@c{negative-sampling}** — contrasting true triples against corrupted false ones so the score learns to separate them.`,
    },
    {
      heading: "Complete and check",
      body: `Two payoffs:

- **@c{link-prediction}** — score *candidate* edges to surface links you never stored (\`(Ada, knows, Babbage)\` is likely though unwritten). It *completes* the brain.
- **@c{triple-classification}** — threshold the score to decide if a specific candidate is true — the verify side.

This is statistics, not logic: it has no guarantees (unlike @c{entailment}), but it works where you have no axioms — the same neural-proposes / symbolic-or-human-verifies pattern.`,
    },
  ],
  visualizations: [
    {
      id: "transe",
      kind: "typed-graph",
      title: "TransE: a relation is a translation",
      textualSummary:
        "In vector space the head entity plus the relation vector lands near the tail: Ada + wrote ≈ note_1 scores high; Ada + wrote ≈ Babbage lands far away and scores low. Link prediction surfaces high-scoring triples you never stored.",
      layers: ["neural", "data"],
      nodes: [
        { id: "ada", type: "Embedding", layer: "neural", label: "Ada (vector)", position: { x: 40, y: 100 } },
        { id: "note", type: "Embedding", layer: "neural", label: "note_1 (≈ Ada+wrote)", position: { x: 380, y: 60 } },
        { id: "bab", type: "Embedding", layer: "neural", label: "Babbage (far)", position: { x: 380, y: 180 } },
      ],
      edges: [
        { id: "hi", source: "ada", target: "note", type: "embeds", label: "wrote: score high", layer: "neural" },
        { id: "lo", source: "ada", target: "bab", type: "embeds", label: "wrote: score low", layer: "neural" },
      ],
    },
  ],
  confusions: [
    { misconception: "Link prediction proves a fact.", correction: "It *scores* plausibility — statistics, not entailment. A predicted link is a candidate to verify, never a guarantee. Logic gives proof; embeddings give a hunch." },
    { misconception: "Embeddings replace the ontology.", correction: "They're complementary: embeddings work where you have no axioms (fuzzy completion); the ontology gives guaranteed entailment and contradiction-catching where you do." },
  ],
  quiz: [
    { id: "k-q1", type: "multiple-choice", prompt: "In @c{transe}, a true @c{triple} `(h, r, t)` satisfies…", options: ["h = t", "h + r ≈ t", "r = 0", "h · t = 1"], correct: 1, explanation: "The relation is a translation h + r ≈ t." },
    { id: "k-q2", type: "true-false", prompt: "True or false: @c{link-prediction} surfaces likely @c{triple}s you never stored.", correct: true, explanation: "It scores candidate edges to complete the graph." },
    { id: "k-q3", type: "true-false", prompt: "True or false: a predicted link is a guaranteed fact like an @c{entailment}.", correct: false, explanation: "It's a statistical hunch, not a proof — verify before trusting." },
  ],
  masteryCheckpoint:
    "You can explain a scoring function, read TransE's translation, and use link prediction/classification to complete and check the graph — knowing it's statistics, not proof.",
};
