/**
 * Unit test for the machinery gates (scripts/gates.mjs). Run: node scripts/test-gates.mjs
 * The key regression: the richness gate MUST FAIL the frozen thin-graph fixture and
 * MUST PASS the real concept graph. If the gate ever passes the thin graph, it has
 * drifted to enforcing nothing.
 */
import { build } from "esbuild";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { richnessGate, bandClosureGate, prereqMinimality, degrees } from "./gates.mjs";
import { THIN_CONCEPTS } from "./fixtures/thin-graph.mjs";

const out = join(tmpdir(), `sb-gates-test-${process.pid}.mjs`);
const stub = join(tmpdir(), `sb-gates-stub-${process.pid}.ts`);
writeFileSync(stub, `export { CONCEPT_GRAPH } from ${JSON.stringify(process.cwd() + "/src/content/concepts.ts")};`);
await build({ entryPoints: [stub], bundle: true, format: "esm", outfile: out, logLevel: "error" });
const { CONCEPT_GRAPH } = await import(pathToFileURL(out).href);
rmSync(out, { force: true });
rmSync(stub, { force: true });

const fails = [];
const expect = (cond, msg) => { if (!cond) fails.push(msg); };

// 1. Richness gate FAILS the thin fixture.
const thinResult = richnessGate(THIN_CONCEPTS);
expect(thinResult.length > 0, "richness gate did NOT fail the thin-graph fixture — it enforces nothing");
console.log(`thin-graph richness failures (expected >0): ${thinResult.length}`);
for (const f of thinResult) console.log("    " + f);

// 2. Richness gate PASSES the real graph.
const realResult = richnessGate(CONCEPT_GRAPH.concepts);
expect(realResult.length === 0, `richness gate FAILED the real graph (should pass): ${realResult.join("; ")}`);

// 3. Band closure holds on the real graph.
const bandResult = bandClosureGate(CONCEPT_GRAPH.concepts);
expect(bandResult.length === 0, `band-closure FAILED the real graph: ${bandResult.join("; ")}`);

// 4. Report (informational) the real graph's hub/hard stats.
const { dependants, prereqs } = degrees(CONCEPT_GRAPH.concepts);
const hubs = CONCEPT_GRAPH.concepts.filter((c) => dependants[c.id] >= 3).length;
const hard = CONCEPT_GRAPH.concepts.filter((c) => prereqs[c.id] >= 3).length;
console.log(`real graph: ${CONCEPT_GRAPH.concepts.length} concepts, ${hubs} hubs(>=3 dependants), ${hard} hard(>=3 prereqs), ${prereqMinimality(CONCEPT_GRAPH.concepts).length} minimality warnings`);

if (fails.length) {
  console.error(`✗ gate tests: ${fails.length} failure(s)`);
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("✓ gate tests pass");
