import { ADDRESS_AR, ADDRESS_EN, EMAIL, PHONE, PHONE_HREF, useI18n } from "../i18n";
import { Logo } from "./Navbar";
import {
  IconFacebook,
  IconInstagram,
  IconMail,
  IconMapPin,
  IconPhone,
  IconXSocial,
} from "../components/Icons";

const socials = [
  { label: "Instagram", Icon: IconInstagram },
  { label: "Facebook", Icon: IconFacebook },
  { label: "X", Icon: IconXSocial },
];

export default function Footer() {
  const { t, lang } = useI18n();
  const explore = [
    { label: t.nav.why, href: "#why" },
    { label: t.nav.visit, href: "#visit" },
    { label: t.nav.reviews, href: "#reviews" },
    { label: "الموقع", href: "#location" },
    { label: t.nav.faq, href: "#faq" },
  ];

  return (
    <footer id="contact" className="relative overflow-hidden bg-ink text-cream/70">
      <div className="relative mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 sm:pb-8 sm:pt-16 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.1fr_1.3fr] lg:gap-10">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/55">{t.footerAbout}</p>
            <div className="mt-4 flex gap-3">
              {socials.map(({ label, Icon }) => (
                <a
                  key={label}
                  href={label === "Facebook" ? "https://www.facebook.com/dr.mohammed.elnaggar" : "#top"}
                  target={label === "Facebook" ? "_blank" : undefined}
                  rel={label === "Facebook" ? "noopener noreferrer" : undefined}
                  aria-label={`${t.brandA} ${t.brandB} — ${label}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/15 text-cream/70 transition-all duration-300 hover:-translate-y-1 hover:border-aqua hover:text-aqua"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label={t.footerExplore}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/40">
              {t.footerExplore}
            </h3>
            <ul className="mt-4 space-y-2">
              {explore.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="underline-draw text-sm font-semibold text-cream/70 hover:text-cream"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footerTreatments}>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/40">
              {t.footerTreatments}
            </h3>
            <ul className="mt-4 space-y-2">
              {t.treatments.map((tr) => (
                <li key={tr.id}>
                  <a
                    href="#treatments"
                    className="underline-draw text-sm font-semibold text-cream/70 hover:text-cream"
                  >
                    {tr.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-cream/40">
              {t.footerVisit}
            </h3>
            <ul className="mt-4 space-y-3 text-sm font-semibold">
              <li className="flex items-start gap-3">
                <IconMapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-aqua" />
                {lang === "ar" ? ADDRESS_AR : ADDRESS_EN}
              </li>
              <li>
                <a
                  href={PHONE_HREF}
                  className="flex items-center gap-3 transition-colors hover:text-aqua"
                >
                  <IconPhone className="h-4.5 w-4.5 shrink-0 text-aqua" />
                  <span dir="ltr">{PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="flex items-center gap-3 transition-colors hover:text-aqua"
                >
                  <IconMail className="h-4.5 w-4.5 shrink-0 text-aqua" />
                  <span dir="ltr">{EMAIL}</span>
                </a>
              </li>
            </ul>
            <dl className="mt-5 space-y-1.5 border-t border-cream/10 pt-4 text-[13px]">
              {t.hours.map((h) => (
                <div key={h.d} className="flex items-center justify-between gap-4">
                  <dt className="text-cream/50">{h.d}</dt>
                  <dd
                    className={`font-bold ${
                      h.h === (lang === "ar" ? "مغلق" : "Closed") ? "text-cream/35" : "text-cream/85"
                    }`}
                  >
                    {h.h}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-cream/10 pt-5 text-xs font-semibold text-cream/40 sm:flex-row">
          <p>{t.rights}</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#top" className="underline-draw hover:text-cream/70">
              {t.privacy}
            </a>
            <a href="#top" className="underline-draw hover:text-cream/70">
              {t.terms}
            </a>
            <a href="#top" className="underline-draw hover:text-cream/70">
              {t.accessibility}
            </a>
          </div>
        </div>
      </div>

      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true" dir="ltr">
        <p className="ghost-word -mb-[0.24em] text-center font-display text-[24vw] font-semibold leading-none">
          EL-NAGGAR
        </p>
      </div>
    </footer>
  );
}
