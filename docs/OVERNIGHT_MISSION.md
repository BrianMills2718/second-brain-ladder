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
- 2026-06-21: Phase 1 done — gates built. richness (R1) + thin-graph regression,
  structural lints (R12), per-band closure (R13), glossary coverage (R4); all wired
  into `npm run check`. Fixed the real lint hits (axiom re-staged to sb-onto).
- 2026-06-21: R10 eval built + proven — `check-content-correctness.mjs` flags the 3
  historical defects with correct trap class, passes corrected concepts (live,
  gpt-5-mini, 0 mismatch). Ran `--all`: 0 wrong, 8 advisory "misleading"; tightened
  reasoner/rule/shacl wording. Policy: FAIL-on-wrong, WARN-on-misleading.
- 2026-06-21: Content — querying branch (query/BGP/SPARQL/Cypher/property-path) and
  modeling-depth (n-ary/reification/named-graph/temporal + object/datatype property).
  60 concepts. Lessons extended; concept panel band-grouped (R2). a-reason achievement
  + cap-reason assessment (R9). Visual pass green at 60 nodes (grid + depth selector
  keep it legible; band-grouped panel replaces the 18-item dump).
- 2026-06-21: 8/13 Definition-of-Done rows green (the deterministic gates + R10
  eval + bands). Remaining: domain-coverage gate (R6 auto), derived wiring (R8/R9),
  layout-sanity assertion (R11). All committed + pushed; deploy verified.
- 2026-06-21 (continued, "proceed until done"): built the remaining gates — R11
  layout-sanity (catches the 1-column collapse without a browser), R6 domain-coverage
  (coverage.ts REQUIRED/DEFERRED + gate; added taxonomy/thesaurus/competency-question/
  ontology-reuse), R9 goal→achievement alignment, R10 stage↔node parity. 64 concepts.
  R10 eval over all 64: 0 hard errors (fixed shacl-validation/taxonomy wording).
  **12/13 DoD rows green, 1 partial (row 10 positions deliberately manual).** The cheap
  path now fails every quality gate. Build + all gates green; deploy verified.
