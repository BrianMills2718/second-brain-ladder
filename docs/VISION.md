# The end-goal vision — index

> **This is the `vision/capability-graph` branch.** It holds north-star design only —
> *not implemented*, and deliberately kept **off `master`** so it doesn't disturb the
> agent iterating the current knowledge-graph site. Don't merge until that work lands;
> when it does, the likely move (per `ENGINE.md`) is to carry these docs as the founding
> design of a separate engine repo.

## The vision in one paragraph
A **"Wikipedia for any goal"** — but the unit is not an *article of information* you read,
it is a **proven capability** you can *do*, and the structure is the prerequisite-ordered
**pathway** to acquiring it, personalized to your goal and your current mastery. One engine
builds, gates, and serves a curriculum *from data*, and — long-term — *generates* one for any
goal. A tech tree for human capability, where progress compounds across goals because skills
are shared nodes.

## Read in this order
1. **`CAPABILITY_MODEL.md`** — *the what + the UX.* The learning model (one node type = a
   verified capability; performance-mode × scale axes; `requires` + `composed-of` edges;
   components + nested assessment; grounding as the upward path to your goal; transfer via
   located-overlap + pretest) and the UI/UX (Bret Victor's ladder of abstraction; semantic
   zoom; the five surfaces). **Start here.**
2. **`METHODOLOGY.md`** — *the how (non-empirical protocol).* The normative method for building
   and operating these systems reliably: four commitments, falsification tests, the gated
   authoring/generation lifecycle, the programmatic/agent/human division of labor, the
   correctness discipline, anti-patterns, and the load-bearing unknowns.
3. **`ENGINE.md`** — *the architecture.* How to collapse the forked sites into one reusable
   engine (core / gates / app / generator / judge) with curriculum-as-data, and the 7-step
   migration plan.

## Relationship to what exists today (on `master`)
The current site (`second-brain-ladder`, 100 concepts / 17 modules) is the **embryo**: its
`concepts` (each with a `microQuiz`) are already explain/recognize capabilities, and its
`achievements` are the capability layer — just too few to feel like a spine. The implemented
gate suite that the methodology generalizes is documented in **`SYSTEM.md`** (the what-is) and
**`MACHINERY_NEEDED.md`** (the why), both on `master`. The vision = make capabilities the rich
spine, add the component/mastery/pretest layer, and the zoomable ladder UX.

## The one thing to crack first
The **canonical component registry** (`METHODOLOGY.md` §12.1): the transfer/overlap mechanism —
and the whole "compounding progress across goals" promise — *requires* that nodes which "share"
a component decompose to the *same identified* one. Without a registry the generator maps into,
overlap is noise. It is the linchpin and is currently unsolved at scale; everything else in the
model is comparatively tractable.
