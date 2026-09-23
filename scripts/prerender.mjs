/**
 * Build-time pre-render — writes the page's static HTML into `dist/index.html`.
 *
 * Why this exists
 * ---------------
 * The site is a client-rendered SPA: `index.html` used to ship an empty
 * `<div id="root">`, so nothing could paint until the JS bundle had downloaded,
 * parsed and executed. That is the 3.0 s FCP / 3.4 s LCP the audit reported.
 *
 * The fix is to put the real markup in the document and let React *hydrate* it
 * (`hydrateRoot`) instead of building it from scratch. The markup has to match
 * what React renders byte for byte — including the whitespace text nodes JSX
 * emits between sibling elements — or React 19 throws the server tree away and
 * re-renders, which is worse than not pre-rendering at all.
 *
 * Hand-writing that markup is possible but brittle: any reformat of a component
 * silently reintroduces a mismatch. So the markup is *generated* here, by
 * rendering the very same components with `react-dom/server`. The two trees
 * cannot drift because there is only one tree.
 *
 * How it runs
 * -----------
 * `vite build` emits the client bundle, then this script runs against the built
 * output. It imports the app through Vite's SSR pipeline (`createServer` in
 * middleware mode) so TypeScript, the `@` alias and the `.webp` imports all
 * resolve exactly as they do in the browser build.
 *
 * Only the *first screen* is kept. Everything below the fold is still rendered
 * by React on the client, so the document stays small and the deferred sections
 * keep their lazy behaviour.
 *
 * Fails open: any error leaves `dist/index.html` untouched and exits 0, so a
 * pre-render problem can never break a deploy.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const htmlPath = path.join(root, "dist", "index.html");

/**
 * Where the static markup ends.
 *
 * The hero is the only section that has to be in the document: it is the first
 * paint and the LCP element. The marker is the end of the hero `<section>`, so
 * the slice below keeps the navbar, the hero, and nothing else.
 */
const HERO_END = "</section>";

async function main() {
  let html;
  try {
    html = await readFile(htmlPath, "utf8");
  } catch {
    console.error("prerender: dist/index.html not found — run `vite build` first.");
    process.exit(0);
  }

  const vite = await createServer({
    root,
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });

  let appHtml;
  try {
    const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
    appHtml = await render();
  } finally {
    await vite.close();
  }

  if (!appHtml || !appHtml.includes(HERO_END)) {
    console.error("prerender: render produced no hero markup — leaving HTML untouched.");
    process.exit(0);
  }

  // Keep only up to the end of the hero section. The rest of the page is
  // client-rendered, so shipping it would only add bytes to the document.
  const heroEnd = appHtml.indexOf(HERO_END) + HERO_END.length;
  let shell = appHtml.slice(0, heroEnd);

  // React 19 hoists `<link rel="preload">` elements emitted by `<img>` into the
  // document head. During SSR they are serialised inline at the top of the
  // rendered tree, but on the client React moves them to `<head>` and renders
  // nothing in their place — so leaving them here is a guaranteed hydration
  // mismatch (React error #418). Drop them; the hero portrait preload is
  // injected into `<head>` by the `clinic:critical-assets` Vite plugin instead.
  shell = shell.replace(/^(?:<link\b[^>]*\/?>)+/, "");

  // Replace whatever is inside `#root` with the rendered shell. The regex is
  // non-greedy and anchored on the id, so it works whether the element is empty
  // or already holds a hand-written fallback. It deliberately does not anchor on
  // the module script: Vite hoists that into `<head>`, so it is not a reliable
  // neighbour of `#root` in the built document.
  const rootPattern = /(<div id="root">)([\s\S]*?)(<\/div>)/;
  if (!rootPattern.test(html)) {
    console.error("prerender: could not find the #root container — leaving HTML untouched.");
    process.exit(0);
  }

  const next = html.replace(rootPattern, `$1${shell}$3`);
  await writeFile(htmlPath, next, "utf8");

  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  console.log(
    `prerender: injected ${kb(Buffer.byteLength(shell))} of static hero ` +
      `(document now ${kb(Buffer.byteLength(next))})`,
  );
}

main().catch((error) => {
  console.error("prerender: skipped —", error?.message ?? error);
  process.exit(0);
});
