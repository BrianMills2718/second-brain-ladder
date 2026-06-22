# awesome-knowledge-graph — curated index of KG databases, tools, datasets, and learning materials, skewed to the semantic-web / graph-DB era

- **URL / stars / activity:** https://github.com/totogo/awesome-knowledge-graph — ~1.9k stars, CC0 license, maintained by Sitao Z. (`totogo`). ~75 commits total; still accepting PRs (4 open issues, ~15 open PRs at fetch time) but cadence is slow and content is incremental rather than restructured. No exact last-commit date surfaced, but the entry set looks last meaningfully refreshed around the early-LLM era (one "Knowledge Graphs and LLMs in Action" book is the only LLM-aware item).
- **Type:** awesome-list

- **What it is:** A single-README curated directory of Knowledge Graph "infrastructure, databases, tools and other resources." It is organized around the classic KG/semantic-web stack: graph databases, RDF triple stores, query languages, public knowledge bases (Wikidata, DBpedia, YAGO), and a thin layer of learning materials. It functions as a vendor/tool catalog more than a syllabus — most entries are products or datasets with a one-line gloss, not papers or methods. It explicitly inherits content from older lists (`jbmusso/awesome-graph` and a Chinese `husthuke/awesome-knowledge-graph`).

- **Section map** (top-level `##` with subsections):
  - **Infrastructure** — Graph Databases · Triple Stores · Graph Computing Frameworks · Graph Visualization · Graph Construction · Languages · Managed Hosting Services
  - **Knowledge Engineering** — Knowledge Fusion (entity resolution / link discovery)
  - **Knowledge Graph Dataset** — General · Semantic Network · Academic & Research · Other Domain
  - **Learning Materials** — Official Documentations · Community Effort
  - **Conferences**
  - **Books**
  - **Contribute / License**

  The mental model this reveals: KG ≈ a *graph database problem*. The bulk of the list is storage engines, query languages (Cypher/SPARQL/Gremlin/GQL), and big static public datasets. There is no section for embeddings, graph neural networks, LLM-based extraction, RAG, GraphRAG, ontology learning, or evaluation. Construction is a 4-item afterthought. This is the pre-LLM symbolic/semantic-web worldview.

- **Notable entries:**
  - **Wikidata** — the canonical free, collaborative, multilingual structured KB; still the default real-world entity backbone for any modern KG/RAG system.
  - **DBpedia** — structured extraction from Wikipedia; foundational Linked Data dataset, now more legacy than Wikidata.
  - **YAGO** — large semantic KB derived from Wikipedia + WordNet + GeoNames; classic academic reference KG.
  - **ConceptNet** — freely available commonsense semantic network; still cited in NLP/commonsense-reasoning work and useful as a relation source.
  - **WordNet** — Princeton lexical database; the legacy lexical-semantics workhorse.
  - **Diffbot Knowledge Graph** — commercial web-scale crawled KG; one of the few entries that bridges to the "extract a KG from the open web" use case relevant today.
  - **Neo4j** — the dominant property-graph DB; its ecosystem (Cypher, GDS library) is where most modern GraphRAG tutorials actually land.
  - **Kuzu** — embeddable, fast columnar graph DB; one of the more modern, LLM-app-friendly engines (lightweight, in-process, good for local "second brain" graphs).
  - **TypeDB (formerly Grakn/Vaticle)** — strongly-typed logical graph DB with inference; modern take on schema-rich knowledge modeling.
  - **Memgraph** — in-memory transactional graph DB; common in real-time + GraphRAG demos.
  - **Oxigraph / QLever** — Rust triple stores; QLever notably scales SPARQL to 100B+ triples on a single machine (legacy-stack but genuinely modern engineering).
  - **Dedupe / LIMES** — entity resolution / link discovery; the "knowledge fusion" piece that an LLM-native pipeline still needs (and increasingly does with embeddings instead).
  - **Semantic Scholar** — AI-powered scholarly KG; one of the few entries explicitly framed as AI-built.
  - **Graphistry** — GPU visual graph analytics (RAPIDS/Arrow); modern visualization for large graphs.
  - **"Knowledge Graphs and LLMs in Action" (Manning)** — the single entry that connects KGs to LLM/RAG pipelines; signals the list authors are aware of, but have not absorbed, the LLM era.
  - Legacy/semantic-web cluster worth knowing exists but largely superseded: **Apache Jena, Virtuoso, GraphDB (Ontotext), AllegroGraph, RDF4J, Blazegraph, TinkerPop/Gremlin, SPARQL** — the RDF/W3C stack.

- **Relevance to a modern "second brain" curriculum:** Useful as a *map of the substrate layer*, not the method layer. What it surfaces that a builder genuinely needs: (1) the choice of graph store — for a local second brain, the modern picks here (Kuzu, Memgraph, Neo4j, TypeDB) matter; (2) public KBs to ground/enrich notes (Wikidata, ConceptNet, Wikidata-derived subgraph tooling like KGPrune); (3) entity-resolution/fusion as a real subproblem (Dedupe). What it is missing is almost everything that defines the modern LLM-native approach: KG construction from unstructured text via LLMs, embeddings + vector indexes, GraphRAG / hybrid retrieval, schema/ontology induction, triple extraction and verification, and evaluation. Estimate roughly 70–80% legacy symbolic / semantic-web / graph-DB-vendor stack, ~20% still-current infrastructure, and ~single-digit % LLM-native. As a curriculum input it is best used to harvest the *infrastructure and dataset shortlist*, then explicitly rescope the methodology onto modern LLM-native sources it does not cover.

- **Caveats:** Maintained but coasting — accepts PRs, no abandonment, but no structural modernization; the section taxonomy itself predates the LLM era and there is no "LLM/RAG/embeddings" home for new entries. Heavily skewed toward (a) graph-database product listings (many commercial/cloud-hosting entries read like a vendor directory) and (b) the RDF/semantic-web tradition. Several legacy items are effectively retired (e.g., Apache Marmotta, Freebase/Graphd). Treat dataset and engine entries as a useful shortlist; do not treat the section structure as the field's current mental model.
