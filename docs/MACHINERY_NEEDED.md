# Machinery needed to author rich concept graphs (discovered by hand-expanding)

**Purpose.** The other agent is building the generation/authoring machinery. This
doc is the *requirements*, discovered empirically by hand-expanding the Second
Brain concept graph from a thin, linear 11-concept stub into a rich, non-linear
graph. Each requirement is grounded in a specific pain hit during the expansion.

**The core finding (why the first attempt was thin & linear).** The validator
gates **correctness** (acyclic / definition-closed / every edge justified) but
nothing about **richness, coverage, or faithfulness**. A near-linear chain of 11
concepts passes every gate. So the cheapest valid output is a thin chain — and
under any time pressure that's what gets produced (it's what *I* produced, with
the methodology docs open). **If the cheap path passes the gates, the gates are
incomplete.** Most machinery below exists to make the rich/correct path the path
of least resistance, and to make the thin path *fail*.

---

## R1. Richness / structure gate (turn "too linear" into a hard failure)
The single highest-leverage piece. The validator must compute structural metrics
on the concept graph and FAIL (or warn loudly) when it's degenerate:
- **Branching**: average out-degree (a concept used by many) and in-degree (a
  concept that converges several prerequisites). A graph where almost every node
  has in-degree ≤1 and out-degree ≤1 is a chain — reject.
- **Convergence count**: how many concepts have ≥3 prerequisites (the genuinely
  "hard" ideas). A rich domain has several; the thin stub had **zero**.
- **Contrast density**: number of `contrasts` edges. The thin stub had ~5; the
  domain has a dozen+ (open- vs closed-world, symbolic vs neural, TBox vs ABox,
  lookup vs entailment, …). Few contrasts = the "category errors" the site exists
  to prevent aren't represented.
- **Longest chain vs width**: a graph that's mostly one long path (depth ≫ width)
  is a ladder, not a graph.
- **Coverage vs scope**: concept count against a declared scope. "KG + ontologies
  + logic + reasoning + identity + neural + neurosymbolic" cannot be 11 concepts.
*(Grounding: see the git diff of `concepts.ts` for this expansion — the metrics
moved from chain-like to converging once real cross-branch edges were added.)*

## R2. Concept ⇄ lesson coupling is a trap — decouple or auto-scaffold
`introducedIn` must point at a real lesson stage, and lessons carry mandatory
structure (≥3 quiz, ≥2 confusions, ≥1 viz, mastery). So **you cannot add a
concept without also authoring a full lesson** for its stage. During expansion
this forced me to write lesson *stubs* just to keep the graph valid — friction
that pushes toward fewer concepts. Machinery should either (a) let concepts exist
before their lesson (lesson = derived view, generated later), or (b) auto-scaffold
a lesson stub when a new `introducedIn` stage appears.

## R3. Per-edge justification (`PREREQ_WHY` + `PREREQ_KIND`) is the dominant manual cost
Every prerequisite edge needs a hand-written `"why"` and a `kind`. For ~30
concepts that's ~50 edges × 2 fields = ~100 hand annotations, kept in two separate
records far from the concept. This is (a) tedious, (b) easy to forget (the
validator catches *missing* ones but not *wrong/lazy* ones), and (c) the thing
most worth generating-then-auditing. Machinery: **propose** `why`/`kind` from the
two concept definitions, then **adversarially audit** each (the Tier-1 review),
rather than author by hand. Also: co-locate the justification with the edge
(`prerequisites: [{id, why, kind}]`) so it can't drift.

## R4. Glossary coverage is unenforced and drifts
The glossary is a hand-maintained list, disconnected from `concepts.ts`. It was
"missing many things" precisely because nothing checks that **every concept term
has a glossary entry** (and vice-versa). Machinery: derive glossary stubs from
concepts (term, short→definition, example, related←prerequisites/contrasts), and
**gate** on coverage (every concept ⇒ glossary entry).

