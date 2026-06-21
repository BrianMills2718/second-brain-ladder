/**
 * R10 — OWL-semantics-trap content eval (the headline machinery from
 * docs/MACHINERY_NEEDED.md). For each concept that makes a semantic claim
 * (entails / inconsistent / classified / rejected / derives), an LLM judge TRACES
 * the entailments under the open-world assumption + no-unique-names and decides
 * whether the claim actually holds, explicitly probing the five traps that every
 * hand-authored defect this project hit fell into:
 *   OWA-as-CWA · no-unique-names · inference-vs-validation · vacuous-truth≠OWA · axiom-direction
 *
 * Two modes:
 *   node scripts/check-content-correctness.mjs            # frozen labeled set (regression/CI)
 *   node scripts/check-content-correctness.mjs --all      # every concept in concepts.ts
 *
 * Frozen mode is the proof: it must flag the 3 historical defects and pass the
 * corrected concepts, else it exits non-zero. (In production this judge would route
 * through llm_client with task=/trace_id=/max_budget=; here it calls OpenRouter
 * directly so the static repo has no Python dependency.)
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { R10_CASES } from "./fixtures/r10-cases.mjs";

const ALL = process.argv.includes("--all");

/** Provider list, tried in order until one succeeds (keys get rate/budget limited).
 *  OpenAI direct first (a real project key), then each OpenRouter key. */
function providers() {
  const list = [];
  if (process.env.OPENAI_API_KEY)
    list.push({ name: "openai", url: "https://api.openai.com/v1/chat/completions", key: process.env.OPENAI_API_KEY, model: process.env.R10_OPENAI_MODEL || "gpt-5-mini" });
  const orKeys = [];
  if (process.env.OPENROUTER_API_KEY_2) orKeys.push(process.env.OPENROUTER_API_KEY_2);
  for (const k of (process.env.OPENROUTER_API_KEYS || "").split(",").map((s) => s.trim()).filter(Boolean)) orKeys.push(k);
  for (const k of [...new Set(orKeys)])
    list.push({ name: "openrouter", url: "https://openrouter.ai/api/v1/chat/completions", key: k, model: process.env.R10_MODEL || "openai/gpt-5-mini" });
  return list;
}
const PROVIDERS = providers();
let CHOSEN = null; // pin the first provider that works

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    verdict: { type: "string", enum: ["correct", "wrong", "misleading"], description: "correct = the semantic claim holds under OWL semantics; wrong = the claim is false; misleading = technically defensible but plants a misconception" },
    trap: { type: ["string", "null"], enum: ["owa-as-cwa", "no-unique-names", "inference-vs-validation", "vacuous-truth-not-owa", "axiom-direction", null], description: "which trap, if any" },
    reasoning: { type: "string", description: "trace the relevant entailments under OWA + no-UNA in 1-3 sentences" },
    fix: { type: ["string", "null"], description: "the minimal correction if not correct, else null" },
  },
  required: ["verdict", "trap", "reasoning", "fix"],
};

const SYSTEM = `You are a strict OWL 2 / RDF 1.1 semantics checker for an educational site whose mission is to PREVENT category errors. Given a concept's definition and example, decide whether its semantic claim is CORRECT under standard OWL semantics. Reason explicitly under the OPEN-WORLD ASSUMPTION and NO-UNIQUE-NAMES assumption; trace the actual entailments.

Probe these traps specifically:
- owa-as-cwa: calling something "inconsistent" when under OWA it is merely not-entailed or merely inferred (needs a disjointness/cardinality axiom to actually contradict).
- no-unique-names: "two different values ⇒ inconsistent" — true for distinct literals, FALSE for object individuals (inferred sameAs unless known distinct).
- inference-vs-validation: attributing rejection of data to the reasoner (the reasoner entails / flags inconsistency; SHACL validation rejects).
- vacuous-truth-not-owa: tying empty-set universal (allValuesFrom) truth to OWA when it is plain first-order quantifier semantics (true under CWA too).
- axiom-direction: wrong direction of subClassOf/subPropertyOf ⊑, domain (types subject) vs range (types object), or property-chain orientation.

Be skeptical; a claim that is structurally plausible but semantically false is "wrong"; one that is defensible but teaches a misconception is "misleading". Only "correct" if the claim genuinely holds.`;

