import { useEffect, useState } from "react";
import { useScrolled } from "../hooks";
import { PHONE, PHONE_HREF, useI18n } from "../i18n";
import { IconClose, IconGlobe, IconMenu, IconPhone } from "../components/Icons";
import logo from "../../images/optimized/logo.webp";

export function Logo({ light = false }: { light?: boolean }) {
  const { t } = useI18n();
  return (
    <a href="#top" className="group flex items-center" aria-label={t.brandA + " " + t.brandB}>
      <img
        src={logo}
        alt="Dr. Mohamed El-Naggar"
        width={384}
        height={267}
        decoding="async"
        className={`h-16 w-36 object-contain transition-transform duration-500 group-hover:scale-[1.03] sm:h-18 sm:w-40 ${
          light ? "brightness-110" : ""
        }`}
      />
    </a>
  );
}

export function LangToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-cream/70 px-3.5 py-2 text-xs font-extrabold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-teal/50 hover:bg-mint ${className}`}
    >
      <IconGlobe className="h-4 w-4 text-teal" />
      {lang === "ar" ? "English" : "العربية"}
    </button>
  );
}

export default function Navbar() {
  const { t } = useI18n();
  const scrolled = useScrolled(32);
  const [open, setOpen] = useState(false);

  const links = [
    { label: t.nav.why, href: "#why" },
    { label: t.nav.visit, href: "#visit" },
    { label: t.nav.reviews, href: "#reviews" },
    { label: "الموقع", href: "#location" },
    { label: t.nav.faq, href: "#faq" },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* announcement bar — collapses on scroll */}
      <div
        className="overflow-hidden bg-ink text-cream transition-all duration-500 ease-out"
        style={{ maxHeight: scrolled ? 0 : 40, opacity: scrolled ? 0 : 1 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-2 text-[11px] font-semibold tracking-wide sm:text-xs">
          <span className="hidden h-1.5 w-1.5 rounded-full bg-aqua animate-pulse-dot sm:block" aria-hidden="true" />
          <p className="truncate">
            {t.announceLead}
            <span className="mx-2 text-cream/30">·</span>
            <span className="text-cream/75">{t.announceOffer}</span>
          </p>
        </div>
      </div>

      <nav
        aria-label="Main"
        className={`transition-all duration-500 ${
          scrolled
            ? "border-b border-ink/5 bg-cream/85 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>

          <ul className="hidden items-center gap-6 xl:gap-7 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="underline-draw text-[13.5px] font-semibold text-ink/75 transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={PHONE_HREF}
              className="hidden items-center gap-2 text-[13.5px] font-bold text-ink/80 transition-colors hover:text-teal md:flex"
            >
              <IconPhone className="h-4 w-4 text-teal" />
              <span dir="ltr">{PHONE}</span>
            </a>
            <a
              href="#book"
              className="btn-sheen hidden rounded-full bg-pine px-5 py-2.5 text-[13.5px] font-bold text-cream shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal lg:inline-block"
            >
              {t.book}
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="absolute left-4 grid h-10 w-10 place-items-center rounded-full border border-ink/10 bg-cream/70 text-ink transition hover:bg-mint lg:hidden sm:left-6"
            >
              {open ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={`fixed inset-0 top-0 -z-10 bg-ivory transition-all duration-500 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-between px-6 pb-10 pt-28">
          <ul className="space-y-1">
            {links.map((l, i) => (
              <li
                key={l.href}
                style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
                className={`transition-all duration-500 ${
                  open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
                }`}
              >
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between border-b border-ink/8 py-3 font-display text-xl font-medium text-ink"
                >
                  {l.label}
                  <span className="text-teal opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 rtl:group-hover:-translate-x-1">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div
            className={`space-y-3 transition-all delay-300 duration-500 ${
              open ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            <a
              href="#book"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-pine py-4 text-center text-base font-bold text-cream"
            >
              {t.book}
            </a>
            <div className="flex items-center justify-center gap-4">
              <a href={PHONE_HREF} className="block text-center text-sm font-bold text-ink/70">
                <span dir="ltr">{PHONE}</span>
              </a>
              <LangToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
