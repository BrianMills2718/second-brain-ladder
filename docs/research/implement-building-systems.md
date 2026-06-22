# Implementing KG / GraphRAG / second-brain systems — the framework-level "how you actually build one," neutral across paradigms

- **Scope:** the *implement* layer — the fourth rung of the learner-empowerment ladder (understand → decide → plan → **implement** → operate). The plan rung (`plan-goal-to-architecture.md`) ends with a chosen approach and a sketched component skeleton (ingestion → store → index → retrieval → orchestration). This note turns that skeleton into a **working system**: for each viable build path it gives the concrete steps, the main framework(s), the exact API/function/package names, and the config knobs you actually touch. It is deliberately hands-on and stays neutral — every path below is a legitimate way to build a personal second brain; which one you build was decided upstream. Operating it (eval, drift, re-index cadence, cost monitoring) is the next rung (`operate-run-and-maintain.md`). **One framing carried through:** the boxes are the same across paradigms (`plan-goal-to-architecture.md` §architecture) — what changes per path is *what runs in each box and when the LLM is called* (query-time only for vector RAG; indexing-time for every graph/wiki/memory path, which is where the cost lives).

> **Version caveat up front (read first).** Every framework here churns fast and the load-bearing detail is the import path and signature, not the concept. Concrete 2026 breakages observed while researching this note: MS GraphRAG moved its `settings.yaml` model schema to a LiteLLM layer in the 3.x line; LlamaIndex deprecated `KnowledgeGraphIndex` in favor of `PropertyGraphIndex` (v0.10.53); LangChain relocated Neo4j classes out of `langchain_community` into a `langchain-neo4j` package and deprecated `RetrievalQA`; Mem0 **removed** external graph-store support from the OSS SDK (PR #4805, ~Apr 2026). **Pin exact versions, and verify import paths against the installed package — not against tutorials or this note.** Learn the pipeline shape; treat the APIs as perishable.

---

## Build path 1 — Vector RAG baseline (the floor everything else builds on)

The canonical pipeline is **load → chunk → embed → store → retrieve → generate** (`rag-fundamentals.md`). The LLM is called only at *query* time, so indexing cost ≈ embedding cost (cheap). This is the smallest thing that works for a personal second brain, and the baseline you should stand up first regardless of where you intend to end up.

**Option A — LlamaIndex (fewest lines to "it works").** Three lines, with an embedding key set:
```python
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
documents = SimpleDirectoryReader("data").load_data()   # auto-detects pdf/md/txt/docx in a folder
index = VectorStoreIndex.from_documents(documents)      # splits + embeds + indexes in one call
query_engine = index.as_query_engine(response_mode="compact")
print(query_engine.query("..."))
```
- **Defaults that matter:** chunking is `SentenceSplitter` at `chunk_size=1024`, `chunk_overlap=20` (tokens). Override globally via the `Settings` object: `Settings.transformations = [SentenceSplitter(chunk_size=512)]`.
- **Swap models on `Settings`** (this is the single place models live): `Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")`; `Settings.llm = Ollama(model="llama3.1")`.
- **Persist or pay twice:** `index.storage_context.persist("./storage")`, reload with `load_index_from_storage`. Without this you re-embed every run.

**Option B — LangChain (more explicit, more knobs).** The pieces are separate components you wire by hand; the namespaces moved in 2024–2025 so the package names are load-bearing:
```python
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

chunks = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200,
                                        add_start_index=True).split_documents(docs)
vs = Chroma(collection_name="notes",
            embedding_function=OpenAIEmbeddings(model="text-embedding-3-small"),
            persist_directory="./chroma_db")
vs.add_documents(chunks)
retriever = vs.as_retriever(search_kwargs={"k": 4})
```
- `RecursiveCharacterTextSplitter` is the recommended default; common defaults are `1000 chars / 200 overlap` (note: **characters**, not tokens — different unit from LlamaIndex).
- **`RetrievalQA` is deprecated.** Current canonical builds are an LCEL chain (`{"context": retriever, "question": RunnablePassthrough()} | prompt | llm | StrOutputParser()`) or an agent (`create_agent` with a `@tool`-wrapped retrieve). For a personal system the plain LCEL chain is the smallest thing that works and avoids agent overhead.
- Local swaps: `langchain_huggingface.HuggingFaceEmbeddings`, `langchain_ollama.ChatOllama`. No-server start: `InMemoryVectorStore`.

**Vector DB choice for personal use** (don't over-engineer): **Chroma** (simplest, persists to a local dir, zero server — the default recommendation) → **LanceDB** if the corpus grows large (embedded, in-process, disk-efficient) → **FAISS** for pure in-memory speed on a static corpus → **Qdrant** (rich metadata filtering, runs locally via Docker) or **pgvector** (only if you already run Postgres) when you actually have a reason. The full menu is covered in `rag-fundamentals.md`.

---

## Build path 2 — GraphRAG pipeline (extraction → graph build → index → local/global query)

All three sub-paths do the same thing: an LLM extracts **entities + relationships** from chunks, you store a graph, you retrieve over it. The LLM is now called **per chunk at indexing time** — this is the dominant cost and the defining difference from vector RAG. Conceptual background in `microsoft-graphrag.md` and `graphrag-jaylzhou.md`.

### 2a. Microsoft GraphRAG (CLI/pipeline — heaviest, most batteries-included)

`pip install graphrag` (latest 3.1.0; Python 3.11–3.13). It is a CLI, not a library you import.
```bash
graphrag init  --root ./ragtest                 # scaffolds settings.yaml, .env, prompts/, input/
graphrag index --root ./ragtest --method standard   # standard | fast | standard-update | fast-update
graphrag query --root ./ragtest --method local "..."   # local | global(default) | drift | basic
```
**Indexing pipeline stages → parquet outputs (in order):** docs → chunk into text units (`text_units.parquet`) → LLM entity+relationship extraction (`entities`/`relationships.parquet`) → optional claim/covariate extraction → embed chunks → **Leiden** community detection, hierarchical (`communities.parquet`) → LLM community reports/summaries (`community_reports.parquet`) → embed reports into a LanceDB vector store.

**Config knobs (`settings.yaml`, 3.x LiteLLM schema):** `completion_models:` / `embedding_models:` maps (each with `model_provider`, `model`, `api_key: ${GRAPHRAG_API_KEY}`, `type: litellm`, optional `api_base`); `chunking:` (`size`, `overlap`, `type: tokens|sentence`); `extract_graph:` (`entity_types: [...]`, `max_gleanings`, `prompt`); `extract_claims:` (`enabled: bool` — **off by default**); `cluster_graph:` (Leiden — `max_cluster_size`, `seed`); `vector_store:` (lancedb default | azure_ai_search | cosmosdb). `graphrag prompt-tune` domain-adapts the extraction prompts to your corpus (run it — it materially improves extraction quality per call).

**Query modes — the key choice at read time:** **local** = KG entities + raw chunks, for entity/subject-specific questions; **global** (default) = map-reduce over *all* community reports, for dataset-wide/thematic "what are the themes" questions (expensive); **drift** = local search seeded with community context (middle ground); **basic** = plain vector RAG over top-k chunks (the baseline, no graph reasoning). This local-vs-global split *is* the GraphRAG value proposition — see `microsoft-graphrag.md` for the original Local-to-Global result.

**Cost:** the most LLM-heavy path here — every chunk drives extraction (plus `max_gleanings` re-prompts), then a report per community across the whole Leiden hierarchy, then global queries fan out over all reports. Mitigations the docs themselves give: cheaper default model, `--cache` (on by default), `--method fast`, `prompt-tune`, and incremental `--method standard-update` so you only pay for new notes.

### 2b. LlamaIndex `PropertyGraphIndex` (library, in-code, flexible store)

`pip install llama-index`; graph stores are separate packages (`llama-index-graph-stores-neo4j`, `...-kuzu`).
```python
from llama_index.core import PropertyGraphIndex
index = PropertyGraphIndex.from_documents(
    documents,
    kg_extractors=[...],            # default: [SimpleLLMPathExtractor(), ImplicitPathExtractor()]
    embed_model=embed_model,        # required while embed_kg_nodes=True (the default)
    property_graph_store=graph_store,   # default SimplePropertyGraphStore() (in-memory)
)
# index.as_query_engine(...) / index.as_retriever(sub_retrievers=[...])
```
- **Extractors (additive — each runs over every chunk):** `SimpleLLMPathExtractor` (free-form triples, no schema, default), `SchemaLLMPathExtractor` (strict ontology via Pydantic; args `possible_entities`, `possible_relations`, `kg_validation_schema`, `strict=True`), `ImplicitPathExtractor` (no LLM; reads existing node relationships, default), `DynamicLLMPathExtractor` (guided but the LLM may invent types). **Choosing the extractor = choosing your extraction prompt/schema** (a build decision below).
- **Graph stores:** `SimplePropertyGraphStore` (in-memory, disk-persistable, no native vectors) → `Neo4jPropertyGraphStore(url="bolt://localhost:7687", username=, password=)` (native vectors, enables Cypher retrievers) → `KuzuPropertyGraphStore` (embedded, no server).
- **Retrievers (default combines the first two):** `LLMSynonymRetriever` (keyword/synonym expansion, any store), `VectorContextRetriever` (embed query → nearest graph nodes → expand; needs embeddings), `TextToCypherRetriever` (LLM writes+runs Cypher; graph-DB stores only), `CypherTemplateRetriever` (safer — fixed parameterized Cypher, LLM only fills params).
- **Embedding wiring:** `embed_kg_nodes=True` embeds each KG node; pass no `vector_store` and vectors live in the graph store; pass one (Qdrant/Chroma) and structure stays in the graph, vectors go external.
- **Legacy note:** `KnowledgeGraphIndex` (the older API — plain triplets, `max_triplets_per_chunk`, `SimpleGraphStore`) is **deprecated since v0.10.53**. Use `PropertyGraphIndex` for new builds.

### 2c. LangChain `LLMGraphTransformer` (extract-to-Neo4j, then text-to-Cypher)

`pip install -U langchain-neo4j langchain-experimental neo4j` (Neo4j classes moved to `langchain-neo4j`).
```python
from langchain_experimental.graph_transformers import LLMGraphTransformer
from langchain_neo4j import Neo4jGraph, GraphCypherQAChain

t = LLMGraphTransformer(llm=llm,
        allowed_nodes=["Person","Organization","Location"],
        allowed_relationships=[("Person","WORKS_AT","Organization")],  # or flat List[str]
        strict_mode=True)
graph_docs = t.convert_to_graph_documents(documents)   # async: aconvert_to_graph_documents

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="...")
graph.add_graph_documents(graph_docs, baseEntityLabel=True, include_source=True)

chain = GraphCypherQAChain.from_llm(llm, graph=graph, allow_dangerous_requests=True)
chain.invoke({"query": "..."})
```
- `allowed_nodes` / `allowed_relationships` **are your schema** — the 3-tuple form `(source, REL, target)` is the strict version; `strict_mode=True` post-filters off-schema items.
- `add_graph_documents(..., baseEntityLabel=True, include_source=True)` adds a shared `__Entity__` label (faster lookup) and persists source nodes for provenance.
- `allow_dangerous_requests=True` is **mandatory** for `GraphCypherQAChain` (LLM-generated Cypher can read/mutate — scope DB permissions in production).
- **Orchestration vs graph build (don't conflate):** `LLMGraphTransformer` builds the KG; **LangGraph** (`StateGraph`, `.compile()`) orchestrates the *agent* that queries it (retrieve → cypher → generate as a state machine). LangGraph is not the graph.

---

## Build path 3 — Lighter graph builds (LightRAG / nano-graphrag)

These build a KG **plus** vector embeddings but skip MS GraphRAG's expensive global community-report generation, and merge incrementally so adding a doc doesn't rebuild the world. Pick these when you want graph-style retrieval at personal scale without the MS-GraphRAG indexing bill.

**nano-graphrag** (`pip install nano-graphrag`, ~1100 LOC, the truly hackable one):
```python
from nano_graphrag import GraphRAG, QueryParam
g = GraphRAG(working_dir="./store")
g.insert(open("book.txt").read())                       # dedup'd by content md5; batch list also ok
g.query("top themes?")                                  # default global
g.query("...", param=QueryParam(mode="local"))          # local; naive needs enable_naive_rag=True
```
Swap everything: `best_model_func`/`cheap_model_func` (strong model for extraction, cheap for summary — examples shipped for DeepSeek, Ollama, Bedrock/Claude), `embedding_func`, `graph_storage_cls` (default `networkx`; built-in `Neo4jStorage`), `vector_db_storage_cls` (default `nano-vectordb`; hnswlib/milvus/faiss).

**LightRAG** (`pip install lightrag-hku`, more featureful — EMNLP 2025):
```python
from lightrag import LightRAG, QueryParam
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
rag = LightRAG(working_dir="./store", embedding_func=openai_embed, llm_model_func=gpt_4o_mini_complete)
await rag.initialize_storages()                          # required; API is async
await rag.ainsert(open("book.txt").read())
await rag.aquery("top themes?", param=QueryParam(mode="mix"))   # mix = default
```
- **Five query modes:** `naive` (plain vector RAG), `local` (specific facts), `global` (cross-doc themes), `hybrid` (local+global), `mix` (local+global+naive, the default/best). `QueryParam` knobs: `top_k` (60), `chunk_top_k` (20), `response_type`.
- **What you wire:** `embedding_func` and `llm_model_func` (providers under `lightrag.llm.*`); v1.5+ supports role-specific LLMs (EXTRACT/QUERY/KEYWORDS/VLM) so a strong extractor + cheap query model is a config, not a fork. Reranker (since 2025.08) is now default for mixed queries and worth keeping. Storage defaults are file/in-memory (dev); production = Postgres/Mongo for all four stores, or Milvus/Qdrant (vector) + Neo4j/Memgraph (graph). Server mode: `lightrag-server` gives a REST API + WebUI.

**Which:** nano-graphrag to read/modify the whole thing; LightRAG for modes, reranking, a server, and more backends out of the box.

---

## Build path 4 — Agent memory (Mem0 / Graphiti)

When the artifact isn't a corpus *you* query but memory an *agent* maintains across sessions (`agent-memory-substrates.md`). The wiring is the same shape: **`add` after a turn, `search` before the next generation, inject results into context.**

**Mem0** (`pip install mem0ai`):
```python
from mem0 import Memory                                  # OSS, self-hosted; runs LLM+embed in-process
m = Memory()                                             # or Memory.from_config(config)
m.add(messages, user_id="alice")                         # LLM extracts salient facts from the turns
m.search(query="...", user_id="alice")                   # also: filters={...}, top_k=
m.get_all(user_id="alice")
```
- **The fork:** `Memory` (OSS, self-hosted) vs `MemoryClient` (hosted Platform, API-key, zero-ops, still ships graph memory + time-decay the OSS lib dropped).
- **OSS defaults:** local Qdrant vector store (`/tmp/qdrant`), GPT-5-mini LLM, text-embedding-3-small embedder — all swappable via the `vector_store`/`llm`/`embedder` blocks in the config dict.
- **⚠️ Recent breakage:** external **graph stores (Neo4j/Memgraph/Kuzu/AGE/Neptune) were removed from the OSS SDK** in v3 (PR #4805, ~Apr 2026); the `enable_graph` flag and `graph_store` block are no longer read. The replacement is built-in "entity linking" (entities stored in a parallel collection, used to boost ranking) — **not a traversable graph**. If you need a real queryable graph from Mem0: pin a pre-v3 version, use the hosted Platform, or use Graphiti instead.

**Graphiti** (`pip install graphiti-core`; requires Neo4j 5.26+ or FalkorDB):
```python
from graphiti_core import Graphiti
g = Graphiti(neo4j_uri, neo4j_user, neo4j_password)
await g.build_indices_and_constraints()                  # one-time; API is async
await g.add_episode(name="...", episode_body=text, source=EpisodeType.text,
                    source_description="...", reference_time=datetime.now(timezone.utc))
results = await g.search("Who was the California AG?")    # results are EntityEdge facts with .valid_at/.invalid_at
```
- On each `add_episode`: LLM extracts entities/relations, resolves/dedups against existing nodes, and — when new facts contradict old ones — marks the old edge invalid rather than deleting (**bi-temporal**: event time vs ingest time, so "what did we believe then" queries work).
- **Incremental, no batch recompute**; retrieval is hybrid (vector + BM25 + graph traversal via RRF) with **no LLM in the read loop** (cheap, ~300ms). The expense is on the **write path** — every episode runs LLM extraction + dedup, so ingestion cost/latency scales with volume.

---

## Build path 5 — LLM-wiki (markdown + links maintained by an LLM)

The DIY path with **no single framework** (`karpathy-gist.md`, `karpathywiki-obsidian.md`): the "code" is a spec/rules file the LLM follows, the markdown vault is the codebase, Obsidian is the IDE. Synthesis moves to *write* time, so retrieval becomes navigation of pre-linked, pre-deduped pages. Pipeline = **ingest → extract → write pages → link → lint.**

**Layout (conventional):** `raw/` (immutable sources — clips, PDFs, transcripts; never edited), `wiki/` (all LLM-generated markdown: entity pages, concept pages, syntheses — each with frontmatter carrying a 1–2 sentence summary + source provenance), `index.md` (catalog: every page + one-line summary, by category), `log.md` (append-only, parseable prefixes), and a rules file (`CLAUDE.md`) documenting the conventions so the agent stays consistent.

**Ingest loop (per source):** LLM reads source in `raw/` → optionally discusses takeaways with you → writes a summary page in `wiki/` → updates `index.md` → **updates the 10–15 related entity/concept pages** it touches (strengthening cross-refs, flagging contradictions where new data supersedes old) → appends to `log.md`. Links use Obsidian `[[wikilink]]` syntax (backlinks implicit); portable to Foam/Dendron since all consume the same markdown.

**Lint loop (periodic health check):** scan for dead/broken wikilinks, orphan pages (no inbound links), missing concept pages, missing cross-references, contradictions between pages, and stale superseded claims. A reference implementation (`github.com/ar9av/obsidian-wiki`) operationalizes this as agent slash-commands (`/wiki-ingest`, `/wiki-lint`, `/cross-linker`) with a manifest JSON that logs ingested sources to enable **delta-only re-processing**; a 100%-local Ollama variant exists (`github.com/kytmanov/obsidian-llm-wiki-local`).

**Cost:** no vector index — retrieval is the LLM reading markdown directly, so context cost scales with vault size; ingestion is LLM-heavy (10–15 pages per source). The manifest/delta-processing is what keeps re-ingest bounded.

---

## The decisions you hit while building

These recur across every path above; the plan rung decided *which path*, these are the build-time settings inside it.

- **Embedding model = an irreversible commitment.** It is locked once you index; changing it forces a full re-embed of the entire store (LightRAG has no re-embed tool; pgvector needs table drops). Decide local-vs-hosted *before* indexing at scale. Hosted/easy: OpenAI `text-embedding-3-small` (1536-dim). Private/local (best for a personal second brain): `nomic-embed-text` via Ollama (fastest setup) or `BAAI/bge-small`/`bge-m3` via sentence-transformers. Note: for graph builds, doc guidance says retrieval quality depends only weakly on the embedding model — pick a fast small one.
- **Chunk size / overlap.** Units differ by framework (LlamaIndex 1024 *tokens*/20; LangChain 1000 *chars*/200) — don't copy a number across frameworks blindly. Smaller (256–512) = precise but fragmented; larger = more context but noisier. For graph paths, chunks feed entity extraction, so *coherent* chunks matter more than raw size.
- **Graph store: in-memory → embedded → server.** `SimplePropertyGraphStore`/`networkx`/JSON (zero-ops, personal scale) → **Kuzu** (embedded, no server, queryable) → **Neo4j** (server, native vectors, Cypher, the production target). Don't stand up Neo4j until a retriever needs Cypher or the graph outgrows memory.
- **Extraction prompt / schema.** Free-form (`SimpleLLMPathExtractor`, MS default prompts) is fastest to stand up but noisy; a constrained schema (`SchemaLLMPathExtractor` with `strict=True`, LangChain `allowed_nodes`/`allowed_relationships` tuples, MS `entity_types` + `prompt-tune`) yields a cleaner, queryable graph at the cost of authoring an ontology. This is the single biggest lever on graph quality.
- **Local vs hosted LLM (the cost lever).** Ollama (llama3.1/qwen/deepseek) = free + private, but graph-extraction quality is model-sensitive; hosted (OpenAI, Anthropic) = better extraction, paid per indexed token. The pattern every framework supports: **strong model for extraction, cheap model for summary/query** (nano's best/cheap funcs, LightRAG's role-specific LLMs, MS's split models).
- **Framework lock-in.** LlamaIndex and LangChain are not interchangeable mid-project (different chunk/index/retriever objects); nano-graphrag and LightRAG store data in different on-disk formats; switching means re-indexing. Pick once, and isolate the framework behind your own thin interface if you want exit options.

---

## Minimal viable build (and what to add as it grows)

The smallest thing that works for a personal second brain is **the LlamaIndex 3-liner with local embeddings + persistence** — load a notes folder, `VectorStoreIndex.from_documents`, `embed_model` = a local BGE/nomic model, `.persist()`. No graph, no server, no API key. Validate that retrieval actually answers your real questions on your real notes *before* building anything heavier.

**Phased growth (add a box only when the metrics or the questions demand it — see `operate-run-and-maintain.md` for measuring):**
1. **Floor:** vector RAG over the vault, persisted, local embeddings.
2. **+ Hybrid:** add BM25 + a reranker when exact-name/code lookups miss (~15–25% lift, no graph infra — `rag-fundamentals.md`).
3. **+ Graph, lightly:** when you start asking multi-hop or "themes across everything" questions, layer in LightRAG (`mix` mode) with a *local* Ollama extractor to keep indexing free — before reaching for MS GraphRAG.
4. **+ Server-backed graph:** move to `PropertyGraphIndex`/`LLMGraphTransformer` over Neo4j only when the graph outgrows memory or you need Cypher.
5. **+ Memory / wiki:** add Mem0/Graphiti only if an *agent* must remember across sessions; add the LLM-wiki layer only if you want a durable human-readable artifact that compounds.

The discipline: **start at the floor, instrument, and let failed queries (not hype) pull you up the ladder.**

---

## Concepts a learner must master to build

A learner who has these can build a system for their own goal and re-build it when the APIs churn:
- **The indexing pipeline** — load → chunk → embed → store, and *when the LLM is called* (query-time for vector RAG; index-time for every graph/memory/wiki path — this is where cost and latency live).
- **Extraction** — turning text into entities/relationships/claims; free-form vs schema-constrained, and that the extraction prompt/schema is the dominant quality lever for any graph.
- **Storage choice** — vector DB vs graph DB vs plain markdown; in-memory → embedded → server, and that the embedding model is locked at index time.
- **Retrieval wiring** — k-NN vs hybrid (vector+BM25+rerank) vs graph traversal vs text-to-Cypher; local vs global query modes and which question shape each serves.
- **Glue / orchestration** — chaining retrieve→generate (LCEL, query engines) and, for agentic systems, the state machine that drives the loop (LangGraph) — kept conceptually separate from the store it queries.

---

## Caveats

- **Framework churn — concepts over APIs.** (Restating the opener because it is the operative risk.) Pin exact versions; verify import paths against the installed package; treat every code snippet above as perishable and the *pipeline shape* as the durable thing.
- **Cost of LLM-heavy indexing.** Plain vector RAG indexes cheaply (embeddings only). Every graph path, agent-memory path, and the LLM-wiki call the LLM *during indexing/ingest* — per chunk, per community, or per page — which is the dominant and easily-underestimated cost (MS GraphRAG full builds have been cited at large per-corpus figures — `plan-goal-to-architecture.md`). Mitigations are consistent across paths: local Ollama extraction (zero marginal cost), the strong-extractor/cheap-query split, caching, and incremental insert so you only pay for *new* notes. Budget for ingest, not query.
