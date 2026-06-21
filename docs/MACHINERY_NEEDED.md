# Machinery needed to author rich concept graphs (discovered by hand-expanding)

**Purpose.** The other agent is building the generation/authoring machinery. This
doc is the *requirements*, discovered empirically by hand-expanding the Second
Brain concept graph from a thin, linear 11-concept stub into a rich, non-linear
graph. Each requirement is grounded in a specific pain hit during the expansion.

**The core finding (why the first attempt was thin & linear).** The validator
gates **structural correctness** (acyclic / definition-closed / every edge
justified / contrasts symmetric) but nothing about **richness (R1), coverage (R6),
content-truth (R10), or render fidelity (R11)**. A near-linear chain of 11 concepts
passes every gate; so does a rich graph full of factually wrong definitions; so does
a correct graph that renders as a single column. The cheapest valid output is a thin
chain — and under any time pressure that's what gets produced (it's what *I*
produced, with the methodology docs open). Worse, the two gates that bit *after* the
graph looked done — its definitions were wrong (R10) and the page rendered linear
(R11) — **failed silently until a human looked**. **If the cheap path passes the
gates, the gates are incomplete.** The machinery below exists to make the
rich/correct/visible path the path of least resistance, and to make the thin, wrong,
or mis-rendered path *fail loudly*. The **Definition-of-Done table** (after R12) is
the consolidated exit condition; R1–R12 are the machinery that drives a page to it.

---

## R1. Richness / structure gate (turn "too linear" into a hard failure)
The single highest-leverage piece. The validator must compute structural metrics
on the concept graph and FAIL (or warn loudly) when it's degenerate:
**Convention first (this doc got it wrong once — pin it down).** Edges are stored
`[prereq, concept]`. For each concept count two things with unambiguous names:
*dependants* = how many concepts list it as a prerequisite; *prerequisites* = how
many it lists. (Do **not** say "in/out-degree" without stating the convention — an
earlier draft of this very doc called `description-logic`/`entity-resolution`/
`propose-verify` "in-degree-≥3 hubs" when they are high-*prerequisite* **sinks**
with zero dependants. The slip is itself evidence the metric must be defined in
code, not prose.)
- **Hubs & hard ideas**: a rich graph has several *hub* concepts (many dependants —
  here `entity`:9, `triple`:6, `class`/`ontology`/`llm-extraction`:5) AND several
  *hard* concepts (≥3 prerequisites). A graph where almost every node has ≤1 of
  each is a chain — reject. **Proposed thresholds: FAIL if `<3` concepts have ≥3
  dependants, OR `<3` concepts have ≥3 prerequisites, OR median total degree `<2`.**
- **Contrast density**: count `contrasts` pairs. This graph has **9** (open- vs
  closed-world, symbolic vs neural, TBox vs ABox, lookup vs entailment, …). Few
  contrasts = the "category errors" the site exists to prevent aren't represented.
  **Proposed: gate a minimum per branch.**
- **Longest chain vs width**: a graph that's mostly one long path (depth ≫ width)
  is a ladder, not a graph. **Proposed: FAIL if `longest_path / max_stage_width > 3`.**
- **Coverage vs scope**: concept count against a declared scope. "KG + ontologies
  + logic + reasoning + identity + neural + neurosymbolic" cannot be 11 concepts.
*(Grounding: the git diff of `concepts.ts` for this expansion — the metrics moved
from chain-like to converging once real cross-branch edges were added.)*
**Every threshold above needs a frozen `thin-graph.fixture` the richness gate must
FAIL** — the 11-node stub that started this is gone from the tree; without a golden
negative, the gate can regress to passing everything. This fixture is itself a
required deliverable (see R12).

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
**Made concrete (2026-06-21):** the reviewer pointed out the 35-concept graph
omits whole expert-map branches — n-ary relations, reification, named graphs, *all*
of querying (the homepage promises "queryable" with no query concept), most OWL
expressivity (disjointness, restrictions, property chains), ontology engineering &
**reuse** (SUMO/FOAF/SKOS), construction sub-steps. The coverage contract is now
written down: **`docs/DOMAIN_COVERAGE.md`** — a tiered key-ideas syllabus (Tier A
required / B suggested / C explicit non-goal) with per-area ✓/◐/✗ status. The R6
gate reads Tier A as required-coverage (fail on absent), Tier C as non-goals (never
flag), Tier B as warnings. Two of the absent Tier-A concepts (`disjointness`,
`validation-vs-inference`) also **fix R10 content bugs** — coverage and correctness
converge. This is the artifact R6 was hand-waving at; it's now a file to gate on.

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

