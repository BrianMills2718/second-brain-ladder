# second-brain-ladder — project instructions

Educational site teaching knowledge graphs / second-brain modeling: RDF, ontologies,
OWL/description-logic, reasoning, identity, neural KG (embeddings/GNNs), and
neurosymbolic construction. Core mission: **prevent category errors** — make the
distinctions visible that learners conflate:

- **OWA vs CWA** — absence means *unknown*, not *false*.
- **inference vs validation** — a reasoner *entails* / flags inconsistency; SHACL
  *validates* / rejects. Never attribute rejection to the reasoner.
- **no-unique-names** — two differently-*named* individuals may be inferred `sameAs`;
  only known-distinct values (e.g. distinct literals) are a contradiction.
- **schema-valid ≠ semantically true** — well-formed/valid JSON or a parsed triple
  can still be false; entailment ≠ assertion ≠ validation.

It is **not** a generic "knowledge graph explainer." Math/semantic correctness under
OWL 2 (OWA + no-UNA) **is the product** — a subtle content error is a critical bug.

> This repo shares its machinery lineage with `godel-concept-ladder`. If you find a
> doc that still describes Gödel (60 concepts, math-correctness, a FastAPI judge),
> it is stale — this project is 100 concepts about knowledge graphs.

## Architecture (current state)
The **concept graph is the source of truth**; everything else is derived.
- **`src/content/concepts.ts`** — 100 concepts across 17 modules. Each has an `id`,
  `term`, `layer`, `band` (foundations/practitioner/expert/frontier), `short`/`example`
  prose (with `@c{}`/`@n{}`/`@t{}` chips), an **acyclic** `prerequisites` list, optional
  `contrasts`, an `introducedIn` module, and optional `microQuiz`. Every prerequisite
  edge **must** have a `PREREQ_WHY` justification + a `PREREQ_KIND` (the two side-tables
  at the bottom of the file).
- **`src/content/derive.ts`** — SCC linter + `deriveStageEdges` + `transitiveReduction`
  + `GOAL_CONCEPTS`.
- **`src/content/graph.ts`** — the skill map. Its concept→concept prerequisite edges,
  **one node per module**, node positions, and path slots are all **derived** from
  (concept graph + module set); only the achievement capstones (+ one orientation link)
  are a hand-authored overlay. See `docs/PATH_DERIVATION.md` (R14).
- **`glossary.ts` / `conceptLayout.ts` / per-stage panels** — derived from concepts.ts.
- **`assessments.ts`** — capstone rubrics + deterministic items + fatal misconceptions
  (authored overlay, aligned to `GOAL_CONCEPTS` by the goal→achievement gate).
- **Frontend** (static Vite/React/TS, KaTeX, React Flow): skill-tree homepage,
  `#/concepts` graph view with a **depth-band selector** (R13), per-stage panels with
  `@c{}` drill-down, lessons (prose/quiz/viz).
- **Judge:** `src/lib/judge.ts` is a *client* that POSTs `{taskId, answer}` to a backend
  at `VITE_JUDGE_URL` (default `localhost:8000`). **That backend is not in this repo**
  (carried from godel); when unreachable, grading degrades to deterministic +
  self-attest — never a silent pass. The semantic-correctness machinery that *is* in
  this repo is the R10 eval below, not this judge.
- To change the curriculum, **edit `concepts.ts` (+ lessons), never the derived graph
  nodes/positions.**

## Gates — what robustness is enforced, where (see `docs/SYSTEM.md` §2 for the table)
- **`npm run check`** = `tsc -b --noEmit && test-gates && validate-content && vite build`.
  This is the **enforced structural floor** and runs in CI as a deploy blocker
  (`.github/workflows/deploy.yml`). It FAILs on: DAG/closure invariants, edge
  justification, contrast symmetry, stage banding, lesson structure, richness (R1),
  module-size (R14), band-closure (R13), glossary coverage (R4), domain coverage (R6),
  goal→achievement (R9), stage↔node parity, layout-sanity (R11). `test-gates.mjs` proves
  the gates that *have* a negative fixture actually FAIL it.
- **`npm run check-content`** — the R10 OWL-semantics-trap eval
  (`check-content-correctness.mjs`): an LLM judge that traces entailments under OWA +
  no-UNA and hunts 5 named traps (owa-as-cwa, no-unique-names, inference-vs-validation,
  vacuous-truth-not-owa, axiom-direction). Frozen calibration set + self-consistency
  (2-of-3, fails only on a stable "wrong"; "misleading" is advisory). **Needs an API key**
  (`OPENAI_API_KEY` or `OPENROUTER_API_KEYS`); skips green without one.
- **`npm run screenshots`** — headless visual pass over **every** route (puppeteer,
  `--disable-dev-shm-usage` on WSL). Mandatory before declaring UI done; it has caught
  render bugs the gates cannot.

## Honest status (read before trusting a green check)
- **Enforced:** the deterministic structural floor (above), in CI, blocking deploy.
- **Advisory / not enforced:** R10 content-correctness is `continue-on-error` in CI,
  `deploy` does not depend on it, and it is **dormant until a key secret is set**. It is
  a calibrated *tool*, not a blocking gate today. Richness (R1) is a degeneracy
  **tripwire** (real-graph margins 3–7×), not a quality lever. `prereqMinimality` /
  `layerConsistency` lints are computed but not gated. Some FAIL gates lack a negative
  fixture; stage↔node parity is near-tautological (nodes are derived from lessons).
- **Unbuilt:** the R5 **propose→gate→revise generation loop** (`docs/MACHINERY_NEEDED.md`
  R5). All content to date is hand-authored *against* the gates; the generator that
  would use them does not exist. This is the project's actual deliverable.

## Non-negotiables
- **Semantic correctness is the product.** Every `short`/`example`/code block must be
  literally true under OWL 2 (OWA + no-UNA). Inconsistency is a property of an *axiom
  set*, never a single triple. Domain types the *subject*, range the *object*.
- **No forward references (prerequisite closure).** Every `@c{X}` in a definition must be
  a transitive prerequisite; `@t{}`/`@n{}` must resolve and not forward-reference.
  Enforced by `validate-content.mjs`.
- **Concept graph invariants** (all gated): `prerequisites` acyclic (a cycle is a
  decomposition error — resolve by naming a primitive, recognizing a well-founded
  inductive definition, reclassifying a contrast, or splitting maturity versions); every
  edge has `PREREQ_WHY` + `PREREQ_KIND`; group-lifted graph acyclic; `contrasts` resolve
  and are symmetric; `band` ≥ every prerequisite's band; `introducedIn` stage ≥ each
  prereq's.
- **Verify by running it.** `npm run check` (green) + `npm run check-content` (no "wrong")
  + `npm run screenshots`. Treat any learner input to the judge as untrusted.

## Doc map
| Doc | Role |
|---|---|
| `docs/SYSTEM.md` | architecture, gate inventory, extend runbook (the durable reference) |
| `docs/MACHINERY_NEEDED.md` | requirements & findings history (R1–R14 + pain log) — the *why* |
| `docs/PATH_DERIVATION.md` | R14: deriving the skill path from the graph |
| `docs/DOMAIN_COVERAGE.md` | the coverage contract (tiered key-ideas syllabus, depth bands) |
| `docs/OVERNIGHT_MISSION.md` | archival session log (historical) |
