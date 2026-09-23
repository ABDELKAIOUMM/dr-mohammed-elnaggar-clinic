import { useEffect, useState, type ReactNode } from "react";
import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconClose, IconFacebook, IconPlay } from "../components/Icons";

/**
 * Wraps a Facebook reel URL in the Embedded *Post* plugin.
 *
 * The older `plugins/video.php` player never resolves Reels — it answers
 * "Video unavailable" — while the Embedded Post plugin renders the reel
 * exactly like the original post: the page header, the vertical 9:16 video
 * and the live engagement counters (reactions / comments / shares).
 *
 * `show_text=false` keeps the card height predictable: without the caption the
 * embed is always `header + video + engagement`, and the video itself is
 * exactly `width * 16 / 9` tall. That lets a card size itself with a single
 * `padding-bottom` calculation instead of a guessed pixel height. Switch it to
 * `true` if the caption should show as well.
 *
 * `adapt_container_width=true` makes the embed follow the card width, so the
 * same URL works in the 4-column desktop grid and the 1-column mobile layout.
 * Facebook renders below its documented 350 px minimum (verified down to
 * 280 px), so the 4-column grid stays intact.
 */
const SHOW_TEXT = false;
const POST_WIDTH = 550;
/** Page header plus engagement bar of the embedded post, in px. */
const POST_CHROME = 128;

/**
 * Lightbox sizing.
 *
 * The reel is portrait 9:16, so a width-driven popup can never grow past
 * `38vh` without clipping the video — which made it look no bigger than the
 * card it came from. Solving the height formula instead — `0.5625` is 9/16 —
 * lets the post fill almost the whole viewport height and read as a real
 * lightbox, while `92vw` keeps it inside narrow or landscape phones.
 */
const MODAL_VIEWPORT_FILL = 88;
const MODAL_WIDTH = `min(92vw, calc((${MODAL_VIEWPORT_FILL}vh - ${POST_CHROME}px) * 0.5625))`;

const embedUrl = (url: string, width = POST_WIDTH) =>
  `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&width=${width}&show_text=${SHOW_TEXT}&adapt_container_width=true`;

/**
 * How far ahead of the viewport a card mounts its iframe.
 *
 * The top margin is deliberately much larger than the bottom one. A card that
 * is still *below* the fold will be reached by a normal downward scroll, so a
 * small lead is enough. A card that has already scrolled *above* the viewport
 * only happens after a fast flick or a restored scroll position, and with a
 * symmetric margin the observer would never match it again — the embed would
 * stay a grey placeholder for the rest of the session. The generous top margin
 * keeps those cards inside the observed band so they still mount.
 */
const EMBED_ROOT_MARGIN = "2000px 0px 400px 0px";

/**
 * Defers the embedded post until its card is close to the viewport.
 *
 * Every Facebook embed boots its own third-party document — hundreds of KB of
 * scripts, thumbnails and XHRs — and this section sits well below the fold.
 * Mounting all four iframes during page load made them race the hero image and
 * the fonts for bandwidth and main-thread time, which is exactly the kind of
 * work that pushes LCP and Total Blocking Time up on a phone.
 *
 * The iframe is therefore created only once its card comes within
 * `EMBED_ROOT_MARGIN`. The reserved box below has the same height in both
 * states, so nothing shifts when the swap happens, and the overlay button still
 * opens the full lightbox straight away.
 */
function DeferredEmbed({ url, title, children }: { url: string; title: string; children: ReactNode }) {
  const [el, setEl] = useState<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  /*
   * A callback ref, not `useRef` + `useEffect`.
   *
   * The section is mounted through `React.lazy` inside a `Suspense` boundary,
   * and the effect below was observed running with `ref.current === null`: the
   * ref had not been attached yet when the effect fired, so the observer was
   * never created and the card stayed a grey placeholder forever. A callback
   * ref cannot miss: React calls it with the node the moment it is attached,
   * and with `null` when it detaches, which is exactly the signal needed to
   * start observing.
   */
  useEffect(() => {
    if (!el || mounted) return;

    // Old browsers without IntersectionObserver: fall back to loading eagerly.
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }

    /*
     * The card can already be inside the viewport by the time this effect runs:
     * `LazySection` mounts the whole section only once it is within 1000px, and
     * a fast scroll (or a restored scroll position) can land the card on screen
     * before the observer has had a chance to fire. IntersectionObserver does
     * report that initial state on its first callback, but only after a frame —
     * and if the element is *above* the viewport the margin never matches it
     * again, so the embed would stay a grey placeholder forever.
     *
     * A synchronous bounding-box check closes that gap: if the card is already
     * within the margin, mount immediately instead of waiting for a callback
     * that may never come.
     */
    const rect = el.getBoundingClientRect();
    const margin = 400;
    if (rect.top < window.innerHeight + margin && rect.bottom > -margin) {
      setMounted(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: EMBED_ROOT_MARGIN },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, mounted]);

  return (
    <>
      {/* The embedded post keeps the reel at its native 9:16 size, so the box
          reserves `video + chrome` and the iframe simply fills it. */}
      <div ref={setEl} className="relative w-full" style={{ paddingBottom: `calc(125% + 80px)` }}>
        {mounted ? (
          <iframe
            src={embedUrl(url)}
            title={title}
            scrolling="no"
            className="absolute inset-0 h-full w-full border-0"
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-fog" aria-hidden="true">
            <IconFacebook className="h-9 w-9 text-[#1877F2] opacity-40" />
          </div>
        )}
        {children}
      </div>
    </>
  );
}

