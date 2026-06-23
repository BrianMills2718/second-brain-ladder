# RAG fundamentals — the retrieval-then-generate layer beneath GraphRAG that a second-brain builder must learn first (chunk → embed → search → rerank → assemble context → generate)

- **What RAG is:** Retrieval-Augmented Generation fetches relevant passages from an external corpus and conditions the LLM's generation on them, instead of relying on the model's frozen parametric memory alone. Coined by Lewis et al. (Facebook AI / UCL), *"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks,"* [arXiv:2005.11401](https://arxiv.org/abs/2005.11401) (NeurIPS 2020), which paired **parametric memory** (a seq2seq generator) with **non-parametric memory** (a dense Wikipedia vector index + neural retriever). The practical payoff: answers grounded in citable, updatable source text, less hallucination, and knowledge you can change without retraining.

- **The pipeline concepts a builder must learn** (each is a real tuning lever):
  - **Chunking** — splitting documents into retrievable units; size + overlap is a tradeoff (big chunks = fewer retrievals but diluted relevance; small = precise but context-fragmented), and *semantic* chunking splits on meaning/structure rather than fixed token counts. ~80% of RAG failures trace to this ingestion layer.
  - **Embeddings** — a model maps each chunk (and the query) to a dense vector so that semantic similarity ≈ geometric closeness; the embedding model choice sets the retrieval ceiling.
  - **Vector databases** — store + index those vectors for fast nearest-neighbor lookup: **FAISS** (library, in-process), **Chroma** (lightweight/local), **pgvector** (Postgres extension, SQL-native), **Qdrant** (production vector DB with filtering).
  - **Similarity search** — rank chunks by vector distance, usually **cosine** similarity, using **ANN** (approximate nearest neighbor, e.g. HNSW) to stay fast at scale by trading exactness for speed.
  - **Keyword / lexical search** — term-overlap ranking, classically **BM25** (sparse); exact-match strong where embeddings miss rare tokens, codes, names, and acronyms.
  - **Hybrid search** — run lexical (BM25/SPLADE) and dense vector retrieval in parallel and fuse the rankings (commonly **Reciprocal Rank Fusion, RRF**) to get both exact-match and semantic recall.
  - **Reranking** — a **cross-encoder** re-scores the top-N candidates by reading query+chunk *together* (vs. the bi-encoder that embeds them separately); highest-ROI add-on, ~10–30% precision lift for ~50–100ms — the "recall-to-precision funnel."
  - **Query rewriting** — reformulate the user's question before retrieval (expansion, decomposition, or **HyDE** = embed a hypothetical answer); pass the *original* query, not the rewrite, to the reranker.
  - **Context window assembly** — select, order, and pack the final chunks into the prompt under a token budget (dedup, place strongest evidence at the edges, cite sources).

- **Failure modes** (these are what motivate GraphRAG):
  - **Lost-in-the-middle** — LLMs attend best to the start and end of a long context; evidence buried in the middle is effectively ignored, so dumping more chunks can *hurt*.
  - **Chunk-boundary loss** — a fact split across a chunk edge (or context separated from its referent) becomes unretrievable; the relevant chunk never surfaces in top-K.
  - **No-global-view** — naive RAG retrieves a handful of local chunks, so it cannot answer corpus-wide / query-focused-summarization questions ("What are the main themes across all my notes?"); the answer lives in *no single chunk*. This is the precise gap GraphRAG fills.
  - **Hallucination when retrieval misses** — if retrieval returns nothing relevant, the generator falls back to parametric memory and invents a fluent, wrong answer; retrieval quality caps the whole system.

- **Evaluation** (measure retrieval and generation separately):
  - **Retrieval metrics** — **recall@k** (fraction of the relevant chunks present in the top-k retrieved — a chunk you never retrieve is information the generator can never use) and **MRR** (mean reciprocal rank — rewards putting the first relevant hit at rank 1; order-aware).
  - **Generation metrics** — **faithfulness / groundedness** (are the answer's claims supported by the retrieved context? — the anti-hallucination metric) and **answer relevance** (does the answer actually address the question?).
  - **RAGAS** ([arXiv:2309.15217](https://arxiv.org/abs/2309.15217)) — the de-facto reference-light eval framework: faithfulness, answer relevance, context precision, context recall (0–1 each; teams often gate CI ≥0.8 on faithfulness + context recall).

- **The bridge to GraphRAG and agentic retrieval** — treat retrieval strategy as a **decision ladder by question type and cost**, not one default:
  1. **Keyword (BM25)** — exact terms, names, codes, IDs; cheapest, no embeddings.
  2. **Vector** — semantic / paraphrase-tolerant lookup of *local* facts ("tell me about X"); ~\$0.001/query, the 80% case.
  3. **Hybrid (+ rerank)** — mixed corpora needing both exact-match and semantic recall; the strong production default.
  4. **GraphRAG** — multi-hop reasoning over entity *relationships* and **global/sensemaking** questions where the answer must synthesize the whole corpus (Edge et al., *"From Local to Global,"* [arXiv:2404.16130](https://arxiv.org/abs/2404.16130)); pre-builds an entity graph + community summaries so corpus-wide synthesis becomes retrievable.
  5. **Agentic retrieval** — the model itself decides *if, what, where, and how* to retrieve, iterating across multiple tools/queries for hard, ambiguous, multi-step tasks; most capable and most expensive (~\$0.02–0.10/query). Spend it only where the question is genuinely hard. The 2026 enterprise pattern is an **intelligent router** dispatching ~80% vector / ~15% graph / ~5% agentic.

- **Caveats:**
  - **Fast-moving** — embedding models, rerankers, vector DBs, and framework APIs (LlamaIndex/LangChain) churn quarterly; treat specific tool defaults as perishable, the pipeline *concepts* as durable.
  - **"RAG is dead" hype vs. reality** — recurring claim that million-token context windows and agents make retrieval obsolete. Reality: long-context is far costlier per query (RAG cited as roughly 8–82× cheaper for typical workloads), can't natively cite sources, and still suffers lost-in-the-middle. The accurate version is "*naive* RAG is dead": retrieval didn't die, it became a smarter, conditional, agent-driven policy — *naive* pipeline retired, retrieval itself essential.
