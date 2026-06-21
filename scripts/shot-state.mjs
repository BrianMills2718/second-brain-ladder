import puppeteer from "puppeteer";
import { join } from "node:path";
const shots = [["concepts","concepts-now"],["node/c-reasoning","reasoning-now"]];
const browser = await puppeteer.launch({ headless: "new", protocolTimeout: 60000,
  args: ["--no-sandbox","--disable-setuid-sandbox","--disable-dev-shm-usage","--disable-gpu"] });
const page = await browser.newPage();
await page.setViewport({ width: 1500, height: 1100, deviceScaleFactor: 1 });
for (const [route,name] of shots) {
  await page.goto(`http://localhost:5174/#/${route}`, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 });
  await new Promise(r=>setTimeout(r,2200));
  if (name==="reasoning-now") { await page.evaluate(()=>{const d=document.querySelector("details.concept-panel"); if(d)d.open=true;}).catch(()=>{}); await new Promise(r=>setTimeout(r,400)); }
  await page.screenshot({ path: join(process.cwd(),"scripts","shots",`${name}.png`), fullPage: name==="reasoning-now" });
  console.log("ok",name);
}
await Promise.race([browser.close(), new Promise(r=>setTimeout(r,4000))]);
process.exit(0);
