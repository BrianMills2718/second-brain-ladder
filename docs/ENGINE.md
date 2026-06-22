# The Ladder Engine — one repo, any goal

**Status:** founding design. The target: collapse the three forked sites
(godel-concept-ladder, category-ladder, second-brain-ladder) into **one reusable
engine** that builds, gates, and serves a curriculum from data — and, long-term,
**generates** that curriculum for *any* learning goal. A "Wikipedia for any goal":
give it a goal, get back a complete, navigable, quality-gated learning structure.

This generalizes what this repo already proved: **the concept graph is the source of
truth, everything else derives, and a gate suite guarantees quality.** The only new
ideas are (1) separate *engine* (code) from *curriculum* (data) so one engine serves
many goals, and (2) add a *generator* that produces a curriculum and lets the gates
make that generation trustworthy.

---

## 1. The core split: engine (code) vs curriculum (data)
Today each site duplicates the framework. The engine inverts that: the framework is
written once; each goal is a data package the engine consumes.

```
ladder/                         ← ONE repo (the engine)
  core/        concept-graph model + derivations (path, layout, glossary, panels)
  gates/       validator + gates.mjs (richness, module-size, band-closure, coverage,
               glossary, layout-sanity, parity) + check-content-correctness (R10)
  app/         the React/Vite renderer — parameterized by a loaded curriculum
  generator/   goal → curriculum (the agentic propose→gate→revise loop, R5)
  judge/       LLM assessment backend (the achievement grader)
  curricula/   the goal data packages (or each its own repo; see §5)
    godel/  category-theory/  second-brain/  <any-goal>/
```

A **curriculum** is everything goal-specific, behind one interface (§3): the concept
graph, the lessons, the coverage contract, and a small domain config (the running
example, the category errors to prevent, the goal statement). The engine builds,
gates, renders, and (optionally) generates any curriculum. Nothing goal-specific lives
in engine code; nothing engine-specific lives in a curriculum.

---

## 2. What the engine guarantees (the gates travel with it)
The whole point of putting the gates in the engine: **any** curriculum — hand-authored
or generated — is held to the same bar. The full inventory is in `SYSTEM.md` §2;
re-stated here as engine guarantees that hold for every goal:
- **Structure:** acyclic justified prerequisites; definition/reference closure; stage
  banding; lesson completeness.
- **Richness & shape:** not-a-thin-chain (R1); pages ≤ N concepts (module-size, R14);
  depth bands closed (R13); path derived, not drifted (parity, R14).
- **Coverage:** every declared key idea exists (R6); every term has a glossary entry (R4).
- **Correctness:** every definition/example true under the domain's semantics (R10 —
  for KG/logic curricula, the OWL/OWA/no-UNA trap eval; pluggable per domain, see §4).
- **Fidelity:** the rendered page actually shows the structure (layout-sanity, R11) and
  every route is visually checked.

These are why generation can be trusted: the generator proposes, the gates reject, the
loop revises until green. **A curriculum that fails a gate is not shippable**, whether a
human or an LLM wrote it.

---

## 3. The curriculum interface (the pluggable boundary)
A curriculum package exports a typed object the engine consumes. Strawman:
```ts
interface Curriculum {
  goal: { id, title, statement, livesAt? }          // what this teaches; deploy target
  domain: {
    runningExample: string                          // the fixed cast (e.g. PA / Ada / a category)
    categoryErrors: Contrast[]                       // the distinctions the goal must keep apart
    correctnessProfile: "owl" | "math" | "none" | …  // which R10 trap-set applies (§4)
    bands: Band[]                                     // depth ladder for this domain
  }
  concepts: Concept[]                                // the source of truth (+ PREREQ_WHY/KIND)
  modules: ModuleManifest                            // titles + order + which concepts (R14)
  lessons: Lesson[]                                  // one per module
  goals: GoalConcept[]; achievements: Achievement[]  // capstones (R9)
  coverage: { required: string[]; deferred: {…}[] }  // the R6 contract
}
```
The engine validates this against every gate, derives the skill tree/path/layout/
glossary, and renders it. **`concepts.ts` etc. stop being code and become this data.**

---

