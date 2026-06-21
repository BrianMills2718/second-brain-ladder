/**
 * Machinery gates over the concept graph — the deterministic half of
 * docs/MACHINERY_NEEDED.md, as pure functions so the validator and a unit test can
 * both call them. Each returns { fail: string[], warn: string[] } (or a plain
 * string[] of failures where noted). FAIL breaks the build; WARN is advisory.
 *
 * Convention (pinned once, to avoid the in/out-degree confusion the doc itself hit):
 *   - dependants(C) = how many concepts list C as a prerequisite (C is a hub)
 *   - prereqs(C)    = how many prerequisites C declares (C is a hard idea)
 */

const BANDS = ["foundations", "practitioner", "expert", "frontier"];
export const bandRank = (b) => Math.max(0, BANDS.indexOf(b ?? "foundations"));

export function degrees(concepts) {
  const dependants = {}, prereqs = {};
  for (const c of concepts) { dependants[c.id] = 0; prereqs[c.id] = (c.prerequisites || []).length; }
  for (const c of concepts) for (const p of c.prerequisites || []) if (dependants[p] !== undefined) dependants[p]++;
  return { dependants, prereqs };
}

/** Longest prerequisite chain (depth of the prereq DAG). */
export function longestChain(concepts) {
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const memo = {};
  const depth = (id) => {
    if (memo[id] !== undefined) return memo[id];
    memo[id] = 1; // guard against accidental cycles (validated elsewhere)
    let d = 1;
    for (const p of byId[id]?.prerequisites || []) if (byId[p]) d = Math.max(d, 1 + depth(p));
    return (memo[id] = d);
  };
  let m = 0;
  for (const c of concepts) m = Math.max(m, depth(c.id));
  return m;
}

export function contrastPairCount(concepts) {
  const seen = new Set();
  for (const c of concepts) for (const x of c.contrasts || []) seen.add([c.id, x].sort().join("|"));
  return seen.size;
}

export const RICHNESS_THRESHOLDS = {
  minHubs: 3, hubDeg: 3,        // >=3 concepts with >=3 dependants
  minHard: 3, hardDeg: 3,       // >=3 concepts with >=3 prerequisites
  minContrasts: 5,              // >=5 contrast pairs
  maxDepthWidthRatio: 3,        // longest_chain / max_stage_width <= 3
};

/** R1 — structural richness. Returns failures (degenerate/chain-like → reject). */
export function richnessGate(concepts, T = RICHNESS_THRESHOLDS) {
  const fail = [];
  const { dependants, prereqs } = degrees(concepts);
  const hubs = concepts.filter((c) => dependants[c.id] >= T.hubDeg).length;
  const hard = concepts.filter((c) => prereqs[c.id] >= T.hardDeg).length;
  const cp = contrastPairCount(concepts);
  const width = {};
  for (const c of concepts) width[c.introducedIn] = (width[c.introducedIn] || 0) + 1;
  const maxWidth = Math.max(1, ...Object.values(width));
  const depth = longestChain(concepts);
  if (hubs < T.minHubs) fail.push(`richness: only ${hubs} hub concept(s) with >=${T.hubDeg} dependants (need >=${T.minHubs}) — graph too chain-like`);
  if (hard < T.minHard) fail.push(`richness: only ${hard} concept(s) with >=${T.hardDeg} prerequisites (need >=${T.minHard}) — no genuinely hard ideas`);
  if (cp < T.minContrasts) fail.push(`richness: only ${cp} contrast pair(s) (need >=${T.minContrasts}) — category errors under-represented`);
  if (depth / maxWidth > T.maxDepthWidthRatio) fail.push(`richness: depth/width ${depth}/${maxWidth} = ${(depth / maxWidth).toFixed(1)} > ${T.maxDepthWidthRatio} — a ladder, not a graph`);
  return fail;
}

/** R13 — per-band closure. A concept must not be SHALLOWER than any prerequisite
 *  (else a depth view would show it with a hidden dependency). Uses RAW bands —
 *  this is the gate that catches hand-tagging mistakes before the renderer's
 *  effective-band derivation papers over them. */
export function bandClosureGate(concepts) {
  const fail = [];
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  for (const c of concepts) {
    const cb = bandRank(c.band);
    for (const p of c.prerequisites || []) {
      const pb = bandRank(byId[p]?.band);
      if (pb > cb) fail.push(`band-closure: ${c.id} (${c.band ?? "foundations"}) has a deeper prerequisite ${p} (${byId[p]?.band}) — a ${c.band ?? "foundations"} view would dangle. Deepen ${c.id} or shallow ${p}.`);
    }
    if (c.band && !BANDS.includes(c.band)) fail.push(`band: ${c.id} has invalid band "${c.band}"`);
  }
  return fail;
}

/** Effective band: max of own + all prerequisites' (the renderer's derivation). */
export function effectiveBands(concepts) {
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const memo = {};
  const eff = (id) => {
    if (memo[id] !== undefined) return memo[id];
    memo[id] = bandRank(byId[id]?.band);
    let b = bandRank(byId[id]?.band);
    for (const p of byId[id]?.prerequisites || []) if (byId[p]) b = Math.max(b, eff(p));
    return (memo[id] = b);
  };
  const out = {};
  for (const c of concepts) out[c.id] = eff(c.id);
  return out;
}

