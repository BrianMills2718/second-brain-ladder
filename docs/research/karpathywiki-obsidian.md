# karpathywiki (Obsidian plugin) — an LLM agent that ingests your notes and grows a linked Markdown wiki inside your vault

- **URL / repo / author / activity:**
  - Plugin page: <https://community.obsidian.md/plugins/karpathywiki> ("Karpathy LLM Wiki")
  - Repo: <https://github.com/green-dalii/obsidian-llm-wiki>
  - Site/docs: <https://llmwiki.greenerai.top/>
  - Author: **Greener-Dalii** (green-dalii); MIT license; TypeScript.
  - Activity: **actively maintained** — created 2026-04-26, last push 2026-06-22 (same day as this note's research), ~119 GitHub stars / 13 forks, 7,000+ Obsidian installs, current version v1.21.1. Single primary author with community PR contributors (e.g. @Indexed-Apogrypha, @FrancoTampieri). Releasing multiple versions per week. Obsidian "official score 95/100" per README.

- **What it is:**
  An Obsidian community plugin that turns your loose notes into a structured, interconnected wiki using an LLM. You drop source notes into a `sources/` folder; the plugin reads them, extracts entities (people, orgs, products) and concepts (theories, methods, terms), and writes standalone wiki pages with `[[bidirectional links]]`, frontmatter, aliases, and an auto-generated index. It also exposes a conversational Q&A interface that answers questions grounded in your vault, returning answers studded with `[[wiki-links]]` back into the graph. Runs entirely client-side in Obsidian — no backend, no telemetry; only the text you send for ingest/query leaves your machine, and only to the LLM provider you configure.

- **Mechanism (concrete):**
  - **Three-layer file architecture:** `sources/` (your read-only inputs) → `wiki/` (LLM-generated pages: `entities/`, `concepts/`, `sources/` summaries, `index.md`, `log.md`) → `schema/` (a co-evolved `config.md` that defines naming/templates/categories/tag vocabulary and is injected into every prompt as the single source of truth).
  - **Ingestion:** Commands like "Ingest single source", "Ingest from folder", "Ingest current file". A `source-analyzer` does *iterative batched extraction* (adaptive batch sizing to dodge the long-document max_tokens ceiling). A `page-factory` does entity/concept page CRUD + merge. Extraction "granularity" is tunable (minimal ~5 → fine ~100 → custom up to ~300–500 items per source) to trade depth against token cost. Page generation runs 1–5 pages concurrently (`Promise.allSettled`, per-page error isolation, exponential backoff). Re-ingesting a source does *incremental merge* into existing pages; a content-hash "Smart Batch Skip" + pre-ingest validation gate avoids re-processing and stops small/local models hallucinating entities from empty files.
  - **Linking / maintenance ("Lint wiki"):** scanners detect duplicate pages, dead links, empty/orphan pages, missing aliases, and contradictions. Every page is forced to carry ≥1 **alias** (translation/abbreviation/variant) so a *tiered semantic duplicate detector* can catch cross-language dupes (e.g. "CoT" vs "思维链") and merge them while preserving aliases. "Smart Fix All" runs repairs in causal order: fill aliases → merge dupes → fix dead links → link orphans → expand empty pages. Contradictions move through a state machine (`detected → review-passed → resolved` / `unresolved`).
  - **Query:** a `query-engine` provides streaming, multi-turn ChatGPT-style chat. Crucially it feeds the LLM **full wiki context, not chunked RAG retrieval** (see below). Valuable conversations can be saved back into the wiki ("Query → Wiki feedback") with dedup.
  - **Models/APIs:** provider-agnostic — Anthropic, Anthropic-compatible (e.g. Claude coding-plan endpoints), Google Gemini, OpenAI, DeepSeek, Kimi, GLM, MiniMax, OpenRouter, plus fully-local **Ollama** and **LM Studio** (no API key). No embeddings/vector store; relies on long-context models (README recommends 1M-token-class models for larger wikis). Model list is fetched live from the provider.

- **Relation to Karpathy's gist** (<https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>; sibling note `karpathy-gist.md` not yet written):
  This is a fairly *faithful, literal* implementation of Karpathy's "LLM wiki" idea — the README cites the gist directly and adopts its core architectural opinions:
  - The "you write, the LLM does the librarian/architect work" framing is taken straight from Karpathy.
  - It explicitly follows Karpathy's **anti-RAG stance**: feed the model the full wiki as context rather than chunked vector retrieval, on the argument that RAG fragments knowledge and breaks cross-graph reasoning. That is the single most distinctive and faithful design choice — it is *not* a vector-DB RAG app.
  - The three-layer `sources → wiki → schema` separation is described as "Karpathy's three-layer separation design."
  - Departures/extensions beyond the bare gist: the heavy *maintenance* machinery (lint, alias-based cross-language dedup, contradiction state machine, auto-maintenance watchers) is the plugin's own engineering, not in the original sketch. So: faithful on philosophy (agent-built wiki, full-context, links-as-citations), substantially elaborated on operational tooling.

- **Relevance to the curriculum:**
  A real, installable, MIT-licensed worked instance of *agentic note-organization and retrieval inside the most popular PKM tool*. For a builder rescoping toward LLM-native agentic retrieval, the lessons are concrete:
  1. **The store is plain Markdown + `[[wikilinks]]`, not a graph DB.** The "knowledge graph" is just Obsidian's link graph over files — the agent's job is writing good links, not maintaining a separate KG. Cheap, inspectable, user-owned, diffable.
  2. **Full-context over RAG is a defensible default at PKM scale.** With 1M-token models, you can hand the model the whole wiki/index and skip embeddings entirely — simpler, and avoids retrieval fragmentation. Worth stress-testing as the corpus grows past context limits (their answer: hierarchical index + long-context models, not chunk-retrieval).
  3. **Maintenance is the hard 80%.** Extraction is easy; keeping the graph coherent (dedup, dead links, cross-language aliases, contradiction tracking, idempotent re-ingest via content hashing) is where most of the 20+ modules go. This is the part a curriculum on agentic KGs most needs to teach.
  4. **Idempotency & cost control as first-class concerns:** content-hash skip, incremental merge, granularity tiers, concurrency + rate-limit guardians — all directly transferable patterns for any batch-LLM ingestion pipeline.

- **Caveats:**
  - **Maturity:** ~2 months old (first release 2026-04), shipping multiple patch releases per week — fast-moving, fixing real bug classes (e.g. empty-file hallucination on local models, file-rename/normalization loops). Capable but not yet battle-hardened; expect churn and occasional migrations (README documents version-to-version cleanup steps).
  - **Single primary author** (community PRs exist but bus-factor is low).
  - **API-key / cost dependency:** quality ingestion of large vaults wants a long-context cloud model (DeepSeek/Gemini/Claude/GPT), i.e. real API spend; fully-local Ollama/LM Studio works but with smaller context windows and weaker extraction (hence the dedicated anti-hallucination gate). Sending note text to a third-party LLM is inherent to the cloud path — local mode is the privacy escape hatch.
  - **No embeddings/semantic vector search** by design — if your use case actually needs scalable retrieval beyond context windows, this architecture pushes back on that.
