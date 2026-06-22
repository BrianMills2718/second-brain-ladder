# Internal protocol — a non-empirical methodology for building capability-graph learning systems

Updated: 2026-06-22

## Abstract

This document specifies the *method* by which we build and operate goal-driven,
capability-graph learning systems (the "Wikipedia for any goal" of `CAPABILITY_MODEL.md`,
served by the engine of `ENGINE.md`). It is a **north-star methodology**, not a record of
results: normative language means *"this is the standard we are choosing,"* not *"this
already holds"* or *"this works."* It deliberately avoids implementation inventory and
empirical claims; the implemented gates live in `SYSTEM.md`, and the questions only a built
system can answer are flagged as such (§12).

The method has four commitments:

1. **Source of truth, not pages.** A curriculum is a *capability graph* (the single source
   of truth); the path, skill tree, layouts, glossary, and panels are *derived views*.
2. **Capability is defined by assessment, not topic.** A node is a *verified performance*;
   nothing ships without a *diagnostic* assessment.
3. **Quality is gated, not asserted.** A suite of gates travels with the engine so the
   cheap, thin, wrong, or drifted path *fails* — for hand-authored and generated content
   alike.
4. **The hard parameters are discovered, not derived.** Optimal granularity, component
   sharing, and transfer have no a-priori theory; the method specifies the *instrumentation*
   that lets a built system reveal them, while fixing everything that *can* be specified.

## 0.1 Contribution and audience

The contribution is a *synthesis*, not the invention of any single control: source-of-truth
graph derivation, a gate suite, an adversarial domain-correctness judge, capability-as-
assessment, and located-overlap transfer, combined into one governed authoring/generation
loop. Audience: (1) agents authoring or generating curricula in this system; (2) reviewers
adjudicating whether a curriculum meets the bar; (3) maintainers deciding whether the engine
enforces this method; (4) future operators asking *why* the system derives-and-gates instead
of hand-authoring pages.

## 0.2 Scope and non-applicability

The full method is for **durable, gated, possibly-generated, multi-goal** learning content —
where drift, silent incorrectness, thin coverage, and ungrounded skills are material risks.
It is intentionally heavier than writing one explainer.

The full method is *inappropriate* for: a one-off throwaway explainer; a single static page
with no graph, no assessment, and no reuse; a personal scratch note. The lightweight path is
still governed by honesty: state the one capability the page targets, write *one* assessment
for it, and don't promote scratch content into the source-of-truth graph until it is gated.

Scratch content enters the governed path the moment it is reused by another node, depended on
as a prerequisite, assigned a goal, or published. Prototype status is not a shield once other
nodes depend on it.

## 0.3 Positioning against adjacent practices

- It differs from **course authoring** because the unit is not a lesson page but a *capability
  defined by its assessment*, and the path is *derived* from a graph, not hand-sequenced.
- It differs from **encyclopedia editing** because the organizing object is a *provable
  capability* (stateful, assessed), not an *article of information* (stateless, read).
- It differs from **LLM content generation** because generated output is subordinate to gates,
  an adversarial correctness judge, and a coverage contract — and is held to the *same* bar as
  human-authored content.
- It differs from **instructional design as usually practiced** because the curriculum is a
  machine-checkable artifact: prerequisites, coverage, correctness, richness, grounding, and
  render-fidelity are *gates*, not review-by-discipline.

## 0.4 Methodology falsification tests

A north star is only useful if it can fail. The method has **failed** in any of these
conditions. These are non-empirical: they describe the control that must exist and the
observable state that means it is absent.

