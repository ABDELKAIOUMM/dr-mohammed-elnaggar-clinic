/**
 * Server-render entry — used only by `scripts/prerender.mjs` at build time.
 *
 * It renders the same `<App />` the browser mounts, so the static markup and the
 * hydrated tree are produced by identical code and cannot drift. Nothing here
 * ships to the client: the browser entry is `src/main.tsx`.
 *
 * `renderToString` rather than a streaming API: the output is a few kilobytes
 * and is injected into a document that is already being written, so there is
 * nothing to stream to.
 */
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(<App />);
}