## R5. Generation: propose→gate→revise loop (the big one your docs already spec)
Authoring 30–60 justified concepts by hand is the bottleneck that *caused* the
thin output. The loop should: given **domain + declared goals + source material**,
fan out agents to propose concepts + prerequisites + contrasts; **gate** against
the validator + R1 richness + R3 audit; **revise** until it clears a richness bar.
Humans/curators review, they don't author from scratch. (See ADR-0005 Ph.2 /
ADR-0006 "agentic-coder propose→gate→revise loop" — specced, not built.)

## R6. Faithfulness audit needs source grounding
Correctness ≠ faithfulness. My hand graph can be acyclic/closed/justified and
still *miss the domain* (e.g., I nearly omitted the open-world assumption — the #1
gotcha — because nothing forces coverage of a domain's known hard ideas).
Machinery: seed from authoritative sources (a syllabus, a textbook TOC, an
existing ontology) and check the concept set covers the declared key ideas; flag
omissions.

## R7. Contrasts are first-class and under-tooled
The "prevent category errors" mission lives in `contrasts`, but they're easy to
forget and only checked for symmetry. Machinery should *suggest* contrasts
(pairs of sibling concepts that learners conflate) and gate a minimum density per
branch.

## R8. Stage/branch assignment + ordering is manual and arbitrary
I hand-assigned each concept a `layer`, `branch`, `introducedIn`, and a graph
`position`. These should be **derived**: branch from clustering the dep graph,
stage from a topological banding, position from a layout pass. Hand-placing node
positions for the skill tree is pure busywork that scales badly.

## R9. Achievements + assessments are hand-authored and decoupled from goals
Each achievement node + capstone rubric + fatal misconceptions is hand-written and
manually wired to prerequisite nodes. Goals (`GOAL_CONCEPTS`) are declared
separately again. Machinery: derive an achievement per declared goal; generate a
capstone whose required-concepts = the goal's closure and whose fatal
misconceptions = the goal-branch's contrasts.

---

## Running pain log (hand-expansion, 2026-06-21)

I expanded the concept graph from a thin 11-concept linear chain to **35 concepts /
~57 prerequisite edges** across 5 stages (sb-kg → sb-onto → sb-reasoning →
sb-neural → sb-neurosymbolic), with real cross-branch convergence and contrasts.
Concrete friction, in the order it bit:

1. **The validator never once complained about thinness (R1, confirmed).** The
   original 11-concept linear chain passed `npm run check` cleanly — tsc, content
   validator, and build all green. Richness is invisible to every gate we have. The
   *only* signal that the graph was too linear was a human eyeballing the skill
   tree. **This is the headline finding: correctness gates are satisfied by the
   cheapest thin graph, so they cannot pull authoring toward richness.** A
   richness/structure gate (branching factor, max-in-degree ≥3 convergence count,
   contrast density, longest-chain-vs-width) is the single highest-value piece of
   machinery.

2. **Per-edge justification dominated the manual cost (R3, confirmed, with a live
   demo).** Every one of the ~57 edges needs a hand-written `PREREQ_WHY` string +
   a `PREREQ_KIND` from a 6-value enum, kept in two separate records *away from*
   the concept it describes. Adding the graph was maybe 30% defining concepts and
   70% writing/aligning these two side-tables. Live demo of the coupling: I added
   one prerequisite (`iri → relation`) to fix a closure error; the validator then
   failed **twice more** in sequence — once for the missing `PREREQ_WHY["iri>relation"]`,
   once for the missing `PREREQ_KIND["iri>relation"]`. One edge = three edits in
   three locations. Machinery: co-locate why+kind on the edge, and auto-propose
   both (LLM) for human audit instead of hand-authoring.

3. **Definition-closure caught a real forward-reference I'd have shipped (R6-adjacent,
   good).** `iri`'s definition used `@c{relation}` but only listed `entity` as a
   prerequisite — the closure checker flagged it. This gate *works* and is worth
   keeping; the cost it imposes (every `@c{}` mention must be a declared prereq) is
   exactly what feeds the per-edge-justification tax in (2). They're the same
   mechanism: tightening definitions adds edges, and every edge adds two side-table
   rows.

