"use client";

import { useLanguage } from "@/components/providers/providers";
import { isArabicText, textDir } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useLanguage();

  return (
    <section id="testimonials" className="bg-bg-elevated/60 py-24 sm:py-30">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <SectionHeading eyebrow={t.testimonials.eyebrow} heading={t.testimonials.heading} />

        {testimonials.length === 0 ? (
          <p className="mt-12 text-center text-fg-muted">{t.testimonials.empty}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <Reveal key={testimonial.id} delay={Math.min(i * 0.08, 0.4)}>
                <figure className="flex h-full flex-col rounded-xl2 border border-border bg-bg p-7">
                  <div className="mb-5 h-px w-10 rule-gold" />
                  <blockquote
                    dir={textDir(testimonial.comment)}
                    className={`flex-1 text-[0.95rem] leading-relaxed text-fg/90 ${
                      isArabicText(testimonial.comment) ? "font-arabic" : "font-sans"
                    }`}
                  >
                    {testimonial.comment}
                  </blockquote>
                  <figcaption
                    dir={textDir(testimonial.customer_name)}
                    className={`mt-6 text-sm font-medium uppercase text-gold ${
                      isArabicText(testimonial.customer_name) ? "font-arabic" : "font-sans tracking-widest2"
                    }`}
                  >
                    {testimonial.customer_name}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
