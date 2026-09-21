import { Reveal } from "../hooks";
import { PHONE, PHONE_HREF, useI18n } from "../i18n";
import { IconArrowRight, IconCheck, IconPhone } from "../components/Icons";

export default function Cta() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-cream sm:py-32">
      <div
        className="absolute -start-24 -bottom-32 h-[420px] w-[420px] rounded-full bg-aqua/15 blur-3xl animate-drift"
        aria-hidden="true"
      />
      <div
        className="absolute -end-24 -top-32 h-[380px] w-[380px] rounded-full bg-amber/15 blur-3xl animate-drift-late"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-aqua">
            {t.ctaBadge}
          </span>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="mt-7 font-display text-[2.5rem] font-medium leading-[1.06] tracking-tight sm:text-6xl lg:text-[4rem]">
            {t.ctaTitleA}{" "}
            <em className="font-light italic text-aqua">{t.ctaTitleB}</em>
          </h2>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-cream/70 sm:text-lg">
            {t.ctaSub}
          </p>
        </Reveal>
        <Reveal delay={360} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#book"
            className="btn-sheen group inline-flex items-center gap-2.5 rounded-full bg-aqua px-8 py-4 text-[15px] font-extrabold text-ink transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            {t.ctaBook}
            <IconArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </a>
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2.5 rounded-full border border-cream/25 px-8 py-4 text-[15px] font-bold text-cream transition-all duration-300 hover:-translate-y-1 hover:border-aqua hover:text-aqua"
          >
            <IconPhone className="h-4.5 w-4.5" />
            <span dir="ltr">{PHONE}</span>
          </a>
        </Reveal>
        <Reveal delay={480} className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {t.ctaChecks.map((c) => (
            <span key={c} className="flex items-center gap-2 text-[13px] font-bold text-cream/55">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-cream/10 text-aqua">
                <IconCheck className="h-3 w-3" />
              </span>
              {c}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
