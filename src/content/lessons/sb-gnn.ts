/**
 * Graph neural networks — message passing over the graph (Frontier track).
 * Concept panels carry the definitions.
 */
import type { Lesson } from "../../types";

export const sbGnn: Lesson = {
  id: "sb-gnn",
  stage: 18,
  title: "Graph Neural Networks",
  summary:
    "The frontier of learning over graphs: instead of embedding each entity in isolation, a GNN lets every node's vector absorb its neighbourhood through message passing — powerful for prediction over your brain's structure, with its own failure modes. (Frontier track.)",
  prerequisites: ["sb-kgml"],
  objectives: [
    "Explain message passing: a node aggregates its neighbours' vectors over hops.",
    "Say why R-GCN (per-relation aggregation) suits knowledge graphs.",
    "Name the failure modes: over-smoothing and the inductive/transductive split.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Structure becomes representation",
      body: `A plain @c{kg-embedding} learns each @c{entity} in isolation. A GNN does better via **@c{message-passing}**: each node updates its vector by *aggregating its neighbours'* vectors, repeated over several hops — so a node's representation reflects its whole neighbourhood.

For a @c{knowledge-graph} you need **@c{rgcn}** — aggregate *per @c{relation} type* (\`wrote\` neighbours separately from \`cites\`), because edge type carries meaning.`,
    },
    {
      heading: "Where it breaks",
      body: `Two failure modes to know:

- **@c{over-smoothing}** — stack too many message-passing layers and every node's vector converges to the same thing; the signal washes out. Deeper isn't always better.
- **@c{inductive-transductive}** — *transductive* models work only on the fixed graph they trained on; *inductive* ones generalize to unseen nodes or new graphs. A growing second brain needs the inductive kind, or it must retrain every time you add a note.`,
    },
  ],
  visualizations: [
    {
      id: "mp",
      kind: "typed-graph",
      title: "Message passing: a node absorbs its neighbours",
      textualSummary:
        "Ada's vector is updated by aggregating the vectors of her neighbours (note_1 via wrote, Babbage via knows); repeated over hops, her representation reflects her whole neighbourhood. R-GCN keeps the aggregation separate per relation type.",
      layers: ["neural"],
      nodes: [
        { id: "ada", type: "Embedding", layer: "neural", label: "Ada (updated)", position: { x: 300, y: 110 } },
        { id: "n1", type: "Embedding", layer: "neural", label: "note_1", position: { x: 40, y: 40 } },
        { id: "bab", type: "Embedding", layer: "neural", label: "Babbage", position: { x: 40, y: 190 } },
      ],
      edges: [
        { id: "m1", source: "n1", target: "ada", type: "embeds", label: "msg (wrote)", layer: "neural" },
        { id: "m2", source: "bab", target: "ada", type: "embeds", label: "msg (knows)", layer: "neural" },
      ],
    },
  ],
  confusions: [
    { misconception: "More GNN layers = better.", correction: "Past a few hops you hit over-smoothing — every node's vector converges and the signal washes out. Depth is a tradeoff, not a free win." },
    { misconception: "A GNN trained on your graph handles new notes automatically.", correction: "Only if it's *inductive*. A transductive model is tied to the fixed graph it trained on and must retrain when the graph grows." },
  ],
  quiz: [
    { id: "n-q1", type: "multiple-choice", prompt: "@c{message-passing} updates a node's vector by…", options: ["random init", "aggregating its neighbours' vectors", "a SPARQL query", "an axiom"], correct: 1, explanation: "Neighbourhood aggregation over hops." },
    { id: "n-q2", type: "true-false", prompt: "True or false: @c{rgcn} aggregates separately per relation type for multi-relational graphs.", correct: true, explanation: "Edge type carries meaning in a KG." },
    { id: "n-q3", type: "true-false", prompt: "True or false: @c{over-smoothing} means too many layers make all node vectors converge.", correct: true, explanation: "The signal washes out with depth." },
  ],
  masteryCheckpoint:
    "You can explain message passing and R-GCN, and name over-smoothing and the inductive/transductive distinction as the key GNN tradeoffs.",
};
