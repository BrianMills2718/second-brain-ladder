# Domain coverage map — the reference the R6 faithfulness gate checks against

**Purpose.** R6 says the toolchain must check the concept set *covers the domain's key
ideas* against an authoritative syllabus, and flag omissions. This file is that syllabus.
**Rescoped 2026-06-22** (see `docs/RESCOPE_PLAN.md`) off the 2018 symbolic-KG framing onto
a **learner-empowerment, decision-first** frame grounded in `docs/research/` (the modern
KG/GraphRAG/LLM-wiki/agentic landscape). The machine contract is `src/content/coverage.ts`;
this file is the rationale and the **target** the contract is migrated toward (R1).

> **Migration note.** `coverage.ts` currently still enforces the *legacy* required set (so
> `npm run check` stays green). R1 migrates `REQUIRED_CONCEPTS` to **this** contract
> concept-by-concept as the new concepts are authored (the ratchet) — never a red build.

## Scope statement (the new spine)
The product teaches a learner to **build a personal knowledge system / "second brain" for
their own goal** — *neutral on the "right" approach*. The terminal goal is **practitioner
capability**, not coverage: *understand the alternatives → weigh tradeoffs → decide & plan
→ implement → operate.* Three paradigms are a **fair decision menu**, each honestly costed:

1. **Symbolic KG** — RDF/property-graph + ontologies + query/reasoning. *One option,
   demoted from the center.*
2. **GraphRAG** — an LLM builds a graph; you retrieve over it.
3. **LLM-wiki / agentic** — front-load synthesis into navigable files; an agent harness
   reads/maintains them.

…with **PKM** as the human-facing reality that maps onto all three (*a backlink is a graph
edge; "AI over my notes" is RAG; an MOC is an agent index*).

**Bands (selectable depth, not scope cuts).** **A = Foundations** (everyone — the
decisions + minimal lifecycle every builder faces) · **B = Practitioner** (building a real
system) · **C = Expert/Frontier** (research/infra/formal depth — opt-in, *not* "won't do").
The gate checks each band as its own sub-curriculum.

**How to read status:** ✓ concept exists · ◐ partial (in prose/example only) · ✗ absent.
(Most are ✗ now — this is the post-rescope *target*; R1 builds it.)

---

## 0. Framing / meta (cross-cutting)
| Key idea | Status | Tier |
|---|---|---|
| what a "second brain" is; **PKM ↔ KG/AI are one artifact from two cultures** | ✗ | **A** |
| **the three paradigms exist + when each fits** (symbolic / GraphRAG / LLM-wiki) | ✗ | **A** |
| knowledge representation is a **choice**, not one true way | ◐ | **A** |
| **schema-valid ≠ semantically true** (the category-error mission) | ✗ | **A** |

## 1. Plan / decide (the meta-skill)
| Key idea | Status | Tier |
|---|---|---|
| **requirements elicitation** (corpus size/type/growth; question shape — lookup vs global-summary vs multi-hop vs temporal; freshness; privacy/local; budget/latency; solo vs team; human-readable vs machine) | ✗ | **A** |
| **mapping requirements → approach** (a neutral decision guide) | ✗ | **A** |
| **MVP-first, reversibility, when to "graduate" to an index** | ✗ | **A** |
| sizing / cost estimation | ✗ | B |

