/**
 * Ontologies — classes, instances, subclass, property schema, ontology (TBox).
 * Build-first: Turtle/RDFS/OWL. The split that makes a second brain *reason*.
 */
import type { Lesson } from "../../types";

export const sbOnto: Lesson = {
  id: "sb-onto",
  stage: 2,
  title: "Ontologies",
  summary:
    "A knowledge graph says what's connected; an ontology says what those connections mean. Classes, a subclass hierarchy, and typed properties — the schema (TBox) over your data (ABox) — are what let your second brain derive facts you never wrote down.",
  prerequisites: ["sb-kg"],
  objectives: [
    "Separate the schema (TBox) from the data (ABox).",
    "Declare classes, a subclass hierarchy, and typed properties in Turtle.",
    "Explain how a subclass axiom lets a reasoner derive new type facts.",
  ],
  definitions: [
    { term: "class", short: "A category of entities — the *kind* a thing is.", example: "`Person`, `Note`." },
    { term: "subclass", short: "An is-a between classes (@n{subclassOf}): subclass members are superclass members.", example: "`Researcher ⊑ Person`." },
    { term: "ontology", short: "The schema + axioms (@n{tbox}) that give your @n{abox} data meaning." },
  ],
  sections: [
    {
      heading: "Two boxes: meaning vs facts",
      body: `Split your brain in two:

- the **@n{abox}** (assertion box) — the *data*: specific facts, like \`:Ada a :Researcher\`.
- the **@n{tbox}** (terminology box) — the *schema/ontology*: the **classes**, the **subclass** hierarchy, and the **property** rules.

The knowledge graph from last stage was the ABox. The ontology is the TBox. The whole reason to add a TBox: it makes facts you never stored *follow logically*.`,
    },
    {
      heading: "Build the schema (Turtle / RDFS / OWL)",
      body: `Declare classes, an is-a hierarchy (@n{subclassOf}), and a typed property with a domain and range:

\`\`\`turtle
@prefix :    <http://me.org/brain#> .
@prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> .

:Person     a rdfs:Class .
:Researcher rdfs:subClassOf :Person .       # Researcher ⊑ Person
:Note       a rdfs:Class .

:wrote rdfs:domain :Person ;                # only people write…
       rdfs:range  :Note .                  # …and they write notes
\`\`\`

That's an ontology: the meaning layer over your triples.`,
    },
    {
      heading: "Why it pays off: derivation, not lookup",
      body: `Now assert one fact and let the schema do work:

\`\`\`turtle
:Ada a :Researcher .                        # the only fact you wrote
\`\`\`

A reasoner, using \`Researcher rdfs:subClassOf Person\`, **derives**:

\`\`\`text
:Ada a :Person .                            # entailed — never stored
\`\`\`

You looked up nothing; the ontology *entailed* it. The same domain/range rules let the reasoner *infer* a thing's type — and with a **disjointness** axiom, catch genuinely contradictory data. This — deriving and checking, not just storing — is the payoff of giving your second brain a schema.`,
    },
    {
      heading: "An ontology is not a taxonomy (and don't reinvent it)",
      body: `Three things often confused:

- a **@c{taxonomy}** is *just* a broader/narrower hierarchy (\`Animal > Mammal > Dog\`);
- a **@c{thesaurus}** adds related/synonym links (SKOS);
- an **@c{ontology}** adds *logical axioms* (disjointness, restrictions, property rules) a reasoner can act on.

Start from **@c{competency-question}s** — the questions your brain must answer ("which notes cite a paper Ada wrote?") — and let them drive the model. And prefer **@c{ontology-reuse}**: align to \`foaf:Person\`, \`schema.org\`, or an upper ontology (SUMO) instead of inventing terms, so your second brain interoperates with the wider world.`,
    },
  ],
  visualizations: [
    {
      id: "onto-diagram",
      kind: "typed-graph",
      title: "Schema (TBox) over data (ABox)",
      textualSummary:
        "Two schema classes: Researcher is a subclass of Person. One data entity, Ada, is an instance of Researcher. Because Researcher is a subclass of Person, a reasoner derives that Ada is also an instance of Person — a fact never explicitly stored.",
      layers: ["schema", "data", "logic"],
      nodes: [
        { id: "person", type: "Class", layer: "schema", label: "Person", position: { x: 280, y: 30 } },
        { id: "researcher", type: "Class", layer: "schema", label: "Researcher", position: { x: 280, y: 200 } },
        { id: "ada", type: "Entity", layer: "data", label: "Ada", position: { x: 40, y: 200 } },
      ],
      edges: [
        { id: "sub", source: "researcher", target: "person", type: "subclass_of", label: "subClassOf", layer: "schema" },
        { id: "inst", source: "ada", target: "researcher", type: "instance_of", label: "a (type)", layer: "data" },
        { id: "ent", source: "ada", target: "person", type: "entails", label: "entailed: Ada a Person", layer: "logic" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "The ontology stores the facts.",
      correction:
        "No — facts live in the ABox (data). The ontology is the TBox (schema/axioms): classes, hierarchy, property rules. It *derives* facts from data; it doesn't hold them.",
    },
    {
      misconception: "If a fact isn't in the graph, it's false.",
      correction:
        "That's the closed-world assumption (databases). RDF/OWL is **open-world**: a missing fact is *unknown*, not false. A big gotcha when modeling a second brain — covered next in Reasoning.",
    },
  ],
  quiz: [
    {
      id: "onto-q1",
      type: "classification",
      prompt: "Schema (TBox) or data (ABox)?",
      buckets: ["TBox (schema)", "ABox (data)"],
      items: [
        { id: "a", label: "`Researcher ⊑ Person`", correctBucket: "TBox (schema)" },
        { id: "b", label: "`:Ada a :Researcher`", correctBucket: "ABox (data)" },
        { id: "c", label: "`wrote: domain Person, range Note`", correctBucket: "TBox (schema)" },
        { id: "d", label: "`:Ada :wrote :note_1`", correctBucket: "ABox (data)" },
      ],
      explanation: "Class axioms + property rules are schema (TBox); specific facts about individuals are data (ABox).",
    },
    {
      id: "onto-q2",
      type: "true-false",
      prompt: "True or false: given `Ada a Researcher` and `Researcher ⊑ Person`, a reasoner can derive `Ada a Person` without you storing it.",
      correct: true,
      explanation: "Yes — that's entailment from the subclass axiom: derivation, not lookup.",
    },
    {
      id: "onto-q3",
      type: "multiple-choice",
      prompt: "What does the ontology add over the bare knowledge graph?",
      options: ["more storage", "the meaning/rules that let a reasoner derive and check facts", "a faster database", "a chat interface"],
      correct: 1,
      explanation: "The TBox gives data meaning — enabling entailment and consistency checking.",
    },
  ],
  masteryCheckpoint:
    "You can separate TBox from ABox, declare classes/subclass/typed-properties in Turtle, and explain how a subclass axiom lets a reasoner derive a new type fact.",
};