## R10. Semantic content-correctness gate — the missing #1 gate for *this* product
**This is the gate the whole site exists for, and nothing currently checks it.**
Every structural gate can be green while the *definitions are wrong*. The 2026-06-21
multi-agent audit found this empirically: the hand graph passed `npm run check`
while carrying four **critical** content errors that plant exactly the category
errors the curriculum is supposed to prevent — e.g. `rule` conflated SHACL
(closed-world *validation*) with SWRL (open-world *inference*); `description-logic`
was defined as "the decidable fragment of logic under OWL" (DL is a *family*, and
*founds* OWL rather than sitting "under" it); the `consistency` example was not
actually inconsistent under the open-world assumption it was teaching; "the reasoner
*rejects* ill-typed triples" attributed SHACL's job to the reasoner. None are
structural — they are domain-truth and category-boundary errors.
Machinery: an **adversarial domain-expert review** of every `short`/`example` and
every code block, run as a gate, with source grounding (RDF 1.1 / OWL 2 / SHACL /
SWRL / DL literature). It must specifically hunt the project's own target
distinctions (`⊢ vs ⊨`, well-formed vs provable vs true vs known, validation vs
inference, OWA vs CWA, data vs schema). This is distinct from R6: R6 checks the
concept *set* covers the domain's key ideas (coverage); R10 checks each
*statement* is true (correctness). For a math-correctness-is-the-product site, R10
outranks everything else here.

## R11. Rendered-artifact fidelity — the page must *show* the richness, not just hold it
A correct, rich graph can still **render** as a linear chain. It did: the
`#/concepts` view laid every concept in one `x=20` column because the layout read
the stage number with a regex that assumed digit-bearing stage ids (`stage-N`),
and SB's ids (`sb-kg`, …) have no digit → `stageNum` returned 0 for all 35 nodes.
The data was non-linear; the *page* was a single line. No tsc/validator/build gate
catches this, and the visual pass **didn't even screenshot `#/concepts`** — so the
only gate that *could* have caught it wasn't pointed at the broken view.
Two requirements fall out:
- **(a) Visual-pass completeness**: the screenshot harness must cover **every
  rendered route** (home skill tree, `#/concepts`, every `#/node/<id>`), enumerated
  from the router, not a hand-picked list. A view with no screenshot is an
  un-gated view.
- **(b) Automated layout-sanity checks** so fidelity isn't purely eyeball: e.g.
  concept nodes must occupy **≥ (number of stages) distinct x-columns**; no view may
  render >70% of nodes in a single column; edge-crossing count under a bound. These
  turn "looks linear" into a hard failure the way R1 turns "is linear" into one.

## R12. Structural lints the correctness gates miss (each found live this session)
The existing validator checks acyclicity, `@c{}`-closure, justification-presence,
and contrast symmetry — and misses every one of these, all found by the audit:
- **Prose forward-reference**: `tbox`/`ontology` (stage 2) are *defined as* "schema
  **+ axioms**", but `axiom` is introduced in stage 3. The `@c{}`-closure checker
  only sees chip refs, not plain-prose mentions. Gate: scan `short`/`example` prose
  for any concept term introduced in a later stage. (This one says `axiom` is
  **mis-staged** — its prereqs are both stage-2; it should move to stage 2.)
- **Contrast staging**: a `contrasts` target may be introduced stages later
  (`triple↔embedding` spans 1→4, `subclass↔sameas` 2→4), so the learner meets the
  chip before the concept exists. Gate: contrast target must be at-or-before, or the
  chip renders only on the later node.
- **Prerequisite minimality**: 6 concepts list a prereq already implied transitively
  (`rdf-graph`→`triple`, `instance`→`entity`, `description-logic`→`class`, …). The
  skill *map* is transitive-reduced; the concept *graph* isn't. Gate: lint the
  `prerequisites` lists with the same reduction.
- **`PREREQ_KIND` correctness (not just presence)**: OWA/CWA→`entailment` are tagged
  `refines` but are `assumes`; `hallucination`→extraction tagged `refines` but is a
  failure-mode. R3 covers proposing/auditing `why`; the `kind` needs the same audit.
