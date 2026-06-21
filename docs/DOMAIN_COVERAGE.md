# Domain coverage map — the reference the R6 faithfulness gate checks against

**Purpose.** R6 (MACHINERY_NEEDED.md) says the toolchain must check that the
concept set *covers the domain's known key ideas* and *flag omissions* — and that
it should seed from an authoritative syllabus. This file is that syllabus for
"build a second brain over KGs / ontologies / neurosymbolic AI", plus the current
coverage status. It was produced by reconciling the 35-concept graph against an
expert-level topic map (KG representation, Semantic Web standards, ontology
engineering, logic/reasoning, querying, construction, KG-ML, neurosymbolic,
LLM+KG, evaluation, systems, governance).

**How to read status:** ✓ have a concept · ◐ partial (mentioned in prose/example
but not a first-class concept) · ✗ absent. **Tier** = scope decision for *this*
product: **A** core to a second brain (should exist) · **B** enrichment (valuable,
optional) · **C** out of scope (research/infra depth — explicit non-goal, so the
coverage gate must NOT flag it).

---

## Scope statement (what "second brain" bounds in/out)
In: a **personal, multi-source, LLM-constructed, ontology-governed, queryable,
trustworthy** knowledge base. That pulls in modeling (incl. provenance/time/context
of real notes), querying, ontology-engineering *basics + reuse*, reasoning (OWA,
validation-vs-inference, the expressivity that makes reasoning *do* something),
neurosymbolic construction, and *light* KG-ML (link prediction, RAG).
Out: the KG-embedding model zoo, GNN internals, complexity theory, distributed
graph systems, triple-store engineering, deep governance/security, and
domain-specific ontologies (biomed/finance/law).

---

## Coverage by area

### KG representation & data models
| Key idea | Status | Tier |
|---|---|---|
| knowledge-graph, entity, relation, triple, IRI | ✓ | A |
| **literal / attribute** (datatype value: dates, numbers, strings) | ✗ | **A** |
| **n-ary relation** ("A gave B to C on date D") | ✗ | **A** |
| **reification** (statement-as-entity, for provenance/time/confidence) | ✗ | **A** |
| **named graph** (graph with an id: source/context/trust separation) | ✗ | **A** |
| **contextual / temporal validity** (fact true only in a time/context) | ✗ | **A** |
| RDF graph, property graph | ✓ | A |
| labeled property graph | ◐ | B |
| hypergraph, temporal graph, probabilistic graph, multimodal graph | ✗ | B/C |

### Semantic Web standards
| Key idea | Status | Tier |
|---|---|---|
| RDF (as a model) | ◐ (rdf-graph) | A |
| **RDFS** (lightweight class/property vocab) | ✗ | **A** |
| OWL 2 (+ EL/QL/RL profiles) | ◐ (named in defs) | A/B |
| **SPARQL** (query RDF) | ✗ | **A** |
| SHACL (validation) | ✓ (shacl-validation) | A |
| **SKOS** (taxonomy/thesaurus model) | ✗ | **A** |
| JSON-LD, R2RML/Direct Mapping | ✗ | B |
| **PROV-O** (provenance ontology — currently `provenance` is the idea, not the standard) | ◐ | B |

### Ontology concepts & engineering
| Key idea | Status | Tier |
|---|---|---|
| ontology, class, instance, subclass | ✓ | A |
| property (schema), domain, range | ◐ (one concept) | A |
| **object property vs datatype property** | ✗ | **A** |
| **disjointness** (also *fixes the `consistency` content bug*) | ✗ | **A** |
| equivalence (class/property) | ✗ | A |
| **cardinality / existential / universal restriction** | ✗ | **A** |
| **property chain** (e.g. hasParent∘hasParent ⇒ hasGrandparent) | ✗ | A/B |
| **competency questions** (the driver of ontology design) | ✗ | **A** |
| **upper / domain / application ontology**; **reuse** (BFO, DOLCE, SUMO, FOAF, schema.org) | ✗ | **A** |
| **ontology alignment / matching** | ✗ | **A** |
| ontological commitment, patterns, modularization, versioning, evolution, governance | ✗ | B/C |
| **taxonomy vs thesaurus vs ontology** (the "ontology ≠ taxonomy" category error) | ✗ | **A** |

### Logic & reasoning
| Key idea | Status | Tier |
|---|---|---|
| entailment, reasoner, consistency, OWA/CWA, description-logic | ✓ | A |
| **validation vs inference** (explicit contrast — *fixes the SHACL/reasoner bug*) | ✗ | **A** |
| deductive / inductive / abductive reasoning | ◐ (deductive only) | B |
| **non-monotonic / default reasoning** (ties to OWA) | ✗ | B |
| datalog, horn clauses, forward/backward chaining, materialization, query rewriting | ✗ | B |
| truth maintenance, paraconsistent, fuzzy, probabilistic logic | ✗ | C |

