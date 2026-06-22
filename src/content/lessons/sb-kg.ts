/**
 * Knowledge Graphs — things, named links, facts. Concept-FIRST: the idea lands
 * before any syntax; Turtle/Cypher come later with EVERY symbol explained. Honest
 * about two things the old version overclaimed: the triple is RDF's *modeling
 * choice* (not a universal law), and "you can't reason over a property graph" is a
 * tooling/history myth, not a fundamental limit.
 */
import type { Lesson } from "../../types";

export const sbKg: Lesson = {
  id: "sb-kg",
  stage: 1,
  title: "Knowledge Graphs",
  summary:
    "A second brain starts as a knowledge graph: your things (entities) connected by named, directed links (relations). A 'fact' is one such link. We'll meet the idea first — no syntax — then see the two main ways to actually store a fact (RDF and property graphs), with every symbol explained, and decide between them honestly (including what's myth vs. real about 'reasoning').",
  prerequisites: [],
  objectives: [
    "Read a knowledge graph as things connected by named, directed links — and see why a 'fact' is usually one link.",
    "Recognize the triple (subject, predicate, object) as RDF's modeling choice, and where it strains (symmetric and multi-part facts).",
    "Read the same tiny graph as Turtle (RDF) and Cypher (property graph) — with every symbol accounted for.",
    "Choose RDF vs a property graph by ecosystem and need — not by the myth that only RDF can reason.",
  ],
  definitions: [
    { term: "triple", short: "A way to write one fact as three parts — subject, predicate, object. RDF's model; common, but not the only way.", example: "`(Ada, wrote, note_1)`." },
    { term: "property graph", short: "A KG model (Neo4j-style) that hangs key/value properties directly on nodes and edges." },
    { term: "RDF graph", short: "A KG model where every fact is a triple and every name is a global @n{iri}." },
  ],
  sections: [
    {
      heading: "Things, links, facts — the whole idea (no syntax yet)",
      body: `Forget formats and code for a moment. A knowledge graph is just two things:

- **Things** — the *nouns* your second brain knows about: a person, a note, an idea, a paper. We call each one an **@c{entity}**.
- **Named, directed links** between them — the *verbs*: \`wrote\`, \`cites\`, \`is_about\`. We call each one a **@c{relation}**.

One link between two things is a **fact** ("Ada *wrote* note_1"). Collect enough facts and the web of them *is* a **knowledge graph** — your things, connected.

That's the entire concept. Notice what it does **not** yet say: nothing here defines what \`wrote\` *means*, or what kinds of thing are allowed to \`write\`. That's the job of the *ontology* (a later stage). Right now a knowledge graph is **pure data**: which things link to which.`,
    },
    {
      heading: "Writing one fact: the triple — and where it strains",
      body: `The most common way to write a single fact down is a **triple**: three parts in order —

\`\`\`text
( subject ,  predicate ,  object )
   Ada    ,    wrote    ,  note_1
\`\`\`

— the thing, the link, the other thing. This is **RDF's modeling choice**, and it's worth knowing *up front* that it is a **choice, not a law of nature**:

- A **symmetric** fact has no natural subject vs. object: "Alice and Bob are siblings." A single \`(Alice, siblings, Bob)\` doesn't capture that Bob is equally Alice's sibling — you must either assert the reverse triple too, or separately declare the relation symmetric.
- A **multi-part (n-ary)** fact doesn't fit three slots: "Ada wrote note_1, in 1843, in London." That's four facts about one event; in plain triples you invent a helper node to hold them.

So the triple is the simplest place to *start*, not the only way to model a fact. (We'll come back to *choosing* a representation later — for now, start with triples.)`,
    },
    {
      heading: "Storing it · option 1 — RDF, reading Turtle symbol by symbol",
      body: `**RDF** (the *Resource Description Framework*) stores facts as triples in which every name is a global **IRI** — an *Internationalized Resource Identifier*, a worldwide-unique name that looks like a web address, so that *your* \`Ada\` and *someone else's* \`Ada\` never get confused when datasets are merged.

A common text format for RDF is **Turtle**. Here is our little graph in Turtle — and then every symbol in it, explained:

\`\`\`turtle
@prefix : <http://me.org/brain#> .

:Ada    :wrote    :note_1 .
:note_1 :is_about :category_theory .
\`\`\`

- **\`@prefix\`** — a shorthand *declaration*. It says: "whenever I write the prefix \`:\`, expand it to this long web address." It exists only to save you typing the full IRI on every name.
- **\`:\`** — the (here *empty*) prefix being defined. \`:Ada\` therefore means \`http://me.org/brain#Ada\`.
- **\`< >\`** — angle brackets wrap a full IRI (web address).
- **\`#\`** — just a character *inside* that address (a "fragment" separator); names hang off it, so \`...brain#Ada\`.
- A line like **\`:Ada :wrote :note_1\`** is three IRIs separated by spaces = one triple (subject, predicate, object).
- The trailing **\`.\`** — ends the statement, the way a period ends a sentence.

So that block is exactly the two facts from above, written so every name is globally unambiguous. *That global-naming property is the whole point of RDF* — not the punctuation.`,
    },
    {
      heading: "Storing it · option 2 — property graph, reading Cypher",
      body: `A **property graph** (e.g. Neo4j) stores the same shape differently: it hangs **key/value properties** directly on the nodes and the edges — handy when a thing, or a *link*, carries lots of attributes. Its language is **Cypher**:

\`\`\`cypher
CREATE (ada:Person {name:'Ada'})-[:WROTE {year:1843}]->(n:Note)
\`\`\`

Symbol by symbol:

- **\`CREATE\`** — the command to add data.
- **\`(ada:Person {name:'Ada'})\`** — a **node**: \`ada\` is a local nickname, \`:Person\` is its type/label, and \`{name:'Ada'}\` are its properties (key/value pairs).
- **\`-[:WROTE {year:1843}]->\`** — a **directed edge** labelled \`WROTE\`, *carrying its own property* \`year:1843\`. (Notice the year hangs on the **edge** — that's the property-graph superpower; in plain RDF you'd need an extra node to say when.)
- **\`(n:Note)\`** — the target node.

Same three things and a link — a different bet about *where attributes live*.`,
    },
    {
      heading: "Choosing: RDF vs property graph — and the 'reasoning' myth",
      body: `Here is the honest comparison, because the usual one is wrong.

**The real differences are ecosystem and shape:**
- **RDF** gives you global IRIs and W3C web standards (so data from different sources *merges* cleanly) and a *standardized* stack of reasoners (RDFS/OWL) that can derive new facts. Great when sharing across systems and standardized inference matter.
- **Property graphs** give you properties-on-edges and extremely fast traversal queries, and dominate the application/database world.

**The myth to drop:** "you can't reason over a property graph." That's mostly an accident of **history and tooling**, not a fundamental limit. Logical reasoning matured in the RDF world because that community standardized formal semantics and shipped reasoners *first*. But you *can* reason over property graphs — run a rule engine over them, or map them to RDF — and the modern machine-learning / embedding kind of reasoning is actually *more* native to them.

**So choose by what you need**, not by "only one can think": web-scale sharing + standardized inference → RDF; properties-on-edges + fast traversal + the mainstream tool ecosystem → property graph. Plenty of real systems use both.`,
    },
  ],
  visualizations: [
    {
      id: "kg-diagram",
      kind: "typed-graph",
      title: "A tiny knowledge graph: things linked by named relations",
      textualSummary:
        "Three things (entities) — Ada, note_1, category_theory — connected by two named, directed links (relations): Ada 'wrote' note_1, and note_1 'is_about' category_theory. Each arrow is one fact. The nodes are the 'nouns', the labelled arrows are the 'verbs'; together they are a knowledge graph. (Whether you store each arrow as an RDF triple or a property-graph edge is a later choice — the picture is the same.)",
      layers: ["data"],
      nodes: [
        { id: "ada", type: "Entity", layer: "data", label: "Ada", position: { x: 40, y: 60 } },
        { id: "note", type: "Entity", layer: "data", label: "note_1", position: { x: 260, y: 60 } },
        { id: "ct", type: "Entity", layer: "data", label: "category_theory", position: { x: 500, y: 60 } },
      ],
      edges: [
        { id: "wrote", source: "ada", target: "note", type: "relation", label: "wrote", layer: "data" },
        { id: "about", source: "note", target: "ct", type: "relation", label: "is_about", layer: "data" },
      ],
    },
  ],
  confusions: [
    {
      misconception: "A knowledge graph already 'knows' what its links mean.",
      correction:
        "No — a knowledge graph is just data: which things link to which. The *meaning* of `wrote` (what may write, what follows from a `wrote` link) lives in the ontology — the schema — a later stage. Keep data and meaning apart.",
    },
    {
      misconception: "Every fact is naturally a triple.",
      correction:
        "The triple (subject, predicate, object) is RDF's modeling *choice*, not a universal law. Symmetric facts (`Alice siblings Bob` — who's the subject?) and multi-part facts (`Ada wrote note_1 in 1843 in London`) don't fit three slots cleanly; you assert reverse triples, declare relations symmetric, or add helper nodes. Property graphs make a different choice (properties on edges).",
    },
    {
      misconception: "You can't reason over a property graph — only RDF can reason.",
      correction:
        "Mostly a myth of history and tooling, not a fundamental limit. Standardized reasoners (RDFS/OWL) grew up in the RDF world first, but you can run rule engines over a property graph or map it to RDF, and ML/embedding-based reasoning is more native to property graphs. Choose by ecosystem and need, not by 'only one can think'.",
    },
  ],
  quiz: [
    {
      id: "kg-q1",
      type: "multiple-choice",
      prompt:
        "You want to record that Alice and Bob are siblings as a single triple `(Alice, siblings, Bob)`. What's the catch?",
      options: [
        "No catch — every fact is a triple, so this is perfect.",
        "`siblings` is symmetric, but a directed triple only says Alice→Bob; you must also assert the reverse or declare the relation symmetric.",
        "Triples can't refer to people, only to numbers.",
        "You must switch to a property graph because RDF can't store names.",
      ],
      correct: 1,
      explanation:
        "A triple is directed (subject→object). For a symmetric fact like siblinghood that's a modeling strain: one triple doesn't capture that Bob is equally Alice's sibling. The triple is RDF's *choice*, not a universal law.",
      wrongExplanations: {
        "0": "This is the 'every fact is a triple' overclaim. Symmetric and multi-part facts don't fit three directed slots cleanly.",
        "2": "Triples refer to anything you can name (people, notes, ideas) — the issue here is symmetry/direction, not what can be named.",
        "3": "RDF stores names fine (as IRIs). The catch is symmetry, and it applies to triples in general — switching stores isn't the point.",
      },
    },
    {
      id: "kg-q2",
      type: "multiple-choice",
      prompt:
        "Your project needs fast traversal and to attach attributes to relationships (e.g. a `since` date on a friendship). You pick a property graph. Is reasoning now off the table?",
      options: [
        "Yes — property graphs fundamentally cannot reason; only RDF/OWL can.",
        "No — reasoning isn't a fundamental limit here; you can run a rule engine or map to RDF. The RDF-only reasoning story is mostly tooling/standards history.",
        "Yes — reasoning requires Turtle syntax, which property graphs don't use.",
        "No — property graphs can't store relationships at all, so the question doesn't arise.",
      ],
      correct: 1,
      explanation:
        "The 'only RDF can reason' claim is a myth of history: standardized reasoners matured in the RDF world first. You can reason over property graphs (rule engines, RDF mappings, and ML/embedding reasoning that's actually more native to them). Choose by ecosystem and need.",
      wrongExplanations: {
        "0": "This is exactly the myth to drop — it's a tooling/standards-history difference, not a fundamental one.",
        "2": "Reasoning depends on semantics + a reasoner, not on a particular text syntax like Turtle.",
        "3": "Property graphs are *built* around relationships (edges) — and uniquely let you put properties on them.",
      },
    },
    {
      id: "kg-q3",
      type: "multiple-choice",
      prompt:
        "In the Turtle line `@prefix : <http://me.org/brain#> .`, what does `@prefix` actually do?",
      options: [
        "It asserts a new fact (a triple).",
        "It declares a shorthand: writing `:` will expand to that web address, so `:Ada` means `http://me.org/brain#Ada`.",
        "It runs a query against the graph.",
        "It marks the file as read-only.",
      ],
      correct: 1,
      explanation:
        "`@prefix` is pure shorthand — it binds the prefix `:` to a base IRI so you don't retype the full address on every name. It asserts no facts itself; the triples are the lines that follow, each ended by `.`.",
      wrongExplanations: {
        "0": "Facts are the triple lines that follow (e.g. `:Ada :wrote :note_1 .`); `@prefix` only sets up the naming shorthand.",
        "2": "Turtle is a way to *write down* data, not to query it (querying RDF is SPARQL's job, a later topic).",
        "3": "There's no read-only semantics here; `@prefix` is just an abbreviation declaration.",
      },
    },
    {
      id: "kg-activity",
      type: "fill-in",
      prompt:
        "Quick build. Write the fact \"Ada cites Peano\" as a triple, in the form (subject, predicate, object).",
      before:
        "You've seen that a triple is three parts in order: the thing, the named link, the other thing.",
      after: "Type it as `(subject, predicate, object)`.",
      accepted: [
        "(ada, cites, peano)",
        "ada, cites, peano",
        "(ada cites peano)",
        "ada cites peano",
      ],
      placeholder: "(subject, predicate, object)",
      explanation:
        "Subject `Ada`, predicate `cites`, object `Peano`: `(Ada, cites, Peano)`. This one fits a triple cleanly because `cites` is directional (Ada cites Peano, not necessarily the reverse) — unlike a symmetric `siblings`, which would need the reverse triple too.",
    },
  ],
  masteryCheckpoint:
    "You can describe a knowledge graph as things linked by named, directed relations; recognize the triple as RDF's modeling choice and name where symmetric/n-ary facts strain it; read both Turtle and Cypher with every symbol accounted for; and choose RDF vs a property graph by ecosystem and need — not by the myth that only RDF can reason.",
};
