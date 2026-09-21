import { useState } from "react";
import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconCheck, IconShield } from "../components/Icons";

export default function Pricing() {
  const { t } = useI18n();
  const [annual, setAnnual] = useState(false);

  return (
    <section id="plans" className="scroll-mt-24 py-24 sm:py-32" aria-labelledby="plans-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">
              {t.plansEyebrow}
            </p>
            <h2
              id="plans-heading"
              className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl"
            >
              {t.plansTitleA}{" "}
              <em className="font-light italic text-teal">{t.plansTitleB}</em>
            </h2>
          </Reveal>

          <Reveal delay={150} className="mt-8">
            <div
              role="group"
              aria-label={t.billingMonthly + " / " + t.billingAnnual}
              className="inline-flex items-center rounded-full border border-ink/10 bg-cream p-1.5 shadow-soft"
            >
              <button
                type="button"
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
                className={`rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  !annual ? "bg-ink text-cream shadow-soft" : "text-ink/55 hover:text-ink"
                }`}
              >
                {t.billingMonthly}
              </button>
              <button
                type="button"
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 ${
                  annual ? "bg-ink text-cream shadow-soft" : "text-ink/55 hover:text-ink"
                }`}
              >
                {t.billingAnnual}
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold transition-colors ${
                    annual ? "bg-aqua text-ink" : "bg-mint text-pine"
                  }`}
                >
                  {t.annualBadge}
                </span>
              </button>
            </div>
          </Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
          {t.plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 140} className="h-full">
              <article
                className={`relative flex h-full flex-col rounded-[1.8rem] p-8 transition-all duration-500 hover:-translate-y-2 ${
                  p.featured
                    ? "bg-ink text-cream shadow-lift lg:-translate-y-4 lg:hover:-translate-y-6"
                    : "border border-ink/8 bg-cream text-ink shadow-soft hover:shadow-lift"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-aqua px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-widest text-ink">
                    {t.mostPopular}
                  </span>
                )}
                <h3 className="font-display text-2xl font-semibold tracking-tight">{p.name}</h3>
                <p className={`mt-1 text-sm font-semibold ${p.featured ? "text-cream/60" : "text-ink/55"}`}>
                  {p.blurb}
                </p>

                <div key={annual ? "annual" : "monthly"} className="mt-6 animate-card-in">
                  <p className="flex items-baseline gap-1.5" dir="ltr" style={{ justifyContent: "flex-start", flexDirection: t.dir === "rtl" ? "row-reverse" : "row" }}>
                    <span className="font-display text-5xl font-semibold tracking-tight">
                      ${annual ? p.annual : p.monthly}
                    </span>
                    <span className={`text-sm font-bold ${p.featured ? "text-cream/60" : "text-ink/50"}`}>
                      {t.perMonth}
                    </span>
                  </p>
                  <p className={`mt-1.5 text-xs font-semibold ${p.featured ? "text-cream/50" : "text-ink/45"}`}>
                    {annual ? t.billedAnnually : t.billedMonthly}
                  </p>
                </div>

                <ul className="mt-7 flex-1 space-y-3.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm font-semibold leading-snug">
                      <span
                        className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                          p.featured ? "bg-aqua text-ink" : "bg-mint text-pine"
                        }`}
                      >
                        <IconCheck className="h-3 w-3" />
                      </span>
                      <span className={p.featured ? "text-cream/85" : "text-ink/75"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#book"
                  className={`btn-sheen mt-8 block rounded-full py-3.5 text-center text-sm font-extrabold transition-all duration-300 hover:-translate-y-0.5 ${
                    p.featured
                      ? "bg-aqua text-ink hover:shadow-lift"
                      : "border border-ink/15 text-ink hover:border-teal hover:bg-mint/50"
                  }`}
                >
                  {t.startPlan} {p.name}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="mt-10">
          <p className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[13px] font-semibold leading-relaxed text-ink/55">
            <IconShield className="h-4 w-4 shrink-0 text-teal" />
            {t.insuranceNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
