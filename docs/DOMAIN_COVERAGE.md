# Domain coverage map — the reference the R6 faithfulness gate checks against

**Purpose.** R6 (MACHINERY_NEEDED.md) says the toolchain must check that the
concept set *covers the domain's known key ideas* and *flag omissions* — and that
it should seed from an authoritative syllabus. This file is that syllabus for
"build a second brain over KGs / ontologies / neurosymbolic AI", plus the current
coverage status. It was produced by reconciling the 35-concept graph against an
expert-level topic map (KG representation, Semantic Web standards, ontology
engineering, logic/reasoning, querying, construction, KG-ML, neurosymbolic,
LLM+KG, evaluation, systems, governance).

**Design model (2026-06-21): go deep, let the user pick the level.** The skill map's
*purpose* is that a learner selects their target expertise; most users won't need
everything, but the curriculum should be **comprehensive by default** and let the
user scope it. So nothing here is "out of scope" — instead every concept gets a
**depth band**, and the UI shows the sub-graph for the user's chosen goal × depth
(the existing goal-closure / `core`-vs-`enrichment` / `coreOnly` toggle is the seed
of this; see R13 in MACHINERY_NEEDED.md). The bands replace the old A/B/C scope tiers:

**How to read status:** ✓ have a concept · ◐ partial (mentioned in prose/example
but not a first-class concept) · ✗ absent. **Tier = depth band** (selectable, not
scope): **A = Foundations** (on by default — everyone) · **B = Practitioner**
(opt-in — you're building a real brain) · **C = Expert/Frontier** (opt-in — research
& infra depth). C is *off by default*, **not** "won't do"; the coverage gate checks
each band as its own sub-curriculum, and only flags a concept missing *within a band
the author declared in-target*.

---

## Scope statement (the spine every band shares)
The product is a **personal, multi-source, LLM-constructed, ontology-governed,
queryable, trustworthy** knowledge base. Foundations (A) covers modeling +
querying + ontology basics + OWA/validation-vs-inference + the propose-verify idea.
Practitioner (B) covers ontology engineering & reuse, the full governed
construction lifecycle, evidence grounding, fusion, link prediction, RAG.
Expert/Frontier (C) covers OWL expressivity depth, reasoning families, the
KG-embedding model zoo, GNNs, evaluation methodology, governance/FAIR, and
research neurosymbolic — available as an opt-in track, layered on, never forced.

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

### Governed construction & assertion lifecycle (from the onto-canon6 methodology whitepaper)
The whitepaper treats KG-building as a *governed assertion lifecycle*, not
extraction-to-graph. It deepens the neurosymbolic/construction half and supplies a
trustworthiness spine a "second brain" actually needs. Almost all absent.
| Key idea | Status | Tier | Why it matters here |
|---|---|---|---|
| **assertion as the unit** (subj+pred+obj **+ scope + modality + provenance + evidence + policy + lifecycle**), richer than a triple | ✗ | **A/B** | reframes "what a fact in your brain *is*"; ties n-ary/reification/provenance/modality into one idea |
| **candidate vs promoted state** (a proposal vs a durable commitment) | ◐ (propose-verify) | **A** | the propose-verify loop *is* this; name the two states |
| **assertion lifecycle / state machine** (raw → candidate → validated → reviewed → promoted → superseded/deprecated/recanonicalized) | ✗ | **B** | the deep version of propose-verify; where trust is earned |
| **evidence grounding** (is the claim *supported by a source span*?) — distinct from schema-valid and from reasoner-consistent | ✗ | **B** | the verify step LLM extraction most needs; catches hallucination at the source, not the schema |
| **schema-valid ≠ semantically-true** ("valid JSON can be false") | ✗ | **A** | a sharp neurosymbolic *contrast/confusion* — and exactly the project's category-error mission |
| **review / promotion event** (governed acceptance leaves a record) | ✗ | **B** | provenance of the *decision*, not just the fact |
| **modality / epistemic status** (observed · inferred · asserted · disputed · predicted · deprecated) | ✗ | **B** | a trustworthy brain must mark *how it knows* each fact |
| **recanonicalization / supersession / deprecation** (explicit change events, not hidden rewrites) | ✗ | **B** | your beliefs change; record the change. Ties temporal validity |
| **progressive disclosure / staged extraction** (discovery → canonicalize → disambiguate → normalize → promote, each its own contract + failure vocab) | ✗ | **B** | the methodology behind "decompose `llm-extraction`"; makes failure localizable |
| **policy context** (the ontology/governance rules in force at review time) | ✗ | **C** | makes promotion auditable across schema change |
| **risk-tiered verification** (scale checks with blast radius) | ✗ | **C** | how to not over- or under-govern |
| **provenance precedence / conflict resolution / truth discovery** (which source wins) | ✗ | **B** | multi-source brains contradict themselves |
| **FAIR / lineage / auditability** | ✗ | **C** | governance-band depth |

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

## Expert/Frontier band (Tier C — opt-in track, OFF by default, not "won't do")
Under the go-deep / user-selectable model these are no longer cut — they are an
advanced track the learner can switch on: KGE model zoo (TransE/RotatE/ComplEx/
TuckER…), GNN internals (message passing, R-GCN, over-smoothing/over-squashing),
computational complexity, distributed graph processing & partitioning, triple-store/
index engineering, deep security/privacy/governance, evaluation methodology, and
domain-specific ontologies (biomed/finance/law as selectable *domain packs*). The
coverage gate treats band C as in-target only when the author/learner has opted into
it, so a Foundations-only page isn't flagged for "missing GNNs" — but an Expert page
is. That conditional-by-band check is the R6+R13 interaction.

## Note for the machinery
This file is the machine-checkable side of R6: the gate reads the Tier-A list as
**required coverage** (flag any absent), the Tier-C list as **explicit non-goals**
(never flag), and Tier-B as **suggestions** (warn, don't fail). When the domain or
scope changes, edit this file — it is the coverage contract, the way `concepts.ts`
is the structure contract.