| The method guarantees… | Required mechanism | Failure condition |
|---|---|---|
| Views never drift from the source graph | derived skill nodes + positions + a parity gate | a module with no derived node, or a hand-edited node/position in a view |
| No node ships unassessable | every capability carries a *diagnostic* assessment | a node with no assessment, or one whose failure does not localize to a single prerequisite |
| Correctness is verified, not asserted | a calibrated adversarial domain-correctness gate | a definition or example published on author confidence alone, with no judge pass |
| Coverage is a contract | a required-key-ideas gate + an explicit deferred list | a declared key idea absent with no recorded deferral |
| Richness is enforced; no dumps | richness + module-size gates + a frozen degenerate fixture | a thin chain, or an over-sized page, passes the build |
| Grounding is structural | every node reaches a declared goal along `requires` | a node with no upward path to any goal ("when will I use this?" is unanswerable) |
| Transfer is verified, not assumed | per-component mastery + an in-context pretest | credit granted for a shared component without a contextual pretest |
| The page shows the structure | layout-sanity + a full-route visual pass | a rendered view collapses, or a route is never screenshotted |
| Generation meets the human bar | the gates run identically on generated and authored content | generated content ships via a path that bypasses any gate |

If a test fires, the response is not to rationalize it. It is to demote the artifact, repair
the mechanism, or record an explicit, scoped exception with an owner.

## 1. The problem the method addresses

The failure modes are not syntax errors; they are *silent quality failures* that pass a naïve
build:
1. the user-facing path **drifts** from the source graph (hand-wired views lag the data);
2. a node is a **topic-blob** ("use monads") with no assessment, so "mastery" is undefined;
3. a definition is **asserted correct** and is in fact a category error the curriculum exists
   to prevent (this happened repeatedly in practice and passed every structural check);
4. the graph is **thin or dumped** — a linear chain, or a 17-concept page;
5. skills are **inert** — taught decontextualized, so the learner asks "when will I use this?";
6. progress is **over-credited** — transfer assumed, not verified.

The method treats each as a first-order risk with a named control (§0.4).

## 2. Core thesis and the unit

**Thesis:** a learning system is a *gated derivation from a source-of-truth capability graph*,
not a pile of hand-authored pages. The full conceptual model — one node type (a *verified
capability*; concepts collapse in as explain/recognize performances), two axes
(performance-mode × scale), two edge types (`requires`, `composed-of`), components with nested
assessment, and the *granularity criterion that a node's failure must localize to one
prerequisite* — is specified in `CAPABILITY_MODEL.md` and assumed here. The protocol governs
how such a graph is *produced, gated, and operated*.

## 3. Quality is gated, not asserted

The gate suite is the method's enforcement layer; it **travels with the engine** so that any
curriculum — authored or generated — is held to one bar. Gates fall in classes:

- **Structural** — acyclic justified prerequisites; definition/reference closure; banding;
  every edge justified; contrasts symmetric. (FAIL.)
- **Shape** — richness (not a thin chain), module-size (no dumps), depth-band closure, path
  derived-not-drifted, layout-sanity (the view shows the structure). (FAIL.)
- **Coverage** — every declared key idea exists; every term defined; deferred ideas explicit.
  (FAIL on required; WARN on deferred.)
- **Assessment** — every capability node carries an assessment; a failure localizes; high-level
  competencies roll up from their parts. (FAIL.)
- **Correctness** — every definition/example is true under the domain's semantics, checked by a
  calibrated adversarial judge (§7). (FAIL on a stable "wrong"; review on "misleading.")
- **Grounding & transfer** — every node has an upward `requires` path to a goal; overlap credit
  is pretest-verified, never assumed. (FAIL / verified-not-assumed.)

The non-negotiable: **the cheap path must fail.** A thin graph fails richness; an unassessable
node fails the assessment gate; an unverified claim fails correctness; a drifted view fails
parity. Making the rich/correct/grounded path the path of least resistance is the entire point.

## 4. The authoring & generation lifecycle

New content moves through a governed loop, identical whether a human or an agent drives it:

1. **Scope** — fix the *goal(s)* and the *coverage contract* (the required key ideas, seeded
   from authoritative sources). This is the R6 contract for the curriculum.
2. **Propose** — capabilities + definitions/examples; the `requires` and `composed-of` edges;
   per-edge justifications; the components each node decomposes into (mapped to a *canonical
   component registry*, never invented per-node — §12.1).
3. **Partition** — cluster into modules and assign depth bands; the path/skill-tree derives.
4. **Assess** — for every node, a diagnostic assessment (and its component tags); for every
   goal, an integrating capstone.
