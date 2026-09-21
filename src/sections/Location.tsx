import { Reveal } from "../hooks";
import { ADDRESS_AR, ADDRESS_EN, useI18n } from "../i18n";
import { IconArrowRight, IconMapPin } from "../components/Icons";

const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/KdQK8Jcf8aZUMmSU9";

export default function Location() {
  const { t, lang } = useI18n();
  const address = lang === "ar" ? ADDRESS_AR : ADDRESS_EN;

  return (
    <section
      id="location"
      className="scroll-mt-24 border-y border-ink/5 bg-fog py-20 sm:py-28"
      aria-labelledby="location-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">{t.footerVisit}</p>
            <h2 id="location-heading" className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
              {lang === "ar" ? "عنواننا على الخريطة" : "Find us on the map"}
            </h2>
            <p className="mt-5 flex items-start gap-3 max-w-md text-[15px] font-semibold leading-relaxed text-ink/65">
              <IconMapPin className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              <span>{address}</span>
            </p>
            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-sheen mt-7 inline-flex items-center gap-2.5 rounded-full bg-pine px-6 py-3.5 text-sm font-extrabold text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal"
            >
              {lang === "ar" ? "افتح في Google Maps" : "Open in Google Maps"}
              <IconArrowRight className="h-4 w-4 rtl:-scale-x-100" />
            </a>
          </Reveal>

          <Reveal delay={140}>
            <div className="relative overflow-hidden rounded-[2rem] bg-fog shadow-lift ring-1 ring-ink/8">
              <div className="aspect-[16/9] overflow-hidden">
                <iframe
                  title={lang === "ar" ? "خريطة موقع العيادة" : "Clinic location map"}
                  src="https://www.google.com/maps?q=Dr.+Mohamed+Elnaggar+Clinic&output=embed"
                  className="h-full w-full border-0 grayscale-[0.15]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={lang === "ar" ? "افتح موقع العيادة في Google Maps" : "Open clinic location in Google Maps"}
                className="absolute inset-0 z-10"
              />
              <div className="pointer-events-none absolute bottom-4 start-4 flex items-center gap-2 rounded-full bg-cream/90 px-4 py-2 text-xs font-extrabold text-ink shadow-soft backdrop-blur-sm">
                <IconMapPin className="h-4 w-4 text-teal" />
                {lang === "ar" ? "اضغط لفتح الخريطة" : "Click to open map"}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
