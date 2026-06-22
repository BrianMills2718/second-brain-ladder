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
