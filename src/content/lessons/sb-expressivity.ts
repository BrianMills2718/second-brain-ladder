/**
 * OWL expressivity — the axioms that make the symbolic side actually reason:
 * property characteristics, restrictions, and defined classes (classification).
 * Concept panels carry the definitions; this is the narrative.
 */
import type { Lesson } from "../../types";

export const sbExpressivity: Lesson = {
  id: "sb-expressivity",
  stage: 7,
  title: "OWL Expressivity",
  summary:
    "The power of the symbolic side is the general rules you state once and the reasoner applies everywhere. Property characteristics (transitive, inverse, symmetric, functional), restrictions (cardinality, some/only), and defined classes turn a handful of axioms into automatic derivation and contradiction-catching.",
  prerequisites: ["sb-reasoning"],
  objectives: [
    "Use property characteristics (transitive, inverse, symmetric, functional) to derive facts.",
    "State a property chain — 'the father of my father is my grandfather'.",
    "Define a class so the reasoner *infers* membership (classification).",
  ],
  definitions: [],
  sections: [
    {
      heading: "Say more, derive more",
      body: `State a general rule once; the reasoner applies it everywhere:

- **@c{property-chain}** — \`hasParent ∘ hasParent ⊑ hasGrandparent\`: grandparents are derived for free.
- **@c{transitive-property}** — \`ancestorOf\` chains close on their own.
- **@c{inverse-property}** — declare \`hasParent\` the inverse of \`hasChild\` and assert either direction; the other is entailed.
- **@c{symmetric-property}** — \`siblingOf\` holds both ways automatically.
- **@c{cardinality-restriction}** / **@c{functional-property}** — "exactly one birth year"; two values *known to differ* (distinct literals) is an inconsistency, not a quiet overwrite.`,
    },
    {
      heading: "Defined classes: the reasoner classifies",
      body: `A **@c{defined-class}** has necessary-*and*-sufficient conditions (an @c{equivalence}, not just a @c{subclass}), built from an **@c{existential-restriction}** or **@c{universal-restriction}**:

\`\`\`text
Parent ≡ hasChild some Person
\`\`\`

Assert \`Ada hasChild Bob\` (and Bob a Person) and the reasoner *infers* \`Ada a Parent\` — it places things in the hierarchy, not just stores types. (Watch the open-world gotcha: a universal \`only\` restriction is vacuously true for things with no such value.)`,
    },
  ],
  visualizations: [
    {
      id: "chain",
      kind: "typed-graph",
      title: "A property chain derives a new relation",
      textualSummary:
        "Ada hasParent Bob and Bob hasParent Cy; with the chain axiom hasParent ∘ hasParent ⊑ hasGrandparent, the reasoner entails Ada hasGrandparent Cy — a fact never stored.",
      layers: ["data", "logic"],
      nodes: [
        { id: "ada", type: "Entity", layer: "data", label: "Ada", position: { x: 40, y: 100 } },
        { id: "bob", type: "Entity", layer: "data", label: "Bob", position: { x: 300, y: 100 } },
        { id: "cy", type: "Entity", layer: "data", label: "Cy", position: { x: 560, y: 100 } },
      ],
      edges: [
        { id: "p1", source: "ada", target: "bob", type: "relation", label: "hasParent", layer: "data" },
        { id: "p2", source: "bob", target: "cy", type: "relation", label: "hasParent", layer: "data" },
        { id: "gp", source: "ada", target: "cy", type: "entails", label: "hasGrandparent (derived)", layer: "logic" },
      ],
    },
  ],
  confusions: [
    { misconception: "A `subClassOf` restriction lets the reasoner infer membership.", correction: "Only an *equivalence* (necessary AND sufficient) does — that's a defined class. A plain subclass gives only a necessary condition, so nothing is classified into it." },
    { misconception: "Two different values of a functional property are always inconsistent.", correction: "Only when they're *known* to differ — distinct literals, or declared differentFrom. Two differently-named individuals are inferred to be the same thing (open-world, no unique names)." },
  ],
  quiz: [
    { id: "e-q1", type: "true-false", prompt: "True or false: a @c{property-chain} `hasParent ∘ hasParent ⊑ hasGrandparent` lets the reasoner derive grandparents.", correct: true, explanation: "Composition entails the target relation." },
    { id: "e-q2", type: "multiple-choice", prompt: "A @c{defined-class} infers membership because it uses…", options: ["a subclass axiom", "an equivalence (necessary + sufficient)", "an embedding", "a SPARQL query"], correct: 1, explanation: "Equivalence adds sufficiency, enabling classification." },
    { id: "e-q3", type: "true-false", prompt: "True or false: a `∀`(only) restriction is vacuously satisfied by something with no values of that property.", correct: true, explanation: "Empty universal quantification is trivially true." },
  ],
  masteryCheckpoint:
    "You can use property characteristics and chains to derive facts, define a class so the reasoner classifies into it, and avoid the no-unique-names and vacuous-truth traps.",
};
