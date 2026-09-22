import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Reveal } from "../hooks";
import { PHONE, PHONE_HREF, useI18n } from "../i18n";
import doctorPhoto from "../../images/optimized/doctor.webp";
import {
  IconArrowRight,
  IconCheck,
  IconPhone,
} from "../components/Icons";

function MaskLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="mask-line">
      <span style={{ ["--d" as string]: `${delay}s` }}>{children}</span>
    </span>
  );
}

export function BookingForm({ requested }: { requested: string }) {
  const { t } = useI18n();
  const [treatment, setTreatment] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (requested) {
      setTreatment(requested);
      setSent(false);
    }
  }, [requested]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const message = [
      "طلب حجز جديد",
      `الاسم: ${name}`,
      `الرقم: ${phone}`,
      `نوع الفحص: ${treatment || t.booking.treatmentDefault}`,
      `الوقت: ${time || t.booking.timeDefault}`,
    ].join("\n");

    window.open(`https://wa.me/201129114212?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div id="book" className="relative mx-auto mt-16 w-full max-w-5xl scroll-mt-28 lg:mt-24">
      <div className="absolute -inset-1.5 rounded-[2rem] bg-gradient-to-r from-aqua/40 via-teal/20 to-amber/30 blur-lg" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.9rem] bg-pine p-6 shadow-lift sm:p-8 lg:p-10">
        <div className="dot-grid-light pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-aqua/25 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative" aria-live="polite">
          {sent ? (
            <div className="flex flex-col items-start gap-5 py-4">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-aqua text-ink">
                <IconCheck className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                  {t.booking.successTitle}
                  {name ? `، ${name.split(" ")[0]}` : ""}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/75">
                  {t.booking.successBody}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-5 py-2.5 text-sm font-bold text-cream transition hover:border-aqua hover:text-aqua"
                >
                  <IconPhone className="h-4 w-4" /> {t.booking.callNow} · <span dir="ltr">{PHONE}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="underline-draw text-sm font-semibold text-cream/60 hover:text-cream"
                >
                  {t.booking.another}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <h3 className="font-display text-2xl font-semibold text-cream sm:text-3xl">
                  {t.booking.h3}
                </h3>
                <p className="text-xs font-semibold text-cream/60">{t.booking.note}</p>
              </div>
              <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.1fr_1.2fr_1fr_auto]">
                <div>
                  <label htmlFor="bf-name" className="sr-only">
                    {t.booking.namePh}
                  </label>
                  <input
                    id="bf-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.booking.namePh}
                    autoComplete="name"
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="bf-phone" className="sr-only">
                    {t.booking.phonePh}
                  </label>
                  <input
                    id="bf-phone"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.booking.phonePh}
                    autoComplete="tel"
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="bf-treatment" className="sr-only">
                    {t.treatmentsChoose}
                  </label>
                  <select
                    id="bf-treatment"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="field field-select"
                  >
                    <option value="">{t.booking.treatmentDefault}</option>
                    {t.treatments.map((tr) => (
                      <option key={tr.id} value={tr.name}>
                        {tr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="bf-time" className="sr-only">
                    {t.booking.timeDefault}
                  </label>
                  <select
                    id="bf-time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="field field-select"
                  >
                    <option value="">{t.booking.timeDefault}</option>
                    {t.booking.times.map((time) => (
                      <option key={time}>{time}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="btn-sheen group inline-flex items-center justify-center gap-2 rounded-xl bg-aqua px-6 py-3 text-sm font-extrabold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift sm:col-span-2 lg:col-span-1"
                >
                  {t.booking.submit}
                  <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Hero({ requested }: { requested: string }) {
  const { t } = useI18n();
  return (
    <section id="top" className="relative overflow-hidden pt-36 lg:pt-44">
      {/* React 19 hoists this into <head>. The portrait is the LCP element and
          is only referenced from JS, so without an explicit preload the browser
          cannot discover — let alone start fetching — it until React has run. */}
      <link rel="preload" as="image" href={doctorPhoto} fetchPriority="high" />
      {/* ambient background */}
      <div
        className="dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />
      <div
        className="absolute -top-32 end-[-10%] h-[480px] w-[480px] rounded-full bg-aqua/25 blur-3xl animate-drift"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 start-[-12%] h-[420px] w-[420px] rounded-full bg-amber/20 blur-3xl animate-drift-late"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10">
          {/* copy */}
          <div>
            <h1 className="mt-7 font-display text-[2.7rem] font-medium leading-[1.06] tracking-tight text-ink sm:text-6xl lg:text-[4.2rem]">
              <MaskLine delay={0.1}>{t.hero.line1}</MaskLine>
              <MaskLine delay={0.24}>
                {t.hero.line2a}
                <em className="font-light italic text-teal">{t.hero.line2b}</em>
                <span className="text-amber">.</span>
              </MaskLine>
            </h1>

            <Reveal delay={420} as="p" className="mt-6 max-w-lg text-base leading-relaxed text-ink/70 sm:text-lg">
              {t.hero.sub}
            </Reveal>

            <Reveal delay={540} className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#book"
                className="btn-sheen group inline-flex items-center gap-2.5 rounded-full bg-pine px-7 py-4 text-[15px] font-bold text-cream shadow-lift transition-all duration-300 hover:-translate-y-1 hover:bg-teal"
              >
                {t.hero.ctaBook}
                <IconArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
            </Reveal>

            <Reveal delay={660} className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5">
              {t.hero.checks.map((c) => (
                <span key={c} className="flex items-center gap-2 text-[13px] font-bold text-ink/65">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-mint text-pine">
                    <IconCheck className="h-3 w-3" />
                  </span>
                  {c}
                </span>
              ))}
            </Reveal>
          </div>

          {/* visual */}
          <Reveal delay={250} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative overflow-hidden rounded-[2.2rem] shadow-lift">
              <div className="aspect-[4/4.7] overflow-hidden">
                <img
                  src={doctorPhoto}
                  alt={t.hero.imgAlt}
                  className="h-full w-full bg-ink object-contain animate-kenburns"
                  width={900}
                  height={898}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent" aria-hidden="true" />
            </div>

            {/* floating card: next opening */}
            <div className="glass absolute -start-3 top-8 flex items-center gap-3 rounded-2xl p-4 shadow-soft animate-floaty sm:-start-8">
              <span className="relative flex h-3 w-3">
                <span className="h-3 w-3 rounded-full bg-aqua animate-pulse-dot" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink/55">
                  {t.hero.nextLabel}
                </p>
                <p className="text-sm font-extrabold text-ink">{t.hero.nextValue}</p>
              </div>
            </div>

            {/* rotating badge */}
            <a
              href="#book"
              aria-label={t.book}
              className="group absolute -bottom-7 -start-5 hidden h-28 w-28 place-items-center rounded-full bg-ink shadow-lift transition-transform duration-500 hover:scale-105 md:grid lg:-start-9"
            >
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow text-cream/90" aria-hidden="true">
                <defs>
                  <path id="badge-circ" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0" />
                </defs>
                <text fontSize="9.5" fontWeight="700" letterSpacing="2.6" fill="currentColor">
                  <textPath href="#badge-circ">{t.hero.badgeText}</textPath>
                </text>
              </svg>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-aqua text-ink transition-transform duration-300 group-hover:rotate-45">
                <IconArrowRight className="h-5 w-5 rtl:-scale-x-100" />
              </span>
            </a>
          </Reveal>
        </div>

        <BookingForm requested={requested} />
      </div>
    </section>
  );
}
