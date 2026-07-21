"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/providers";
import { formatLocalPhone } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function Footer({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const localPhone = settings.whatsapp_phone ? formatLocalPhone(settings.whatsapp_phone) : null;

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-content flex-col items-center gap-5 px-5 text-center sm:px-8">
        <Image
          src="/logo/norah-monogram.png"
          alt="Norah Studio"
          width={140}
          height={90}
          className="h-8 w-auto opacity-90"
        />
        <p className="text-sm text-fg-muted">
          {t.footer.tagline}
          {localPhone && (
            <span dir="ltr" className="mx-2 inline-block">
              • {localPhone}
            </span>
          )}
        </p>
        <p className="text-xs text-fg-muted/70">
          © {year} Norah Abdullah Studio — {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
