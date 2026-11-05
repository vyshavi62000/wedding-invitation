/*
 * Re-creates invitation.jpg (the "Save as Image" download) from the current
 * config.js. Run it after changing names, date or venue:
 *
 *   npm install --no-save playwright
 *   npx playwright install chromium
 *   node tools/render-invitation.js
 */
const path = require("path");
const { pathToFileURL } = require("url");
const { chromium } = require("playwright");

(async () => {
  const root = path.resolve(__dirname, "..");
  const out = path.join(root, process.argv[2] || "invitation.jpg");
  const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--ignore-gpu-blocklist"] });
  const page = await browser.newPage({ viewport: { width: 480, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  await page.goto(pathToFileURL(path.join(root, "index.html")).href);
  await page.waitForTimeout(1500);
  await page.click("#env-seal", { force: true });
  await page.waitForTimeout(8000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.addStyleTag({ content: "#music,.scroll-cue,#petals{display:none!important}" });
  await page.waitForTimeout(1500);
  await (await page.$("#card")).screenshot({ path: out, type: "jpeg", quality: 90 });
  await browser.close();
  console.log("Saved", out);
})();
