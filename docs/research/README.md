# Research notes — modern KG / GraphRAG / second-brain landscape

Landscape scan (2026-06-22) to inform rescoping the Second Brain curriculum off the 2018
symbolic stack onto the LLM-native one. One note per source, grouped by theme.

### Foundations / retrieval
| Note | What it is | Verdict |
|---|---|---|
| [rag-fundamentals](rag-fundamentals.md) | RAG pipeline: chunk→embed→vector/BM25/hybrid→rerank→generate; eval (RAGAS) | **Prerequisite bedrock**; its failure modes motivate GraphRAG |

### GraphRAG (the modern spine)
| Note | What it is | Verdict |
|---|---|---|
| [microsoft-graphrag](microsoft-graphrag.md) | The canonical system (~34k★): extract→graph→Leiden communities→summaries; local vs global search | **THE reference**; teach the index-vs-query-time and local-vs-global splits |
| [graphrag-jaylzhou](graphrag-jaylzhou.md) | **DIGIMON** — unified framework re-implementing 9 GraphRAG methods | Best **teachable decomposition**: method = graph type × retrieval operators |
| [awesome-graphrag](awesome-graphrag.md) | Survey companion (~2.5k★): organization→retrieval→integration taxonomy | The map of the GraphRAG field; research-heavy |

### LLM Wiki / agentic notes (the third paradigm — front-load synthesis, navigate)
| Note | What it is | Verdict |
|---|---|---|
| [karpathy-gist](karpathy-gist.md) | Karpathy's "LLM Wiki" (Apr 2026): agent **builds & maintains** a persistent linked-markdown wiki; *anti-RAG* | Canonical statement of **agentic navigation > query-time retrieval** — the paradigm you favor |
| [karpathywiki-obsidian](karpathywiki-obsidian.md) | `green-dalii/obsidian-llm-wiki` plugin implementing it (full-context, no embeddings) | A real, installable worked instance; the hard part is graph **maintenance** |
| [open-knowledge-format](open-knowledge-format.md) | Google OKF v0.1 (Jun 2026): Markdown+frontmatter+wikilinks spec | Same pattern formalized; enterprise-interchange, **mostly out-of-scope** but a portability case study |

### Agent memory (the substrate of a "second brain for agents")
| Note | What it is | Verdict |
|---|---|---|
| [agent-memory-substrates](agent-memory-substrates.md) | Zep/Graphiti, Mem0, Letta/MemGPT, Cognee, Memobase | The substrate layer; key decision = **graph vs flat-vector memory** |

### KG reasoning & legacy symbolic stack
| Note | What it is | Verdict |
|---|---|---|
| [awesome-kg-reasoning](awesome-kg-reasoning.md) | Neural reasoning taxonomy (TPAMI'24): embedding/GNN/path/rule | "Reasoning" = KG completion, **not** OWL/DL — confirms the RDF-vs-LPG correction |
| [awesome-knowledge-graph](awesome-knowledge-graph.md) | Canonical KG awesome-list (~1.9k★) | ~70–80% **legacy** graph-DB/semantic-web; no LLM/GraphRAG sections |
| [open-kgo](open-kgo.md) | `mloda` plugin over 9 KG backends | Legacy symbolic exemplar to move *off* |

### The human reality
| Note | What it is | Verdict |
|---|---|---|
| [pkm-methods-and-tools](pkm-methods-and-tools.md) | Zettelkasten/PARA/evergreen/MOCs; Obsidian/Logseq/Tana/Notion/Reor/Khoj/NotebookLM | What learners actually want; **PKM and GraphRAG are the same artifact from two cultures** |
| [awesome-second-brain](awesome-second-brain.md) | aristoapp list (~430★): agent-memory framing, Collect→Organize→Evolve→Use→Govern | AI-native lifecycle scaffold; over-indexes on backends |

## Synthesis — what this means for the rescope

**There are three paradigms for "knowledge over your stuff," not one:**
1. **Symbolic KG** (RDF/OWL/SPARQL, triple stores). Legacy; the old awesome-lists still
   center it. *Reasoning here = deductive entailment* — now a niche.
2. **GraphRAG** (LLM builds a graph; you retrieve over it at query time). The modern
   spine. MS GraphRAG is the reference; DIGIMON gives the modular "graph type × retrieval
   operator" decomposition. *Reasoning here = neural / retrieval (link prediction,
   multi-hop, community summarization).*
3. **LLM Wiki / agentic notes** (LLM front-loads synthesis into a persistent, navigable,
   human-readable artifact and *reads/writes* it; full-context over chunk-retrieval).
   Karpathy's gist → the karpathywiki plugin → OKF. *Retrieval here = the agent
   navigating an index it maintains* — the pattern the project owner favors.