## 4. Making correctness pluggable per domain
R10 (content correctness) is domain-specific: KG/ontology curricula need the OWL
open-world / no-unique-names trap checklist; a math curriculum needs proof-vs-truth /
quantifier-scope traps; a programming curriculum needs different ones. So the engine
ships a **correctness-profile registry**: each profile is a system prompt + a named
trap checklist + a frozen calibration set (the proven-defects regression set). A
curriculum names its profile; the R10 eval loads it. This keeps the eval rigorous and
calibrated per domain instead of one-size-fits-all. (The current OWL profile and its
frozen `r10-cases.mjs` become the first registered profile.)

---

## 5. The generator — the heart of "Wikipedia for any goal" (R5)
Given a **goal** (+ optional authoritative sources), produce a gated curriculum:
1. **Scope** — derive the domain's key-idea map (seed coverage from sources / an expert
   syllabus; this is the R6 contract for the goal).
2. **Concepts** — propose concepts + definitions + examples; build the prerequisite DAG;
   write `PREREQ_WHY`/`KIND`. (Fan out; dedup; this is where most volume is.)
3. **Partition** — cluster into modules (R14) and assign depth bands; derive the path.
4. **Lessons & assessments** — generate prose/quiz/viz per module; capstones per goal.
5. **GATE** — run the full suite (structure + richness + coverage + R10 correctness +
   layout). Every failure is specific and localized.
6. **Revise** — fix flagged items; loop until green (loop-until-dry / budget).
7. **Curate** — a human supplies taste (titles, ordering, final review); the gates
   guarantee the floor, the human supplies the ceiling.

The division of labor is the project's standing rule: **programmatic** for coverage +
enforcement, **agents** for generation + judgment, **human** for direction + taste. The
gates are what let step 6 run autonomously without shipping garbage — the same gates
that caught my own hand-authoring errors all session.

---

## 6. Migration plan (3 forks → 1 engine + 3 curricula)
Incremental, each step shippable:
1. **Define the `Curriculum` interface** (§3) in the engine; make the renderer + gates
   read from a loaded curriculum instead of importing `src/content/*` directly.
2. **Extract the engine** from second-brain-ladder (the most advanced fork): `core/`,
   `gates/`, `app/`, `judge/` (port godel's backend). This becomes `ladder/`.
3. **Port second-brain as the first curriculum** (`curricula/second-brain/`) — mostly
   moving `src/content/*` behind the interface. Verify gates + render unchanged.
4. **Port godel and category-theory** as curricula. category-theory must first adopt the
   concept-graph-as-source-of-truth architecture (it's still the older linear-stage
   variant) — itself a good test that the engine generalizes.
5. **Register correctness profiles** (§4): OWL (exists), math (for godel/CT).
6. **Build the generator** (§5) against the gate suite. First milestone: regenerate an
   *existing* curriculum from its goal + sources and check it passes the same gates
   (the curricula are the generator's eval set).
7. **Multi-curriculum hosting:** a deploy per goal, or one shell with goal selection.

---

## 7. Open decisions (for review)
- **Repo name & home:** `ladder` (the three sites are all "…-ladder")? New repo vs.
  evolving second-brain-ladder in place. New repo is cleaner; pick before step 2.
- **Curricula in-repo vs. own repos:** a monorepo `curricula/` is simplest to gate
  together; separate repos scale to many goals but complicate cross-cutting gate runs.
  Recommend in-repo until there are >~5 goals.
- **Curriculum format:** keep `.ts` (type-safe, current) or move to JSON/YAML so the
  generator emits data, not code. Recommend a typed JSON the engine validates — the
  generator should emit data, and `.ts` curricula can compile to it.
- **Correctness for arbitrary domains:** R10 needs a calibrated trap-set + frozen cases
  per domain. For a brand-new goal with no profile, the generator must *also* propose
  the correctness profile (and a human must vet it) — the riskiest open problem.

The honest bottom line: the engine and its gates are ~80% present in second-brain-ladder
already; the new work is (a) the engine/curriculum *boundary*, (b) the per-domain
*correctness profiles*, and (c) the *generator*. (c) is the moonshot; (a)+(b) are a
bounded refactor that immediately pays off by de-duplicating the three sites.
