# System reference — how it works, what's enforced, how to extend

The durable reference for second-brain-ladder. For the *why* (the discovered
requirements + findings history) see `MACHINERY_NEEDED.md`; this doc is the *what is*
and *how to*. Current size: **100 concepts / 17 modules / 20 skill nodes** (counts are
not hand-maintained elsewhere — run `npm run check`, which prints them).

---

## 1. Architecture: one source of truth, everything else derived
```
concepts.ts  ──┬─▶ graph.ts (skill tree: nodes, edges, positions, path)   [derived]
 (SOURCE OF    ├─▶ glossary.ts (entries)                                   [derived]
  TRUTH)       ├─▶ conceptLayout.ts (#/concepts layout)                    [derived]
               └─▶ per-stage concept panels                               [derived]
lessons/*      ──▶ module pages (prose/quiz/viz)        [authored, one per module]
assessments.ts ──▶ capstones (LLM-judge + deterministic) [authored overlay]
```
- **`src/content/concepts.ts`** is the single source of truth: each concept has an id,
  term, `layer`, `band`, `short`/`example` (with `@c{}`/`@n{}`/`@t{}` chips), an
  **acyclic** `prerequisites` list, optional `contrasts`, an `introducedIn` (its
  module), and optional `microQuiz`. Every prerequisite edge has a `PREREQ_WHY`
  justification + a `PREREQ_KIND` (the two side-tables at the bottom of the file).
- **Module = page = path step.** A concept's `introducedIn` names its module; one
  lesson file per module. The skill-tree node, its position, its prerequisite edges,
  the recommended-path slot, and the concept panel are all **derived** from
  (concept graph + module set) — see `PATH_DERIVATION.md` (R14). Only the achievement
  capstones are a hand-authored overlay.
- **Depth bands** (`Concept.band`: foundations / practitioner / expert / frontier) make
  the curriculum comprehensive-by-default but scopeable: the depth selector on
  `#/concepts` collapses to a band, and each band is a closed sub-curriculum (gated).

**The rule:** to change the curriculum, edit `concepts.ts` (+ lessons). Never
hand-edit the derived skill-graph nodes/positions.

---

## 2. The gate inventory (what robustness is enforced, where, how)
Run all deterministic gates: **`npm run check`** (`tsc --noEmit` → `test-gates` →
`validate-content` → `vite build`). Run the semantic gate: **`npm run check-content`**
(needs an API key). CI (`.github/workflows/deploy.yml`) runs `npm run check` on every
push/PR (blocks deploy on failure) + `check-content` when a key secret is set.

| Gate | Enforces | FAIL/WARN | Where | Req |
|---|---|---|---|---|
| DAG invariants | acyclic prereqs; group-lift acyclic; prereqs resolve; primitives are atoms | FAIL | validate-content.mjs | — |
| Definition closure | every `@c{X}` in a def is a transitive prerequisite | FAIL | validate-content.mjs | — |
| Reference closure | `@t{}`/`@n{}` resolve; no forward references | FAIL | validate-content.mjs | — |
| Edge justification | every edge has `PREREQ_WHY` + valid `PREREQ_KIND`; no orphans | FAIL | validate-content.mjs | R3 |
| Contrast integrity | contrasts resolve + are symmetric | FAIL | validate-content.mjs | R7 |
| Stage banding | a prereq's stage ≤ the concept's stage | FAIL | validate-content.mjs | R8 |
| Lesson structure | ≥3 quiz, ≥2 confusions, ≥1 viz w/ textualSummary, mastery | FAIL | validate-content.mjs | R2 |
| **Richness** | hubs / hard-ideas / contrast-density / depth-vs-width thresholds | FAIL¹ | gates.mjs · test-gates.mjs | R1 |
| **Module size** | a page holds ≤9 concepts (no dumps) | FAIL | gates.mjs | R14 |
| **Band closure** | no concept shallower than a prerequisite | FAIL | gates.mjs | R13 |
| **Glossary coverage** | every concept term has a glossary entry | FAIL | gates.mjs (glossary derived) | R4 |
| **Domain coverage** | every Tier-A key idea exists; deferred listed | FAIL | coverage.ts | R6 |
| **Goal→achievement** | every declared goal is assessed by some capstone | FAIL | validate-content.mjs | R9 |
| **Stage↔node parity** | every module has exactly one skill node | FAIL | validate-content.mjs | R10/R14 |
| **Layout sanity** | the `#/concepts` view can't render collapsed (stages separated) | FAIL² | conceptLayout.ts · test-gates.mjs | R11 |
| Structural lints | prose-forward-ref · contrast-staging · goal/sink-drift | WARN | gates.mjs | R12 |
| **Content correctness** | each definition/example is true under OWL (OWA + no-UNA), probing 5 traps | FAIL-on-wrong³ | check-content-correctness.mjs | R10 |

