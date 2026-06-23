# Diagrams — process & data flow for the Ladder engine

Mermaid (renders on GitHub). Companion to `ENGINE.md` (architecture prose) and `GAPS.md`
(what's built vs. designed). **Status reminder:** the engine/curriculum split and the
generator are *designed, not built* — these diagrams show the **target** flow; today the
"engine" code and one curriculum are fused in `src/content/*` (see `GAPS.md` §B).

---

## 1. Architecture — engine (code) vs curriculum (data) vs generator

```mermaid
flowchart LR
  subgraph CUR["CURRICULUM — data, one package per goal"]
    direction TB
    C["concepts + PREREQ_WHY / PREREQ_KIND<br/>(the source of truth)"]
    L["lessons: prose · quiz · viz · activity"]
    COV["coverage contract (required / deferred)"]
    DOM["domain config:<br/>running example · category errors ·<br/>correctness profile · depth bands"]
  end

  subgraph ENG["ENGINE — code, one for ALL goals"]
    direction TB
    CORE["core: derive path · skill map · glossary · panels"]
    GATES["gate suite: structure · richness · coverage ·<br/>closure · layout · R10 correctness · CRAFT judge"]
    APP["app: React/Vite renderer (parameterized)"]
    JUDGE["judge: LLM assessment backend"]
  end

  GEN["generator: goal + sources → curriculum<br/>(propose → gate → revise)"]

  GEN -->|emits| CUR
  CUR -->|loaded via Curriculum interface| ENG
  ENG -->|build · gate · render| SITE["deployed learning map (GitHub Pages)"]
  GATES -. "make generation trustworthy" .-> GEN
```

*Today:* `CURRICULUM` and `ENGINE` are not separated — `src/content/*` is both. `GEN` does
not exist. The **CRAFT judge** in `GATES` is designed (`GAPS.md` A1), not built.

---

## 2. Build / derive / gate pipeline (what exists today, deterministic)

```mermaid
flowchart TD
  SRC["concepts.ts — source of truth<br/>(acyclic prereqs + why/kind)"]
  LES["lessons/*.ts"]
  SRC --> DERIVE["derive.ts: SCC lint · stage edges · transitive reduction"]
  DERIVE --> MAP["skill tree + #/concepts map"]
  DERIVE --> PATH["recommended path / order"]
  DERIVE --> GLOSS["glossary"]
  DERIVE --> PANELS["per-stage concept panels"]
  SRC --> GATE{"npm run check:<br/>tsc · gates · validator · build"}
  LES --> GATE
  GATE -->|fail = localized| FIX["fix the named concept/edge/page"] --> SRC
  GATE -->|green| BUILD["vite build"] --> DEPLOY["merge to master → GitHub Pages"]
```

*Gap (`GAPS.md` A6):* the gate does **not** yet validate lesson-prereq ordering or
lesson-prose `@c{}` stage — a reorder can silently introduce a forward reference.

---

## 3. The generator loop — the moonshot (designed, `ENGINE.md` §5 / `GAPS.md` B2)

```mermaid
flowchart TD
  GOAL["goal + optional sources"] --> SCOPE["1 · scope: key-idea map → coverage contract"]
  SCOPE --> CONC["2 · propose concepts + prerequisite DAG + why/kind"]
  CONC --> PART["3 · partition into modules + assign depth bands"]
  PART --> AUTH["4 · author lessons: prose · quiz · viz · activity"]
  AUTH --> GATE{"5 · GATE: structure · richness · coverage ·<br/>R10 correctness · CRAFT soul · layout"}
  GATE -->|fail, localized| REV["6 · revise the flagged items"] --> GATE
  GATE -->|green| CURATE["7 · human curate: voice · ordering · final taste"]
  CURATE --> OUT["a gated curriculum (data package)"]
  OUT -. "feeds" .-> APP2["engine renders it"]
```

**Division of labor (the standing rule):** *programmatic* for coverage + enforcement
(gates), *agents* for generation + judgment (steps 2/4/6 + the R10 & craft judges),
*human* for direction + taste (step 7). Steps 5–6 are why the loop can run autonomously
without shipping garbage — **but only as strong as the gates** (so `GAPS.md` A1/A2/B3 gate
the trust).

---

## 4. Curriculum data model (one source of truth → many derived views)

```mermaid
flowchart LR
  subgraph SOT["source of truth"]
    CO["Concept{ id, short, example, prerequisites[], why, kind, band, introducedIn }"]
    LO["Lesson{ stage, sections, quiz[], viz[], activity, mastery }"]
  end
  CO --> G1["acyclic prereq DAG"]
  G1 --> SM["skill-map nodes + edges (group-lifted, transitively reduced)"]
  G1 --> ORD["topological order → path"]
  CO --> GL["glossary entries"]
  CO --> CL["definition closure check (@c{} ⊆ prereqs)"]
  LO --> RND["rendered lesson page"]
  SM --> RND2["#/concepts graph view"]
```

*Rule:* edit the **source of truth**; never hand-edit a derived view (the gates enforce
derived-not-drifted).
