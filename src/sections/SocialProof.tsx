import { Counter, Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconShield, ToothMark } from "../components/Icons";

const partners = [
  "Delta Dental",
  "Cigna",
  "Aetna",
  "MetLife",
  "Guardian",
  "UnitedHealthcare",
  "Humana",
  "Principal",
];

export default function SocialProof() {
  const { t } = useI18n();
  return (
    <section aria-label={t.statsLabel} className="border-y border-ink/5 bg-cream py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {t.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 110} className="relative ps-5">
              <span
                className="absolute start-0 top-1 h-[calc(100%-8px)] w-[3px] rounded-full bg-gradient-to-b from-aqua to-teal"
                aria-hidden="true"
              />
              <p
                dir="ltr"
                style={{ textAlign: t.dir === "rtl" ? "right" : "left" }}
                className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
              >
                <Counter value={s.value} decimals={"decimals" in s ? (s.decimals as number) ?? 0 : 0} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[13px] font-bold uppercase tracking-[0.14em] text-ink/50">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center gap-6 lg:flex-row lg:gap-10">
          <p className="flex shrink-0 items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-ink/45">
            <IconShield className="h-4 w-4 text-teal" />
            {t.partnersLabel}
          </p>
          <div dir="ltr" className="marquee w-full overflow-hidden">
            <div className="marquee-track flex w-max items-center animate-marquee">
              {[...partners, ...partners].map((p, i) => (
                <span
                  key={`${p}-${i}`}
                  className="flex items-center gap-10 pr-10 text-lg font-extrabold tracking-tight text-ink/35 transition-colors hover:text-ink/70"
                  aria-hidden={i >= partners.length}
                >
                  {p}
                  <ToothMark className="h-3.5 w-3.5 text-aqua/60" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