5. **Generate views & lessons** — prose/quiz/visuals per module (derived + authored).
6. **GATE** — run the full suite (§3) + the visual pass. Every failure is specific and local.
7. **Revise** — fix flagged items; loop until green (loop-until-clean / under a budget).
8. **Curate** — a human supplies *direction and taste* (titles, ordering, goal definitions) and
   reviews the highest-stakes artifacts (assessments, capability decompositions).
9. **Promote** — only gated, curated content enters the source-of-truth graph and publishes.

**Lifecycle invariants:** no node promoted without an assessment; no view hand-edited (only the
graph is); no claim promoted without a correctness pass; no goal without a capstone; no
generated artifact promoted through a path that skips a gate.

## 5. Division of labor (who does what)

The method assigns work to the actor each is good at, and the audit trail shows which.

| Actor | Owns | Must not own alone |
|---|---|---|
| **Programmatic** (gates, derivation) | exhaustive coverage + enforcement: derive views, run every gate, check every edge/term/route | deciding *relevance* or *correctness* of meaning |
| **Agent** (LLM) | generation (capabilities, edges, lessons, assessments) and bounded semantic judgment (correctness, decomposition) | promoting its own output past a gate; defining a *goal* or a high-stakes assessment unreviewed |
| **Human** | direction + taste: which goals matter, titles, ordering; review of goals, capability decompositions, capstone assessments | re-deriving views by hand; overriding a gate without a recorded exception |

Default rule: when actors disagree or required evidence is missing, **do not promote** — keep
the candidate, surface the gate failure, and escalate the judgment, not the override.

## 6. Correctness discipline (correctness is the product)

For a curriculum whose mission is to *prevent category errors*, a subtle content error is a
critical defect. Therefore:
- correctness is **adversarial and calibrated**: an independent judge checks each
  definition/example against the domain's semantics, *probing a named, frozen checklist of the
  domain's classic traps*, against a **frozen calibration set of real, previously-caught
  defects** (the regression gate);
- it is **domain-profiled**: each domain registers a correctness profile (its trap checklist +
  calibration set); a new domain must *also* produce and human-vet its profile;
- it is **policy-bound**: FAIL on a *stable* "wrong" (self-consistency, not a single sample);
  "misleading" is advisory human review;
- it is **never self-asserted**: author confidence is not evidence. (Observed repeatedly:
  careful authors — human and model — ship category errors the gates can't see and only an
  adversarial judge catches; even *fixes* of known errors regress. Hence the standing gate.)

## 7. Risk-tiered rigor

Scrutiny scales with blast radius. Highest-stakes first:
1. **Goal definitions & capstone assessments** — they *define* what a learner is certified to do;
   human-authored or human-vetted, always.
2. **Per-node assessments** — they *define* each node; gated for diagnosticity + correctness.
3. **Capability decompositions / component mappings** — they determine overlap and transfer
   credit; gated against the canonical component registry.
4. **Definitions/examples** — correctness-gated.
5. **Prose/visuals** — structurally gated; lower stakes.

A node's *assessment* is higher-stakes than its *prose*, because the assessment is the node.

## 8. Artifact inventory

Each step leaves a checkable artifact: the **capability graph** (source of truth); the
**coverage contract**; the **module manifest** (titles/order/membership); **per-node
assessments with component tags**; the **gate report**; the **correctness-eval report** (per
node, with trap class); the **visual-pass record** (every route); the **goal→capstone map**.
A step that leaves no artifact cannot be adjudicated and is treated as not done.

## 9. Anti-patterns the method rejects

| Anti-pattern | Detection | Correction |
|---|---|---|
| Hand-wiring a derived view | a node/edge/position authored outside the graph | derive it; delete the hand-wiring |
| Topic-blob node | a node with no assessment, or a non-localizing failure | decompose into assessable task-types |
| Asserted correctness | a claim with no correctness-eval record | run the judge; fix or demote |
| Inert skill | a node with no upward `requires` path to a goal | attach it to a real goal via authentic tasks |
| Assumed transfer | shared-component credit with no contextual pretest | pretest the overlap in the new context |
| One-size granularity | a fixed "level" instead of a `composed-of` zoom axis | model granularity as the axis; navigate it |
| Thin or dumped graph | richness / module-size gate fires | enrich / split |
| Silent coverage gap | a required key idea missing | add it, or record an explicit deferral |