async function callProvider(p, messages) {
  const body = {
    model: p.model,
    messages,
    response_format: { type: "json_schema", json_schema: { name: "owl_verdict", strict: true, schema: SCHEMA } },
  };
  const res = await fetch(p.url, {
    method: "POST",
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${p.name} HTTP ${res.status}: ${(await res.text()).slice(0, 160)}`);
  const data = await res.json();
  return JSON.parse(data.choices?.[0]?.message?.content);
}

async function judge(c) {
  const messages = [
    { role: "system", content: SYSTEM },
    { role: "user", content: `Concept: ${c.term}\nDefinition: ${c.short}\nExample: ${c.example ?? "(none)"}\n\nIs the semantic claim correct under OWL semantics?` },
  ];
  if (CHOSEN) return callProvider(CHOSEN, messages);
  let lastErr;
  for (const p of PROVIDERS) {
    try { const r = await callProvider(p, messages); CHOSEN = p; console.log(`(using ${p.name} / ${p.model})\n`); return r; }
    catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error("no providers");
}

async function loadConcepts() {
  const out = join(tmpdir(), `sb-r10-${process.pid}.mjs`);
  const stub = join(tmpdir(), `sb-r10-stub-${process.pid}.ts`);
  writeFileSync(stub, `export { CONCEPT_GRAPH } from ${JSON.stringify(process.cwd() + "/src/content/concepts.ts")};`);
  await build({ entryPoints: [stub], bundle: true, format: "esm", outfile: out, logLevel: "error" });
  const { CONCEPT_GRAPH } = await import(pathToFileURL(out).href);
  rmSync(out, { force: true }); rmSync(stub, { force: true });
  return CONCEPT_GRAPH.concepts;
}

const CLAIMY = /entail|inconsist|consisten|classif|reject|deriv|contradict|violat|infer|vacuous|sameas|same individual|disjoint/i;

if (!PROVIDERS.length) {
  console.error("R10 eval: no API key in env (OPENAI_API_KEY / OPENROUTER_API_KEY_2 / OPENROUTER_API_KEYS). The eval is built and runnable; set a key to run it.");
  process.exit(2);
}

const cases = ALL
  ? (await loadConcepts())
      .filter((c) => CLAIMY.test(`${c.short} ${c.example ?? ""}`))
      .map((c) => ({ id: c.id, term: c.term, short: c.short, example: c.example, expect: null }))
  : R10_CASES;

console.log(`R10 eval: ${cases.length} ${ALL ? "claim-bearing concepts" : "frozen cases"} (providers: ${PROVIDERS.map((p) => p.name + "/" + p.model).join(", ")})\n`);

let mismatches = 0, flagged = 0, errors = 0;
for (const c of cases) {
  let v;
  try { v = await judge(c); }
  catch (e) { console.log(`  ERROR ${c.id}: ${e.message}`); errors++; continue; }
  const isCorrect = v.verdict === "correct";
  if (!isCorrect) flagged++;
  const tag = isCorrect ? "ok " : "FLAG";
  let label = "";
  if (c.expect) {
    const expectedCorrect = c.expect === "correct";
    const matched = expectedCorrect === isCorrect;
    if (!matched) mismatches++;
    label = matched ? "  ✓expected" : "  ✗MISMATCH(expected " + c.expect + ")";
  }
  console.log(`  [${tag}] ${c.id} → ${v.verdict}${v.trap ? " (" + v.trap + ")" : ""}${label}`);
  if (!isCorrect) console.log(`         ${v.reasoning}${v.fix ? "\n         fix: " + v.fix : ""}`);
}

console.log(`\n${flagged} flagged / ${cases.length} (${errors} errors).`);
if (!ALL) {
  if (errors) { console.error("R10 frozen eval had call errors — cannot certify."); process.exit(2); }
  if (mismatches) { console.error(`✗ R10 eval: ${mismatches} label mismatch(es) — the judge mis-classified the calibration set.`); process.exit(1); }
  console.log("✓ R10 eval: flagged all historical defects, passed all corrected concepts.");
}
