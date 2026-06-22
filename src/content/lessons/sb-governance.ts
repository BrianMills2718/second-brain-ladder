/**
 * Governance & quality — making a second brain trustworthy over time: quality
 * dimensions, epistemic status, lineage, access, and FAIR.
 */
import type { Lesson } from "../../types";

export const sbGovernance: Lesson = {
  id: "sb-governance",
  stage: 17,
  title: "Governance & Quality",
  summary:
    "A second brain you keep for years needs governance: measurable quality, an honest record of how you know each fact, the full lineage behind it, control over who sees what, and FAIR principles so it can be shared and reused.",
  prerequisites: ["sb-eval", "sb-construction"],
  objectives: [
    "Name the data-quality dimensions and mark each fact's epistemic status.",
    "Distinguish provenance (source) from lineage (full history).",
    "Apply access control and FAIR principles to a shared brain.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Quality and honesty",
      body: `- **@c{data-quality}** — judge the brain on *completeness*, *accuracy*, and *freshness*, not vibes.
- **@c{epistemic-status}** — mark *how* you know each fact: observed, asserted, @c{entailment}-derived, disputed, predicted, deprecated. This is the antidote to confusing a guess for ground truth — the project's whole \`provable ≠ true\` mission, made operational per fact.`,
    },
    {
      heading: "History, access, and sharing",
      body: `- **@c{lineage}** — the full transformation history of a fact (source → extracted → fused → stored), richer than @c{provenance}'s single source step.
- **@c{access-control}** — who may read or change which @c{triple}s, often per @c{named-graph} (your private notes stay private).
- **@c{fair}** — Findable, Accessible, Interoperable, Reusable: public @c{iri}s + reused vocabularies (@c{ontology-reuse}) so your brain can join the wider web of knowledge.`,
    },
  ],
  visualizations: [
    {
      id: "epistemic",
      kind: "typed-graph",
      title: "Marking how you know",
      textualSummary:
        "Two facts about Ada carry different epistemic status: 'Ada wrote note_1' is observed (from a source); 'Ada knows Bob' is predicted (from link prediction). Tagging each prevents treating a statistical guess as ground truth.",
      layers: ["data", "system"],
      nodes: [
        { id: "obs", type: "Entity", layer: "data", label: "Ada wrote note_1", position: { x: 60, y: 60 } },
        { id: "pred", type: "Entity", layer: "data", label: "Ada knows Bob", position: { x: 60, y: 200 } },
        { id: "tag", type: "System", layer: "system", label: "epistemic status", position: { x: 440, y: 130 } },
      ],
      edges: [
        { id: "o", source: "obs", target: "tag", type: "relates", label: "observed", layer: "system" },
        { id: "p", source: "pred", target: "tag", type: "relates", label: "predicted", layer: "system" },
      ],
    },
  ],
  confusions: [
    { misconception: "Provenance and lineage are the same.", correction: "Provenance is the immediate source of a fact; lineage is its *whole* transformation history (extract → fuse → recanonicalize → store). You need lineage to audit how a fact really came to be." },
    { misconception: "All stored facts are equally trustworthy.", correction: "Tag epistemic status — observed vs inferred vs predicted vs disputed. A predicted link and a sourced observation should never look identical in your brain." },
  ],
  quiz: [
    { id: "g-q1", type: "multiple-choice", prompt: "Which is a @c{data-quality} dimension?", options: ["embedding size", "freshness", "query speed", "node colour"], correct: 1, explanation: "Completeness, accuracy, freshness." },
    { id: "g-q2", type: "true-false", prompt: "True or false: @c{epistemic-status} marks how you know a fact (observed, inferred, predicted…).", correct: true, explanation: "It prevents confusing a guess for ground truth." },
    { id: "g-q3", type: "true-false", prompt: "True or false: @c{fair} data uses public IRIs and reused vocabularies so others can reuse your graph.", correct: true, explanation: "Findable/Accessible/Interoperable/Reusable." },
  ],
  masteryCheckpoint:
    "You can measure data quality, tag epistemic status, distinguish provenance from lineage, and apply access control + FAIR to a shared brain.",
};
