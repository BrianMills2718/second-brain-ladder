# Handoff — Second Brain rescope (for a parallel agent)

**Date:** 2026-06-22. **Author:** Claude Code (the "rescope" agent). **Purpose:** hand off
the content/curriculum work so another agent can continue in parallel without colliding.

## TL;DR
I rescoped this curriculum off the 2018 symbolic-KG framing onto a **learner-empowerment,
decision-first** one (three paradigms as a neutral menu; modern spine early), built two new
modern modules + a feedback sidebar, and craft-rewrote **one** legacy page. **The structural
rescope is largely done; the *pedagogy/craft* pass is barely started** — that's the biggest
open gap, and it's the actual product quality the owner cares about.

## 1. State / where to look
- **`master` is current**, deployed at https://brianmills2718.github.io/second-brain-ladder/ ;
  `npm run check` is green. **Source of truth = `src/content/concepts.ts` (+ `lessons/*`)**;
  the skill tree, `#/concepts` map, glossary, path all DERIVE — never hand-edit derived output.
- **Curriculum order now (19 stages):** 0 orientation · 1 kg · **2 embeddings/extraction/identity ·
  3 retrieve(decision ladder) · 4 framing(three paradigms)** · 5 query · 6 modeling · 7 onto ·
  8 onto-eng · 9 reasoning · 10 expressivity · 11 neurosymbolic … 18 gnn. (Modern spine = 2–4,
  ahead of the symbolic depth = 5–10.)
- **Durable docs:** `docs/RESCOPE_PLAN.md` (plan + vertical-slice roadmap), `docs/CONCERNS.md`
  (the **live gap register, C1–C20** — read this), `docs/DOMAIN_COVERAGE.md` (rescoped coverage
  contract; `coverage.ts` is its machine form). Methodology theory + the **craft bar** live in
  the sibling `godel-concept-ladder` repo: `METHODOLOGY.md` §8/§11/§13/§15 + `docs/ADR-0008`.
- **Open PRs (not yet on master), worth merging:** **#1** = 2 OWL content fixes +
  rewrote the wrong-project `CLAUDE.md`; **#2** = 17 research notes in `docs/research/` (the
  modern KG/GraphRAG/LLM-wiki/agentic landscape — the evidence base for the rescope).

## 2. What's DONE
- **Structure:** modern decision spine moved ahead of the symbolic depth; symbolic demoted
  from "the foundation" to "one option." New modules `sb-retrieve` (retrieval decision ladder:
  keyword→vector→hybrid→RAG→GraphRAG→agentic→LLM-wiki, neutral) and `sb-framing` (three
  paradigms + the PKM↔KG bridge). Per-section **feedback sidebar** (💬) live. Coverage contract
  rescoped.
- **Craft:** **one** page craft-passed — `sb-kg` (Knowledge Graphs): concept-before-syntax,
  every Turtle/Cypher symbol explained, the `(s,p,o)` and "can't-reason-over-property-graphs"
  overclaims fixed, real misconception quizzes + a build activity; `iri`/`triple`/
  `knowledge-graph`/`property-graph` concept defs fixed too.

## 3. KNOWN GAPS (explicit, prioritized) — start here

**G1 — the full craft bar (the three deepest principles, godel `METHODOLOGY.md` §11, after
N. Case).** Beyond the mechanical layer (explain-every-symbol, concept-before-syntax, real
quizzes) a page must also: **(a) "show what made you care"** (open with a hook, not a
definition); **(b) PEA — picture/analogy FIRST** (lead with a concrete image, then name the
parts); **(c) Therefore & But** (a problem→solution tension chain, not a listicle). These are
*soft* — no gate enforces them.
  - ✅ **`sb-kg` now meets the FULL bar** and is the **template** — see **`docs/CRAFT_PATTERN.md`**
    (hook → detective-evidence-board analogy → Therefore/But spine). Copy its shape.
  - ⚠️ **`sb-retrieve` and `sb-framing` meet only the mechanical floor** — retrofit them to the
    pattern (they open with definitions; PEA/hook are weak).
  - ❌ **Legacy pages (stages 5–18) + orientation: no craft pass at all.**
  (Owner has NOT yet signed off on the craft "voice" — e.g. the detective-board analogy style —
  so confirm the voice on `sb-kg` before propagating it across every page.)

**G2 — the legacy pages have had NO craft pass.** Stages 5–18 (query, modeling, onto, onto-eng,
reasoning, expressivity, neurosymbolic, construction, llm-kg, kgml, eval, reasoning-adv,
governance, gnn) **and orientation (stage 0, still symbolic-first)** still carry the *original*
defects: unexplained syntax, syntax-first, trivial quizzes, no activities, content overclaims.

**G3 — missing modern content modules:** Construct, Operate, Plan/decide (the rest of the
decide→plan→implement→operate lifecycle the rescope frame calls for).

**G4 — C18:** `sb-neural` (stage 2) bundles the LLM/embedding *basics* with advanced
identity/KG-ML concepts (`kg-embedding`, `entity-resolution`) — owe a basics/identity split.

**G5 — C20:** the re-sequence left **advisory prose-forward-refs** (modern modules mention
symbolic concepts introduced later — Cypher, query, validation, subclass, TransE). Build is
green; resolve by introducing those naming-concepts earlier, or softening prose.

**G6 — C1:** no whole-graph **neutrality audit** yet (does any paradigm get favored? the owner's
LLM-wiki preference must stay one option, fairly costed).

**G7 — gate gaps found:** lesson-level `prerequisites` ordering and lesson-prose `@c{}` stage
are **not** validated (a reorder silently created a forward-ref that all gates missed). Worth
adding deterministic checks. Also: the `Lesson` schema has **no activity type** — judged
"activities" are currently faked as `fill-in` quizzes (C12).

## 4. Coordination (don't collide)
- **`docs/ENGINE.md`** (the parallel founding design = "one engine, curriculum-as-data,
  generate any goal") and my work are **complementary**: my output is the **second-brain
  *curriculum* content** (`concepts.ts` + lessons) — exactly the "curriculum as data" the engine
  will consume. It is **not** engine code. **If you're refactoring `src/content/*` into a
  `Curriculum` package, coordinate the cut** — we should not both be rewriting `src/content/*`
  simultaneously. Easiest split: one agent owns the engine refactor + the data interface; the
  other owns curriculum content/craft.
- **Process discipline:** keep `npm run check` green on every change; commit each increment;
  log gaps/decisions to `docs/CONCERNS.md` (the live register); audit changes adversarially
  (independent review, not self-review — it caught real bugs the gates missed this session).
- **Deploy:** GitHub Pages deploys from `master`; merging a PR to `master` deploys it.
