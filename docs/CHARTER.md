# CHARTER — the north star (ratified 2026-06-23)

**This is the single fixed reference** the whole effort is checked against (the
`doc-consistency-audit` anchor). It supersedes the old `vision/capability-graph` branch
index (`VISION.md`) and resolves the fragmented-charter finding (DOC_AUDIT_2026-06-23 F3).
Amend *this* doc when the north star changes; don't let it drift implicitly.

## The vision, in one paragraph
A **"Wikipedia for any goal"** — but the unit is not an *article you read*, it is a
**verified capability you can do**, and the structure is the prerequisite-ordered **pathway**
to acquiring it, personalized to your goal and current mastery. **One engine** builds, gates,
and serves a learning map *from data*, and — long-term — **generates** one for *any* goal
(including *describing a codebase as a learning map*). Progress compounds across goals because
capabilities are shared nodes. A tech tree for human capability.

## The model (what a node is)
- **Node = a verified capability** (a performance + an assessment). *Concepts collapse in*:
  "knowing what X is" is the *explain/recognize* capability for X. The current sites use a
  **concept** graph; the target is a **capability** graph where a concept is one mode of a
  capability. (Detail: `CAPABILITY_MODEL.md` — the model + UX, now on the main line.)
- **Two axes:** performance-mode × scale (not layers). **Two edge types:** `requires`
  (prerequisite, gates + orders) and `composed-of` (granularity / zoom). Components carry
  **nested assessment**; goal-facing nodes are **grounded** ("why you're here"); **transfer**
  works when nodes share the *same identified* component.

## The engine (how it's built)
- **The concept/capability graph is the single source of truth; everything else derives**
  (path, skill map, glossary, panels). Edit the source, never the derived view.
- **A gate suite makes it trustworthy** — three kinds: **structural** (acyclicity, closure,
  coverage, richness, layout — deterministic), **correctness** (per-domain LLM judge, R10),
  and **craft** (an LLM judge for the craft bar — *buildable, not yet built*: `GAPS.md` A1).
- **Engine (code) is separate from curriculum (data)** so one engine serves many goals
  (`ENGINE.md` — architecture + the 7-step migration; the boundary is unbuilt).
- **The generator** turns goal + sources into a gated curriculum via **propose → gate →
  revise**. Division of labor: *programmatic* enforces, *agents* generate + judge, *humans*
  direct + supply taste. (The generator is the moonshot — `GAPS.md` B2.)

## The quality bar & stance
- **Craft bar** (`CRAFT_PATTERN.md`): a page must *show what made you care* → lead with a
  **picture/analogy** → run a **Therefore/But** spine — not just be structurally valid.
- **Learner empowerment + neutrality:** equip the learner to *understand alternatives →
  decide → plan → implement → operate* for *their* goal; where approaches compete, present a
  fair menu honestly costed — the author's preference is one option, never the spine.

## Where we are (the embryo)
Three forked sites are the embryo: **godel** (the methodology's reference instance),
**second-brain** (being rescoped to learner-empowerment / decision-first / neutral; the first
real curriculum), and **learning-map-ladder** (in progress — a learning map *of this engine*,
the first dogfood of the "describe-a-system" goal-type). The implemented gate/derive/render
machinery already exists; the engine/curriculum boundary, the generator, and the
capability-graph model are the work ahead.

## Canonical docs (what is authoritative — single source per concern)
| Concern | Canonical doc | Notes |
|---|---|---|
| North star | **`CHARTER.md`** (this) | supersedes `vision/capability-graph:VISION.md` |
| Methodology / theory | **`godel-concept-ladder/METHODOLOGY.md`** | the second-brain `METHODOLOGY.md` on the vision branch is **superseded** — do not revive it |
| Capability model + UX | **`docs/CAPABILITY_MODEL.md`** | now on the main line (de-orphaned) |
| Engine architecture + migration | **`docs/ENGINE.md`** | |
| Process / data-flow diagrams | **`docs/DIAGRAMS.md`** | |
| Gap register (what to improve) | **`docs/GAPS.md`** | |
| Second-brain rescope plan + live concerns | **`docs/RESCOPE_PLAN.md`** + **`docs/CONCERNS.md`** | |
| Current architecture (implemented) | **`docs/SYSTEM.md`** | ⚠️ counts/scope stale — see its flag |
| Historical (pre-rescope) | `MACHINERY_NEEDED.md`, `OVERNIGHT_MISSION.md` | keep as history, not live spec |

## Load-bearing unknowns (the honest risk list)
1. **Canonical component registry (the linchpin):** transfer/compounding requires that nodes
   which "share" a component decompose to the *same identified* one. Unsolved at scale
   (`CAPABILITY_MODEL.md` §12.1). Everything else is comparatively tractable.
2. **The generator** producing *good* (not just gate-passing) curricula — depends on the
   craft + correctness judges existing (`GAPS.md` A1/A2/B2).
3. **Per-domain correctness profiles** the generator must propose + a human vet for a new goal
   (`GAPS.md` B3).
4. **Pre-empirical:** nothing yet validated to *teach better* (godel METHODOLOGY §13) —
   deferred by design until the system is built.
