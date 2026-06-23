# Rescope plan — from "2018 symbolic KG" to a learner-empowerment, decision-first second brain

- **Date:** 2026-06-22
- **Decision:** rescope **in place, in this repo, on a branch** — evolve `concepts.ts`
  (the source of truth) and reuse the existing machinery (gates, `derive.ts`, `graph.ts`,
  frontend). Do **not** rebuild infrastructure and do **not** start a fresh repo.
- **Companion docs:** `docs/research/` (the 17-note landscape + synthesis — the evidence
  base), `godel-concept-ladder/METHODOLOGY.md` §8/§11/§13/§15 (the theory),
  `godel-concept-ladder/docs/ADR-0008` (the decisions), `docs/SYSTEM.md` (current architecture),
  `docs/DOMAIN_COVERAGE.md` (the coverage contract — to be rewritten by R0).
- **Purpose:** an unambiguous plan with **checkable** success criteria (godel-ROADMAP
  discipline) for turning the current symbolic-stack curriculum into a neutral,
  decision-first, practitioner-capability curriculum.

## Why rescope (the diagnosis)
The current instance is well-formed and largely correct, but **mis-scoped to ~2018**: it
spines on the symbolic Semantic-Web stack (RDF → SPARQL/Cypher → OWL/SHACL → reasoners),
jumps straight to querying, omits the dominant modern paradigms (RAG/GraphRAG, agentic
retrieval, LLM-driven construction, agent memory), and teaches through language *syntax*
rather than concepts. The gates enforce correct *structure*; nothing enforces *modern
scope* or *good-to-learn-from*. (Detail: `docs/research/README.md`, `docs/REVIEW-2026-06-22.md`.)

## The target frame (what we are building toward)
A curriculum that **empowers the learner**, **neutral on the "right" answer**, to:
> *understand the alternatives → weigh tradeoffs → decide & plan → implement → operate* —
> a personal knowledge system, for **their own** goal.

Terminal goal = **practitioner capability**, not conceptual coverage (METHODOLOGY §8).
Three paradigms presented as a **fair decision menu**, each honestly costed — never spined
on a favorite:
1. **Symbolic KG** (RDF/OWL/property-graph + query) — one option, demoted from the center.
2. **GraphRAG** (LLM builds a graph; retrieve over it).
3. **LLM-wiki / agentic** (front-load synthesis into navigable files; an agent harness
   reads/maintains them) — the practical home of the Karpathy-wiki idea.
…with **PKM** as the human-facing reality that maps onto all three (a link *is* an edge).

