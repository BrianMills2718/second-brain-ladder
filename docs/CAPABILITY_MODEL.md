# The capability-graph model & UX — the end-goal vision

**Status:** north-star design (not implemented). This is the *learning model and UX* the
long-term product rests on; `ENGINE.md` is the *engine architecture* that would serve
it. Distinct from the current site (a single hand-authored curriculum). Developed as a
design conversation; it deliberately marks what's **settled** vs what only a **built,
instrumented system can answer** (see §7 — that honesty is part of the methodology).

**One-line goal:** a "Wikipedia for any goal" — but where the unit is not an *article of
information* you read, it is a **proven capability** you can *do*, and the structure is
the prerequisite-ordered **pathway** to acquiring it, personalized to your goal and your
current mastery. A tech tree for human capability.

---

## 1. The reframe: capability, not information
| | Wikipedia | This |
|---|---|---|
| Unit | an article (a topic) | a **capability** (an assessable performance) |
| Contract | "after reading, you *know about* X" | "after this, you *can do* X — and we verified it" |
| State | stateless | **stateful** — tracks what you've proven |
| Navigation | curiosity / hyperlinks | **goal** → your derived pathway |

It differs from adjacent things too: vs **Duolingo/skill-tree apps** it's *any* goal,
*generated*, *cross-domain* (not one curated tree); vs **Coursera/Khan** it's a *graph*
that derives *your* path to *your* goal (not a one-size course); vs a **knowledge
graph/Roam** it's about *acquiring capability with pedagogy + proof* (not linking notes).

---

