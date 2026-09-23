/*
 * Clinic landing page — static asset cache.
 *
 * Why this exists: GitHub Pages serves every file with `Cache-Control:
 * max-age=600`, and that header cannot be changed (Pages has no custom-header
 * support). So a returning visitor re-downloads the JS/CSS bundle roughly every
 * ten minutes. Caching policy for our own files is the part of the request we
 * can actually control.
 *
 * Scope is deliberately narrow:
 *  - Cross-origin requests (Google Fonts, the Pexels photos, the Facebook SDK
 *    and its frames) are never seen, let alone cached. Their responses are
 *    opaque, we cannot reason about their semantics, and a service worker has no
 *    business re-hosting someone else's CSS or iframe document.
 *  - Non-GET and range requests go straight to the network.
 *
 * This does not change a PageSpeed Insights score — PSI always runs against an
 * empty cache in a fresh profile. It is about repeat visits, and about the site
 * still opening when the network drops mid-session.
 *
 * Bump VERSION to invalidate everything after a policy change.
 */

const VERSION = "v2";
const CACHE = `clinic-static-${VERSION}`;

/** The app shell; resolved relative to this worker's scope, so it tracks `base`. */
const SHELL = "./";

/**
 * Entries kept in the cache. Each deploy adds two dozen-odd hashed asset URLs —
 * one bundle plus one chunk per section — so this covers a couple of releases
 * without letting the cache grow without bound.
 * Ordering of `cache.keys()` is insertion order in practice, not by spec, which
 * is good enough for a size cap.
 */
const MAX_ENTRIES = 60;

/** How many new entries to admit before sweeping. */
const SWEEP_EVERY = 40;

const offline = () => new Response("", { status: 504, statusText: "Offline" });

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE);
        // `cache: "reload"` bypasses the HTTP cache, so a new worker never seeds
        // itself with the previous deploy's HTML.
        await cache.add(new Request(SHELL, { cache: "reload" }));

        // Warm the entry bundle and the hero images from the document we just
        // cached. Their filenames are content-hashed, so they can never go
        // stale, and pulling them in now means the *next* visit paints from
        // disk instead of waiting on GitHub Pages' 10-minute HTTP cache.
        //
        // Best-effort: a failure here must not fail the install, because the
        // fetch handler still fills the cache on demand.
        const html = await (await cache.match(SHELL))?.text();
        if (html) {
          const urls = new Set();
          for (const match of html.matchAll(/(?:src|href)="([^"]*\/assets\/[^"]+)"/g)) {
            urls.add(new URL(match[1], self.registration.scope).href);
          }
          await Promise.all(
            [...urls].map((url) =>
              cache.add(new Request(url, { cache: "reload" })).catch(() => {}),
            ),
          );
        }
      } catch {
        // A failed pre-cache must not fail the install: the fetch handler can
        // still fill the cache on demand.
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => name !== CACHE).map((name) => caches.delete(name)),
      );
      await prune();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: network first. The document is what names the hashed assets, so
  // serving a stale copy would point at files the last deploy already deleted.
  if (request.mode === "navigate") {
    event.respondWith(shellFirst(request));
    return;
  }

  // Build output. Filenames carry a content hash, so a cached copy can never be
  // stale — this is the request that saves a repeat visitor the whole bundle.
  if (url.pathname.includes("/assets/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Everything else we own (icons, manifest, this script's own fetches).
  event.respondWith(staleWhileRevalidate(request));
});

async function shellFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(SHELL, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await cache.match(SHELL)) || offline();
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  if (hit) return hit;
  try {
    const response = await fetch(request);
    if (response.ok && response.type === "basic") {
      await cache.put(request, response.clone());
      sweep();
    }
    return response;
  } catch {
    return offline();
  }
}

let admitted = 0;

/**
 * Throttled prune. `activate` only fires when the worker script itself changes,
 * which is far rarer than a deploy, so the cache is swept here as entries are
 * admitted. Deliberately not awaited: the response is already on its way, and a
 * worker terminated mid-sweep loses nothing — the next call re-runs it.
 */
function sweep() {
  if (++admitted < SWEEP_EVERY) return;
  admitted = 0;
  prune().catch(() => {});
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(request);
  const revalidated = fetch(request)
    .then(async (response) => {
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return hit || (await revalidated) || offline();
}

async function prune() {
  const cache = await caches.open(CACHE);
  const keys = await cache.keys();
  if (keys.length <= MAX_ENTRIES) return;
  await Promise.all(keys.slice(0, keys.length - MAX_ENTRIES).map((key) => cache.delete(key)));
}
