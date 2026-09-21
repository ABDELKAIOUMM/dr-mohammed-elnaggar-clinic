import { useState } from "react";
import { Reveal } from "../hooks";
import { PHONE, PHONE_HREF, useI18n } from "../i18n";
import { IconArrowRight, IconCheck, IconChevron, IconPhone } from "../components/Icons";

export default function Treatments({ onBook }: { onBook: (name: string) => void }) {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState(t.treatments[0].id);
  const tr = t.treatments.find((x) => x.id === activeId) ?? t.treatments[0];

  return (
    <section
      id="treatments"
      className="relative scroll-mt-24 overflow-hidden bg-fog py-24 sm:py-32"
      aria-labelledby="treatments-heading"
    >
      <div
        className="absolute -start-24 top-1/3 h-96 w-96 rounded-full bg-aqua/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-12 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">
            {t.treatmentsEyebrow}
          </p>
          <h2
            id="treatments-heading"
            className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem]"
          >
            {t.treatmentsTitleA}{" "}
            <em className="font-light italic text-teal">{t.treatmentsTitleB}</em>
          </h2>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-10">
          {/* selector */}
          <div
            role="tablist"
            aria-label={t.treatmentsChoose}
            className="flex snap-x gap-3 overflow-x-auto pb-3 lg:sticky lg:top-28 lg:block lg:snap-none lg:space-y-3 lg:overflow-visible lg:pb-0"
          >
            {t.treatments.map((x) => {
              const selected = x.id === activeId;
              return (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(x.id)}
                  className={`group flex min-w-[240px] shrink-0 snap-start items-center justify-between gap-4 rounded-2xl border px-5 py-4 text-start transition-all duration-400 lg:min-w-0 lg:shrink ${
                    selected
                      ? "border-ink bg-ink text-cream shadow-lift"
                      : "border-ink/8 bg-cream/70 text-ink hover:-translate-y-0.5 hover:border-teal/40 hover:bg-cream"
                  }`}
                >
                  <span>
                    <span className="block text-[15px] font-extrabold">{x.name}</span>
                    <span
                      className={`mt-0.5 block text-xs font-semibold ${
                        selected ? "text-aqua" : "text-ink/45"
                      }`}
                    >
                      {x.price}
                    </span>
                  </span>
                  <IconChevron
                    className={`h-4 w-4 shrink-0 transition-all duration-400 rtl:-scale-x-100 ${
                      selected ? "text-aqua" : "-translate-x-1 text-ink/25 group-hover:translate-x-0 rtl:translate-x-1 rtl:group-hover:translate-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* detail card — re-animates on change */}
          <div key={tr.id} className="animate-card-in" role="tabpanel" aria-label={tr.name}>
            <article className="overflow-hidden rounded-[2rem] bg-cream shadow-lift">
              <div className="relative h-60 overflow-hidden sm:h-72 lg:h-80">
                <img
                  src={tr.image}
                  alt={tr.alt}
                  className="h-full w-full object-cover animate-kenburns"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <span className="glass absolute start-5 top-5 rounded-full px-4 py-2 text-xs font-extrabold text-pine">
                  {tr.tag}
                </span>
                <span className="absolute bottom-4 end-5 rounded-full bg-ink/55 px-4 py-2 text-xs font-bold text-cream backdrop-blur-sm">
                  {tr.duration}
                </span>
              </div>

              <div className="p-7 sm:p-9 lg:p-10">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                  <h3 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                    {tr.name}
                  </h3>
                  <span className="rounded-full bg-mint px-4 py-1.5 text-sm font-extrabold text-pine">
                    {tr.price}
                  </span>
                </div>

                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/70">{tr.blurb}</p>

                <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                  {tr.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-start gap-2.5 rounded-xl bg-fog px-4 py-3.5 text-[13px] font-bold leading-snug text-ink/80"
                    >
                      <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-teal text-cream">
                        <IconCheck className="h-2.5 w-2.5" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onBook(tr.name)}
                    className="btn-sheen group inline-flex items-center gap-2.5 rounded-full bg-pine px-7 py-3.5 text-sm font-bold text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal"
                  >
                    {t.treatmentsBook} {tr.name}
                    <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                  </button>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-2 text-sm font-bold text-ink/60 transition-colors hover:text-teal"
                  >
                    <IconPhone className="h-4 w-4" />
                    {t.treatmentsAsk} <span dir="ltr">{PHONE}</span>
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
