import { I18nProvider, useI18n } from "./i18n";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import SocialProof from "./sections/SocialProof";
import Features from "./sections/Features";
import BeforeAfter from "./sections/BeforeAfter";
import FacebookVideos from "./sections/FacebookVideos";
import Benefits from "./sections/Benefits";
import Testimonials from "./sections/Testimonials";
import Location from "./sections/Location";
import Faq from "./sections/Faq";
import Footer from "./sections/Footer";

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#book"
      className="sr-only z-[100] rounded-full bg-pine px-5 py-3 text-sm font-bold text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      {t.skip}
    </a>
  );
}

function Site() {
  return (
    <div className="relative min-h-screen">
      <SkipLink />
      <div className="noise-overlay" aria-hidden="true" />
      <Navbar />

      <main>
        <Hero requested="" />
        <SocialProof />
        <Features />
        <BeforeAfter />
        <FacebookVideos />
        <Benefits />
        <Testimonials />
        <Location />
        <Faq />
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <Site />
    </I18nProvider>
  );
}
