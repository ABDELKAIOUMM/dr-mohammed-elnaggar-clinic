import { lazy, useEffect, useState } from "react";
import { I18nProvider, useI18n } from "./i18n";
import { LazySection } from "./hooks";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";

/*
 * Section splitting.
 *
 * `Navbar` and `Hero` stay static imports: together they *are* the first paint,
 * and the hero headline is the LCP element. Everything below them becomes its
 * own chunk, because on a phone none of it is visible until the user has already
 * scrolled a full screen — those bytes cannot move FCP, LCP or the first input,
 * and shipping them upfront only makes the bundle that can slower to arrive.
 *
 * A split on its own is not enough. A dynamic import defers only until the
 * component first renders, and every section is part of the first render, so all
 * nine `import()` calls would fire on mount and race the entry bundle for
 * bandwidth. `LazySection` supplies the missing half: the fetch is held back
 * until the section is within a screen of the viewport.
 */
const SocialProof = lazy(() => import("./sections/SocialProof"));
const Features = lazy(() => import("./sections/Features"));
const BeforeAfter = lazy(() => import("./sections/BeforeAfter"));
const FacebookVideos = lazy(() => import("./sections/FacebookVideos"));
const Benefits = lazy(() => import("./sections/Benefits"));
const Testimonials = lazy(() => import("./sections/Testimonials"));
const Location = lazy(() => import("./sections/Location"));
const Faq = lazy(() => import("./sections/Faq"));
const Footer = lazy(() => import("./sections/Footer"));

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#book"
      className="sr-only z-[100] rounded-full bg-pine px-5 py-3 text-sm font-bold text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t.skip}
    </a>
  );
}

/**
 * A deferred section is not in the document until it is nearly on screen, which
 * would be fatal to every in-page link that points at one (`#why`, `#visit`,
 * `#reviews`, `#location`, `#faq`): at click time there is no element to scroll
 * to, and the browser silently does nothing. Any of three signals mounts the
 * whole page at once instead — a `#hash` in the entry URL, a click on an
 * in-page anchor, or a later `hashchange`.
 *
 * The click listener is on the capture phase so it runs before React's own
 * handlers and before the browser acts on the default navigation.
 */
function useEagerOnAnchor() {
  const [eager, setEager] = useState(
    () => typeof window !== "undefined" && window.location.hash.length > 1,
  );

  useEffect(() => {
    if (eager) return;

    const enable = () => setEager(true);
    const onClick = (event: MouseEvent) => {
      if ((event.target as Element | null)?.closest?.('a[href^="#"]')) enable();
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", enable);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", enable);
    };
  }, [eager]);

  return eager;
}

/**
 * Finishes a scroll the browser had to abandon. The anchor only appears once its
 * chunk has resolved, so this retries across a few frames instead of assuming
 * the target exists immediately.
 *
 * When the anchor *was* already mounted, the browser navigated correctly on its
 * own and this leaves it alone: a second `scrollIntoView` on the first frame
 * would only fight the smooth-scroll the browser already started.
 */
function usePendingHashScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;

    let frame = 0;
    let attempts = 0;

    const attempt = () => {
      const target = document.getElementById(id);
      if (target) {
        if (attempts > 0) target.scrollIntoView();
        return;
      }
      if (++attempts < 120) frame = requestAnimationFrame(attempt);
    };

    frame = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(frame);
  }, [active]);
}

function Site() {
  const eager = useEagerOnAnchor();
  usePendingHashScroll(eager);

  return (
    <div className="relative min-h-screen" suppressHydrationWarning>
      <SkipLink />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />

      <main>
        <Hero requested="" />
        <LazySection eager={eager}>
          <SocialProof />
        </LazySection>
        <LazySection eager={eager}>
          <Features />
        </LazySection>
        <LazySection eager={eager}>
          <BeforeAfter />
        </LazySection>
        <LazySection eager={eager}>
          <FacebookVideos />
        </LazySection>
        <LazySection eager={eager}>
          <Benefits />
        </LazySection>
        <LazySection eager={eager}>
          <Testimonials />
        </LazySection>
        <LazySection eager={eager}>
          <Location />
        </LazySection>
        <LazySection eager={eager}>
          <Faq />
        </LazySection>
      </main>

      <LazySection eager={eager}>
        <Footer />
      </LazySection>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Site />
    </I18nProvider>
  );
}
