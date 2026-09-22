import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconArrowRight, IconCheck } from "../components/Icons";

/** One real treatment case shown as a simple photo card. */
function CaseCard({
  tag,
  title,
  subtitle,
  info,
  image,
}: {
  tag: string;
  title: string;
  subtitle: string;
  info: string;
  image: string;
}) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[1.8rem] bg-cream/5 shadow-lift ring-1 ring-cream/10 transition-all duration-500 hover:-translate-y-2 hover:ring-cream/20">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={`${title} — ${subtitle}`}
          width={1000}
          height={750}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 z-10 rounded-md bg-ink/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-cream backdrop-blur-sm">
          {tag}
        </span>
      </div>
      <div className="p-7">
        <h3 className="font-display text-xl font-semibold tracking-tight text-cream">{title}</h3>
        <p className="mt-0.5 text-xs font-semibold text-aqua">{subtitle}</p>
        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-cream/50">
          <IconCheck className="h-3.5 w-3.5 text-aqua" />
          {info}
        </div>
      </div>
    </article>
  );
}

export default function BeforeAfter() {
  const { t } = useI18n();
  return (
    <section
      id="before-after"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-24 text-cream sm:py-32"
      aria-labelledby="ba-heading"
    >
      <div
        className="dot-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_80%_70%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />
      <div className="absolute -start-24 bottom-0 h-96 w-96 rounded-full bg-aqua/15 blur-3xl animate-drift" aria-hidden="true" />
      <div className="absolute -end-24 top-0 h-80 w-80 rounded-full bg-amber/15 blur-3xl animate-drift-late" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-aqua">
              {t.beforeAfter.eyebrow}
            </p>
            <h2
              id="ba-heading"
              className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.3rem]"
            >
              {t.beforeAfter.titleA}{" "}
              <em className="font-light italic text-aqua">{t.beforeAfter.titleB}</em>
            </h2>
          </Reveal>
          <Reveal delay={150} as="p" className="mt-5 text-sm leading-relaxed text-cream/60">
            {t.beforeAfter.sub}
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {t.beforeAfter.cases.map((c, i) => (
            <Reveal key={c.id} delay={(i + 1) * 90}>
              <CaseCard
                tag={c.tag}
                title={c.title}
                subtitle={c.subtitle}
                info={c.info}
                image={c.image}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="mt-14 text-center">
          <a
            href="#book"
            className="btn-sheen group inline-flex items-center gap-2.5 rounded-full bg-aqua px-8 py-4 text-[15px] font-extrabold text-ink transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            {t.beforeAfter.cta}
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