## The new spine (decisions × lifecycle, not taxonomy)
Organize modules on the **builder's decisions and the build lifecycle**:
- **Represent** — notes/links → property graph → KG (the DIGIMON graph-type ladder);
  the property-graph-vs-RDF decision (incl. the "reasoning is mostly tooling/history, not a
  fundamental limit" correction).
- **Construct** — manual modeling vs **LLM extraction / GraphRAG indexing / wiki synthesis**,
  with hallucination filtering; entity resolution.
- **Retrieve** — the decision ladder: keyword → vector → hybrid+rerank → GraphRAG →
  **agentic harness over files** (adopt + extend, not build; MCP/connectors/plugins).
- **Operate & govern** — maintenance (dedup, re-ingest, dead-link/contradiction lint,
  bi-temporal validity), production eval, cost/observability, provenance/forgetting.
Each module: present the options as candidate solutions with costs (a natural
*Therefore & But*), give decision criteria, then show **how to implement and operate** it.

## Migration approach (evolve, don't rebuild)
- **Source of truth stays `concepts.ts`.** Keep the existing, audited symbolic concepts as
  the *symbolic-KG branch* (one option). **Add** modern branches (RAG/GraphRAG, agentic/
  LLM-wiki, agent-memory, PKM) and **re-anchor `introducedIn`/goals** to the decision/
  lifecycle modules. The skill map, ordering, glossary, panels re-derive for free.
- **Reuse the machinery** (gates, `derive`, `graph`, frontend). The structural floor is
  sound; we are changing the *content set and frame*, not the compiler.
- **Apply the content-craft requirements** (METHODOLOGY §11): concept-before-syntax;
  explain *every* symbol/acronym; PEA show-then-tell; Therefore-&-But arcs;
  per-line confusion-anticipation; non-trivial quiz distractors; ≥1 judged *activity*
  per module for mastery.
- **Apply the neutrality discipline** (§8): a fair menu; the owner's LLM-wiki preference is
  one option fairly costed.
- **Record tension resolutions** (§15): for each big tradeoff (coverage↔skill-focus,
  rigor↔concision, breadth↔implementation-depth) note, per module, how it was resolved.
- **Durable vs perishable** (§13): teach durable concepts; date/quarantine tool specifics.

## Milestones (each ends `npm run check` green + committed)

> ⚠️ STALE-INTERNAL (DOC_AUDIT 2026-06-23, F5): the R1–R5 blocks below read as *future
> to-do*, but the "Execution — vertical slice roadmap" section further down marks **S1–S9
> done**. The two halves disagree on status. Source of truth = the slice roadmap + `CONCERNS.md`;
> these R-blocks need their status reconciled. Decision needed, not yet applied.

### R0 — Scope contract + branch (this doc) — *DONE*
- Rewrote `docs/DOMAIN_COVERAGE.md` for the new scope: a tiered key-ideas syllabus across
  the three paradigms + the decision/lifecycle spine (Tier-A required / B advisory /
  C opt-in non-goal), grounded in `docs/research/`.
- **Ratchet (refinement of the original "let it fail"):** `coverage.ts` keeps the *legacy*
  REQUIRED set so `npm run check` stays **green**; R1 migrates `REQUIRED_CONCEPTS` to the
  new contract **concept-by-concept as each is authored** — never a deliberately-red build
  (honors the "each milestone ends green" standing rule). `coverage.ts` carries a migration
  marker pointing at the new contract.
- **Success:** this plan + the rescoped DOMAIN_COVERAGE exist and define the new Tier-A
  target; `coverage.ts` references the new contract (migration marker); build green.
- **Verify:** plan + coverage doc reviewed; `npm run check` green.

### R1 — New concept-graph spine (the rescope's core)
- Author the decision/lifecycle modules in `concepts.ts`; demote symbolic content to one
  branch; add the modern branches; re-anchor goals to practitioner capabilities.
- **Success:** `npm run check` green on the new graph; R6 coverage = all Tier-A present;
  every concept band/track-tagged; goal closure reaches the new practitioner goals;
  the `#/concepts` view renders the new multi-branch structure (not a single column).
- **Verify:** check green; coverage report all-Tier-A; screenshots show a multi-branch graph.

### R2 — Content-craft pass
- Bring every module to the §11 bar: concept-before-syntax; total symbol/acronym
  explanation; PEA + Therefore-&-But; confusion-anticipation; rewrite quizzes so every
  distractor encodes a real misconception; add ≥1 judged activity per module.
- **Success:** completeness/quiz/craft checks pass (extend the gate where feasible; manual
  rubric where not); a spot-check finds no bare acronym / unexplained symbol / syntax-first
  intro; every module has ≥3 non-trivial quiz items + ≥1 activity.
- **Verify:** the (expanded) gate green; a manual craft-rubric review per module logged.

### R3 — Implement & operate modules (the in-practice layer)
- Author the *plan / implement / operate* content (from `docs/research/` plan-build-operate
  notes): planning a build, framework build paths, day-2 operations.
- **Success:** the lifecycle is complete — each paradigm has decide → plan → implement →
  operate coverage, not just "understand."
- **Verify:** lifecycle coverage check per paradigm; review.

### R4 — Feedback channel (heckle-test)
- Build the per-section in-product feedback sidebar (METHODOLOGY §15 early-signal).
- **Success:** every rendered section can submit a tagged "confusing/boring/wrong/missing"
  note; submissions are captured addressably.
- **Verify:** e2e/screenshot pass exercises the widget on a sample route.

### R5 — Tension resolutions recorded + neutrality audit
- Record per-module tension resolutions (§15); run a neutrality audit (does any paradigm
  get spined/favored?).
- **Success:** a tension-resolution log exists per module for the named forces; an
  independent neutrality pass finds no favored-paradigm tilt (or flags + fixes it).
- **Verify:** the log exists; neutrality audit logged.

## Execution — vertical slice roadmap (per the `design-plan` skill)
The milestones R0–R5 are *thematic phases*; **execution is thin, vertical, risk-ordered
slices** (a milestone like R1 is **not** one step — it is the sequence of module slices
below). Live concern register: `docs/CONCERNS.md` (triaged at every slice boundary).

**Modality split.** *Deductive* (specify + gate): the concept-graph structure, gates,
coverage ratchet, render correctness, quiz/activity presence, lifecycle coverage — we have
the theory (METHODOLOGY) and acceptance (gates). *Exploratory* (instrument + readout):
whether the content actually *lands* (pre-empirical) — readout = the feedback-sidebar
signal + the adversarial craft verdict; and the feedback-sidebar UX itself. Neutrality is
auditable (deductive) but also has an exploratory readout ("does a reader feel pushed?").

**Risk-ordered slice skeleton** (directional; re-plan after each; next 2 specified below):
1. **Retrieve: the decision ladder** — one Foundations module, full vertical, at the new bar.
2. **Feedback sidebar** — the readout instrument for the "does it land" unknown.
3. **Framing / orientation** — three paradigms + PKM↔KG bridge; demote the symbolic-first intro.
4. **Represent decision** — property-graph vs RDF, triple+limits, schema spectrum (OWL/DL → opt-in).
5. **Construct** — LLM extraction + hallucination filtering + entity resolution.
6. **Operate** — maintenance + evaluation (the neglected layer).
7. **Plan/decide** — the requirements→approach meta-skill module.
8. **Whole-graph audit** — neutrality + tension-resolution log + retire orphaned legacy concepts + complete the `coverage.ts` migration.

```
Slice 1 — "Retrieve: the decision ladder" module, end-to-end at the new bar
  advances:        R1 (new spine) — the highest-contrast Foundations module
  vertical scope:  author its concepts in concepts.ts (retrieval-ladder, keyword/BM25,
                   vector-search/embeddings, hybrid+rerank, rag-fundamentals + failure
                   modes, graphrag-local/global, agentic-harness-retrieval, llm-wiki) with
                   prereqs + PREREQ_WHY/KIND; ratchet coverage.ts; a lesson (sb-retrieve)
                   with concept-before-syntax + every-symbol-explained + PEA + Therefore/But,
                   ≥3 misconception-bearing quiz items, ≥1 judged activity; register +
                   render the module
  de-risks:        the core bet — does decision-first + neutral + craft-heavy work
                   end-to-end in the existing machinery (gates / derive / render)?
  success (deductive): npm run check green (coverage ratchet, closure, band-closure);
                   screenshots render the module + concepts (no single-column collapse);
                   spot-check: no bare acronym / unexplained symbol / syntax-first intro;
                   ≥3 nontrivial quiz items + ≥1 activity present
  audit:           adversarial pass trying to break — (a) neutrality (favors a paradigm,
                   esp. LLM-wiki?), (b) craft (any unexplained symbol/acronym; concept-
                   after-syntax?), (c) correctness (RAG/GraphRAG claims; local-vs-global /
                   no-global-view accurate?), (d) closure (forward refs?) → findings to CONCERNS.md
  cleanup:         retire/relocate legacy querying concepts now superseded; no orphaned
                   edges; coverage.ts entries match authored concepts
  done-when:       check green ∧ screenshots clean ∧ audit findings dispositioned ∧
                   cleanup done ∧ CONCERNS.md triaged

Slice 2 — Per-section feedback sidebar (the readout instrument)
  advances:        R4
  vertical scope:  a per-section feedback control in the lesson UI capturing {route,
                   section, tag(confusing|boring|wrong|missing), note}, persisted addressably
  de-risks:        the exploratory "does the content land" unknown — builds the instrument
                   that yields the readout for every later slice; also de-risks the new UI
  success:         (deductive) e2e/screenshot pass exercises the widget on the Slice-1 route;
                   submission captured. (exploratory readout it enables: per-section
                   confusion/boredom signal)
  audit:           submits on every section? leak/collision? a11y? → CONCERNS.md
  cleanup:         add the widget's route(s) to the screenshot harness
  done-when:       check green ∧ widget exercised in e2e ∧ audit dispositioned ∧ register triaged
```

## Relationship to the methodology (dogfood + transfer test)
This rescope is a **partial M5 hostile-transfer test** for the methodology
(`godel-concept-ladder` ROADMAP M5). It stresses the machinery on a domain that is
**plural/contested** (competing paradigms, no single right answer → exercises neutrality)
and **fast-moving/empirical** (→ exercises set/time faithfulness, §13) and **practitioner**
(→ exercises the decide→plan→implement→operate arc, §8). It does **not** exercise move-4
maturity-versioning (no genuine co-constitutive cycle), so it is not a *complete* M5 — a
co-constitutive topic (mechanics) is still owed for that.

## Honest caveats / open risks
- **The gates do not check craft, quiz quality, activities, or neutrality** — these are a
  soft layer (ADR-0008); R2/R5 lean on manual rubric + the feedback loop until detectors
  exist. The rescope can pass `npm run check` and still under-deliver on the §11/§15 bar.
- **Neutrality vs. the owner's preference** is a standing risk; R5's audit is the guard.
- **Pre-empirical** — none of this is validated to teach better (METHODOLOGY §13).
- **Research is point-in-time (June 2026)** and partly directional; date the specifics.
- **Coordination:** this repo was built by another agent; work proceeds on a branch and a
  PR so nothing is silently clobbered.

## Standing rules
- Evolve `concepts.ts`; never hand-edit derived outputs. Each milestone ends green + commit.
- Neutral menu, fairly costed — never spine on a favorite paradigm.
- Concept before syntax; explain every symbol/acronym; non-trivial quizzes; a judged
  activity per module; a confusion-anticipation pass per line.
- Teach durable concepts; date/quarantine perishable tool specifics.
