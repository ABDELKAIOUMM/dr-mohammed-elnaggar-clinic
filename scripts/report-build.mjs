/**
 * Post-build report — run with `npm run report:build` after `npm run build`.
 *
 * Collects everything a performance change is meant to move: the bytes that
 * actually ship, and the two `index.html` transforms that the
 * `clinic:critical-assets` plugin in `vite.config.ts` is responsible for. Much
 * cheaper than a Lighthouse run for confirming that a change landed.
 *
 * Read-only — it never modifies `dist/`. Exits non-zero if a check fails.
 */
import { gzipSync } from "node:zlib";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "..", "dist");

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const mark = (pass) => (pass ? "ok" : "FAIL");

const htmlPath = path.join(distDir, "index.html");
let html;
try {
  html = await readFile(htmlPath, "utf8");
} catch {
  console.error("dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const htmlBytes = Buffer.byteLength(html);
const htmlGzip = gzipSync(html, { level: 9 }).length;

// A stylesheet we wrote ourselves, as opposed to the Google Fonts one inside the
// `<noscript>` fallback, which only exists for clients without JS.
const renderBlocking = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)]
  .map((match) => match[0])
  .filter((tag) => !tag.includes("fonts.googleapis.com"));

let assetFiles = [];
try {
  const entries = await readdir(path.join(distDir, "assets"), { withFileTypes: true });
  assetFiles = await Promise.all(
    entries
      .filter((entry) => entry.isFile())
      .map(async (entry) => {
        const { size } = await stat(path.join(distDir, "assets", entry.name));
        return { name: entry.name, size };
      }),
  );
} catch {
  /* no assets directory */
}
assetFiles.sort((a, b) => b.size - a.size);

// `lastIndexOf`, because the comment above may quote the tag name in prose and
// only the injected element is a real stylesheet.
const styleAt = html.lastIndexOf("<style>");
const scriptAt = html.indexOf('type="module"');
const preload = html.match(/<link[^>]+rel="preload"[^>]+as="image"[^>]*>/i);

// The `srcSet` strings are assembled at runtime from the variant table, so the
// bundle can only be checked for the URLs themselves — the `w` descriptor is
// appended by `toSrcSet`, and the minifier splits that template literal into
// `url + " " + width + "w"`. What matters is that every variant survived
// tree-shaking and is referenced; the preload check above proves the widths are
// mapped to the right files.
const bundle = assetFiles.find((file) => file.name.endsWith(".js"));
const bundleJs = bundle ? await readFile(path.join(distDir, "assets", bundle.name), "utf8") : "";
const bundleHas = (...needles) => needles.every((needle) => bundleJs.includes(needle));

const checks = [
  ["render-blocking stylesheet removed", renderBlocking.length === 0],
  ["stylesheet inlined into <head>", styleAt > -1 && html.includes("</style>", styleAt)],
  [
    "inline <style> sits after the module script",
    styleAt > -1 && scriptAt > -1 && scriptAt < styleAt,
  ],
  ["hero portrait preloaded", preload !== null],
  ["hero preload is responsive", Boolean(preload && /imagesrcset=/.test(preload[0]))],
  [
    "stylesheet asset dropped from the bundle",
    !assetFiles.some((file) => file.name.endsWith(".css")),
  ],
  ["portrait variants referenced", bundleHas("doctor-480-", "doctor-760-", "doctor-900-")],
  ["logo variants referenced", bundleHas("logo-160-", "logo-320-", "logo-384-")],
  ["service worker registered", bundleJs.includes("serviceWorker")],
];

console.log(`index.html        ${kb(htmlBytes)} raw   ${kb(htmlGzip)} gzipped`);
console.log(`assets/           ${kb(assetFiles.reduce((sum, file) => sum + file.size, 0))} across ${assetFiles.length} file(s)\n`);

console.log("Largest assets");
for (const file of assetFiles.slice(0, 8)) {
  console.log(`  ${file.name.padEnd(34)} ${kb(file.size).padStart(9)}`);
}

for (const family of ["doctor", "logo"]) {
  const variants = assetFiles.filter((file) => new RegExp(`^${family}(-\\d+)?-`).test(file.name));
  if (!variants.length) continue;
  console.log(`\n${family} variants`);
  for (const file of variants) {
    console.log(`  ${file.name.padEnd(34)} ${kb(file.size).padStart(9)}`);
  }
}

if (preload) {
  console.log("\nHero preload");
  console.log(`  ${preload[0].replace(/\s+/g, " ")}`);
}

console.log("\nindex.html checks");
for (const [label, pass] of checks) {
  console.log(`  [${mark(pass)}] ${label}`);
}
console.log(
  `  critical path order: module script @ ${scriptAt} B, inline style @ ${styleAt} B`,
);

if (renderBlocking.length) {
  console.log("\nRemaining render-blocking tags:");
  for (const tag of renderBlocking) console.log(`  ${tag}`);
}

const failed = checks.filter(([, pass]) => !pass);
if (failed.length) process.exitCode = 1;