export default function FacebookVideos() {
  const { t } = useI18n();
  const [selectedVideo, setSelectedVideo] = useState<(typeof t.videos.items)[number] | null>(null);

  useEffect(() => {
    if (!selectedVideo) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedVideo(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedVideo]);

  return (
    <section
      id="facebook-videos"
      className="scroll-mt-24 bg-cream py-24 sm:py-32"
      aria-labelledby="videos-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1877F2] text-white shadow-soft">
                <IconFacebook className="h-6 w-6" />
              </span>
              <span>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-teal">
                  {t.videos.eyebrow}
                </p>
                <h2 id="videos-heading" className="font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl lg:text-[2.8rem]">
                  <a
                    href="https://www.facebook.com/dr.mohammed.elnaggar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/page inline-flex items-center gap-3 transition-colors hover:text-[#1877F2]"
                  >
                    {t.videos.title}
                    <IconFacebook className="h-6 w-6 shrink-0 text-[#1877F2] transition-transform duration-300 group-hover/page:scale-110 sm:h-7 sm:w-7" />
                  </a>
                </h2>
              </span>
            </div>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink/65">{t.videos.sub}</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {t.videos.items.map((v, i) => (
            <Reveal key={v.id} delay={i * 120}>
              <div className="group relative h-full overflow-hidden rounded-[1.6rem] bg-white shadow-soft ring-1 ring-ink/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift">
                <DeferredEmbed url={v.url} title={v.title}>
                  {/* Facebook's iframe swallows every click, so a transparent layer sits
                      on top of it: tapping the reel itself opens the lightbox instead of
                      Facebook's own inline player. The veil and the play badge are only
                      revealed on hover, so the default look stays the real post cover. */}
                  <button
                    type="button"
                    onClick={() => setSelectedVideo(v)}
                    aria-label={`${t.videos.watchOn}: ${v.title}`}
                    title={t.videos.watchOn}
                    className="group/play absolute inset-0 z-10 flex cursor-pointer items-center justify-center"
                  >
                    <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover/play:bg-ink/35" />
                    <span className="relative grid h-16 w-16 scale-90 place-items-center rounded-full bg-white/90 text-[#1877F2] opacity-0 shadow-lift ring-1 ring-white/60 backdrop-blur-sm transition-all duration-300 group-hover/play:scale-100 group-hover/play:opacity-100">
                      <IconPlay className="h-7 w-7 translate-x-[1px]" />
                    </span>
                  </button>
                </DeferredEmbed>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      {selectedVideo && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-black"
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedVideo(null);
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedVideo(null)}
            aria-label={t.videos.close}
            className="absolute end-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <IconClose className="h-6 w-6" />
          </button>
          <h3 className="sr-only" id="video-modal-title">
            {selectedVideo.title}
          </h3>
          <a
            href={selectedVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute start-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-3 text-xs font-extrabold text-white backdrop-blur-sm transition hover:bg-white/25"
          >
            <IconFacebook className="h-4 w-4" />
            {t.videos.openOnFacebook}
          </a>
          {/* The lightbox fills the viewport height while keeping the whole post visible. */}
          <div className="relative overflow-hidden rounded-2xl bg-white" style={{ width: MODAL_WIDTH }}>
            <div className="relative w-full" style={{ paddingBottom: `calc(177.78% + ${POST_CHROME}px)` }}>
              <iframe
                key={selectedVideo.url}
                src={embedUrl(selectedVideo.url)}
                title={selectedVideo.title}
                scrolling="no"
                className="absolute inset-0 h-full w-full border-0"
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
