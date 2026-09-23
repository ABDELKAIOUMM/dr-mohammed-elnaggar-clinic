import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { registerServiceWorker } from "./register-sw";

/*
 * `hydrateRoot`, not `createRoot`.
 *
 * `index.html` ships a hand-written hero (see the comment there), so `#root`
 * already contains the markup React is about to render. Hydration adopts those
 * nodes and only attaches the event listeners, instead of throwing them away and
 * rebuilding the tree — which is what lets the hero paint before this module has
 * even been fetched.
 *
 * The static shell is Arabic, matching the document's default `lang`. A
 * returning English visitor is handled by the inline script in `<head>`, which
 * flips `lang`/`dir` before paint; `I18nProvider` reads that attribute back, so
 * the first client render agrees with the server markup.
 */
hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <App />
  </StrictMode>
);

// Registered from here rather than from markup so it picks up Vite's `base`
// through `import.meta.env.BASE_URL`, and so the dev server is left untouched.
registerServiceWorker();
