/**
 * Registers the static-asset service worker (`public/sw.js`).
 *
 * Production only: under `npm run dev` the worker would cache the dev server's
 * module URLs and make hot reload behave in ways that are hard to reason about.
 *
 * Registration deliberately waits for `load`. The worker's install fetch must
 * not compete for bandwidth with the hero image or the JS bundle on a first
 * visit — caching is a repeat-visit concern.
 */
export function registerServiceWorker() {
  if (!import.meta.env.PROD) return;
  if (!("serviceWorker" in navigator)) return;

  // `BASE_URL` is the Vite `base` (`/dr-mohammed-elnaggar-clinic/`), so the
  // script path and its scope stay correct if the site ever moves.
  const url = `${import.meta.env.BASE_URL}sw.js`;
  const options = {
    scope: import.meta.env.BASE_URL,
    // GitHub Pages serves `sw.js` with `Cache-Control: max-age=600` and that
    // header cannot be configured. A stale worker script is the hardest failure
    // mode to debug, so bypass the HTTP cache when checking for a new one.
    updateViaCache: "none",
  } as const;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(url, options).catch(() => {
      /* the site works without it */
    });
  });
}
