# Overnight autonomous build — mission & acceptance

**Started:** 2026-06-21. **Directive:** "set up all work … then implement until it is
done." NEVER STOP except for genuinely irreversible+shared-state actions or an
un-defaultable architectural decision. Re-read this file after any compaction.

## Mission
Take the second-brain-ladder from "rich concept graph + partial page" to an
**optimal, high-quality, self-enforcing** educational site, while **stress-testing
the generation system and building the machinery** that makes producing these
reliable. The machinery is the real product: build the deterministic gates and the
LLM content-correctness eval that operationalize `docs/MACHINERY_NEEDED.md`, then let
them force the content to high quality.

## Strategy (build the gates first, then the content must meet them)
1. **Gates first.** Implement the deterministic gates (R1 richness, R12 lints,
   R13 per-band closure, R4 glossary, goal/sink drift) in `scripts/validate-content.mjs`
   + a frozen thin-graph fixture. Then fix everything they flag.
2. **R10 eval.** Build the LLM OWL-semantics-trap checker (the headline machinery),
   proven on the 3 known historical defects.
3. **Content breadth**, band-tagged, lessons written, R10-verified.
4. **Polish**: glossary, lessons-teach-concepts, achievements, full visual pass.

## Acceptance (done = all green)
- `npm run check` green WITH the new gates active.
- New gates actually fire on bad input (frozen thin-graph fixture FAILS richness; a
  seeded forward-ref/minimality/band-closure violation FAILS).
- R10 eval runs, catches the 3 historical defects, passes the corrected concepts.
- Every concept band-tagged or correctly defaulted; per-band closure holds; depth
  selector legible at each band (visual pass).
- Every concept term has a glossary entry (R4 gate green).
- Each stage's lesson teaches its concepts (no 18-concept dump); concept panel
  band-grouped.
- Querying + modeling-depth branches added (the "queryable" promise fulfilled),
  R10-verified.
- Achievements/assessments cover declared goals.
- `npm run screenshots` green on ALL routes; concept graph legible at depth.
- `MACHINERY_NEEDED.md` updated: what got built vs deferred. Deploy green.

## Working rules
- Commit + push every verified increment (small commits). Use `GH_CONFIG_DIR=/home/brian/.config/gh-personal`.
- Content correctness is the product: after any content slice, run the R10 re-audit
  (subagent or the eval) before declaring it done. Math/OWL errors are critical bugs.
- Update tasks (TaskUpdate) as you go. Log findings in MACHINERY_NEEDED.md pain log.
- Circuit breaker: 3 failed attempts at the same problem with no new info → log + move on.

## Progress log (append; newest last)
- 2026-06-21: mission set; tasks created. Starting Phase 1 (gates).
