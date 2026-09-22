import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconCheck, IconSparkle } from "../components/Icons";
// Imported (not referenced as "/images/...") so Vite bundles them: a raw
// root-absolute URL works in dev — where the project root is served — but it
// is never emitted to dist/ and ignores `base`, so it 404s on GitHub Pages.
import clinicPhoto from "../../images/optimized/clinic-1.webp";
import clinicPhoto2 from "../../images/optimized/clinic-2.webp";

export default function Benefits() {
  const { t } = useI18n();
  return (
    <section id="visit" className="scroll-mt-24 bg-cream py-24 sm:py-32" aria-labelledby="visit-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          {/* sticky intro + image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">
                {t.visitEyebrow}
              </p>
              <h2
                id="visit-heading"
                className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl"
              >
                {t.visitTitleA}{" "}
                <em className="font-light italic text-teal">{t.visitTitleB}</em>
              </h2>
              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/65">{t.visitSub}</p>
            </Reveal>

            <Reveal delay={150} className="relative mt-9">
              <div className="overflow-hidden rounded-[1.8rem] shadow-lift">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={clinicPhoto}
                    alt={t.visitImgAlt}
                    className="h-full w-full object-cover animate-kenburns"
                    width={1078}
                    height={796}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="mt-4 overflow-hidden rounded-[1.8rem] shadow-soft">
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={clinicPhoto2}
                    alt={t.visitImgAlt}
                    className="h-full w-full object-cover"
                    width={1079}
                    height={1439}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="glass absolute -bottom-5 start-5 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-soft">
                <IconSparkle className="h-4 w-4 text-teal" />
                <p className="text-xs font-extrabold text-ink">{t.openUntil}</p>
              </div>
            </Reveal>

            <Reveal delay={280} className="mt-12">
              <div className="rounded-3xl border border-teal/15 bg-mint/45 p-6 sm:p-7">
                <h3 className="font-display text-xl font-semibold text-ink">{t.afterFirst}</h3>
                <ul className="mt-4 space-y-3">
                  {t.firstVisitIncludes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm font-semibold text-ink/75">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal text-cream">
                        <IconCheck className="h-3 w-3" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* steps timeline */}
          <div className="lg:pt-2">
            {t.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 130}>
                <div
                  className={`group relative flex gap-6 py-8 sm:gap-9 sm:py-10 ${
                    i < t.steps.length - 1 ? "border-b border-ink/8" : ""
                  }`}
                >
                  <span
                    className="relative z-10 shrink-0 font-display text-5xl font-light text-sand transition-colors duration-500 group-hover:text-teal sm:text-6xl"
                    aria-hidden="true"
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.7rem]">
                      {s.title}
                    </h3>
                    <p className="mt-2.5 max-w-lg text-[15px] leading-relaxed text-ink/65">{s.copy}</p>
                  </div>
                  <span
                    className="absolute end-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-aqua opacity-0 transition-all duration-500 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </Reveal>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}