- **Layer consistency**: `iri`=`system` but `identifier`=`data` though an IRI *is* a
  global identifier; the identity cluster spans 3 layers. Gate: sibling concepts of
  the same nature share a layer (or justify the difference).
- **Near-duplicate concepts**: `neurosymbolic` ≈ `propose-verify`. Gate: flag pairs
  whose definitions are near-identical for a merge/sharpen decision.
- **Goal/sink drift** (promoted from pain-log item 8): every graph sink must be a
  declared goal *or* an explicitly-marked enrichment leaf. Currently an undeclared
  terminal is a silent warning; make it a gate.

---

## Definition of done — a generated page is complete only when ALL hold
The requirements above are the *machinery*; this is the **acceptance checklist** the
machinery must drive a page to. "Reliably generate full pages" means: emit, then
gate against every row, then revise until green (R5 is the loop; this is its exit
condition). Status = what exists today vs what this doc asks to be built.

| # | Gate (a page is done only if…) | Req | Status today |
|---|--------------------------------|-----|--------------|
| 1 | concept graph acyclic, `@c{}`-closed, every edge has `why`+`kind`, contrasts symmetric | (validator) | ✅ exists |
| 2 | stage banding coherent (prereq stage ≤ concept stage); no **prose** forward-refs | R12 | ⚠️ chip-only; prose gap |
| 3 | structural richness ≥ thresholds (hubs, hard-ideas, contrast density, depth/width) | R1 | ❌ not built |
| 4 | concept set covers the domain's declared key ideas (faithfulness/coverage) | R6 | ❌ not built |
| 5 | **every definition & example is factually correct** vs authoritative sources | **R10** | ❌ not built |
| 6 | prerequisite lists minimal; kinds correct; layers consistent; no near-dups | R12 | ❌ not built |
| 7 | every concept term ⇒ glossary entry (and back) | R4 | ❌ not built |
| 8 | every stage has a full lesson (≥3 quiz, ≥2 confusions, ≥1 viz, mastery) | R2 | ✅ enforced (but couples — see R2) |
| 9 | every declared goal ⇒ achievement + capstone; required-concepts = goal closure; no goal/sink drift | R9/R12 | ⚠️ manual; drift only warns |
| 10 | downstream wiring (skill-graph node, positions, registrations) derived, not hand-edited | R8 | ❌ manual |
| 11 | **every rendered route screenshotted; layout-sanity passes (multi-column, no collapse)** | **R11** | ⚠️ harness fixed, coverage+checks gap |
| 12 | a frozen degenerate fixture still FAILS the richness gate (regression) | R1/R12 | ❌ fixture gone |

Rows 5 and 11 are the two that bit *this* session despite everything else being
green; rows 3, 4, 5, 11, 12 are the ones with no automation at all.

---

## Running pain log (hand-expansion, 2026-06-21)

I expanded the concept graph from a thin 11-concept linear chain to **35 concepts /
61 prerequisite edges / 9 contrast pairs** across 5 stages (sb-kg → sb-onto →
sb-reasoning → sb-neural → sb-neurosymbolic), with real cross-branch convergence.
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
   demo).** Every one of the 61 edges needs a hand-written `PREREQ_WHY` string +
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
   misconceptions), and `derive.ts` (`GOAL_CONCEPTS`) — `concepts.ts` plus **5
   downstream files (6 total)**. Miss any one and the stage silently doesn't appear,
   or the goal-closure throws an undeclared-terminal warning. The concept graph is
   *supposed* to be the single source of truth (ADR-0003) but 5 downstream files
   still need hand-wiring. (Scope note: this tax is per **stage**, which is coarse;
   adding a concept to an *existing* stage touches only `concepts.ts` + its two
   side-tables. R1/R5 mass-produce concepts, so the per-stage cost is the rarer one
   — but it's the one that silently hides a whole stage.) Machinery: scaffold node +
   achievement + lesson stub + goal registration from a concept-graph diff.

7. **Node x/y positions are hand-placed (R8-adjacent).** Each `graph.ts` node
   carries literal `{ x, y }` pixels. I eyeballed an 8-node layout; one wrong
   number and edges cross or nodes overlap. This should be auto-laid-out (the DAG
   already has the structure) with manual nudge as the exception, not the rule.

8. **Goal declaration is decoupled from the graph and warns silently (R9 + R1).**
   `GOAL_CONCEPTS` is a hand-maintained list in `derive.ts`; any graph **sink** not
   in it is an "undeclared terminal". After expansion the graph had **14 sinks**, of
   which **4** were undeclared terminals (`abox`, `closed-world-assumption`,
   `description-logic`, `hallucination`), and I re-picked the goal set by hand to
   clear them. The system *knows* the sinks (`sinks()` computes them) but won't
   propose them as goals or fail on the mismatch. Machinery: derive candidate goals
   from sinks; make goal/sink drift a gate, not a warning (promoted into R12).

9. **The mandatory visual pass was itself broken for this content (tooling).** The
   `screenshots.mjs` harness still pointed at Gödel routes (`stage-6`, `stage-14`)
   and used hash-`goto` that doesn't re-render an SPA (every shot was the home
   page, byte-identical). It also hung on WSL in `browser.close()` after the file
   was already written, killing the batch mid-run. None of tsc/validator/build
   catches a broken visual harness. Fixed here (correct `#/node/<id>` routes,
   reload-to-rerender, `Promise.race` teardown). Lesson: the visual pass needs to
   be content-agnostic and self-terminating, or it silently stops being run.

