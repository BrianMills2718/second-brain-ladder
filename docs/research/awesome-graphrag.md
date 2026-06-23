# Awesome-GraphRAG — curated paper/system collection backing a GraphRAG survey

- **URL / stars / activity:** https://github.com/DEEP-PolyU/Awesome-GraphRAG — ~2.5k stars, actively maintained (frequent paper additions; latest news entries into 2026, "Continuously updating, stay tuned!", PRs welcomed).
- **Type:** Awesome-list / survey paper-collection (curated, taxonomy-organized).
- **What it is:** A continuously updated reading list of GraphRAG (Graph Retrieval-Augmented Generation) papers, systems, benchmarks, and open-source projects, maintained by DEEP-PolyU (Hong Kong PolyU). It directly accompanies the survey paper **"A Survey of Graph Retrieval-Augmented Generation for Customized Large Language Models"** (arXiv:2501.13958, 2025), and mirrors that paper's classification framework. It is the canonical map of the GraphRAG research landscape rather than a single tool.

## GraphRAG taxonomy

The field is organized around three pipeline stages (matching the survey):

1. **Knowledge Organization** — how the graph/index is built
   - Graphs for Knowledge Indexing (graph used as an index over a corpus)
   - Graphs as Knowledge Carrier
     - Knowledge Graph construction from corpus (extract entities/relations from raw text)
     - GraphRAG over existing KGs (Wikidata, Freebase, domain KGs)
   - Hybrid GraphRAG (text chunks + graph)
2. **Knowledge Retrieval** — how relevant subgraphs/paths are fetched
   - Semantic-similarity-based retriever (embeddings)
   - Logical-reasoning-based retriever
   - LLM-based retriever
   - GNN-based retriever
   - Multi-round (iterative) retriever
   - Post-retrieval processing (rerank/prune)
   - Hybrid retriever
3. **Knowledge Integration** — how retrieved graph context is fed to the LLM
   - Fine-tuning (node-level, path-level, subgraph-level)
   - In-context learning (chain-of-thought over graph, collaborative KG refinement)

Supporting sections: Related Survey Papers, **Benchmarks**, **Open-source Projects**.

## Key systems / papers

- **Microsoft GraphRAG** (2024) — modular graph-based RAG; community summaries enable global/whole-corpus QA.
- **LightRAG** (2024) — simple, fast dual-level (local+global) graph retrieval.
- **HippoRAG / HippoRAG2** (HippoRAG2 ICML 2025) — neurobiologically inspired; "RAG to Memory," non-parametric continual learning via personalized PageRank over a KG.
- **RAPTOR** (ICLR 2024) — recursive abstractive clustering into a retrieval tree (hierarchical summaries).
- **Think-on-Graph** (ICLR 2024) — LLM agent does iterative beam search/reasoning over a KG.
- **GraphReader** (2024) — graph-based agent for long-context reasoning.
- **PIKE-RAG** (Microsoft) — specialized knowledge + rationale-augmented generation.
- **KAG** — Knowledge Augmented Generation targeting professional/vertical domains.
- **G-Retriever** — RAG for textual-graph question answering.
- **StructRAG** — structurizes information at inference time (hybrid).
- **nano-graphrag** / **Fast-GraphRAG** — lightweight, hackable, query-adaptive reimplementations of the GraphRAG pattern.
- Recent frontier (2026): **LinearRAG** (ICLR 2026, relation-free construction), **MemGraphRAG** (KDD 2026), **LogicRAG** (AAAI 2026), **GraphRAG-Bench / Benchmark** (ICLR 2026), plus domain variants (LegalGraphRAG).
- **Benchmarks:** GraphRAG-Bench, DIGIMON, PolyG; multi-hop (Multihop-RAG, CWQ, MetaQA); large-scale complex QA (KQAPro, LC-QuAD/LC-QuAD v2, GrailQA, WebQSP); domain-specific (UltraDomain, TutorQA, FACTKG, Mintaka).

## Relevance to a "second brain" curriculum

GraphRAG is the modern LLM-native realization of the "second brain": a personal corpus turned into a queryable knowledge graph, retrieved over, and synthesized by an LLM. The taxonomy above is effectively the curriculum spine. Concepts a builder must learn:

- **Entity & relation extraction** from raw notes/docs (LLM-driven KG construction) — the bridge from unstructured "second brain" content to a graph.
- **Graph construction vs. graph-as-index** — when to build an explicit KG vs. use a graph as an index layer over chunks; hybrid (text + graph).
- **Community detection / hierarchical summarization** (Microsoft GraphRAG communities, RAPTOR trees) — enables thematic/global queries over the whole vault.
- **Local vs. global retrieval** — entity-neighborhood lookups vs. corpus-wide synthesis (the LightRAG dual-level distinction); knowing which a query needs.
- **Retrieval strategies** — semantic similarity, multi-hop path/logical reasoning, GNN-based, iterative/multi-round, and post-retrieval rerank/prune.
- **Memory & continual update** (HippoRAG, PageRank-style graph traversal) — keeping the second brain incremental, not re-indexed from scratch.
- **Knowledge integration** — in-context (graph-aware CoT) vs. fine-tuning; how retrieved subgraphs are serialized into the prompt.
- **Evaluation** — using GraphRAG-Bench / multi-hop QA sets to measure whether the system actually reasons over connections rather than recalling chunks.

## Caveats

- Research-heavy: it is an academic survey companion (mostly papers), not a tooling tutorial or build guide — practical "how to ship it" content is thin; pair with the engineering repos (Microsoft GraphRAG, LightRAG, nano-graphrag).
- Maintained and current (entries into 2026, ~2.5k stars), but taxonomy reflects the authors' survey framing; other surveys slice the field differently.
- Heavy skew toward QA benchmarks and KG-over-public-corpus settings; personal-knowledge / note-taking use cases are not its focus and must be inferred.
- Source: WebFetch of the GitHub repo and raw README (2026-06); star/date figures are approximate as reported by the page.
