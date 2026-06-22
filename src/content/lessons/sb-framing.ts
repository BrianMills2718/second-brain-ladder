/**
 * Framing: three ways to build a second brain (and how to choose). A NEUTRAL
 * orientation to the WHOLE subject — not a how-to for one tool. The thesis:
 * a second brain can be built three ways, and the skill is *choosing*, not
 * adopting a favorite. Two big unifications carry the lesson: (1) PKM (note-
 * taking) and knowledge graphs are ONE artifact seen from two communities, and
 * (2) knowledge representation is a CHOICE, not one true way. We also retain the
 * project's category-error mission, recast for this domain: schema-valid ≠ true.
 *
 * Craft bar (same as sb-retrieve, non-negotiable):
 *   - concept-before-syntax; explain every acronym/symbol on FIRST use
 *     (PKM, KG, RAG, MOC, RDF, n-ary…);
 *   - PEA show-then-tell: a picture/analogy BEFORE the abstract definition;
 *   - Therefore-&-But narrative; confusion-anticipation inline;
 *   - NEUTRALITY: the three paradigms are a fair menu, each honestly costed —
 *     no favorite (especially NOT a tilt toward LLM-wiki/agentic).
 *
 * This is ADDITIVE: it does not replace sb-orientation (whose symbolic body
 * stays for now; ordering is re-anchored in a later slice). Like an orientation
 * module it previews forward ideas; per closure rules it references only concepts
 * already introduced (via @c{}) and uses plain prose for anything forward, so the
 * forward-reference gate stays green without a gloss/foreshadow edge kind (which
 * this schema does not have — noted as a limitation below).
 */
import type { Lesson } from "../../types";