const stripChips = (s) => (s || "").replace(/@[cnt]\{[^}]*\}/g, " ");
const COMMON = new Set(["axioms", "rules", "values", "things", "person", "place"]);

/** R12 — prose forward-reference (WARN). Scans plain prose (chips stripped) for a
 *  distinctive term belonging to a LATER stage. Caught the axiom-in-tbox bug. */
export function proseForwardRefs(concepts, stageNum) {
  const warn = [];
  for (const c of concepts) {
    const prose = (stripChips(c.short) + " " + stripChips(c.example)).toLowerCase();
    for (const d of concepts) {
      if (d.id === c.id) continue;
      if (stageNum(d.introducedIn) <= stageNum(c.introducedIn)) continue;
      const term = d.term.toLowerCase();
      if (term.length < 5 || COMMON.has(term)) continue;
      const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`);
      if (re.test(prose)) warn.push(`prose-forward-ref: ${c.id} (${c.introducedIn}) prose mentions "${d.term}" introduced later in ${d.introducedIn}`);
    }
  }
  return warn;
}

/** R12 — contrast staging (WARN): a contrasts target introduced at a later stage. */
export function contrastStaging(concepts, stageNum) {
  const warn = [];
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  for (const c of concepts)
    for (const x of c.contrasts || [])
      if (byId[x] && stageNum(byId[x].introducedIn) > stageNum(c.introducedIn))
        warn.push(`contrast-staging: ${c.id} (${c.introducedIn}) contrasts ${x} (${byId[x].introducedIn}, later) — chip surfaces before its concept`);
  return warn;
}

/** R12 — prerequisite minimality (WARN): a direct prereq implied transitively. */
export function prereqMinimality(concepts) {
  const warn = [];
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  const anc = (id, memo = {}) => {
    if (memo[id]) return memo[id];
    const seen = new Set();
    const st = [...(byId[id]?.prerequisites || [])];
    while (st.length) { const u = st.pop(); if (seen.has(u)) continue; seen.add(u); st.push(...(byId[u]?.prerequisites || [])); }
    return (memo[id] = seen);
  };
  for (const c of concepts) {
    const direct = c.prerequisites || [];
    for (const p of direct) {
      for (const q of direct) {
        if (p === q) continue;
        if (anc(q).has(p)) { warn.push(`prereq-minimality: ${c.id} lists ${p} directly, but ${q} already implies it transitively`); break; }
      }
    }
  }
  return warn;
}

/** R12 — goal/sink drift (WARN): a graph sink that is not a declared goal. */
export function goalSinkDrift(concepts, goals) {
  const hasDependent = new Set();
  for (const c of concepts) for (const p of c.prerequisites || []) hasDependent.add(p);
  const goalSet = new Set(goals || []);
  return concepts
    .map((c) => c.id)
    .filter((id) => !hasDependent.has(id) && !goalSet.has(id))
    .map((id) => `goal/sink-drift: ${id} is a sink (nothing depends on it) and not a declared goal — promote to a goal or accept as an enrichment leaf`);
}

/** R4 — glossary coverage (FAIL on missing). glossarySlugs is a lowercased Set. */
export function glossaryCoverage(concepts, glossarySlugs) {
  const fail = [];
  for (const c of concepts)
    if (!glossarySlugs.has(c.term.toLowerCase()))
      fail.push(`glossary-coverage: concept "${c.term}" (${c.id}) has no glossary entry`);
  return fail;
}

/** R14 — module size. A page/module (`introducedIn`) must hold a digestible number of
 *  concepts; a 17-concept page is a dump that must be split. Empty modules (orientation)
 *  are exempt. Returns FAILs for over-max. */
export const MODULE_SIZE = { max: 9 };
export function moduleSizeGate(concepts, T = MODULE_SIZE) {
  const byModule = {};
  for (const c of concepts) (byModule[c.introducedIn] ??= []).push(c.id);
  const fail = [];
  for (const [m, ids] of Object.entries(byModule))
    if (ids.length > T.max)
      fail.push(`module-size: "${m}" has ${ids.length} concepts (max ${T.max}) — split into focused pages (R14, docs/PATH_DERIVATION.md)`);
  return fail;
}

/** R12 — layer consistency (WARN): sibling concepts (one is-a/refines the other) in
 *  different layers. Heuristic: a concept and a prereq tagged kind is-a/refines. */
export function layerConsistency(concepts, prereqKindOf) {
  const warn = [];
  const byId = Object.fromEntries(concepts.map((c) => [c.id, c]));
  for (const c of concepts)
    for (const p of c.prerequisites || []) {
      const k = prereqKindOf(c.id, p);
      if ((k === "is-a" || k === "refines") && byId[p] && byId[p].layer !== c.layer)
        warn.push(`layer-consistency: ${c.id} (${c.layer}) ${k} ${p} (${byId[p].layer}) — siblings in different layers`);
    }
  return warn;
}
