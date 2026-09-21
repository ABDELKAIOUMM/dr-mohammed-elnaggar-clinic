import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import {
  IconCrown,
  IconFlask,
  IconGentle,
  IconHours,
  IconReceipt,
  IconScan,
} from "../components/Icons";

const iconList = [IconGentle, IconScan, IconCrown, IconFlask, IconReceipt, IconHours];

export default function Features() {
  const { t } = useI18n();
  return (
    <section id="why" className="relative scroll-mt-24 py-24 sm:py-32" aria-labelledby="why-heading">
      <div
        className="absolute end-0 top-24 h-80 w-80 rounded-full bg-mint/50 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-2 lg:items-end">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">
              {t.whyEyebrow}
            </p>
            <h2
              id="why-heading"
              className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.3rem]"
            >
              {t.whyTitleA} <em className="font-light italic text-teal">{t.whyTitleB}</em>
            </h2>
          </Reveal>
          <Reveal delay={150} as="p" className="max-w-md text-[15px] leading-relaxed text-ink/65 lg:ms-auto">
            {t.whySub}
          </Reveal>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {t.features.map((f, i) => {
            const Icon = iconList[i % iconList.length];
            return (
              <Reveal key={f.title} delay={(i % 3) * 130}>
                <article className="group relative flex h-full items-start gap-4 overflow-hidden rounded-2xl border border-ink/8 bg-cream p-4 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-lift sm:block sm:rounded-3xl sm:p-7">
                  <span
                    className="absolute end-4 top-3 font-display text-3xl font-light text-ink/8 transition-colors duration-500 group-hover:text-mint sm:end-6 sm:top-5 sm:text-5xl"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-mint text-pine transition-all duration-500 group-hover:-rotate-6 group-hover:bg-pine group-hover:text-aqua sm:h-13 sm:w-13 sm:rounded-2xl">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 pe-5 sm:pe-10">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-ink sm:mt-6 sm:text-[22px]">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink/65 sm:mt-3 sm:text-sm">{f.copy}</p>
                  </div>
                  <span
                    className="absolute bottom-0 start-0 h-[3px] w-0 bg-gradient-to-r from-aqua to-teal transition-all duration-500 group-hover:w-full"
                    aria-hidden="true"
                  />
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
