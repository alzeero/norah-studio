"use client";

import { useLanguage } from "@/components/providers/providers";
import { buildWhatsAppUrl } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { WhatsAppIcon } from "./whatsapp-icon";
import type { SiteSettings } from "@/lib/types";

export function WhatsAppSection({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const href = settings.whatsapp_phone
    ? buildWhatsAppUrl(settings.whatsapp_phone, settings.whatsapp_message)
    : undefined;

  return (
    <section
      id="book"
      className="relative overflow-hidden bg-[hsl(133_18%_10%)] py-24 text-white sm:py-30"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--gold)/0.14),transparent_60%)]" />
      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <SectionHeading eyebrow={t.whatsapp.eyebrow} heading={t.whatsapp.heading} className="[&_h2]:text-white" />
        <p className="mx-auto mt-5 max-w-md text-white/70">{t.whatsapp.body}</p>

        <div className="mt-10 flex flex-col items-center gap-5">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex h-16 items-center gap-3 rounded-full bg-gold px-10 text-base font-medium text-black shadow-gold transition-colors duration-300 hover:bg-white"
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-gold/60 [animation:pulse-ring_2.8s_cubic-bezier(0.22,1,0.36,1)_infinite] motion-reduce:hidden" />
              <WhatsAppIcon className="h-6 w-6 shrink-0" />
              {t.whatsapp.cta}
            </a>
          ) : (
            <p className="text-sm text-white/50">
              {t.whatsapp.cta} — أضيفي رقم واتساب من لوحة التحكم لتفعيل هذا الزر.
            </p>
          )}

          {settings.whatsapp_phone && (
            <p
              dir="ltr"
              className="flex items-center gap-2 text-lg font-medium text-white"
            >
              <WhatsAppIcon className="h-5 w-5 shrink-0 text-gold" />
              <span>+{settings.whatsapp_phone.replace(/[^\d]/g, "")}</span>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