## 2. The model (this part is settled)
### One node type
A node is **a verified capability** — a performance with an assessment. *Concepts collapse
in*: "knowing what a derivative is" is just the capability to *explain / recognize / answer
about* it. This is the mainstream assessment-design position (Wiggins & McTighe's
*Understanding by Design* defines understanding *as* a bundle of performances; Bloom's
"knowledge/comprehension" are verbs). There is no "knowing" to build on other than the
performances. (Philosophically contestable — the "pass every test but not *really*
understand" objection — but moot for a built system: the performances are all we can act on.)

### Two descriptive axes (not layers)
A capability is located by two dimensions, both continuous:
- **Performance mode:** `explain → recognize/classify → compute → solve → apply-in-an-authentic-task`.
- **Scale / granularity:** `atomic skill → situated task → broad competency`.

"Concept vs capability vs sub-competency vs competency" was conflating *mode* and *scale*
with *type*. There is one type; mode and scale are properties.

### Two edge types (keep them distinct)
- **`requires`** (prerequisite) — *learning order*. Drives the path and remediation. A
  capability requires finer capabilities and the concepts (explanatory capabilities) beneath it.
- **`composed-of`** (part-of) — *granularity / zoom*. A coarse capability decomposes into
  finer ones; this is the axis you navigate. It is a **graph, not a tree**: a sub-capability
  is `composed-of` *many* coarse ones (`find an optimum` ∈ pricing ∧ gradient-descent ∧
  beam-sizing) — that shared reuse across domains is the whole "Wikipedia scale."

They correlate (a task's parts are usually prerequisites for it) but differ: prerequisites
also include enabling knowledge that isn't a *part* of the performance.

### Components & nested assessment
Capabilities decompose into **components** (the knowledge-component grain). Assessment
**nests by scale**: leaves get recall/explain checks; mid-level authentic tasks get
performance assessments; broad competencies are demonstrated by *composition* (you've "got"
it when you can do its parts + an integrating capstone — how competency-based education
actually works). The assessment graph mirrors the capability graph.

**Granularity criterion (how to pick the grain):** a capability is at the right grain when
**failing its assessment is *diagnostic*** — it points to *one* remediable prerequisite. Too
broad → a failure tells you nothing; too narrow → the test is trivial. This ties grain to
the whole point of a prerequisite graph (remediation), and — see §4 — it is *required*, not
just nice, because pretests must localize to components.

---

## 3. Grounding — "when will I ever use this?"
The perennial student question is a *symptom* of organizing around decontextualized
skill-atoms ("inert knowledge"). The fix: **the goal-facing nodes are authentic, grounded
capabilities** ("price a product to maximize profit," "train a model that converges"); the
skills/concepts are the prerequisite graph *beneath* them. (Task-centered instructional
design — van Merriënboer's 4C/ID, Merrill's First Principles: authentic whole tasks are the
spine; skills are taught *in service of* them.)

Crucially, **grounding is relational, not intrinsic.** The same skill (`differentiate`) is
grounded differently per goal — marginal cost (economist), gradient descent (ML), velocity
(physicist), the object itself (mathematician). So you don't attach *the* real-world task to
a node; **"when will I use this" is answered by the path *up* to the learner's declared
goal.** The system always shows *why you're here*: "you're learning this because your goal
*X* requires *Y* requires this." Motivation is structural, surfaced by the UI — not exhortation.

---

## 4. Transfer & compounding progress (the killer feature, honestly mechanized)
Because skill nodes are **shared** (authored once, feed many goals), **progress compounds
across goals**: mastering nodes for goal A literally shortens goal B. *"You're already 60%
of the way to 'train a model that converges' — you have 7 of its 12 prerequisites."* No
course platform does this; it falls out of shared nodes. This is the meta-progression a tech
tree has and education never does.

But the naïve version over-claims, because **far transfer is weak** — a shared node doesn't
mean the *ability* ported. The honest mechanism: **don't assume transfer, locate and verify
it.**
- A and B are distinct nodes that share a *located* set of **components** (overlap = the
  *intersection of component sets*, not a percentage).
- Mastery is traced **per component** (knowledge tracing). Your "doneness" of B is a *prior*.
- On starting B, the system **pretests the shared components in B's context** → confirm,
  repair the weak ones, and fully teach the non-shared rest.

This *converts* the transfer pessimism into a feature: the pretest **catches** far-transfer
failures (you "knew" optimization in calculus, fail it in pricing), and re-learning it *in
context* **is** the transfer instruction. The system can't over-credit. The user-facing
promise becomes honest and falsifiable: not *"you're 60% done,"* but *"because you did A, B
should be ~60% faster — we'll confirm by pretest."*

**What this *requires* (the linchpin):** a **consistent, shared component vocabulary across
nodes**, and **assessments tagged to components**. If A and B were decomposed into different
component sets, the overlap is fake and the pretest probes the wrong things. This is the same
hard decomposition problem throughout, now load-bearing.

---

## 5. UI/UX — the ladder of abstraction
The fine capability/component graph is the **source of truth**; the user-facing graph is a
**derived, coarsened, zoomable view** (the current concept-graph → skill-graph derivation,
generalized). Per Bret Victor's *Ladder of Abstraction*: the power is in **moving fluidly
between levels**, and **every abstraction must step *down* to its concretes**.

- **Semantic zoom** (the make-or-break for Wikipedia scale): `fields → capabilities →
  components`, like Google Maps (country → city → street). You almost never see the whole
  graph — you see your route and its neighborhood, **mastery-colored** (passed / available /
  locked). It is *not* two fixed levels but a continuum the learner controls altitude on; a
  bundled "Derivatives" node always steps down to its component capabilities and their
  assessment items. (Backend-fine, frontend-bundled: `explain-derivative` and
  `compute-derivative` may be separate backend nodes but surface to the user as two
  *assessment questions* on one tile.)
- **The surfaces:**
  1. **Goal intake** — "what do you want to be able to *do*?" → resolve to a target capability
     (or generate one) → compute the route from your current frontier.
  2. **The pathway** (primary) — your goal-scoped ladder: a metro-map from "you are here" to
     the goal, with branches and cross-domain detours.
  3. **The capability page** (the unit) — *what you'll be able to do*, the path in (prereqs)
     and out (unlocks), the lesson, and front-and-center **PROVE IT** (the assessment).
  4. **The map** — the broader graph at the right zoom, mastery-colored, explorable.
  5. **Progress / frontier** — always-on state; the compounding "X% to your next goal."
- **Mastery & pretest are computed on the fine graph, displayed coarse** — a progress bar, a
  short in-context pretest — so the fine-grained backend stays tractable to the user.

```
 "I want to be able to … price a product to maximize profit"
   YOUR PATHWAY        ● proven  ◐ available  ○ locked
   ●functions ─ ◐derivative ─ ○find-optimum ─ ◎ GOAL
                                 └ detour: ○model-a-situation
   depth ◉practitioner   "you're 60% there — let's pretest the overlap ▸"
   ── capability tile ──  "Find the optimum of a profit function"
      prereqs ◐ · unlocks: pricing, inventory · LEARN ▸ … · PROVE IT ▸
```

---

## 6. Relation to the current code
second-brain-ladder is the **embryo** of this: `concepts` (each with a `microQuiz` = an
*explain/recognize* capability with an assessment) + `achievements`/`assessments` (the
*capability* layer — but only ~3, so it never felt like a spine). The vision generalizes:
make **capabilities the rich spine**, resting on concepts, all one node type; add the
**component + mastery + pretest** layer; and the **zoomable ladder** UX. `ENGINE.md` says how
to build the engine that serves any such curriculum; this doc says what it organizes and how
it feels.

---

## 7. What's settled vs. what only a built system can answer
**Settled (the model above):** one node type (verified capability); two axes (mode, scale);
two edge types (`requires`, `composed-of`); components with nested assessment; grounding as
the upward path; transfer via located-overlap + pretest; fine source-of-truth, derived
zoomable views.

**Designing without theory (the stance).** We have *no theory* of the optimal granularity,
whether components are truly shared, or how much transfers — and per Hamming/Victor, *that is
the expected state at the theory/unknown boundary.* You don't derive these on paper; you
build an **instrumented, explorable** system and read the answers off real data. The criteria
we landed on are exactly such **empirical readouts**:
- *Is the grain right?* → **do failures localize to one prerequisite?**
- *Does it transfer / is the overlap real?* → **what does the pretest confirm vs. repair?**

These are *observations* of a running system, not decisions. The gates + assessment data are
the instrumentation. **The model is now clean enough; the remaining questions are empirical,
and the next insight comes from the built artifact, not more armchair refinement.**

**The load-bearing open problems (in priority order):**
1. **Component-vocabulary consistency** — do nodes that "share" a component truly decompose to
   the *same identified* one, or does every node invent its own atoms (→ the overlap graph is
   noise)? Hand-authored = consistency-by-discipline; generated = needs a **canonical
   component registry** the generator maps into. *The linchpin of the whole adaptive mechanism.*
2. **Transfer magnitude** — does enough actually carry that the "X% faster" promise is real,
   or do the application-edges have to do nearly all the work?
3. **Authentic-task assessment at scale** — performance/portfolio assessment is far harder and
   messier than exercise grading; can it be authored/generated reliably and gamed-resistantly?
4. **Generation: multi-scale coherence** — do a coarse capability's children actually compose
   to it, and do the nested assessments roll up? (Implies new gates: a *part-of coverage* gate
   and an *assessment roll-up* gate.)
5. **Navigation model** — lead with authentic tasks (4C/ID pedagogy) or with skills? The right
   *pedagogy* and the right *navigation* may differ.
