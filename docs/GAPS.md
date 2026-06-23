# GAPS — the methodical register of what we need to improve

One organized place for **every known gap** across the whole effort (engine + gates +
craft + content + validation), so improvement is planned, not ad-hoc. Each gap: **what /
why it matters / improvement path / status**. The rescope's *live, per-slice* register is
`CONCERNS.md` (C1–C20); this doc is the **durable, categorized** view and the home for
cross-project/engine gaps. Design source: `ENGINE.md`; methodology: godel `METHODOLOGY.md`.

**Legend — status:** 🔴 not started · 🟡 partial/in progress · 🟢 done · 🔵 designed, unbuilt.

---

## A. Gate gaps — the gates don't yet enforce what they should
The headline finding of the whole effort: **the gates enforce *structure*, not *quality or
truth*.** Several are weaker than they look. Most of these are *buildable* (esp. via
LLM-judged gates) — the point of this section is to enumerate them so we build them.

| # | Gap | Why it matters | Improvement path | Status |
|---|---|---|---|---|
| A1 | **Craft "soul" is not gated** — hook / picture-first / Therefore-&-But (`CRAFT_PATTERN.md`) are unchecked; I hand-fixed exactly what gates miss. | Generated *and* hand-authored pages can pass every gate and still be flat. This is the #1 risk for "generate any goal **at quality**." | **Buildable — an LLM-judged "craft gate"**: grade a page against `CRAFT_PATTERN.md` (does it open with a hook? lead with a picture/analogy? run a Therefore/But spine?) with a **frozen calibration set + self-consistency + propose→gate→revise iteration** — same shape as the R10 correctness judge. *Not a fundamental limit; just unbuilt.* | 🔵 |
| A2 | **R10 content-correctness gate is dormant/non-blocking** — `continue-on-error`, needs a key secret, skips green without one. | The flagship correctness gate gates nothing today. | Make the frozen-calibration regression **blocking**; keep `--all` advisory; add per-domain profiles (see B3). | 🟡 |
| A3 | **Richness (R1) is a degeneracy tripwire**, not a quality lever (real margins 3–7×; a 6-node hub-spoke passes). | Reads as a quality gate but only catches catastrophic collapse. | Accept as a floor; route real quality to A1 (craft judge) + R10. Document honestly (done in SYSTEM.md). | 🟢 (understood) |
| A4 | **Dead lints** — `prereqMinimality` / `layerConsistency` are computed but not emitted/gated. | Looks like coverage that isn't there. | Either surface as advisories or delete; don't leave computed-then-discarded. | 🔴 |
| A5 | **stage↔node parity can't really fail** — checks lessons→nodes, but nodes are *derived* from lessons (near-tautological); the reverse isn't implemented. | A green gate that can't fail reads as false assurance. | Implement the real reverse check (every concept-node ↔ a real lesson). | 🔴 |
| A6 | **Lesson-prereq ordering + lesson-prose `@c{}` stage are NOT validated** — the Slice-5 reorder *silently* created a forward-ref (`sb-neural`→`sb-onto`@later) that all gates missed; audit caught it. | Reorders/edits can silently break "introduced-before-use" at the lesson level. | Add deterministic checks: a lesson's `prerequisites` must be earlier-stage; a lesson-prose `@c{}` must resolve at-or-before its stage. | 🔴 |
| A7 | **No judged-activity type in the schema** — `Lesson.quiz` is the only interactive field; "activities" are faked as `fill-in` (C12). | The methodology wants *demonstrated capability*, not just MCQs. | Add an `activity`/`exercise` type (or wire lessons to the `assessments.ts` LLM judge). | 🔴 |

---

## B. Engine gaps — `ENGINE.md` is designed, not built
Current state: **no engine code; still a single-curriculum monolith** (`src/content/*`); no
`core/ gates/ app/ judge/ generator/ curricula/` split. The building *blocks* exist as code
here (gates, derive, renderer) + the judge in godel. The 7-step migration (`ENGINE.md` §6)
has **not** started.

| # | Gap | Why it matters | Improvement path | Status |
|---|---|---|---|---|
| B1 | **No engine/curriculum boundary** — renderer + gates import `src/content/*` directly. | Can't serve >1 goal; the three forks duplicate the framework. | Define the `Curriculum` interface (§3); make engine read a *loaded* curriculum (§6 steps 1–3). | 🔵 |
| B2 | **No generator** (goal → curriculum, propose→gate→revise) — *the moonshot*. | This is the actual product ("Wikipedia for any goal"). Unbuilt in **both** projects (= godel M4). | Build it against the gate suite (A1/A2 must exist first to make it trustworthy); first eval = regenerate an existing curriculum and re-pass the gates. | 🔵 |
| B3 | **Per-domain correctness profiles** — only OWL exists; a new goal needs its own trap-set + frozen cases. | Without a profile, R10 can't gate a new domain; for arbitrary goals the generator must *propose + a human vet* the profile — `ENGINE.md`'s "riskiest open problem." | Profile registry (system prompt + named traps + frozen set); generator proposes a draft profile for vetting. | 🔵 |
| B4 | **No multi-curriculum hosting**; format (`​.ts` vs typed JSON) and repo home (new `ladder` vs in-place) undecided. | Blocks shipping many goals; the generator should emit *data*, not `.ts` code. | Decide format (recommend typed JSON the engine validates) + hosting (deploy-per-goal or one shell). | 🔵 |
| B5 | **New goal-type: "describe a codebase as a learning map."** | A named target use case (and the learning-map-of-the-engine is its first instance). | Treat a codebase as the source corpus; generate a concept/dependency map + lessons over it. | 🔴 |

---

## C. Content / craft gaps — the rescope (second-brain curriculum)
| # | Gap | Status |
|---|---|---|
| C-craft | Only **2 pages at the full craft bar** (`sb-kg`, `sb-retrieve`); `sb-framing` partial (WIP stashed); **~14 legacy pages + orientation** not craft-passed (still original defects). | 🟡 |
| C-modules | Missing modern modules: a **Plan/decide** meta-skill module (lifecycle gap). | 🔴 |
| C-split | `sb-neural` bundles basics + advanced identity/KG-ML at stage 2 (C18) — owe a split. | 🔴 |
| C-prose | Re-sequence left **advisory prose-forward-refs** (modern modules cite later symbolic concepts — Cypher/query/validation/subclass/TransE) (C20). | 🟡 |
| C-neutrality | No **whole-graph neutrality audit** yet (C1) — keep every paradigm a fair option. | 🔴 |

---

## D. Validation gaps
| # | Gap | Status |
|---|---|---|
| D1 | **Pre-empirical** — nothing validated to actually *teach better* (godel METHODOLOGY §13). Deferred by design until the system is built. | 🔵 (deferred) |
| D2 | **Gates validated against hand-authored content, not generator output** — the generator is the adversary the gates were built for, and it has never run against them. | 🔵 |

---

## The throughline
The same idea fixes most of A and unblocks B2: **make quality and truth into LLM-judged,
calibrated, iterated gates** (craft judge A1, correctness profiles B3) so the generator's
propose→gate→revise loop can be *trusted* to produce good — not merely well-formed —
curricula. That, plus the engine/curriculum boundary (B1), is the path to "generate any
goal at quality."
