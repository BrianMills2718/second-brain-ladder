# Agent-memory substrates — the persistence backends ("second brain") that let LLM agents remember across sessions

- **Scope:** "Agent memory" is the layer that survives between an LLM's stateless calls: it captures what was said and done, distills it into durable facts/relations, and selectively *re-injects* the right slice back into a finite context window on each turn. The context window is RAM; this is the disk. It is the substrate layer of an AI "second brain" — without it, an agent re-meets you every conversation. Concretely these systems do four things: **ingest** (chat turns, docs, tool results) → **extract/consolidate** (LLM turns raw text into facts, entities, or profile fields) → **store** (vector index, knowledge graph, or pinned text blocks) → **retrieve** (pull the relevant memories into the prompt at query time). The systems below differ mainly in the *store* and the *extraction* steps.

## Per system

### Zep / Graphiti — temporal context graph (bi-temporal KG memory)
- **What it is:** `getzep/graphiti` (~27.7k★, created Aug 2024, very active, Apache-2.0) is the open-source **temporal context-graph engine**; **Zep** is the hosted/commercial platform built on it (managed per-user graphs, sub-200ms retrieval, SDKs, governance). Paper: *Zep: A Temporal Knowledge Graph Architecture for Agent Memory* (arXiv 2501.13956).
- **Memory model:** a **bi-temporal knowledge graph**. Entities are nodes; facts are edges stored as triples (Entity → relationship → Entity), and **each fact carries a validity window** — when it became true and when (if ever) it was superseded — so the graph distinguishes *what is true now* from *what was true before* without recomputing the graph. Everything traces back to **episodes** (the raw ingested data = provenance). Retrieval is **hybrid**: semantic + BM25 keyword + graph traversal. This is the clearest "temporal KG + GraphRAG" memory in the landscape.
- **Maturity:** the most production-hardened graph-memory option; OSS engine is mature, scale/governance lives in the paid tier.

### Mem0 — extracted-fact memory layer (vector-first, optional graph)
- **What it is:** `mem0ai/mem0` (~59k★, the most-starred of the group; created 2023, YC S24, very active) — a "universal memory layer for AI agents." OSS library + self-hosted server + hosted cloud. Markets benchmark wins on LoCoMo / LongMemEval / BEAM.
- **Memory model:** **LLM-extracted facts** rather than a formal ontology. On each interaction an LLM pulls out salient facts and stores them; the current (2026) algorithm is **single-pass ADD-only extraction** (memories accumulate, nothing overwritten), with **entity linking** across memories and **multi-signal retrieval** (semantic + BM25 + entity match, fused). Scopes memory at **User / Session / Agent** levels. A graph backend exists as an option, but the default mental model is "vector store of deduplicated facts," not a graph.
- **Maturity:** the de-facto popular "memory API"; large adoption, fast-moving, easy on-ramp.

### Letta (formerly MemGPT) — hierarchical paging (LLM-as-OS)
- **What it is:** `letta-ai/letta` (~23.5k★; the OSS framework that grew out of the **MemGPT** paper, *MemGPT: Towards LLMs as Operating Systems*, arXiv 2310.08560, Packer & Wooders, UC Berkeley, Oct 2023; spun into a company + rebranded Letta Sept 2024). A platform for **stateful agents** with a hosted API + CLI ("Letta Code").
- **Memory model:** **hierarchical / OS-style virtual context management**. Three tiers: **core memory** (editable blocks pinned in the prompt — like RAM, always in-context, e.g. `human`/`persona` blocks), **archival memory** (a vector DB the agent searches on demand), and **recall memory** (full message history on "disk"). The agent itself runs the **paging** between tiers via tool calls — deciding what to keep in context, what to evict, and what to fetch back. The contribution is the *paging mechanism*, not a particular store.
- **Maturity:** influential and well-known (the paper is the canonical reference for memory paging); the framework is broad (agents + memory, not memory-only).

### Cognee — ECL pipeline → vector + graph (cognitive-science ontology)
- **What it is:** `topoteretes/cognee` (~18.9k★, created 2023, very active) — open-source "AI memory platform" you self-host. Ingests data in any format and builds a knowledge graph. Paper: *Optimizing the Interface Between Knowledge Graphs and LLMs for Complex Reasoning* (Markovic et al., 2025, arXiv 2505.24478).
- **Memory model:** **combines vector embeddings + a knowledge graph** via an Extract→Cognify→Load (ECL) pipeline, with **cognitive-science-grounded ontology generation** so documents are both searchable by meaning and connected by evolving relationships. Adds operational concerns: tenant/user isolation, traceability, OTEL, audit. Positioned as a "company brain" / unified ingestion + graph/vector search layer.
- **Maturity:** active OSS, graph-oriented like Graphiti but broader-ingestion and less explicitly *temporal*; younger production story.

### Others worth knowing
- **Memobase** (`memodb-io/memobase`, ~2.8k★, created Sept 2024) — **user-profile-based** long-term memory: instead of a graph or a loose fact pile, it maintains **structured user profiles** (batched/buffered per user to cut LLM cost), aimed at companions/tutors/personalized assistants. A distinct fourth model: *profile fields*, not triples or vectors.
- Adjacent names that recur (from the broader landscape and our `awesome-second-brain` note): **Supermemory** (hosted memory + connectors/MCP), **Honcho** (session context + user modeling), **Mnemosyne** (lightweight local SQLite memory with consolidation), plus survey lists like `TsinghuaC3I/Awesome-Memory-for-Agents` and `XiaomingX/awesome-ai-memory`.