10. **The graph was structurally rich but factually wrong, and every gate stayed
    green (R10 — the most important gap).** A multi-agent domain audit of the
    finished graph found **four critical content errors** (SHACL/SWRL conflation in
    `rule`; `description-logic` = "the decidable fragment of logic under OWL"; a
    `consistency` example that isn't inconsistent under OWA; "the reasoner rejects
    ill-typed triples"). `npm run check` passed throughout. These are *exactly* the
    category errors the site exists to prevent, and **no structural gate can ever
    catch them** — only a source-grounded domain-expert review can. The whole
    machinery effort is worthless if the rich graph it produces is wrong; R10 is the
    gate that was most missing from this doc's first draft.

11. **A correct, rich graph rendered as a pure straight line (R11).** After the
    expansion, `#/concepts` displayed all 35 concepts in a single vertical column —
    indistinguishable from the linear stub. Cause: `ConceptGraphView` derived the
    stage column with `introducedIn.match(/(\d+)/)`, assuming godel-style `stage-N`
    ids; SB's `sb-kg`/`sb-onto`/… have no digit, so every node got column 0. tsc,
    validator, and build were all green; the visual pass didn't screenshot
    `#/concepts` at all. The *user* caught it on the live site. Fixed (stage index
    read from `LESSONS`, route added to the harness), but the lesson is structural:
    **page fidelity needs its own gate** — enumerate every route into the visual
    pass and add a layout-sanity check (nodes must span ≥ #stages columns). A
    correct graph you can't *see* is correct is not a finished page.

12. **This doc had its own factual errors, which is itself a data point.** The
    first draft said "~57 edges" (actually 61), "a dozen+ contrasts" (9), "~10 new
    sinks" (14 sinks / 4 undeclared), an inconsistent "5-file / four-file" count,
    and — worst — named three graph **sinks** (`description-logic`,
    `entity-resolution`, `propose-verify`) as "in-degree-≥3 hubs", conflating
    prerequisites-consumed with dependants. If the human author of the requirements
    doc miscounts degree by hand, the requirement ("compute these metrics") is even
    more justified: **the metric must live in code with a pinned convention**, never
    in prose. (All corrected above.)

**Bottom line.** The hand-expansion produced a genuinely non-linear, convergent
graph — three branches converging on `neurosymbolic`; the most-depended-upon
concepts are `entity` (9 dependants), `triple` (6), and `class`/`ontology`/
`llm-extraction` (5), while `description-logic`/`entity-resolution`/`propose-verify`
are high-prerequisite **sinks** (3 prerequisites, 0 dependants — *not* hubs; the
draft that called them hubs is corrected in item 12). But *nothing in the toolchain
asked for that richness, noticed its absence, checked the definitions were true, or
checked the page rendered them*. Every gate I hit was a **structural-correctness**
gate. Richness (R1), faithfulness (R6), **content-truth (R10)**, and **render
fidelity (R11)** all came entirely from human judgment or a post-hoc adversarial
audit — and two of them (R10, R11) failed silently until a human looked. That
asymmetry — structure enforced; truth, richness, and rendering un-gated; wiring
manual — *is* the case for the machinery, and the Definition-of-Done table above is
the exit condition it has to drive a page to.
