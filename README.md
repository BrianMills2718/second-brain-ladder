# Second Brain Ladder

**Live:** https://brianmills2718.github.io/second-brain-ladder/ (auto-deploys from
`master` via GitHub Actions → Pages). The hosted site is fully usable — lessons, the
skill tree, the concept graph with a depth selector, deterministic quizzes, progress.
Open-ended capstone grading needs an LLM judge; on the static host it degrades to
self-assess.

An educational site that teaches how to **build a second brain** over knowledge
graphs, ontologies, and neurosymbolic AI — from first principles to the frontier. The
through-line is the field's core category errors: **data ≠ schema**, **provable
(entailment) ≠ true ≠ predicted**, **validation ≠ inference**, **open- vs
closed-world**, **symbolic vs neural**. Keeping those apart is what makes a second
brain queryable *and* trustworthy.

## What's in it
**100 concepts across 17 modules** (20 skill-tree nodes), banded by depth so it's
comprehensive by default but scopeable: Foundations (KGs, querying, modeling,
ontologies + engineering, reasoning) → Practitioner (OWL expressivity, neural,
neurosymbolic, the construction pipeline, LLM-over-KG, evaluation, governance) →
Expert (KG embeddings/link-prediction, reasoning families) → Frontier (GNNs). The
depth selector on `#/concepts` collapses to whatever level you want.

## Architecture — concept graph as source of truth
`src/content/concepts.ts` is the single source of truth (concepts + acyclic,
justified prerequisites + contrasts + depth bands). **Everything else is derived**: the
skill-tree nodes/edges/positions/recommended-path, the glossary, the `#/concepts`
layout, and the per-page concept panels. To change the curriculum you edit
`concepts.ts` (+ a lesson per module); the path follows. See **`docs/SYSTEM.md`**.

The same source-of-truth discipline is enforced by a suite of **gates** so the
curriculum can't silently degrade — richness, module-size, band-closure, domain
coverage, glossary coverage, goal↔achievement alignment, layout-sanity, plus an LLM
**content-correctness** gate that checks every definition against OWL semantics
(open-world + no-unique-names) for the field's classic traps. Full inventory in
`docs/SYSTEM.md`.

## Develop
```bash
npm install
npm run dev            # local dev server
npm run check          # tsc + gate tests + content validator + build (CI runs this)
npm run check-content  # LLM OWL-correctness gate (needs OPENAI_API_KEY / OPENROUTER_API_KEYS)
npm run screenshots    # headless visual pass (puppeteer; mandatory before "UI done")
```
Adding a concept or a module: see the runbook in `docs/SYSTEM.md` §3.

## Docs
- **`docs/SYSTEM.md`** — architecture, the gate inventory, the extend runbook (start here).
- `docs/MACHINERY_NEEDED.md` — the discovered requirements + findings history (the *why*).
- `docs/PATH_DERIVATION.md` — deriving the learning path from the concept graph.
- `docs/DOMAIN_COVERAGE.md` — the coverage contract (key-ideas syllabus, depth bands).
- `CLAUDE.md` — operating instructions for agents/contributors in this repo.
