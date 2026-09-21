import { useEffect, useState } from "react";
import { Reveal, prefersReducedMotion } from "../hooks";
import { useI18n } from "../i18n";
import { IconChevron, IconQuote, IconStar } from "../components/Icons";

export default function Testimonials() {
  const { t, lang } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = t.testimonials.length;

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6500);
    return () => clearInterval(id);
  }, [paused, count]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);
  const isRtl = lang === "ar";

  return (
    <section
      id="reviews"
      className="relative scroll-mt-24 overflow-hidden bg-pine py-8 text-cream sm:py-16"
      aria-labelledby="reviews-heading"
    >
      <div
        className="dot-grid-light absolute end-5 top-7 h-24 w-24 opacity-50 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute -end-12 -top-8 h-48 w-48 rounded-full bg-aqua/15 blur-3xl animate-drift"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-aqua">
              {t.reviewsEyebrow}
            </p>
            <h2
              id="reviews-heading"
              className="mt-2 font-display text-2xl font-medium leading-[1.08] tracking-tight sm:text-4xl lg:text-[3rem]"
            >
              {t.reviewsTitleA}{" "}
              <em className="font-light italic text-aqua">{t.reviewsTitleB}</em>
            </h2>
          </Reveal>
          <Reveal delay={150} className="glass-dark flex items-center gap-3 rounded-2xl p-3 sm:p-5">
            <div>
              <p dir="ltr" className="font-display text-2xl font-semibold text-aqua">
                4.9
              </p>
              <div className="mt-1 flex gap-0.5 text-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <IconStar key={i} className="h-3.5 w-3.5" />
                ))}
              </div>
            </div>
            <p className="text-sm font-semibold leading-snug text-cream/70">{t.reviewsAggregate}</p>
          </Reveal>
        </div>

        <Reveal delay={200} className="mt-5">
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label={t.reviewsChoose}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="overflow-hidden">
              <div
                dir="ltr"
                className="flex transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {t.testimonials.map((tm, i) => (
                  <figure
                    key={tm.name}
                    dir={t.dir}
                    className="min-w-full px-1"
                    aria-hidden={i !== index}
                    aria-label={`${i + 1} / ${count}`}
                  >
                    <IconQuote className="h-7 w-7 text-aqua/60" />
                    <blockquote className="mt-3 max-w-3xl font-display text-lg font-light leading-snug tracking-tight sm:text-2xl lg:text-[1.9rem]">
                      “{tm.quote}”
                    </blockquote>
                    <figcaption className="mt-4 flex flex-wrap items-center gap-2.5">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-aqua font-display text-sm font-semibold text-ink">
                        {tm.initials}
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold text-cream">{tm.name}</span>
                        <span className="block text-xs font-semibold text-cream/55">{tm.tag}</span>
                      </span>
                      <span className="ms-auto flex gap-0.5 text-amber">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <IconStar key={j} className="h-3.5 w-3.5" />
                        ))}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2" role="tablist" aria-label={t.reviewsChoose}>
                {t.testimonials.map((tm, i) => (
                  <button
                    key={tm.name}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`${tm.name}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? "w-10 bg-aqua" : "w-5 bg-cream/25 hover:bg-cream/40"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={isRtl ? next : prev}
                  aria-label={t.reviewsPrev}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-all duration-300 hover:border-aqua hover:text-aqua"
                >
                  <IconChevron className="h-5 w-5 rotate-180 rtl:-scale-x-100" />
                </button>
                <button
                  type="button"
                  onClick={isRtl ? prev : next}
                  aria-label={t.reviewsNext}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-cream transition-all duration-300 hover:border-aqua hover:text-aqua"
                >
                  <IconChevron className="h-5 w-5 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