## 2. Represent
| Key idea | Status | Tier |
|---|---|---|
| entity, relation, **triple (s,p,o) — and its limits** (symmetric/n-ary; an RDF *modeling choice*, not a universal truth) | ◐ | **A** |
| nodes/edges/properties; **property graph vs RDF** (the decision; *reasoning over property graphs is mostly tooling/history, not a fundamental limit*) | ◐ | **A** |
| **links / backlinks / graph view** (the PKM bridge = a property graph) | ✗ | **A** |
| **schema spectrum: schemaless → typed → ontology** (when a schema earns its cost) | ✗ | **A** |
| literal/attribute, object- vs datatype-property, domain/range | ◐ | A/B |
| n-ary relation, reification / **RDF-star**, named graph, temporal validity | ◐ | B |
| ontology, class, subclass, instance | ✓ | B |
| **RDF / RDFS / SPARQL / Cypher / GQL** (the symbolic paradigm's tools — *if you choose it*) | ◐ | B |
| OWL expressivity depth (restrictions, property chains, profiles), **description logic** | ✓ | **C** |

## 3. Construct
| Key idea | Status | Tier |
|---|---|---|
| **manual modeling vs LLM-driven construction** (the build decision) | ◐ | **A** |
| **the hallucination problem + filtering** (LLM-as-judge / evidence grounding) | ◐ | **A** |
| LLM extraction decomposed: **NER / entity-linking / relation-extraction / coreference** | ◐ | A/B |
| **entity resolution / dedup / canonicalization** | ✓ | A/B |
| schema-guided / ontology-grounded extraction; open IE | ◐ | B |
| **governed assertion lifecycle** (candidate→promoted; modality; provenance) | ◐ | B |
| knowledge fusion / conflict resolution / truth discovery (multi-source) | ✗ | B |

## 4. Retrieve (the decision ladder — the core skill)
| Key idea | Status | Tier |
|---|---|---|
| **the retrieval decision ladder** (keyword → vector → hybrid+rerank → GraphRAG → agentic) | ✗ | **A** |
| **embeddings / vector search / similarity**; keyword/BM25; **hybrid + reranking** | ◐ | **A** |
| **RAG fundamentals + failure modes** (lost-in-middle; *no-global-view* → the GraphRAG gap) | ✗ | **A** |
| **GraphRAG: local vs global, index-time vs query-time, community summarization** | ✗ | **A**/B |
| **agentic retrieval — adopt a harness** (Claude Code/Codex/Cursor + **MCP/connectors/plugins**) over files | ✗ | **A**/B |
| build-your-own agent loop (ReAct / Self-RAG / CRAG) — the **embedded/product** contrast | ✗ | B |
| **LLM-wiki**: agent maintains navigable files; *full-context vs chunk-retrieval* | ◐ | **A** |
| KG embeddings / **link prediction** / GNN reasoning (the neural-completion option's depth) | ◐ | **C** |

## 5. Operate & govern (the neglected hard layer)
| Key idea | Status | Tier |
|---|---|---|
| **maintenance** (incremental re-index, dedup, dead-link/contradiction lint, idempotent re-ingest) | ✗ | **A**/B |
| **evaluation** (golden set, RAGAS / faithfulness, gating updates) | ✗ | **A**/B |
| **temporal / bi-temporal validity** (valid-time vs transaction-time) | ✗ | B |
| cost / latency / observability | ✗ | B |
| provenance, versioning, forgetting / privacy | ◐ | B |
| **agent-memory substrates** (graph vs flat — Zep/Graphiti, Mem0) | ✗ | B |
| FAIR / lineage / access control / epistemic status | ✗ | C |

---

## Tier-A target shortlist (what R1 must build for an honest "build a second brain")
The Foundations bar — the literate-builder set. (✗ today; this is the rescope's R1 scope.)
1. **The three paradigms + when each fits**, and PKM↔KG/AI equivalence (framing).
2. **The plan/decide meta-skill** — requirements → approach mapping; MVP-first.
3. **Triple + its limits**; **property graph vs RDF** (the represent decision); **links/graph-view** as the PKM bridge; the **schema spectrum**.
4. **RAG fundamentals + the retrieval decision ladder** (keyword → vector → hybrid → GraphRAG → agentic).
5. **GraphRAG local-vs-global** and **index-vs-query-time**.
6. **Agentic-harness retrieval** (adopt + extend; MCP) and the **LLM-wiki** pattern.
7. **LLM construction + hallucination filtering**; **entity resolution**.
8. **Operate**: maintenance + evaluation as first-class (not an afterthought).
9. **schema-valid ≠ semantically true** (the category-error mission, retained).

## Tier-C — opt-in depth, OFF by default (not "won't do")
Deep OWL 2 / description-logic formal semantics; the KG-embedding model zoo math
(TransE/RotatE/ComplEx internals); GNN architecture internals (message passing, R-GCN,
over-smoothing); distributed graph processing / triple-store & index engineering;
deep evaluation methodology; domain ontology packs (biomed/finance/law). The gate treats
band C as in-target only when the author/learner opts in.

## Note for the machinery
The R6 gate reads `coverage.ts`: **Tier-A = required** (FAIL if a key idea has no concept),
**Tier-C = explicit non-goals** (never flag), **Tier-B = advisory** (warn). This file is
the contract; `coverage.ts` is its machine form, **migrated to this rescoped target in R1**
(ratcheted, never a red build). When scope changes, edit this file first.
