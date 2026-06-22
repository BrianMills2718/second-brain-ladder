/**
 * Retrieve: the decision ladder — a NEUTRAL menu of ways to get knowledge back
 * out of a second brain. Each rung arrives as the fix to the previous rung's
 * limit (a Therefore-&-But arc), and each is honestly costed. The lesson does NOT
 * spine on a favorite; the recommended skill is matching the rung to the question
 * type + budget. The concept panel carries the authoritative definitions; this is
 * the narrative. Craft bar (RESCOPE_PLAN §"new bar"): concept-before-syntax,
 * every symbol/acronym spelled out on first use, picture/example/analogy before
 * the abstract definition, confusion-anticipation inline.
 */
import type { Lesson } from "../../types";

export const sbRetrieve: Lesson = {
  id: "sb-retrieve",
  stage: 17,
  title: "Retrieve: the decision ladder",
  summary:
    "Storing knowledge is half a second brain; getting the right piece back out is the other half. There is no single best way to retrieve — there is a ladder of options, each fixing the last one's weakness at a new cost. The skill is matching the rung to your question and your budget, not picking a favorite.",
  prerequisites: ["sb-neural", "sb-kg"],
  objectives: [
    "Frame retrieval as a neutral decision: match the method to the question type and the budget, not to a favorite.",
    "Walk the ladder — keyword, vector, hybrid+rerank, RAG, GraphRAG, agentic, LLM-wiki — and say what limit each rung fixes and what it costs.",
    "Spell out and define every acronym in the space (BM25, ANN, RAG, GraphRAG, MCP) and explain what each names.",
    "Pick a defensible rung for a given question, and justify it by its tradeoffs.",
  ],
  definitions: [],
  sections: [
    {
      heading: "The decision, before any method",
      body: `Imagine a friend with a perfect memory. You don't keep them around for what they *store* — you keep them around for what they can *hand back* the moment you ask. A second brain is the same: the value is in **retrieval**, the read side — getting the *relevant* piece back out for the question in front of you.

Here is the trap this whole lesson defends against: people reach for the newest, most powerful retrieval method by reflex. That is a mistake. Each method below is a **rung on a ladder**, and each rung trades something away. A cheap rung can be the *right* rung. So the goal is not "which is best?" — there is no best. The goal is a decision: **match the method to the question type and to your budget (money, latency, maintenance).**

Two questions decide almost everything:

1. *Do I want an exact phrase, or do I mean a concept?* (lexical vs. semantic)
2. *Is this a one-fact lookup, a many-fact synthesis, or a whole-corpus question?* (scope)

We will climb the ladder one rung at a time. Watch the shape: each rung arrives as the *fix* for the previous rung's *limit* — but every fix has a bill attached.`,
    },
    {
      heading: "Rung 1 — keyword search (cheap, exact, literal)",
      body: `**Picture it first.** You hit Ctrl-F in a long document and type a word. The browser jumps to that exact word. That is keyword search — also called *lexical* search, because it matches on the literal letters (the lexicon), not the meaning.

The standard way to *rank* the matches is a formula called **BM25** — short for **Best Matching 25** (it was the 25th formula in a research series; the name carries no deeper meaning). The idea is simple to state: a document scores higher when it contains the query's words, and *rarer* words count for more (a note that contains "Lovelace" tells you more than one that contains "the").

\`\`\`text
query:  "ML"
hit:    a note containing the letters  M L     ✅
miss:   a note that only says  "machine learning"   ❌  (no shared letters)
\`\`\`

**Why it's a good rung:** it is cheap, fast, exact, and *explainable* — you can see exactly which word matched. For codes, names, error strings, and exact phrases, nothing beats it.

**But** (here is the limit that forces the next rung): it is blind to meaning. A synonym it has never seen is a miss. Search "ML" and a note that only says "machine learning" never surfaces. *Therefore* we need a method that matches on meaning, not letters.`,
    },
    {
      heading: "Rung 2 — vector search (matches meaning, fuzzily)",
      body: `**Analogy first.** Picture every note dropped onto a giant map where *things about the same topic land near each other* — all the cooking notes in one region, all the math notes in another. To answer a question, you drop the *question* onto the same map and grab whatever notes landed nearby. That map is what an **embedding** gives you: a learned list of numbers (a vector) for each piece of text, arranged so that similar meanings sit close together. **Vector search** returns the documents whose embeddings are *closest* to the query's embedding — closeness being the **similarity** you met on the neural side.

This is why it fixes Rung 1's blind spot: ask "how do neural nets learn?" and a note titled "backpropagation" comes back even though they share *zero words* — they share *meaning*, so they sit near each other on the map.

One acronym to define, because you will see it everywhere: **ANN**, **Approximate Nearest Neighbor**. Finding the truly closest vectors among millions is slow, so an ANN index finds the *almost*-closest ones much faster — it trades a little accuracy for a lot of speed. "Approximate" is the honest word: it can occasionally miss the very best match.

**But** vector search has its own bill. The match is *fuzzy* — there is no guarantee an exact keyword is present, so it can miss a precise code or name that keyword search would have nailed. And it inherits the embedding's blind spots: if the embedding model never learned a niche term, the map places it wrong. *Therefore* the obvious move is: why not run *both*?`,
    },
    {
      heading: "Rung 3 — hybrid search + reranking (both, then sharpen)",
      body: `If Rung 1 is exact-but-literal and Rung 2 is meaningful-but-fuzzy, **hybrid search** is the natural reconciliation: run keyword search *and* vector search, then merge their two result lists.

There is usually one more step, and its name needs unpacking: **reranking**. The first pass casts a wide, cheap net (the two searches above). Reranking then takes just the top handful of candidates and feeds each one, *paired with the query*, into a slower, more careful model called a **cross-encoder** — "cross" because it reads the query and the document *together* and judges how well they actually answer each other, rather than comparing two pre-computed vectors. The reranker reorders the shortlist so the best answer rises to the top.

\`\`\`text
query ─┬─▶ keyword search ─┐
       └─▶ vector search  ─┴─▶ merged shortlist ─▶ reranker ─▶ final order
\`\`\`

**Why climb here:** you get lexical exactness *and* semantic recall, and the reranker buys you a sharper final order than either search alone.

**But** the bill is now real: you maintain *two* indexes instead of one, and the reranker adds latency on every query. For a small personal note set that may be over-engineering. *Therefore*, so far we have only found *documents* — the user still has to read them. The next rung asks the machine to read them for you.`,
    },
    {
      heading: "Rung 4 — RAG (retrieve, then let an LLM answer)",
      body: `Everything so far hands you a *list of documents*. **RAG** changes the output. RAG is spelled out **Retrieval-Augmented Generation**, and reading it backwards is the clearest way to understand it:

- **Generation** — a large language model (an LLM, the same family of model you met doing *LLM extraction* on the neural side) writes an answer in prose.
- **Augmented** — but its writing is *augmented* (supported) by…
- **Retrieval** — …passages fetched *first* by any rung above (keyword, vector, or hybrid).

So the flow is: **retrieve relevant passages → hand them to the LLM → the LLM answers using them.** The payoff is grounding: instead of answering from the model's hazy memory (which is how a **hallucination** — a confident, well-formed, but unsupported claim — sneaks in), it answers from *your* fetched notes and can cite them.

\`\`\`text
question ─▶ retrieve your 5 most relevant notes ─▶ LLM writes an answer
                                                   using ONLY those notes (+ citations)
\`\`\`

**Confusion to head off now:** RAG does *not* eliminate hallucination — it *reduces* it. If retrieval hands the model the wrong notes, it will confidently answer from the wrong notes.

**But** here is the structural limit, and it sets up the next two rungs at once: RAG only ever sees *the few chunks it retrieved*. It has **no whole-corpus view**. Ask "what are the recurring themes across *all* my notes?" and there is no handful of chunks that answers it — the answer lives in the *shape of the whole collection*. *Therefore* we need retrieval that understands structure across the corpus.`,
    },
    {
      heading: "Rung 5 — GraphRAG (build a graph first, then retrieve over it)",
      body: `**GraphRAG** is a *variant* of RAG (same retrieve-then-generate idea) with one big addition up front: before answering anything, it uses an LLM to read your whole corpus and build a **knowledge graph** out of it — pulling out entities, the relations between them, and then *clustering* related entities into communities and writing a short **community summary** for each cluster.

That extra structure unlocks two retrieval modes, and the distinction matters:

- **Local search** answers an *entity-specific* question by walking the graph's neighbors. "What does Ada connect to?" → start at the Ada node, hop to its neighbors. This is roughly what plain RAG does, plus relationship-following (good for *multi-hop* questions: "who did the people Ada cited go on to influence?").
- **Global search** answers a *whole-corpus* question — exactly the kind Rung 4 could not — by reading the **community summaries** instead of individual chunks. "What are the main themes across everything?" is answerable because the themes were *pre-computed* as summaries.

So GraphRAG is the rung that buys you the global view RAG lacks.

**But** the bill is steep and worth stating plainly: building that graph is an *expensive indexing step* (many LLM calls over your whole corpus), and it must be **rebuilt** as your notes change or it goes stale. For a fast-changing or small corpus, that build cost may never pay back.

**Confusion to head off:** GraphRAG is *not* "the same as RAG" and it is *not* "RAG but always better." It is RAG plus a costly graph-building step that earns its keep *only* when you have global/multi-hop questions over a reasonably stable corpus.`,
    },
    {
      heading: "Rung 6 — agentic retrieval (let an agent decide what to look up next)",
      body: `Every rung so far does retrieval in *one fixed shot*: one query in, one set of results out. **Agentic retrieval** breaks that into a *loop*. An LLM acting as an **agent** decides, turn by turn, what to look up next: it searches, *reads* a result, and based on what it found issues a *follow-up* search or runs a tool — repeating until it has enough to answer.

\`\`\`text
"Compare what my 2024 vs 2025 notes say about X"
  → agent searches 2024 → reads → searches 2025 → reads → synthesizes the comparison
\`\`\`

This handles *multi-step* questions that no single query can express, because the agent's *second* move depends on what its *first* move found.

**The most important practical point — and a common misconception.** "Agentic retrieval" does **not** mean "go build a custom reasoning loop from scratch." The usual, cheaper path is to **adopt an existing, capable agent harness** and point it at your files. These harnesses talk to your data and tools through **MCP** — the **Model Context Protocol**, an open standard for exposing tools and data sources to an agent in a uniform way (think "a USB port for agent tools"). Adopting a harness over building your own loop is the default; building your own is one option among many, not the definition.

**But** the bill is the heaviest yet, and it is three separate costs:
- **Cost/latency:** an agent may issue *many* model calls for one question.
- **Non-determinism:** ask twice, possibly get two different search paths and two different answers — harder to test and trust.
- **Security:** giving an agent tools and file access is a real *permission surface*; a tool that can read or write your files can be misused or mis-prompted.`,
    },
    {
      heading: "Rung 7 — the LLM-wiki variant (front-load the synthesis)",
      body: `Every rung after keyword search does its thinking *at query time* — you ask, and only then does the work happen. The **LLM-wiki** approach flips the timing: do the thinking *at write time*.

Instead of re-searching raw chunks on every question, an LLM maintains a set of clean, cross-linked wiki pages — one per topic — that summarize and connect your notes. An agent (Rung 6) *reads* those pages to answer, and *updates* them as new notes arrive. Reads become fast and coherent because the synthesis already happened.

\`\`\`text
40 raw notes on category theory
   → agent maintains one  category-theory.md  page (a living summary)
   → to answer, read THAT page instead of re-searching 40 notes
\`\`\`

**Why someone reaches for this rung:** answers are fast, coherent, and consistent, because a human-readable artifact was curated up front rather than reassembled per query.

**But** — and this is exactly why it is a *rung with real downsides*, not the destination — the bill is **maintenance and non-determinism**: the wiki files can go *stale* (a new note contradicts the page and the page wasn't updated), they can *self-contradict* across pages, and the maintenance pass that keeps them current is itself an LLM step, so it is non-deterministic and can quietly introduce errors. A wiki nobody (human or agent) maintains decays into confident, out-of-date prose.`,
    },
    {
      heading: "Climbing back down: the neutral takeaway",
      body: `Notice that we *climbed* the ladder by limits — each rung fixed the last one's weakness — but climbing higher is **not** the same as climbing *better*. Higher rungs cost more money, more latency, more maintenance, and (from Rung 6 on) more non-determinism and security surface. The right move is often to climb *back down* to the cheapest rung that actually answers your question.

A neutral way to decide:

- **Exact phrase, code, name, error string?** → keyword search. Don't pay for embeddings.
- **"I mean the concept, not the words"?** → vector search.
- **Both, and the order really matters?** → hybrid + rerank.
- **Want a written, cited answer from a few sources?** → RAG.
- **A whole-corpus or multi-hop question over a stable corpus?** → GraphRAG (if the build cost pays back).
- **A genuinely multi-step investigation?** → an adopted agentic harness — accepting cost + non-determinism + a permission surface.
- **A topic you query constantly and can afford to maintain?** → an LLM-wiki — accepting the upkeep and staleness risk.

There is no favorite here. The expert move is to name your question type and your budget *first*, then pick the lowest rung that clears both.`,
    },
  ],
  visualizations: [
    {
      id: "retrieve-ladder",
      kind: "comparison-table",
      title: "The retrieval ladder — what each rung fixes and what it costs",
      textualSummary:
        "Seven retrieval methods compared on three honest questions. Keyword/BM25: matches exact words (yes), matches meaning (no), gives a whole-corpus view (no) — cheapest, exact, but blind to synonyms. Vector search: exact words (no), meaning (yes), corpus view (no) — semantic but fuzzy and no exact-match guarantee. Hybrid+rerank: exact words (yes), meaning (yes), corpus view (no) — both strengths but two indexes plus reranker latency. RAG: produces a written cited answer but only sees retrieved chunks (no corpus view) and only reduces, not eliminates, hallucination. GraphRAG: adds a whole-corpus/global view (yes) via a knowledge graph, but pays an expensive indexing build that must be rebuilt. Agentic retrieval: handles multi-step questions (corpus view via iteration) but is non-deterministic, many model calls, and a security/permission surface. LLM-wiki: fast coherent reads from pre-synthesized pages, but the pages can go stale/self-contradict and need ongoing non-deterministic maintenance. The lesson is neutral: match the rung to the question type and budget, not to a favorite.",
      columns: ["Matches exact words?", "Matches meaning?", "Whole-corpus / multi-hop?"],
      rows: [
        {
          label: "Keyword search (BM25) — cheap, exact, literal",
          cells: {
            "Matches exact words?": { value: "yes", note: "literal lexical match; ideal for codes, names, error strings" },
            "Matches meaning?": { value: "no", note: "a synonym it never saw is a miss" },
            "Whole-corpus / multi-hop?": { value: "no", note: "ranks documents, no synthesis" },
          },
        },
        {
          label: "Vector search — semantic, fuzzy",
          cells: {
            "Matches exact words?": { value: "no", note: "no exact-keyword guarantee; can miss a precise name/code" },
            "Matches meaning?": { value: "yes", note: "embedding similarity finds synonyms; ANN index for speed" },
            "Whole-corpus / multi-hop?": { value: "no", note: "still returns nearby documents only" },
          },
        },
        {
          label: "Hybrid + rerank — both, then sharpen",
          cells: {
            "Matches exact words?": { value: "yes", note: "keyword half keeps lexical exactness" },
            "Matches meaning?": { value: "yes", note: "vector half keeps semantic recall; cross-encoder reranks" },
            "Whole-corpus / multi-hop?": { value: "no", note: "cost: two indexes + reranker latency" },
          },
        },
        {
          label: "RAG — retrieve then generate a cited answer",
          cells: {
            "Matches exact words?": { value: "n/a", note: "depends on the retriever it sits on" },
            "Matches meaning?": { value: "n/a", note: "depends on the retriever it sits on" },
            "Whole-corpus / multi-hop?": { value: "no", note: "sees only retrieved chunks; reduces but doesn't end hallucination" },
          },
        },
        {
          label: "GraphRAG — build a graph, then retrieve",
          cells: {
            "Matches exact words?": { value: "n/a", note: "retrieval runs over the built graph" },
            "Matches meaning?": { value: "yes", note: "entities + relations; local search walks neighbors" },
            "Whole-corpus / multi-hop?": { value: "yes", note: "global search over community summaries; cost: expensive rebuildable indexing" },
          },
        },
        {
          label: "Agentic retrieval — adopt a harness, loop over tools",
          cells: {
            "Matches exact words?": { value: "n/a", note: "the agent chooses which retriever/tool to call" },
            "Matches meaning?": { value: "yes", note: "can call semantic search among its tools" },
            "Whole-corpus / multi-hop?": { value: "yes", note: "iterates; cost: non-deterministic, many calls, permission surface" },
          },
        },
        {
          label: "LLM-wiki — front-load synthesis into maintained pages",
          cells: {
            "Matches exact words?": { value: "n/a", note: "you read curated pages, not raw documents" },
            "Matches meaning?": { value: "yes", note: "pages are topic summaries; fast coherent reads" },
            "Whole-corpus / multi-hop?": { value: "yes", note: "cost: pages go stale / self-contradict; non-deterministic upkeep" },
          },
        },
      ],
    },
  ],
  confusions: [
    {
      misconception: "RAG and GraphRAG are the same thing.",
      correction:
        "GraphRAG is a variant of RAG, not a synonym. Plain RAG retrieves text chunks and only ever sees the few it fetched (no whole-corpus view). GraphRAG first spends an expensive LLM pass building a knowledge graph (entities, relations, clustered community summaries) and retrieves over that — which is what gives it a global/multi-hop view. It is RAG plus a costly indexing step, not RAG renamed, and not automatically better.",
    },
    {
      misconception: "Agentic search means you have to build a custom ReAct-style agent loop yourself.",
      correction:
        "The default, cheaper path is to ADOPT an existing capable agent harness and point it at your files (typically via MCP, the Model Context Protocol). Building your own reason-act loop is one option, not the definition of agentic retrieval. The defining feature is iteration — the agent decides what to look up next based on what it just found — not who wrote the loop.",
    },
    {
      misconception: "Vector search understands meaning the way a human does, so it always beats keyword search.",
      correction:
        "Vector search matches on embedding similarity, which is fuzzy and has no exact-keyword guarantee — it can miss a precise code, name, or error string that keyword search nails, and it inherits the embedding model's blind spots for terms it never learned well. For exact lookups, the cheaper keyword rung is often the better choice. 'Newer/fancier' is not 'better'; match the rung to the question.",
    },
    {
      misconception: "The newest, most powerful rung (agentic / LLM-wiki) is the right default.",
      correction:
        "Climbing the ladder is by limits, not by quality. Higher rungs add cost, latency, maintenance, non-determinism, and (from agentic up) a security/permission surface. The neutral expert move is to drop to the lowest rung that actually answers your question type within your budget — often that is keyword or vector search, not an agent.",
    },
  ],
  quiz: [
    {
      id: "rt-q1",
      type: "multiple-choice",
      prompt:
        "You need to find every note that contains the exact error string `ERR_CONN_REFUSED`. Which rung is the best *first* choice, and why?",
      options: [
        "Vector search — it understands meaning, so it will find the error.",
        "Keyword search (BM25) — it matches the literal string exactly and is cheapest.",
        "An agentic harness — only an agent can find exact strings.",
        "LLM-wiki — read a summary page instead of searching.",
      ],
      correct: 1,
      explanation:
        "An exact literal string is the textbook case for lexical/keyword search: exact, cheap, explainable. Don't pay for embeddings or an agent when Ctrl-F-style matching is exactly what you want.",
      wrongExplanations: {
        "0": "Misconception: 'meaning' always wins. Vector search is fuzzy and has no exact-keyword guarantee — it can rank the literal match below a 'semantically similar' but wrong note.",
        "2": "Misconception: agentic = more capable at everything. An agent is overkill (and non-deterministic, and costly) for a one-shot exact-string lookup.",
        "3": "An LLM-wiki page is a synthesized summary; the exact raw string may have been abstracted away, and it needs maintenance you haven't paid for.",
      },
    },
    {
      id: "rt-q2",
      type: "multiple-choice",
      prompt:
        "Why can GraphRAG answer 'What are the recurring themes across ALL my notes?' when plain RAG cannot?",
      options: [
        "GraphRAG uses a bigger LLM, so it just knows more.",
        "Plain RAG only sees the few chunks it retrieved; GraphRAG pre-computes community summaries over the whole corpus and retrieves those (a global view).",
        "GraphRAG never hallucinates, so its answers are always complete.",
        "Plain RAG cannot use an LLM, but GraphRAG can.",
      ],
      correct: 1,
      explanation:
        "A whole-corpus question has no answer in any single handful of chunks — it lives in the shape of the whole collection. GraphRAG's expensive indexing builds clustered community summaries, so global search can read those. That capability is the payoff that justifies the build cost.",
      wrongExplanations: {
        "0": "Misconception: capability comes from model size. The difference is structural — pre-computed community summaries — not a bigger model.",
        "2": "Misconception: GraphRAG eliminates hallucination. Grounding reduces it; nothing here makes hallucination impossible.",
        "3": "Both retrieve-then-generate with an LLM. The 'R' in RAG already includes an LLM generating the answer.",
      },
    },
    {
      id: "rt-q3",
      type: "multiple-choice",
      prompt:
        "A teammate says: 'We should just always use the agentic harness — it's the most advanced, so it's the best default.' What's the most accurate neutral response?",
      options: [
        "Agreed — newer methods are strictly better, so default to the top rung.",
        "Disagree — climbing the ladder is by limits, not quality; higher rungs add cost, non-determinism, and a security surface, so default to the lowest rung that answers the question within budget.",
        "Disagree — agentic retrieval doesn't actually work, so never use it.",
        "Agreed — and we should hand-build the agent loop ourselves for full control.",
      ],
      correct: 1,
      explanation:
        "Neutrality is the whole point: there is no favorite rung. Each is an option with honest costs. Agentic retrieval is great for genuinely multi-step questions but costs many model calls, is non-deterministic, and opens a permission surface — so it is a poor *default*, not a poor *tool*.",
      wrongExplanations: {
        "0": "Misconception: advanced = best default. Cost, latency, maintenance, and security all argue against defaulting to the top rung.",
        "2": "Over-correction in the other direction. Agentic retrieval is genuinely the right rung for multi-step investigations; the error is making it the *default*, not using it at all.",
        "3": "Restates the 'build it yourself' misconception. The usual path is to ADOPT a harness (e.g. via MCP), not to hand-build the loop.",
      },
    },
    {
      id: "rt-q4",
      type: "multiple-choice",
      prompt:
        "What does reranking add to a hybrid search pipeline, in plain terms?",
      options: [
        "It deletes the keyword index so only vectors remain.",
        "It takes the top candidates and re-scores each query–document pair jointly with a slower cross-encoder, sharpening the final order.",
        "It guarantees the exact-keyword match always ranks first.",
        "It replaces the LLM so no generation is needed.",
      ],
      correct: 1,
      explanation:
        "A reranker is a second, more careful pass over a small shortlist: a cross-encoder reads the query and each candidate document *together* and judges how well they match, reordering the top results. It costs extra latency, which is the tradeoff.",
      wrongExplanations: {
        "0": "Hybrid keeps both keyword and vector retrieval; reranking reorders their merged shortlist, it doesn't delete an index.",
        "2": "No such guarantee — the reranker scores relevance jointly; an exact match wins only if it's genuinely the best answer.",
        "3": "Reranking is part of retrieval, not generation; it has nothing to do with the LLM answer step in RAG.",
      },
    },
    {
      // JUDGED ACTIVITY (free-response). The Lesson type has no dedicated
      // activity/exercise/short-answer construct (see types.ts: Lesson.quiz is the
      // only interactive field, a union of quiz kinds). The richest judged
      // interaction available is FillInQ — learner free-text, normalized
      // (whitespace/case folded) and matched against accepted answers. So the
      // "judged activity" is a decision task graded by name-the-rung.
      id: "rt-activity",
      type: "fill-in",
      prompt:
        "Decision activity. Read the scenario, then NAME the single retrieval rung you'd reach for first, by its common name. You will be graded on the rung you name; the explanation states the tradeoff that justifies it.",
      before:
        "Scenario: You have a large, fairly stable archive — ~50,000 research notes collected over years, updated only occasionally. Your question is: \"What are the major themes across the whole archive, and how do they connect?\" This is a whole-corpus synthesis question — no single note or handful of notes answers it — and because the corpus is large and changes rarely, a one-time expensive index build can pay back over many such queries.",
      after:
        "Type the rung's name (e.g. keyword search, vector search, hybrid search, RAG, GraphRAG, agentic retrieval, or LLM-wiki).",
      accepted: ["graphrag", "graph rag", "graph-rag"],
      placeholder: "name the rung",
      explanation:
        "A whole-corpus 'themes and how they connect' question is exactly what GraphRAG's global search (over pre-computed community summaries) is built for — plain RAG sees only the few chunks it retrieved and can't synthesize across everything. The scenario's two cost flags both point the same way: the corpus is large (so the global view is genuinely needed) and stable (so the expensive graph build is rebuilt rarely and pays back over many queries). The real skill is the contrast: had the corpus been small and fast-changing, that rebuild cost might never pay back, and an agentic harness that iterates at query time — no pre-build — would be the better call. Matching the rung to the corpus's size and stability is the whole point.",
    },
  ],
  masteryCheckpoint:
    "You can walk the retrieval ladder (keyword → vector → hybrid+rerank → RAG → GraphRAG → agentic → LLM-wiki), spell out and explain every acronym (BM25, ANN, RAG, GraphRAG, MCP), say what limit each rung fixes and what it costs, and — neutrally — pick the lowest rung that answers a given question within budget, justifying the choice by its tradeoffs.",
};
