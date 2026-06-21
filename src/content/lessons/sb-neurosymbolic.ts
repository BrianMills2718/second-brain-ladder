/**
 * Neurosymbolic — propose & verify. The payoff: a brain that's both general
 * (neural) and trustworthy (symbolic). Concept panels carry the definitions.
 */
import type { Lesson } from "../../types";

export const sbNeurosymbolic: Lesson = {
  id: "sb-neurosymbolic",
  stage: 5,
  title: "Neurosymbolic: Propose & Verify",
  summary:
    "Put the two halves together: let the neural side propose (extract triples, find similar things) and the symbolic side verify (the ontology and reasoner check types, shapes, and consistency). That loop is how a second brain stays both general and trustworthy.",
  prerequisites: ["sb-reasoning", "sb-neural"],
  objectives: [
    "State the neurosymbolic principle: neural proposes, symbolic verifies.",
    "Constrain extraction to an ontology so output is on-schema by construction.",
    "Validate extracted data with shapes (SHACL) and track provenance.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Neural proposes, symbolic verifies",
      body: `Neither half is enough alone: pure symbolic can't read your prose; pure neural can't be trusted. **@c{neurosymbolic}** combines them — and the core loop is **@c{propose-verify}**: @c{llm-extraction} drafts triples, then the @c{reasoner} + shapes accept, repair, or reject them.

\`\`\`text
text ──LLM──▶ candidate triples ──reasoner/SHACL──▶ accept / repair / reject ──▶ store
\`\`\``,
    },
    {
      heading: "Two levers that make it work",
      body: `- **@c{ontology-grounded-extraction}**: constrain the LLM to the ontology's classes & properties, so it can *only* emit on-schema triples — fewer errors to catch later.
- **@c{shacl-validation}**: run extracted data past shape constraints (every \`Note\` needs a \`title\`; \`wrote\` only links \`Person→Note\`), rejecting the bad ones.

And always record **@c{provenance}** — which source and which extractor produced each fact, with what confidence — because now your brain mixes derived, extracted, and asserted facts, and you'll need to know which is which.`,
    },
  ],
  visualizations: [
    {
      id: "ns-loop",
      kind: "typed-graph",
      title: "The propose → verify loop",
      textualSummary:
        "LLM extraction proposes candidate triples; the ontology + reasoner (and SHACL shapes) verify them, rejecting ill-typed or shape-violating ones; the survivors, with provenance, are stored. Neural proposes; symbolic verifies.",
      layers: ["neural", "logic", "system"],
      nodes: [
        { id: "llm", type: "Embedding", layer: "neural", label: "LLM extraction (propose)", position: { x: 40, y: 80 } },
        { id: "verify", type: "Reasoner", layer: "logic", label: "ontology + reasoner + SHACL (verify)", position: { x: 360, y: 80 } },
        { id: "store", type: "System", layer: "system", label: "store (with provenance)", position: { x: 700, y: 80 } },
      ],
      edges: [
        { id: "prop", source: "llm", target: "verify", type: "extracts", label: "candidate triples", layer: "neural" },
        { id: "ver", source: "verify", target: "store", type: "verifies", label: "accepted", layer: "logic" },
      ],
    },
  ],
  confusions: [
    { misconception: "Neurosymbolic means using a smarter LLM.", correction: "It's not bigger neural — it's *combining* neural and symbolic: the LLM proposes, the ontology/reasoner verify. The verification is what buys trust." },
    { misconception: "If extraction is constrained to the ontology, you don't need to verify.", correction: "Grounding reduces errors but doesn't eliminate them. You still validate with shapes/reasoner and keep provenance — propose AND verify." },
  ],
  quiz: [
    { id: "ns-q1", type: "multiple-choice", prompt: "The neurosymbolic principle is:", options: ["use only neural", "use only symbolic", "neural proposes, symbolic verifies", "alternate randomly"], correct: 2, explanation: "Neural proposes (extract/similarity); symbolic verifies (ontology/reasoner/shapes)." },
    { id: "ns-q2", type: "true-false", prompt: "True or false: ontology-grounded extraction constrains the LLM to emit only triples using declared classes and properties.", correct: true, explanation: "Grounding makes output on-schema by construction." },
    { id: "ns-q3", type: "true-false", prompt: "True or false: once neural and symbolic facts mix, recording provenance (source + extractor) becomes important.", correct: true, explanation: "You need to know which facts were asserted, derived, or extracted — and how reliably." },
  ],
  masteryCheckpoint:
    "You can state the propose→verify loop, explain ontology-grounded extraction and SHACL validation as the verify step, and say why provenance matters once facts come from mixed sources.",
};
