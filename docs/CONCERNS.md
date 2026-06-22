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

*Triage log:* opened 2026-06-22 (Slice 0 / R0 boundary) — C9 resolved; C1, C5, C7 are the live ones to watch.