## 10. Adjudication checklist

Use to judge whether a curriculum (or one node) meets the method:
- **Source of truth:** are all views *derived*? Is the graph the only authored structure?
- **Assessability:** does every node have an assessment whose failure localizes to one prereq?
- **Correctness:** does every claim have a passing adversarial-judge record?
- **Coverage:** does every declared key idea exist or carry an explicit deferral?
- **Shape:** does the graph clear richness + module-size, and the view layout-sanity?
- **Grounding:** does every node reach a goal by `requires`? Can the UI answer "when will I use this?"
- **Transfer:** is cross-goal credit pretest-verified, not asserted?
- **Provenance:** can each promoted node be traced to its gate + correctness + curation records?

## 11. Evaluation design (non-empirical)

This document claims no results. It defines how the *method* would be evaluated, with candidate
metrics declared *before* any run:
- *Does grain localize failures?* → fraction of assessment failures that map to a single
  prerequisite.
- *Is overlap real?* → fraction of "shared" components that a contextual pretest confirms vs.
  must repair.
- *Does generation meet the human bar?* → can a generated curriculum pass the same gate suite a
  human-authored one does, including the correctness judge?
- *Does the cheap path fail?* → seeded degenerate/incorrect/drifted inputs must be rejected
  (the frozen negative fixtures).

The target is not zero friction; it is **decision-grade enforcement**: every gate either
catches a real defect class or is removed.

## 12. Limitations, costs, and the load-bearing unknowns

**Costs:** gate maintenance; the correctness judge needs an API budget and a per-domain profile;
authentic-task and capstone assessment are expensive to author well; the artifact trail can
become clutter if not given roles. Mitigation is proportionality (§0.2, §7).

**12.1 The load-bearing unknowns (specifiable as risks, not yet resolvable):**
1. **Canonical component registry.** The transfer/overlap mechanism *requires* that nodes which
   "share" a component decompose to the *same identified* one. Without a canonical registry the
   generator maps into, every node invents its own atoms and overlap is noise. *This is the
   linchpin and is currently unsolved at scale.*
2. **Transfer magnitude.** Whether enough carries that the "X% faster" promise is real, or the
   application-edges must do nearly all the work.
3. **Multi-scale generation coherence.** Whether a coarse capability's children actually compose
   to it and the nested assessments roll up — implying gates we have *not* built (a *part-of
   coverage* gate, an *assessment roll-up* gate).
4. **Per-domain correctness profiles for novel goals.** A brand-new goal has no trap checklist or
   calibration set; the generator must propose one and a human must vet it.

Per Hamming/Victor (`CAPABILITY_MODEL.md` §7), these are the *expected* state of designing at
the theory/unknown boundary. The method's stance is: **specify and gate everything that can be,
instrument the rest, and let the built system reveal the unknowns — do not pretend to derive
them.**

## 13. Method summary

The protocol as a loop:
1. fix the goal and the coverage contract;
2. propose the capability graph (nodes = verified performances; `requires` + `composed-of`
   edges; components mapped to the canonical registry);
3. assess every node diagnostically and every goal with a capstone;
4. derive the views; generate the lessons;
5. **gate everything** — structure, shape, coverage, assessment, correctness, grounding,
   fidelity — so the cheap/wrong/thin/drifted path fails;
6. revise to green;
7. let a human supply direction and taste and review the highest-stakes artifacts;
8. promote only gated, curated, traceable content;
9. operate it instrumented, and let the unknowns (grain, overlap, transfer) be *read off* the
   running system, not argued on paper.

The result is a learning system that can accumulate capability — across goals and over time —
without depending on heroic authoring, unverified generation, or asserted correctness.
