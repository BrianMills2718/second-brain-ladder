# Concern register — Second Brain rescope (live, append-only)

Per the `design-plan` skill: every uncertainty/tension/issue captured the moment it
arises, each with a disposition, triaged at **every slice boundary**. Disposition vocab:
`open → resolved | mitigated | accepted (rationale) | escalated (stop/re-plan) | deferred → slice N`.

| # | Concern (what / where / why it matters) | Disposition |
|---|---|---|
| C1 | **Neutrality vs. the owner's LLM-wiki preference** — content could tilt toward the favored paradigm. | **open → mitigated:** per-slice adversarial neutrality audit + the feedback loop; whole-graph neutrality audit as the final slice. |
| C2 | **Gates don't check craft, quiz-distractor quality, judged activities, or neutrality** — a slice can pass `npm run check` and still miss the §11/§15 bar. | **accepted (soft layer, ADR-0008):** mitigated by per-slice adversarial audit + a manual craft rubric until tension-detectors exist. |
| C3 | **Pre-empirical** — nothing here is validated to teach better (METHODOLOGY §13). | **accepted (deferral by design):** the feedback sidebar (Slice 2) is the early readout, explicitly *signal not proof*. |
| C4 | **coverage ↔ skill-focus tension unresolved** — neutrality wants breadth, skill-focus wants only decision-relevant. | **deferred → per slice:** record the §15 tension resolution per module; revisit at the final audit. |
| C5 | **Ownership / PR stacking** — this is the other agent's repo; PRs #1/#2/#3 are open and will drift from `master`. | **open → escalated:** owner decision on merge order/coordination; mitigated by branch-based work (nothing clobbered). |
| C6 | **Research is point-in-time (June 2026)**, partly vendor-influenced/directional. | **accepted:** durable/perishable discipline (§13) — teach concepts, date/quarantine tool specifics. |
| C7 | **coverage.ts mid-migration** — legacy REQUIRED set vs. the new DOMAIN_COVERAGE target can drift. | **open → mitigated:** ratchet `REQUIRED_CONCEPTS` in lockstep within each module slice; final slice confirms full migration. |
| C8 | **Legacy ~100 symbolic concepts — demote vs. delete?** Risk of orphans / broken closure when re-anchoring. | **deferred → per slice:** keep correct ones as the symbolic *branch*; retire true orphans in each slice's cleanup. |
| C9 | **R1 was a horizontal big-bang** ("rewrite the whole graph") — the slicing failure mode. | **resolved:** decomposed into vertical per-module slices (Slice roadmap, RESCOPE_PLAN). |
| C10 | **Feedback sidebar has no users yet** — the readout needs actual usage to produce signal. | **accepted:** build early (Slice 2) so signal accrues over later slices; not on the content critical path. |
| C11 | **godel M2d `cap-first` false-fail + M4/M5 stalled** — the parent roadmap is parked while this proceeds. | **deferred (separate track):** this rescope is a *partial* M5; M2d/M4 resume independently. |
| C12 | **No "activity" type in the Lesson schema** — `Lesson.quiz` is the only interactive field; the judged activity was implemented as a `fill-in` (thin for a mastery "activity"). | **accepted for now; deferred → later slice:** add an activity/exercise type to `types.ts` + a judged construct (or reuse `assessments.ts` LLM-judge). |
| C13 | **Slice 1 appended the Retrieve module at stage 17 (end)** — not yet integrated into the new decision/lifecycle spine; symbolic not yet demoted. | **accepted (walking skeleton):** deferred → spine-restructuring slices (3/4/8 re-anchor ordering + demote symbolic). |
| C14 | **`docs/research/` absent on the rescope branch** (the 17 notes live in PR #2) — Slice-1 authoring relied on RESCOPE_PLAN + standard knowledge, not the notes. | **open → mitigated:** ties C5; resolve via merge order (land research PR #2 into the rescope line) so later slices cite the evidence. |
| C15 | **Advisory WARNs:** goal/sink-drift on `hybrid-search`/`graphrag`/`llm-wiki` (leaves); a `prose-forward-ref` false-positive on pre-existing `kg-rag` (common word "retrieval", not a chip). | **accepted:** leaves are enrichment terminals; the kg-rag hit is not a real forward ref. Revisit when the spine is re-anchored (C13). |

**Re-plan (2026-06-22, after Slice 3):** Slices 1 & 3 proved the "author a module at the new
bar" unknown is *retired*. By the skill's risk-ordering, the **biggest remaining unknown is
now the spine re-anchor (C13)** — can we reorder stages / re-point `introducedIn` / demote
the symbolic body without breaking the derive+gates? So the **next slice is promoted to the
spine re-anchor** (attack it while only 2 modules need moving — cheap to be wrong now),
*before* appending Represent/Construct/Operate/Plan content. Appending 4 more modules first
would compound the re-anchor debt — the skill's "skipping cleanup" failure mode.

*Triage log:*
- 2026-06-22 (Slice 0 / R0 boundary) — C9 resolved; C1, C5, C7 the live watch items.
- 2026-06-22 (Slice 1 boundary, post-audit) — adversarial audit of the Retrieve module: neutrality **PASS** (no favored rung; a confusion + quiz attack "newest=best default"), craft **PASS** (every acronym spelled out; concept-before-syntax; PEA; Therefore/But), correctness **PASS**. One real defect **found & fixed**: the judged activity's scenario (small/changing corpus) contradicted its keyed answer (GraphRAG) — reframed to a large/stable corpus so GraphRAG is unambiguous and the agentic-vs-graph cost contrast is taught. Opened C12–C15. Live watch: C1, C5/C14, C12.
- 2026-06-22 (Slice 3 boundary, post-audit) — Framing module: neutrality **PASS** (three paradigms a fair menu; "none is the answer"; quiz + confusion attack "newer=better"), craft **PASS** (PKM/KG/RAG/MOC/RDF spelled out; PEA; Therefore/But), correctness **PASS** (Lovelace 1815; Curie 1903 Physics / 1911 Chemistry — accurate), activity **PASS** (scenario↔keyed-answer consistent — no repeat of the Slice-1 defect; the sb-retrieve template carried the fix), closure **PASS**. No defects. Concepts directly bake in the owner's earlier corrections (`representation-choice` = the symmetric-relation/n-ary limit; `schema-valid-vs-true`). **C13 now load-bearing:** two Foundations modules (framing, retrieve) sit at the END (stages 17–18) of a symbolic-first order — the dedicated spine re-anchor slice grows more necessary with each append.
- 2026-06-22 (Slice 2 boundary, post-audit) — feedback sidebar: submit-only-on-save **PASS** (form onSubmit, not render/scroll), addressable section keying (slug/index) **PASS**, a11y (dialog/focus/Escape/click-outside/aria) **PASS**, no-reflow (0-width anchor + abs popover) **PASS**, JSON export round-trips **PASS**. No defects. **C10 → mitigated:** the widget exists; the owner can heckle Slice-1 content now (the readout still needs actual use). Env hazard (not a code bug): a stale dev server from another git worktree on :5173 can serve wrong content during `npm run screenshots` — start a fresh `npm run dev` first.
