/**
 * Meaning & Reasoning — entailment, reasoners, the open-world assumption. The
 * concept panel carries the authoritative definitions; this is the narrative.
 */
import type { Lesson } from "../../types";

export const sbReasoning: Lesson = {
  id: "sb-reasoning",
  stage: 3,
  title: "Meaning & Reasoning",
  summary:
    "Give your brain a reasoner and it stops being a lookup table: it derives facts you never stored and flags contradictions. The catch is the open-world assumption — 'not stored' means unknown, not false.",
  prerequisites: ["sb-onto"],
  objectives: [
    "Tell entailment (derived) apart from lookup (stored).",
    "Explain the open-world vs closed-world assumption and why it bites.",
    "Say what a reasoner does: classify, entail, check consistency.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Derivation, not lookup",
      body: `With an @c{ontology}, a @c{reasoner} computes **@c{entailment}s** — facts that *follow* from your data + axioms. You assert one fact; the reasoner derives the rest.

\`\`\`turtle
:Ada a :Researcher .                 # the only fact you stored
# with  :Researcher rdfs:subClassOf :Person  the reasoner ENTAILS:
:Ada a :Person .                     # derived, never written
\`\`\`

It also checks **@c{consistency}** — with \`Person\` and \`Note\` declared *disjoint*, the bad triple \`:note_1 :wrote :Ada\` entails \`:note_1 a :Person\` (subject = domain of \`wrote\`); alongside \`:note_1 a :Note\` that's a contradiction. (Without the disjointness axiom it would just *infer* the extra type — open-world, no contradiction.)`,
    },
    {
      heading: "The open-world gotcha",
      body: `RDF/OWL uses the **@c{open-world-assumption}**: a fact you didn't store is *unknown*, not false. Databases use the **@c{closed-world-assumption}** (missing = false). Mixing them up is the most common second-brain modeling bug: "the graph doesn't say Ada knows Bob" does **not** mean she doesn't.`,
    },
  ],
  visualizations: [
    {
      id: "reasoning-entail",
      kind: "typed-graph",
      title: "A reasoner entails a new fact",
      textualSummary:
        "Ada is asserted an instance of Researcher; Researcher is a subclass of Person; the reasoner therefore entails Ada is a Person — a fact that was never stored.",
      layers: ["data", "schema", "logic"],
      nodes: [
        { id: "person", type: "Class", layer: "schema", label: "Person", position: { x: 300, y: 30 } },
        { id: "res", type: "Class", layer: "schema", label: "Researcher", position: { x: 300, y: 200 } },
        { id: "ada", type: "Entity", layer: "data", label: "Ada", position: { x: 40, y: 200 } },
      ],
      edges: [
        { id: "sub", source: "res", target: "person", type: "subclass_of", label: "subClassOf", layer: "schema" },
        { id: "inst", source: "ada", target: "res", type: "instance_of", label: "a", layer: "data" },
        { id: "ent", source: "ada", target: "person", type: "entails", label: "entailed", layer: "logic" },
      ],
    },
  ],
  confusions: [
    { misconception: "Reasoning is just querying what's stored.", correction: "A reasoner *derives* facts that follow logically (entailment), beyond what you stored. That's the whole point of an ontology." },
    { misconception: "If the graph doesn't contain a fact, it's false.", correction: "Only under the closed-world assumption (databases). RDF/OWL is open-world: missing = unknown. Get this wrong and your reasoner draws conclusions you didn't intend." },
  ],
  quiz: [
    { id: "rs-q1", type: "true-false", prompt: "True or false: given `Ada a Researcher` + `Researcher ⊑ Person`, a reasoner derives `Ada a Person` without you storing it.", correct: true, explanation: "Entailment from the subclass axiom." },
    { id: "rs-q2", type: "multiple-choice", prompt: "Under the open-world assumption, a fact not in the graph is…", options: ["false", "unknown", "an error", "automatically added"], correct: 1, explanation: "Open-world: absent = unknown, not false." },
    { id: "rs-q3", type: "true-false", prompt: "True or false: a reasoner can detect that your data contradicts your ontology (an inconsistency).", correct: true, explanation: "Consistency checking is a core reasoner capability." },
  ],
  masteryCheckpoint:
    "You can separate entailment from lookup, state the open-world assumption, and name what a reasoner does (entail, classify, check consistency).",
};
