/**
 * Ontology engineering — taxonomy vs ontology, reuse, and the design driver
 * (competency questions). Concept panels carry the definitions.
 */
import type { Lesson } from "../../types";

export const sbOntoEng: Lesson = {
  id: "sb-onto-eng",
  stage: 8,
  title: "Ontology Engineering",
  summary:
    "A good ontology is engineered, not improvised: you start from the questions it must answer, you reuse existing vocabularies instead of inventing terms, and you know the difference between a taxonomy, a thesaurus, and a full ontology with logical axioms.",
  prerequisites: ["sb-onto"],
  objectives: [
    "Tell a taxonomy, a thesaurus, and an ontology apart.",
    "Drive a model from competency questions written before you build.",
    "Reuse existing ontologies (FOAF, schema.org, SUMO) instead of reinventing.",
  ],
  definitions: [],
  sections: [
    {
      heading: "Taxonomy ≠ thesaurus ≠ ontology",
      body: `Three things often confused:

- a **@c{taxonomy}** is *just* a broader/narrower hierarchy (\`Animal > Mammal > Dog\`);
- a **@c{thesaurus}** adds related/synonym links (SKOS);
- an **@c{ontology}** adds *logical axioms* (@c{disjointness}, @c{equivalence}, restrictions, property rules) a reasoner can act on.

An ontology is not just a taxonomy — the axioms are what let it *derive and check*.`,
    },
    {
      heading: "Engineer it: questions first, reuse always",
      body: `Start from **@c{competency-question}s** — the questions your brain must answer ("which notes cite a paper Ada wrote?") — and let them drive what classes and properties you need. If the model can't answer them, the model is wrong.

Then prefer **@c{ontology-reuse}**: align to \`foaf:Person\`, \`schema.org\`, or an upper ontology (SUMO) instead of inventing terms, so your second brain interoperates with the wider world. A few more building blocks: **@c{subproperty}** (\`hasMother ⊑ hasParent\`), **@c{equivalence}** (\`Human ≡ Person\`), and the **@c{object-property}** / **@c{datatype-property}** split (links between things vs data values).`,
    },
  ],
  visualizations: [
    {
      id: "onto-eng-ladder",
      kind: "typed-graph",
      title: "From taxonomy to ontology",
      textualSummary:
        "A ladder of expressiveness: a taxonomy (subclass hierarchy) gains related links to become a thesaurus (SKOS), then gains logical axioms (disjointness, restrictions, property rules) to become a full ontology a reasoner can use.",
      layers: ["schema", "logic"],
      nodes: [
        { id: "tax", type: "Class", layer: "schema", label: "taxonomy (hierarchy)", position: { x: 40, y: 90 } },
        { id: "the", type: "Class", layer: "schema", label: "thesaurus (+ related)", position: { x: 320, y: 90 } },
        { id: "onto", type: "Ontology", layer: "logic", label: "ontology (+ axioms)", position: { x: 620, y: 90 } },
      ],
      edges: [
        { id: "t2", source: "tax", target: "the", type: "relates", label: "+ related links", layer: "schema" },
        { id: "t3", source: "the", target: "onto", type: "relates", label: "+ logical axioms", layer: "logic" },
      ],
    },
  ],
  confusions: [
    { misconception: "An ontology is just a hierarchy of categories.", correction: "That's a taxonomy. An ontology adds logical axioms (disjointness, restrictions, property rules) that a reasoner uses to derive and check — the hierarchy alone can't." },
    { misconception: "Build your ontology from scratch with your own terms.", correction: "Reuse: align to FOAF / schema.org / an upper ontology so your brain interoperates. And design from competency questions, not bottom-up term-invention." },
  ],
  quiz: [
    { id: "oe-q1", type: "multiple-choice", prompt: "What distinguishes an @c{ontology} from a @c{taxonomy}?", options: ["it has more classes", "it adds logical axioms a reasoner can act on", "it uses RDF", "nothing"], correct: 1, explanation: "Axioms (disjointness, restrictions, rules) are the difference." },
    { id: "oe-q2", type: "true-false", prompt: "True or false: @c{competency-question}s are written before modeling and drive what the ontology needs.", correct: true, explanation: "Questions-first is the engineering discipline." },
    { id: "oe-q3", type: "true-false", prompt: "True or false: reusing `foaf:Person` instead of inventing your own `Person` helps your brain interoperate.", correct: true, explanation: "Ontology reuse buys interoperability." },
  ],
  masteryCheckpoint:
    "You can separate taxonomy/thesaurus/ontology, drive a model from competency questions, and reuse existing vocabularies instead of reinventing terms.",
};