### Querying
| Key idea | Status | Tier |
|---|---|---|
| **SPARQL / basic graph pattern** (the "queryable" promise the homepage makes) | ✗ | **A** |
| **Cypher / GQL** (property-graph querying) | ◐ (one example) | A/B |
| property path, conjunctive query, regular path query, federated query | ✗ | B |
| reasoning-aware query answering | ✗ | B |
| join ordering, indexing, cardinality estimation | ✗ | C |

### KG construction & integration
| Key idea | Status | Tier |
|---|---|---|
| llm-extraction (text→triples), ontology-grounded extraction | ✓ | A |
| **NER / entity linking / relation extraction / coreference** (decompose the extraction black box) | ◐ | A/B |
| event extraction, slot filling, open IE, schema-guided extraction | ◐/✗ | B |
| entity-resolution | ✓ | A |
| **knowledge fusion / conflict resolution / truth discovery** (multi-source brain) | ✗ | **A** |
| record linkage, canonicalization, dedup, schema matching | ✗ | B |
| provenance | ✓ | A |

### KG-ML, neurosymbolic, LLM+KG
| Key idea | Status | Tier |
|---|---|---|
| embedding, similarity, kg-embedding | ✓ | A |
| **link prediction / graph completion** (fill in your brain) | ✗ | **A** |
| triple classification, entity/relation prediction, entity alignment | ✗ | B |
| KGE model zoo (TransE/RotatE/ComplEx/…), tensor factorization | ✗ | **C** |
| GNNs (message passing, R-GCN, over-smoothing, …) | ✗ | **C** |
| neurosymbolic, propose-verify, hallucination | ✓ | A |
| **KG-grounded RAG** (use the brain with an LLM) | ✗ | **A** |
| differentiable reasoning, semantic loss, rule learning, query embedding, MLN/PSL | ✗ | B/C |
| LLM failure modes: schema drift, entity conflation, temporal invalidity, benchmark leakage | ◐ (hallucination only) | B |

### Evaluation, systems, governance
| Key idea | Status | Tier |
|---|---|---|
| precision/recall/F1, MRR, Hits@K, calibration, ablation, consistency-eval | ✗ | B |
| triple store, graph DB, reasoner, ontology editor (Protégé), materialized views | ◐ (reasoner) | C |
| FAIR, access control, epistemic status, lineage, bias, privacy | ✗ | C |

---

## High-value gaps (Tier-A shortlist, ~18 concepts)
Add these for the curriculum to honestly cover "build a second brain":
1. **literal** (datatype values) — triples currently only have entity objects.
2. **object-property vs datatype-property** + first-class **domain/range**.
3. **n-ary relation** and **4. reification** (+ the modern **RDF-star / named graph**
   mechanism) — *the* way provenance/time/confidence attach to facts; `provenance`
   is already a goal concept with no mechanism behind it.
5. **named graph** · **6. contextual/temporal validity**.
7. **query / SPARQL** (basic graph pattern) — the homepage's "stays queryable" claim
   has no concept behind it. (+ Cypher/GQL for property graphs.)
8. **disjointness** — *and it fixes the `consistency` content bug*.
9. **validation vs inference** (contrast) — *and it fixes the SHACL/reasoner bug*.
10. **cardinality / existential / universal restriction** + **property chain** — the
    OWL expressivity that makes reasoning produce non-trivial entailments.
11. **RDFS** + **OWL profiles** (standards placement).
12. **taxonomy vs thesaurus vs ontology (SKOS)** — a mission-aligned category error.
13. **competency questions** — the "build" framing's actual starting point.
14. **ontology reuse / upper+domain ontologies / alignment** (SUMO, FOAF, schema.org)
    — "don't reinvent; align to existing ontologies."
15. **knowledge fusion / conflict resolution** — a multi-source brain needs it.
16. **link prediction / graph completion** — completing the brain.
17. **KG-grounded RAG** — using the brain with an LLM.
18. **NER / entity-linking / relation-extraction** — decompose `llm-extraction`.

## Deliberate non-goals (Tier C — the gate must NOT flag these)
KGE model zoo (TransE/RotatE/ComplEx/TuckER…), GNN internals (message passing,
R-GCN, over-smoothing/over-squashing), computational complexity, distributed graph
processing & partitioning, triple-store/index engineering, deep
security/privacy/governance, and domain-specific ontologies (biomed/finance/law).
These are real expertise but out of scope for a personal-second-brain curriculum;
listing them here is what lets the R6 gate distinguish "missing" from "won't do."

## Note for the machinery
This file is the machine-checkable side of R6: the gate reads the Tier-A list as
**required coverage** (flag any absent), the Tier-C list as **explicit non-goals**
(never flag), and Tier-B as **suggestions** (warn, don't fail). When the domain or
scope changes, edit this file — it is the coverage contract, the way `concepts.ts`
is the structure contract.