export const sbFraming: Lesson = {
  id: "sb-framing",
  stage: 18,
  title: "Framing: three ways to build a second brain",
  summary:
    "A neutral map of the whole subject before you pick any tool. A second brain stores your knowledge and hands the right piece back. Note-taking and knowledge graphs turn out to be the same artifact seen from two communities, and there are three honest ways to build one. The skill is choosing the right one for your goal and budget — not adopting a favorite.",
  prerequisites: ["sb-retrieve"],
  objectives: [
    "Say what a 'second brain' is in one breath: it stores your knowledge (write side) and hands the right piece back when you ask (retrieval, the read side).",
    "See the big unification — note-taking (PKM) and knowledge graphs are ONE artifact from two cultures: a backlink is an edge, the graph view is a KG visualization, 'AI over my notes' is RAG.",
    "Lay out the three paradigms as a fair, honestly-costed menu — symbolic KG, GraphRAG, LLM-wiki/agentic — and choose by goal and budget, not by favorite.",
    "Treat knowledge representation as a CHOICE: the (subject, predicate, object) triple is one model, awkward for symmetric and n-ary facts; property graphs and linked notes are alternatives.",
    "Hold the category line: a fact can be well-formed / valid and still be false. Schema-valid is not the same as true.",
  ],
  definitions: [],
  sections: [
    {
      heading: "What a 'second brain' actually is",
      body: `**Picture it first.** Imagine a friend with a perfect memory who has read everything you've ever read. You don't value them for the *pile* of facts in their head — you value them because, the moment you ask, they hand you the *one right thing*. That is a **second brain**: a personal system that **stores** your knowledge and **hands the right piece back** when you ask.

So a second brain has two halves, and naming them prevents half the confusion in this whole field:

- the **write side** — *storing* knowledge as you go (notes, facts, links);
- the **read side** — **retrieval**, *getting the relevant piece back out* for the question in front of you.

A store you can't query well is a drawer, not a brain. Both halves matter. (You met the read side in depth in the previous module, the retrieval ladder; this lesson zooms out to the whole picture.)`,
    },
    {
      heading: "The big unification: note-taking and knowledge graphs are the same thing",
      body: `Here is the idea that makes everything else click — and it surprises almost everyone. Two communities have been building the *same artifact* and calling it two different things.

On one side: **PKM**, short for **Personal Knowledge Management** — the world of note-taking apps (Obsidian, Roam, and friends), where you write notes and *link* them to each other. On the other side: **KG**, short for **Knowledge Graph** — the world (everything you studied earlier in this course) of entities and the named relations between them.

**They are the same thing seen from two angles.** Watch each correspondence line up:

- A bidirectional **backlink** between two notes — \`[[neural nets]]\` links to \`[[backpropagation]]\` — *is* a knowledge-graph **edge**: a relation between two entities. The note app and the graph database are storing the *same* link.
- The note app's **"graph view"** — that pretty constellation of dots and lines — *is* a KG visualization. Same picture, different label.
- **"AI over my notes"** — asking a chatbot questions about your own writing — *is* **RAG** (Retrieval-Augmented Generation: fetch the relevant notes first, then let a language model answer using them). You already learned RAG by that name; "chat with my notes" is just RAG wearing friendly clothes.
- A hand-made index note — what PKM folks call a **MOC**, a **Map of Content** (a note that just links out to all your notes on a topic) — *is* the index an AI agent would navigate to find things.

*Therefore* you do not have to choose between "I take notes" and "I build a knowledge graph." You are already doing one when you do the other. The interesting question is not *which*, but *how explicit* you make the structure — which is exactly the choice the rest of this lesson is about.`,
    },
    {
      heading: "Representation is a CHOICE, not one true way",
      body: `Before the three paradigms, one more idea that keeps people from cargo-culting a format. **How you represent a fact is a modeling choice**, not a law of nature.

You learned the **triple** earlier: \`(subject, predicate, object)\` — for example \`(Ada, wrote, note_1)\`. It is clean and it is the choice **RDF** (the Resource Description Framework, the standard you met on the symbolic side) makes. But "clean" is not "universal." Watch where the triple gets awkward:

- **Symmetric facts.** \`(Alice, siblings, Bob)\` does *not* automatically give you \`(Bob, siblings, Alice)\` — a plain triple is one-directional. You either store the reverse triple too, or *declare* the property symmetric so a reasoner fills it in. Either way, the symmetry took extra work the format didn't give you for free.
- **n-ary facts** ("n-ary" = "having n parts", as opposed to *binary* = two parts). A job is really \`employer + role + salary + start-date\` all at once. A single subject-predicate-object triple holds only *two* endpoints, so a four-part fact won't fit in one — you have to introduce an intermediate node to glue the parts together.

There are other models. A **property graph** (the Neo4j style you saw) puts attributes *directly on the edge* — so the single \`siblings\` edge can just carry \`since: 1990\`. And plain linked notes are *also* a graph, just an informal one. None of these is "correct"; each fits some facts better than others.

*Therefore* the lesson is the same one we keep returning to: pick the representation that fits *your* facts. The triple is a tool, not a commandment.`,
    },
    {
      heading: "Three ways to build a second brain — a fair menu",
      body: `Now the heart of it. There are **three paradigms** for turning your knowledge into a working second brain. They are a *decision menu*, and the single most important thing to internalize is this: **none of them is "the answer."** Each buys something real and each charges a real price. The expert move is to name your **goal** and your **budget** (build effort, money, latency, maintenance, how much you trust a non-deterministic step) and then *choose* — not to adopt whichever one is fashionable.

We'll take them in turn, each costed honestly.

**(a) Symbolic knowledge graph.** You model your knowledge *explicitly*: entities, the relations between them, and an ontology (the schema/rules) on top — then you **query** it and **reason** over it. This is the whole symbolic track you studied. *What it buys:* precision and **inspectability** — every fact is explicit, every inference is traceable, and a reasoner can catch contradictions. *What it costs:* it is **heavy to build** (you must model the schema up front) and **brittle to messy reality** (real notes are vague; forcing them into clean entities and relations is real labor, and a lot of human knowledge resists it).

**(b) GraphRAG.** You met this on the retrieval ladder: an LLM reads your whole corpus and *builds a knowledge graph for you* — entities, relations, and clustered "community summaries" — and then you retrieve over that graph. *What it buys:* a **global view** of the whole corpus (it can answer "what are the recurring themes across everything?", which plain RAG cannot) without you hand-modeling anything. *What it costs:* an **expensive indexing step** (many LLM calls over the whole corpus) that must be **rebuilt** as your notes change — so on a small or fast-moving corpus the build cost may never pay back.

**(c) LLM-wiki / agentic.** An LLM **agent** keeps a set of clean, navigable files (a living wiki) and *reads and maintains* them: it answers from the synthesized pages and updates them as new notes arrive. *What it buys:* a **low build cost** (no schema to design, no big index to compute) and **human-readable** artifacts — the files are just Markdown you can open and edit. *What it costs:* **upkeep** (the pages can go stale or contradict each other) and **non-determinism** (the maintenance and the answering are LLM steps, so they can quietly drift or err, and asking twice can give two paths).

**A confusion to head off right now:** higher build-sophistication is *not* higher quality. A hand-built symbolic KG is the most rigorous *and* the most expensive to build; an LLM-wiki is the cheapest to start *and* the least deterministic. Neither extreme "wins." Match the paradigm to the job. (And these are not walls between camps — see the next note.)`,
    },
    {
      heading: "Schema-valid is not the same as true",
      body: `One category error deserves its own warning sign, because it bites people in *every* paradigm.

**A fact can be perfectly well-formed and still be false.** "Well-formed" / "valid" is about **shape**: is it valid JSON? a syntactically fine triple? does it pass the schema's **validation** check (the structural check you saw — right types, required fields present)? "True" is about **the world**: does it match reality?

These are *different axes*. A schema checks the form; it has no idea about the fact.

- \`(Earth, hasMoonCount, 7)\` is a flawless triple — correct shape, valid types — and simply untrue.
- \`(Ada_Lovelace, bornIn, 1850)\` passes every structural check and is *false* (she was born in 1815).

*Therefore* "it validated" or "the model returned well-formed JSON" tells you the *shape* is right and *nothing about whether the fact is right.* This matters most where a neural step proposes facts: an LLM happily emits beautifully-formed, confidently-stated, *wrong* triples. Structure correctness is necessary, not sufficient. (This is why the neurosymbolic move — neural proposes, symbolic *verifies* — checks facts against trusted sources, not just against the schema.)`,
    },
    {
      heading: "How to choose — and why the paradigms compose",
      body: `Putting it together, the whole skill of this course in one move: **decide, don't default.**

A neutral way to choose:

- **Need auditable, precise, contradiction-checkable knowledge** (compliance, a domain you'll reason over)? → lean **symbolic KG**, and pay the modeling cost.
- **Need a global view over a large, fairly stable corpus** ("themes across 50,000 notes, and how they connect")? → lean **GraphRAG**, if the one-time build cost pays back over many queries.
- **Need a fast-moving personal wiki you'll actually maintain**, and you can tolerate non-determinism? → lean **LLM-wiki / agentic**, and budget for upkeep.

**And — a second confusion to retire — you do not have to pick exactly one.** The paradigms **compose**. A real second brain often keeps a small symbolic core for the facts that must be exact, runs GraphRAG for big-picture questions, and lets an agent maintain human-readable wiki pages over the top. "Pick one paradigm forever" is a false choice; "match each piece of the job to the cheapest paradigm that does it well" is the expert habit — the very same neutral, cost-matching instinct you practiced on the retrieval ladder, now applied to the whole architecture.`,
    },
  ],
  visualizations: [
    {
      id: "framing-paradigms",
      kind: "comparison-table",
      title: "The three paradigms — what each buys and what it costs (a fair menu)",
      textualSummary:
        "Three neutral ways to build a second brain, each honestly costed; none is universally best — choose by goal and budget. " +
        "Symbolic knowledge graph: explicit (yes — you model entities/relations/ontology by hand), inspectable/precise (yes — every fact and inference is traceable, a reasoner catches contradictions), low build cost (no — heavy up-front modeling and brittle to messy real-world notes). " +
        "GraphRAG: explicit (partly — an LLM builds the graph for you, not hand-modeled), inspectable/precise (partly — you get a global view via community summaries but the build is LLM-made), low build cost (no — an expensive indexing pass that must be rebuilt as notes change). " +
        "LLM-wiki / agentic: explicit (no — knowledge lives in synthesized human-readable files, not a formal schema), inspectable/precise (partly — files are readable but the synthesis is non-deterministic and can go stale or self-contradict), low build cost (yes — no schema to design and no big index, but you pay ongoing maintenance instead). " +
        "The point is the choice: symbolic for auditable precision, GraphRAG for a global view over a large stable corpus, LLM-wiki/agentic for a cheap-to-start maintainable personal wiki — and they compose.",
      columns: ["Knowledge modeled explicitly?", "Inspectable / precise?", "Low build cost?"],
      rows: [
        {
          label: "(a) Symbolic KG — model entities/relations + ontology, query & reason",
          cells: {
            "Knowledge modeled explicitly?": { value: "yes", note: "you hand-model entities, relations, and the ontology/schema" },
            "Inspectable / precise?": { value: "yes", note: "every fact explicit; inferences traceable; a reasoner catches contradictions" },
            "Low build cost?": { value: "no", note: "heavy up-front modeling; brittle to messy/vague real-world notes" },
          },
        },
        {
          label: "(b) GraphRAG — LLM builds a graph from your notes, you retrieve over it",
          cells: {
            "Knowledge modeled explicitly?": { value: "n/a", note: "an LLM extracts the graph for you — explicit, but not hand-modeled" },
            "Inspectable / precise?": { value: "yes", note: "global view via clustered community summaries; but the graph is LLM-built" },
            "Low build cost?": { value: "no", note: "expensive indexing pass over the whole corpus; must be rebuilt as notes change" },
          },
        },
        {
          label: "(c) LLM-wiki / agentic — an agent keeps & maintains navigable files",
          cells: {
            "Knowledge modeled explicitly?": { value: "no", note: "knowledge lives in synthesized human-readable files, no formal schema" },
            "Inspectable / precise?": { value: "n/a", note: "files are readable, but synthesis is non-deterministic and can go stale/self-contradict" },
            "Low build cost?": { value: "yes", note: "no schema, no big index — but you pay ongoing maintenance instead" },
          },
        },
      ],
    },
  ],
  confusions: [
    {
      misconception:
        "A knowledge graph and my linked notes are two different things — one is 'AI/database stuff', the other is just note-taking.",
      correction:
        "They are the SAME artifact seen from two communities. A bidirectional backlink between two notes is a knowledge-graph edge (a relation between two entities); the note app's 'graph view' is a KG visualization; 'AI over my notes' is RAG; a Map-of-Content index note is the index an agent navigates. PKM (Personal Knowledge Management) and knowledge graphs differ in how *explicit* the structure is, not in what they fundamentally are.",
    },
    {
      misconception:
        "I have to pick ONE paradigm — symbolic KG, GraphRAG, or LLM-wiki — and commit to it.",
      correction:
        "No. They compose, and the skill is matching each piece of the job to the right one. A real second brain often keeps a small symbolic core for facts that must be exact, runs GraphRAG for whole-corpus questions, and lets an agent maintain readable wiki pages on top. 'Pick one forever' is a false choice; 'match the cheapest paradigm that does each job well' is the expert move.",
    },
    {
      misconception:
        "If a fact is well-formed — valid JSON, a syntactically fine triple, it passes schema validation — then it's a true fact.",
      correction:
        "Well-formed/valid is about SHAPE; true is about the WORLD — different axes. `(Earth, hasMoonCount, 7)` is a perfectly valid triple and simply false. `(Ada_Lovelace, bornIn, 1850)` passes every structural check and is still wrong. Validation checks structure, not truth. This is exactly why the neurosymbolic move verifies proposed facts against trusted sources, not just against the schema.",
    },
    {
      misconception:
        "The (subject, predicate, object) triple is the one correct, universal way to write down any fact.",
      correction:
        "The triple is one modeling CHOICE (RDF's), not a law. It is awkward for symmetric facts (`Alice siblings Bob` doesn't entail the reverse without extra work) and for n-ary facts (a job = employer + role + salary + dates won't fit in one triple). Property graphs put attributes on edges; plain linked notes are a graph too. Pick the representation that fits the facts.",
    },
  ],
  quiz: [
    {
      id: "fr-q1",
      type: "multiple-choice",
      prompt:
        "A colleague using Obsidian says: 'I just take linked notes — I'm not doing any of that knowledge-graph stuff.' What's the most accurate response?",
      options: [
        "Correct — note-taking and knowledge graphs are unrelated; you'd need a database to have a KG.",
        "The backlinks between your notes ARE knowledge-graph edges, and the graph view IS a KG visualization — you're already building a knowledge graph, just an informal one.",
        "True, but only because Obsidian can't store relations between notes.",
        "Correct — a knowledge graph requires an ontology, so plain notes can never be one.",
      ],
      correct: 1,
      explanation:
        "PKM (note-taking) and knowledge graphs are one artifact seen from two communities. A bidirectional backlink is an edge between two entities — a KG edge — and the 'graph view' is a KG visualization. The difference is how explicit the structure is, not whether it's a graph.",
      wrongExplanations: {
        "0": "This is the core misconception the lesson dismantles. A backlink between two notes is exactly a relation between two entities — a knowledge-graph edge — whether or not a 'database' is involved.",
        "2": "Backlinks ARE stored relations between notes; that's precisely why linked notes already form a graph.",
        "3": "An ontology (schema) adds *meaning/rules* on top, but a set of linked notes is already a knowledge graph (the data layer) without one. The ontology is optional structure, not the price of admission.",
      },
    },
    {
      id: "fr-q2",
      type: "multiple-choice",
      prompt:
        "You need a second brain whose facts are auditable and contradiction-checkable for a compliance use case, and you can afford up-front modeling effort. Among the three paradigms, which leans best — and why is this NOT a claim that it's the best paradigm overall?",
      options: [
        "GraphRAG — it's the newest, so it's strictly the most rigorous.",
        "Symbolic KG — explicit facts and traceable inference fit an auditable use case; it's best *here* because the goal (auditability) and budget (can afford modeling) match its strengths, not because it wins everywhere.",
        "LLM-wiki — readable files are always the most trustworthy.",
        "Whichever is most popular this year — paradigm choice is a matter of fashion.",
      ],
      correct: 1,
      explanation:
        "Neutrality is the whole point: a symbolic KG is precise and inspectable, which is exactly what auditability needs, and the scenario can pay its heavy build cost. That makes it the right fit *for this goal and budget* — it would be a poor fit for a fast-moving corpus you can't afford to model. No paradigm wins universally.",
      wrongExplanations: {
        "0": "Newer is not more rigorous. GraphRAG's graph is LLM-built (less inspectable than a hand-modeled symbolic KG) and carries an expensive rebuildable index — wrong fit for an auditable compliance store.",
        "2": "LLM-wiki files are readable but non-deterministic and can go stale or self-contradict — the opposite of what an auditable, contradiction-checked store requires.",
        "3": "Paradigm choice is driven by goal and budget, not fashion — that's exactly the habit the lesson teaches.",
      },
    },
    {
      id: "fr-q3",
      type: "multiple-choice",
      prompt:
        "Your LLM extracted the triple `(Marie_Curie, wonNobelPrize, Chemistry_1903)` from a note. It is valid JSON, a syntactically fine triple, and passes schema validation. What can you correctly conclude?",
      options: [
        "It's true — it passed validation.",
        "It's well-formed (correctly shaped), but possibly false — validation checks structure, not truth (in fact Curie's 1903 Nobel was in Physics).",
        "It's false — LLM output is never reliable.",
        "Nothing, because triples can't represent prizes.",
      ],
      correct: 1,
      explanation:
        "Schema-valid ≠ true. Validation confirms the *shape* (right form, right types) and says nothing about whether the fact matches the world. Curie's 1903 Nobel was in Physics (her Chemistry Nobel was 1911), so this well-formed triple is false — which is exactly why neurosymbolic systems verify against trusted sources, not just the schema.",
      wrongExplanations: {
        "0": "This is the category error the lesson warns against: passing validation proves the structure is correct, not that the fact is correct.",
        "2": "Over-correction. Well-formed LLM output can be true or false; the point is that *validation alone* doesn't tell you which. You can't conclude 'false' from validation either.",
        "3": "A triple represents this fact fine; the issue is purely that the fact is untrue, not that it's unrepresentable.",
      },
    },
    {
      id: "fr-q4",
      type: "multiple-choice",
      prompt:
        "Why is `(Alice, siblings, Bob)` a good illustration that the (subject, predicate, object) triple is a modeling *choice* rather than the one true way?",
      options: [
        "Because siblings aren't entities, so the triple is invalid.",
        "Because the triple is one-directional: it doesn't automatically give you `(Bob, siblings, Alice)` — a symmetric fact needs the reverse triple or a 'symmetric property' declaration, work the format doesn't hand you for free.",
        "Because triples can only describe people, not relationships.",
        "Because property graphs are always better than triples.",
      ],
      correct: 1,
      explanation:
        "A plain triple has one direction (subject → object). Symmetric facts therefore take extra work — either store the reverse triple or declare the property symmetric so a reasoner fills it in. That awkwardness shows the triple is a choice with tradeoffs (it's also clumsy for n-ary facts), and that property graphs / linked notes are valid alternatives.",
      wrongExplanations: {
        "0": "`Alice` and `Bob` are perfectly good entities; the triple is well-formed. The point is the *direction*, not validity.",
        "2": "Triples describe relationships routinely; the predicate IS a relationship. The issue is one-directionality, not subject matter.",
        "3": "Neutrality cuts both ways: property graphs aren't 'always better' either — each representation fits some facts better. That's the whole 'representation is a choice' point.",
      },
    },
    {
      // JUDGED ACTIVITY (free-response). The Lesson type has no dedicated activity/
      // exercise construct — Lesson.quiz (a union of quiz kinds) is the only
      // interactive field (see types.ts). The richest judged interaction available
      // is FillInQ: learner free-text, normalized (whitespace/case folded) and
      // matched against `accepted`. So the judged activity is a decision task graded
      // by name-the-paradigm. (Limitation: no rubric/open-ended judging at the
      // lesson level; that lives in assessments.ts capstones, out of scope here.)
      id: "fr-activity",
      type: "fill-in",
      prompt:
        "Decision activity. Read the scenario, then NAME the single paradigm you'd lean toward first. You're graded on the paradigm you name; the explanation gives the tradeoff that justifies it — and the contrast that would flip the answer.",
      before:
        "Scenario: A small legal team wants a second brain over their contracts. The facts must be EXACT and auditable — 'which clauses in which contracts reference statute X, and do any contradict each other?' — and they can budget real up-front effort to model contracts, clauses, and statutes as entities and relations with a schema a reasoner can check.",
      after:
        "Type the paradigm's name (e.g. symbolic KG / symbolic knowledge graph, GraphRAG, or LLM-wiki / agentic).",
      accepted: [
        "symbolic kg",
        "symbolic knowledge graph",
        "symbolic",
        "knowledge graph",
        "kg",
        "symbolic-kg",
      ],
      placeholder: "name the paradigm",
      explanation:
        "Two flags in the scenario both point to a symbolic knowledge graph: the facts must be EXACT and auditable (so you want explicit facts and traceable, reasoner-checkable inference — symbolic KG's core strength), and the team can pay the heavy up-front modeling cost (its core price). The real skill is the contrast that flips it: had the corpus been a sprawling, fast-changing personal note pile where nobody can afford to model a schema and 'good-enough global themes' is the goal, GraphRAG (or an LLM-wiki/agentic setup) would be the better lean — the symbolic build cost would never pay back. Matching the paradigm to the goal (exact + auditable) and the budget (modeling effort available) is the whole point; no paradigm wins universally.",
    },
  ],
  masteryCheckpoint:
    "You can say what a second brain is (store + retrieve), explain the PKM↔KG unification (a backlink is an edge, the graph view is a KG visualization, 'AI over my notes' is RAG, spelling out PKM/KG/RAG/MOC), lay out the three paradigms (symbolic KG, GraphRAG, LLM-wiki/agentic) as a fair menu each honestly costed, choose among them by goal and budget (and note they compose), treat the triple as a modeling choice with limits, and hold the line that schema-valid is not the same as true.",
};