**Key cross-cutting findings:**
- **The RDF-vs-LPG reasoning correction is confirmed.** The whole modern reasoning
  literature is neural/embedding/GNN; symbolic OWL/DL is absent. The modern answer to
  "can you reason over a KG" is embeddings/GraphRAG, which is *more* native to property
  graphs than to RDF.
- **PKM ↔ KG/AI is one artifact from two cultures.** A bidirectional link *is* a
  property-graph edge; the graph view *is* a KG visualization; "AI over my notes" *is*
  RAG; an MOC/index note *is* Karpathy's `index.md`. The curriculum should make these
  mappings explicit and stop treating "KG" and "note-taking" as different subjects.
- **The hard part of the LLM-Wiki paradigm is maintenance, not extraction** (dedup,
  aliases, dead links, contradictions, idempotent re-ingest) — a great teachable problem.
- **Retrieval is a decision ladder, by question type and cost:** keyword → vector →
  hybrid+rerank → GraphRAG (global/multi-hop) → agentic/LLM-wiki. This *is* the
  skill-based spine.

**Curriculum spine (learner-empowerment framing — neutral on the "right" answer).** The
goal is **practitioner capability**: equip the learner to *understand the alternatives →
weigh tradeoffs → decide & plan → implement → operate* for **their own** goal. Present the
three paradigms as a **fair decision menu**, each with its costs — not a favored spine
(the owner's preference for the LLM-wiki paradigm is one option presented honestly, with
its maintenance cost and lack of empirical proof). Organize on the builder's decisions and
the full build lifecycle:
- *Represent* — notes/links → property graph → KG (the DIGIMON graph-type ladder).
- *Construct* — LLM extraction / GraphRAG indexing / wiki synthesis, with hallucination filtering.
- *Retrieve* — the decision ladder: keyword → vector → hybrid+rerank → GraphRAG → agentic/LLM-wiki.
- *Operate & govern* — deploy, maintain, evaluate, update, manage cost.

Critically, the tree must not stop at "understand"; it must carry the learner through
**plan → implement → operate**. The notes so far cover *what/why/tradeoffs* well but are
thin on this *in-practice* layer — the biggest current gap (see backlog).

## Backlog — notes we still should have (advice)

Prioritized; not yet written. **The "in-practice" cluster (8–10) is now top priority** —
it's the layer the curriculum's plan→implement→operate goal most needs and the notes most
lack.

*In-practice layer (the biggest gap):*
8. **Implement: building the systems end-to-end** *(HIGH)* — LlamaIndex / LangChain
   property-graph & KG indexes; standing up a GraphRAG pipeline; deploying an agent-memory
   store (Mem0/Graphiti); building an LLM-wiki. Hands-on, framework-level "how you
   actually build one."
9. **Plan: goal → approach → architecture** *(HIGH)* — how to scope a build, elicit
   requirements, pick a paradigm/stack for a given goal and budget, and sketch the
   architecture. The decision-and-planning skill itself.
10. **Operate: run & maintain** *(HIGH)* — maintenance (dedup, re-ingest, dead links,
    contradiction handling), production eval, cost/latency/observability, updating a live
    knowledge store. The "use it in practice" layer.

*Concept/comparative layer:*
1. **KG construction, LLM-driven** *(HIGH)* — RAKG, KGGen, OpenIE, schema-guided
   extraction, entity resolution / coreference, hallucinated-triple filtering
   (LLM-as-judge). The *construct* stage; the owner already surfaced the RAKG paper.
2. **Represent: property graph vs RDF + query languages + standards** *(HIGH)* — Cypher,
   ISO GQL (2024), RDF-star / RDF 1.2, schema.org, Wikidata, PROV (provenance), JSON-LD.
   The foundation of the *represent* decision page and the home of the RDF-vs-LPG fix.
3. **Agentic RAG / agentic retrieval** *(MEDIUM-HIGH)* — ReAct, Self-RAG, CRAG
   (corrective RAG), query planning, tool-use search. Ties the Karpathy-wiki idea to the
   literature; the top of the retrieval ladder.
4. **Evaluation, end to end** *(MEDIUM)* — RAGAS, GraphRAG-Bench, retrieval metrics, KG
   quality, faithfulness. Resonates with the methodology's gate/efficacy thread.
5. **Specific GraphRAG systems, deep-dive** *(MEDIUM)* — LightRAG, HippoRAG/HippoRAG2,
   RAPTOR, Pike-RAG (currently only at survey depth).
6. **Long-context vs RAG / context engineering** *(MEDIUM)* — the "is RAG dead" debate,
   NotebookLM, when long-context replaces retrieval.
7. **Lightweight ontology / schema design** *(LOW-MEDIUM)* — the schemaless → typed →
   ontology spectrum; when a schema earns its cost (links to Tana supertags, OKF `type`).
