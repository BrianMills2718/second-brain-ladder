# Deriving the learning path from the concept graph (a generalizable methodology)

**Status:** methodology (R14). Implemented incrementally; see the Definition-of-Done
in MACHINERY_NEEDED.md.

## The problem this solves
The concept graph is the source of truth (ADR-0003). The learner-facing **path** —
the skill-tree nodes, their order, their positions, the per-page concept panels — was
hand-authored *alongside* it. So when the concept graph grew 5× (11 → 64 concepts),
the path did not: it stayed 6 pages, three of them holding 17 concepts each, while the
graph view showed all 64. That is drift, and it is the same failure family as every
other hand-vs-derived gap in this project (staging, bands, goal/sink): **anything
hand-maintained in parallel with the source of truth will diverge from it.**

The fix is not "split three pages once." It is to make the path a **derived view** of
the concept graph, governed by gates, so it *stays* in sync and *scales* as the graph
grows — for this curriculum and any future one.

## Principle: the path is a pure function of (concept graph + a thin module manifest)
```
path, skill-tree nodes, node edges, positions, concept panels
        =  f( concept graph , module manifest )
```
- **Concept graph** (source of truth): concepts, prerequisites, bands, contrasts.
- **Module manifest** (thin, human-authored taste): an *ordered* list of modules, each
  a `{ id, title, band }`. A concept names its module via `introducedIn`. The manifest
  carries the two things a machine should *not* invent — **what to call a module** and
  **the pedagogical order/grouping** — and nothing else.
- **Everything else is derived**, never hand-wired:
  - skill-tree **node per module** (1:1 with the manifest);
  - node→node **prerequisite edges** = transitive-reduced lift of concept edges to
    modules (already done by `deriveStageEdges`);
  - **positions** = a topological auto-layout (depth = x, order within depth = y), not
    hand-placed pixels;
  - **recommended path** = a topological order of the module DAG;
  - per-module **concept panel** = concepts whose `introducedIn` = that module,
    band-grouped.

A "module" is the unit of a page *and* a path step. It is deliberately finer than the
old "stage": ~4–9 concepts, one digestible page, one node on the path.

## What makes it robust + high quality (the gates)
The manifest is cheap to get wrong, so the system enforces that it is a **well-formed
partition** of the graph. These are the R14 gates (in `gates.mjs` / `validate-content.mjs`):

| Invariant | Rule | On violation |
|---|---|---|
| **Partition completeness** | every concept's `introducedIn` is a real module; every module non-empty | FAIL |
| **Module size** | `MIN ≤ |module| ≤ MAX` (default 3–9) — a 17-concept page can't exist | FAIL (forces a split; the "make the dense path fail" principle) |
| **Cohesion** | a module's concepts are connected via intra-module edges or shared prerequisites | WARN (a grab-bag module is a smell, not always a bug) |
| **Order is a valid topology** | the module DAG (lifted edges) is acyclic AND the declared order is one of its topological orders | FAIL |
| **Band monotonicity** | a module's band ≥ each prerequisite module's band (depth never decreases along the path) | FAIL |
| **Derivation parity** | the skill-tree nodes equal the modules (no hand-added/missing node); positions come from the layout pass, not literals | FAIL (this is the stage↔node parity gate, generalized) |

The existing quality gates (richness R1, coverage R6, correctness R10, glossary R4)
then run **per the whole graph**, and the size/cohesion gates run **per module** — so
a page can't silently become a 17-concept dump *or* a 1-concept stub.

## Division of labor (programmatic / agent / human — the project's standing rule)
- **Human** authors the *manifest only*: module titles, bands, and order — taste and
  naming, which a machine shouldn't fabricate. Assigning a concept to a module
  (`introducedIn`) is also human, but gated.
- **Programmatic** derives all structure (nodes, edges, positions, path, panels) and
  enforces the partition invariants. No structure is hand-wired.
- **Agents** generate the per-module lesson *prose* (sections, quizzes, confusions,
  viz) from the module's concepts, gated by the content checks (R2, R10).

This is exactly "programmatic for coverage + agent for judgment + human for direction":
the human points (titles/order), the machine guarantees the shape, agents fill content.

## Robustness properties this buys
1. **No drift** — the path is recomputed from the graph every build; it can't lag.
2. **Scales** — adding concepts grows the *number of modules* (more path steps), not
   the *density of a page*; the size gate forces that.
3. **Add-a-module is one edit** — name it in the manifest + tag its concepts; the node,
   edges, position, path slot, and panel all derive. (Removes the old 6-file tax.)
4. **Reorder safely** — the order gate rejects a sequence that violates a prerequisite.
5. **Self-correcting density** — an overloaded page fails CI, so the curriculum is
   *pushed* toward well-sized modules instead of accreting into mega-pages.

## Implementation plan (incremental, each step green)
1. **Module-size gate** (R14) — FAIL on a module outside 3–9 concepts. This immediately
   fails the three 17-concept stages, *forcing* the split (encodes the intent in CI).
2. **Derive skill-tree nodes from the module set** — `graph.ts` stops hand-authoring
   `concept(...)` nodes and positions; it generates one node per lesson/module and
   auto-lays-out positions. Achievements stay authored (they carry assessment refs) but
   are also auto-positioned relative to their prerequisite modules.
3. **Split the dense stages into modules** — re-tag concepts' `introducedIn`, add the
   new lesson pages (prose + quizzes + viz), reorder. Because of step 2 this needs *no*
   `graph.ts` node wiring — the nodes derive.
4. **Band-monotonicity + cohesion gates** — finish the R14 invariant set.

The end state: the recommended path is a faithful, well-paced projection of the concept
graph that grows with it, and "the path looks light" becomes impossible — a thin path
over a rich graph fails the size/partition gates the same way a thin graph fails
richness.
