import { useState } from "react";
import { Reveal } from "../hooks";
import { useI18n } from "../i18n";
import { IconPlus } from "../components/Icons";

export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 bg-fog py-24 sm:py-32" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-teal">
                {t.faqEyebrow}
              </p>
              <h2
                id="faq-heading"
                className="mt-4 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl"
              >
                {t.faqTitleA}{" "}
                <em className="font-light italic text-teal">{t.faqTitleB}</em>
              </h2>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/65">{t.faqSub}</p>
            </Reveal>
          </div>

          <div>
            {t.faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 70}>
                  <div className="border-b border-ink/10">
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        id={`faq-button-${i}`}
                        onClick={() => setOpen(isOpen ? null : i)}
                        className="group flex w-full items-center justify-between gap-6 py-6 text-start"
                      >
                        <span
                          className={`font-display text-lg font-semibold tracking-tight transition-colors duration-300 sm:text-xl ${
                            isOpen ? "text-teal" : "text-ink group-hover:text-teal"
                          }`}
                        >
                          {f.q}
                        </span>
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                            isOpen
                              ? "rotate-45 border-teal bg-teal text-cream"
                              : "border-ink/15 text-ink/60 group-hover:border-teal group-hover:text-teal"
                          }`}
                        >
                          <IconPlus className="h-4 w-4" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${i}`}
                      role="region"
                      aria-labelledby={`faq-button-${i}`}
                      className="grid transition-[grid-template-rows] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
                      style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-ink/65">
                          {f.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