¹ Richness is a **tripwire** (large margins on a real graph) — it catches a degenerate
collapse, not incremental quality. The frozen `fixtures/thin-graph.mjs` proves it fails
a thin chain. ² Layout-sanity catches a *collapse*, not a valid-but-scrambled order
(no ground truth beyond `lesson.stage`). ³ The LLM judge: frozen calibration set is the
deterministic regression gate; `--all` runs every concept with self-consistency
(2-of-3) and fails only on a stable "wrong"; "misleading" is advisory review.

---

## 3. Runbook — extending the curriculum
**Add a concept** (1 file):
1. Add the object to `CONCEPTS` in `concepts.ts`: `{ id, term, layer, band?, short,
   example?, prerequisites, contrasts?, introducedIn, microQuiz? }`.
2. For **each** prerequisite, add `"<id>><prereq>"` to **both** `PREREQ_WHY` and
   `PREREQ_KIND` (kinds: is-a/part-of/defined-via/operates-on/refines/assumes).
3. Every `@c{X}` you write in `short`/`example` must be a (transitive) prerequisite.
   `band` must be ≥ every prerequisite's band. `introducedIn`'s stage ≥ each prereq's.
4. `npm run check` (structure) then `npm run check-content` (OWL correctness).

**Add a module/page** (no skill-graph wiring needed — it derives):
1. Add a lesson file `src/content/lessons/sb-<id>.ts` with the full `Lesson` shape
   (id, **stage** = next integer, no gaps; title; summary; prerequisites; objectives;
   sections; ≥1 visualization; ≥2 confusions; ≥3 quiz; masteryCheckpoint).
2. Register it in `lessons/index.ts` (stage order).
3. Tag its concepts' `introducedIn` to `sb-<id>`. Keep each module ≤9 concepts.
4. Add `sb-<id>` → a branch in the `BRANCH` map in `graph.ts` (cosmetic colour).
5. `npm run check`. The node, position, path slot, and concept panel all derive.

**Add a goal/capstone:** add the achievement to `achievementDefs` in `graph.ts` (id,
title, assessmentIds, prereq module nodes) + the assessment in `assessments.ts`
(rubric + deterministic + fatal misconceptions); declare the goal concept in
`GOAL_CONCEPTS` (derive.ts) — the goal→achievement gate enforces alignment.

**Mandatory before "done":** `npm run check` green, `npm run check-content` clean
(no "wrong"), and the headless visual pass `npm run screenshots` (all routes;
eyeball legibility — it has caught render bugs the gates can't).

---

## 4. Doc map (where each thing lives)
| Doc | Role |
|---|---|
| `README.md` | project entry point (what/why, live URL, quickstart) |
| `docs/SYSTEM.md` | **this** — architecture, gate inventory, runbook (the durable reference) |
| `docs/MACHINERY_NEEDED.md` | requirements & findings history (R1–R14 + pain log) — the *why* |
| `docs/PATH_DERIVATION.md` | R14 methodology: deriving the path from the graph |
| `docs/DOMAIN_COVERAGE.md` | the coverage contract (key-ideas syllabus, depth bands) |
| `docs/OVERNIGHT_MISSION.md` | archival session log (historical; not a live spec) |
| `CLAUDE.md` | agent/contributor operating instructions for this repo |