## Cross-cutting concepts a builder must learn
- **Short-term vs long-term memory** — the in-context working set (what's in the prompt now) vs durable storage that outlives the session. Every system is fundamentally about moving information across this boundary.
- **Memory extraction / consolidation** — raw turns are noisy; an LLM step distills them into facts/entities/profile fields. *Consolidation* = merging new evidence into existing memory rather than appending blindly (Mem0's ADD-only vs UPDATE/DELETE is exactly this design tension).
- **Temporal / bi-temporal knowledge** — facts change ("works at X" → "works at Y"). A real memory must represent *validity over time*: when a fact held and when it was superseded. Graphiti/Zep make this first-class (validity windows + episode provenance); flat vector stores generally do not.
- **Retrieval: vector vs graph** — vector/semantic search finds *similar* text; graph traversal finds *connected* facts (multi-hop, relationship-aware). Hybrid retrieval (semantic + keyword + graph) is now the norm at the high end (Graphiti, Mem0 v3).
- **Memory paging (MemGPT)** — treat the context window as a managed resource: page memories in/out under explicit control (the agent or runtime decides what to evict and fetch). The OS analogy is the core idea behind Letta.
- **Forgetting / decay** — unbounded accumulation degrades retrieval and cost; mature memory needs eviction, recency/importance weighting, or summarization. (Note the live tension: Mem0's 2026 ADD-only design deliberately *doesn't* delete — a deliberate bet that accumulation + better retrieval beats forgetting.)
- **Fact deduplication / conflict resolution** — the same fact arrives many times; contradictory facts arrive over time. The system must dedup (entity linking / merging) and resolve conflicts (supersede old facts, ideally with a timestamp rather than silent overwrite). This is *the* hard problem and where temporal KGs earn their complexity.

## Relevance to the curriculum
This is the **substrate layer** of the modern "second brain for agents" — the backend beneath the PKM/note-taking surface. It maps directly onto the curriculum's GraphRAG / KG spine:
- **Graphiti / Zep ≈ temporal KG + GraphRAG memory** — the textbook instance of "entities + typed relations + provenance + time," retrieved by hybrid graph traversal. This is the cleanest bridge from formal-KG concepts (triples, entities, edges, ontology) to a *running* agent system, and it adds **bi-temporality**, a dimension classic OWL/RDF teaching under-serves.
- **Cognee ≈ KG + vector with ontology generation** — shows the neurosymbolic seam: embeddings for recall, graph for structure/reasoning, ontology for grounding.
- **Mem0 / Memobase ≈ the *non-graph* baselines** — extracted-fact vector store vs structured profile. Essential as the foil that motivates *why* a graph: they are simpler, cheaper, and often sufficient.
- **Letta/MemGPT ≈ the orthogonal axis (paging)** — not "what store" but "how the agent manages its own context," a systems concept independent of graph-vs-vector.

**Decision framing — graph memory vs flat vector memory:**
- Reach for **flat vector / extracted-fact memory (Mem0, Memobase)** when memories are largely independent facts or preferences, queries are "what do I know related to X," you don't need multi-hop reasoning, and you want the cheapest/fastest path. Most personal-assistant recall lands here.
- Reach for **graph memory (Graphiti/Zep, Cognee)** when relationships between entities matter (multi-hop "how is A connected to B"), when **facts change over time** and you must answer "what was true *then*," when you need provenance/auditability, or when many facts compose into a queryable structure. The cost is operational complexity and LLM spend on extraction.
- **Paging (Letta)** is a separate decision: choose it when the agent needs to *autonomously manage* a large evolving working set within a fixed window — it composes with either store underneath.

## Caveats
- **Young and fast-moving.** Most of these are 2023–2024-born and shipping breaking changes (Mem0 rewrote its core algorithm in April 2026; Letta rebranded from MemGPT in 2024). Benchmark claims (LoCoMo etc.) are vendor-run — treat as directional, not settled.
- **Commercial gravity.** Zep and Mem0 (and the hosted tiers of Cognee/Memobase) are companies; the OSS repo is often the *engine*, with scale, governance, latency, and management features reserved for the paid tier (explicit in the Zep-vs-Graphiti table). Read "open source" as "open core."
- **Star counts are popularity, not maturity or correctness** — Mem0 (~59k★) dwarfs the others largely on ease-of-adoption, not on memory-model sophistication. Verify any specific capability against current docs; this space rewrites itself quarterly.

### Sources
- [getzep/graphiti](https://github.com/getzep/graphiti) · [Zep paper (arXiv 2501.13956)](https://arxiv.org/abs/2501.13956)
- [mem0ai/mem0](https://github.com/mem0ai/mem0) · [Mem0 research](https://mem0.ai/research)
- [letta-ai/letta](https://github.com/letta-ai/letta) · [MemGPT paper (arXiv 2310.08560)](https://arxiv.org/abs/2310.08560)
- [topoteretes/cognee](https://github.com/topoteretes/cognee) · [Cognee paper (arXiv 2505.24478)](https://arxiv.org/abs/2505.24478)
- [memodb-io/memobase](https://github.com/memodb-io/memobase) · [Awesome-Memory-for-Agents](https://github.com/TsinghuaC3I/Awesome-Memory-for-Agents)