4. **Contrast symmetry is enforced but one-directional to author (R7, confirmed).**
   I wrote `embedding` contrasts `triple`; the validator failed because `triple`
   didn't list `embedding` back. Symmetry is checked but not maintained — you hand-
   edit both endpoints. With ~9 contrasts that's fine; at scale it's error-prone.
   Machinery: declare a contrast once, derive the reverse.

5. **Stage banding is load-bearing and entirely manual (R8, confirmed).** Cross-
   branch edges (e.g. `entity-resolution → similarity`, `neurosymbolic →
   llm-extraction`) forced every concept's `introducedIn` to be chosen so that
   prereqs land in the same-or-earlier stage. I assigned all 35 by hand and had to
   reason about the global ordering each time. Nothing derives or checks the
   *minimal* banding — the topo order is recomputed by the app but the human still
   picks the bands. Machinery: derive a default banding from the DAG (longest-path
   layering) and let the author only override.

6. **Adding a stage is a 5-file change with no scaffolding (R2, confirmed).** To
   make the three new stages *visible* I had to touch, in lockstep:
   `concepts.ts` (the concepts + both side-tables), a new `lessons/sb-*.ts` per
   stage, `lessons/index.ts` (register + trim UPCOMING), `graph.ts` (a concept
   node + an achievement node + achievement-prereq edges + node x/y positions),
   `assessments.ts` (a capability + rubric + deterministic items + fatal
   misconceptions), and `derive.ts` (`GOAL_CONCEPTS`). Miss any one and the stage
   silently doesn't appear, or the goal-closure throws an undeclared-terminal
   warning. The concept graph is *supposed* to be the single source of truth
   (ADR-0003) but four downstream files still need hand-wiring. Machinery: scaffold
   node + achievement + lesson stub + goal registration from a concept-graph diff.

7. **Node x/y positions are hand-placed (R8-adjacent).** Each `graph.ts` node
   carries literal `{ x, y }` pixels. I eyeballed an 8-node layout; one wrong
   number and edges cross or nodes overlap. This should be auto-laid-out (the DAG
   already has the structure) with manual nudge as the exception, not the rule.

8. **Goal declaration is decoupled from the graph and warns silently (R9 + R1).**
   `GOAL_CONCEPTS` is a hand-maintained list in `derive.ts`; any graph **sink** not
   in it is an "undeclared terminal". After expansion I had ~10 new sinks and had to
   re-pick the goal set by hand to avoid warnings. The system *knows* the sinks
   (`sinks()` computes them) but won't propose them as goals or fail on the
   mismatch. Machinery: derive candidate goals from sinks; make goal/sink drift a
   gate, not a warning.

9. **The mandatory visual pass was itself broken for this content (tooling).** The
   `screenshots.mjs` harness still pointed at Gödel routes (`stage-6`, `stage-14`)
   and used hash-`goto` that doesn't re-render an SPA (every shot was the home
   page, byte-identical). It also hung on WSL in `browser.close()` after the file
   was already written, killing the batch mid-run. None of tsc/validator/build
   catches a broken visual harness. Fixed here (correct `#/node/<id>` routes,
   reload-to-rerender, `Promise.race` teardown). Lesson: the visual pass needs to
   be content-agnostic and self-terminating, or it silently stops being run.

**Bottom line.** The hand-expansion produced a genuinely non-linear, convergent
graph (three branches converging on `neurosymbolic`; in-degree-≥3 hubs at
`entailment`, `ontology`, `description-logic`, `entity-resolution`, `propose-verify`)
— but *nothing in the toolchain asked for that richness or would have noticed its
absence*. Every gate I hit was a **correctness** gate (closure, symmetry,
justification-presence, acyclicity). The richness came entirely from human
judgment, and the manual cost was concentrated in exactly the side-tables and
multi-file wiring that R1–R3 and R8–R9 propose to automate. That asymmetry —
correctness enforced, richness un-asked-for, wiring manual — *is* the case for the
machinery.
