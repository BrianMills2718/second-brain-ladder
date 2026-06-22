/**
 * Visual-pass helper: screenshot key stages of the running dev server so we can
 * eyeball rendering (markdown tables/lists, definition chips, the notation
 * rollup, and the interactive visualizations). Run the dev server first.
 *
 *   node scripts/screenshots.mjs            # uses http://localhost:5173
 *
 * Output PNGs go to scripts/shots/.
 */
import puppeteer from "puppeteer";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.BASE || "http://localhost:5173";
const OUT = join(process.cwd(), "scripts", "shots");
mkdirSync(OUT, { recursive: true });

// [route, name, optional expand-the-panels?] — routes are #/node/<id> (App.tsx)
const SHOTS = [
  ["", "home-skilltree", false],            // skill-tree edge routing + labels (now non-linear)
  ["concepts", "concepts-view", false],     // the full concept DAG — must be multi-column, not one line
  ["node/c-orientation", "stage0-orientation", false],
  ["node/c-kg", "stage1-kg", true],         // concept panel (ADR-0002) + chips
  ["node/c-onto", "stage2-onto", true],     // TBox/ABox typed-graph
  ["node/c-reasoning", "stage3-reasoning", true], // entailment viz + turtle code block
  ["node/c-neural", "stage4-neural", true], // entity resolution viz + code block
  ["node/c-neurosymbolic", "stage5-neurosymbolic", true], // propose→verify loop + code block
  ["node/c-kg", "feedback-widget", "feedback"], // per-section feedback flag + session panel (Slice 2)
];

const browser = await puppeteer.launch({
  headless: "new",
  protocolTimeout: 120000,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage", // WSL/container: /dev/shm too small → screenshot hangs
    "--disable-gpu",
  ],
});
const page = await browser.newPage();
await page.setViewport({ width: 1100, height: 1400, deviceScaleFactor: 1 });

for (const [route, name, expand] of SHOTS) {
  try {
    // Hash-only navigation does not reload an SPA, so puppeteer's goto would
    // resolve on the *previous* render. Force a fresh boot: set the hash, reload.
    await page.goto(`${BASE}/#/${route}`, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 }); // networkidle0 hangs on WSL
    await new Promise((r) => setTimeout(r, 1500)); // let KaTeX/React Flow settle

    if (expand === true) {
      // open the per-stage concept + notation rollups and the first inline chip
      await page.evaluate(() => {
        for (const sel of ["details.concept-panel", "details.notation-panel"]) {
          const d = document.querySelector(sel);
          if (d) d.open = true;
        }
      }).catch(() => {});
      const chip = await page.$(".def-chip-trigger");
      if (chip) await chip.click().catch(() => {});
      await new Promise((r) => setTimeout(r, 500));
    } else if (expand === "feedback") {
      // Slice 2: capture a flag, open its popover + the session panel so the
      // per-section feedback widget is visible in the shot.
      const flag = await page.$(".sf-flag");
      if (flag) await flag.click().catch(() => {});
      const toggle = await page.$(".sf-panel-toggle");
      if (toggle) await toggle.click().catch(() => {});
      await new Promise((r) => setTimeout(r, 400));
    }

    const file = join(OUT, `${name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`shot ${name} -> ${file}`);
  } catch (e) {
    console.error(`FAILED ${name}: ${e.message?.split("\n")[0]}`);
  }
}

// browser.close() can hang on WSL after the last screenshot is already written;
// race it against a timeout and hard-exit so the visual pass always terminates.
await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 4000))]);
console.log("done");
process.exit(0);
