/**
 * The Neural Side & Identity — embeddings, similarity, LLM extraction (+ its
 * failure mode), and entity resolution. Concept panels carry the definitions.
 */
import type { Lesson } from "../../types";

export const sbNeural: Lesson = {
  id: "sb-neural",
  stage: 4,
  title: "The Neural Side & Identity",
  summary:
    "Learned representations fill the gaps symbolic ones can't: embeddings give fuzzy similarity, LLMs extract triples from prose, and together they help decide when two records are the same entity. The price is no guarantees — neural output can be confidently wrong.",
  prerequisites: ["sb-onto"],
  objectives: [
    "Say what an embedding buys (fuzzy similarity) and gives up (verifiability).",
    "Use LLM extraction to turn text into triples — and name its failure mode.",
    "Explain entity resolution as exact (sameAs) + fuzzy (similarity) identity.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Vectors and similarity",
      body: `An **@c{embedding}** is a learned vector for an entity; **@c{similarity}** (cosine) says "these are about the same thing" — fuzzily, without any logical guarantee. Unlike a @c{triple}, an embedding isn't a checkable fact; it's a hunch with a number.`,
    },
    {
      heading: "Extraction and its failure mode",
      body: `An LLM can turn prose into triples (**@c{llm-extraction}**):

\`\`\`text
"Ada wrote a note about category theory"
        ⟶  (Ada, wrote, note_1) , (note_1, is_about, category_theory)
\`\`\`

Fast and general — but it **@c{hallucination}s**: it will confidently emit a triple that isn't supported. That's why the next stage runs every extracted triple past the symbolic side before trusting it.`,
    },
    {
      heading: "Who is who: entity resolution",
      body: `Your notes will call the same person \`Ada\`, \`A. Lovelace\`, \`wd:Q7259\`. An **@c{identifier}** is just a name; **@c{sameas}** asserts two names denote one entity; **@c{entity-resolution}** decides *when* to draw that link — combining exact \`sameAs\` evidence with fuzzy @c{similarity}. (Note: \`sameAs\` is *same individual*, not @c{subclass}.)`,
    },
  ],
  visualizations: [
    {
      id: "neural-resolve",
      kind: "typed-graph",
      title: "Entity resolution = exact + fuzzy identity",
      textualSummary:
        "Two identifiers, :Ada and wd:Q7259, are judged to denote the same entity: a sameAs link (exact) plus high embedding similarity (fuzzy) support merging them into one node.",
      layers: ["data", "neural", "schema"],
      nodes: [
        { id: "ada", type: "Entity", layer: "data", label: ":Ada", position: { x: 40, y: 80 } },
        { id: "wd", type: "Entity", layer: "data", label: "wd:Q7259", position: { x: 360, y: 80 } },
      ],
      edges: [
        { id: "same", source: "ada", target: "wd", type: "is_a", label: "sameAs (exact)", layer: "schema" },
        { id: "sim", source: "ada", target: "wd", type: "embeds", label: "similar (fuzzy)", layer: "neural" },
      ],
    },
  ],
  confusions: [
    { misconception: "Embeddings/LLM output are facts you can trust like triples.", correction: "They're unverified. An embedding is a similarity hunch; an extracted triple may be a hallucination. Neural output is a *proposal*, not a guarantee." },
    { misconception: "High similarity means same entity.", correction: "Similarity is evidence, not proof. Entity resolution combines it with exact `sameAs` signals and thresholds — and `sameAs` is same individual, not a subclass relation." },
  ],
  quiz: [
    { id: "nu-q1", type: "true-false", prompt: "True or false: an LLM-extracted triple should be verified before you trust it, because the LLM can hallucinate.", correct: true, explanation: "Extraction is powerful but unverified — hallucination is its failure mode." },
    { id: "nu-q2", type: "multiple-choice", prompt: "An embedding gives you…", options: ["a logically guaranteed fact", "fuzzy similarity with no guarantees", "a SPARQL query", "an ontology"], correct: 1, explanation: "Embeddings encode fuzzy similarity, not verifiable facts." },
    { id: "nu-q3", type: "true-false", prompt: "True or false: `sameAs` means two identifiers denote the same individual (not that one class is a subclass of another).", correct: true, explanation: "sameAs is individual identity; subclass is a class-level is-a." },
  ],
  masteryCheckpoint:
    "You can say what embeddings and LLM extraction buy and cost, name hallucination as the failure mode, and describe entity resolution as exact + fuzzy identity.",
};
