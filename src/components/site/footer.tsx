"use client";

import Image from "next/image";
import { useLanguage } from "@/components/providers/providers";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12">
      <div className="mx-auto flex max-w-content flex-col items-center gap-5 px-5 text-center sm:px-8">
        <Image
          src="/logo/norah-monogram.png"
          alt="Norah Studio"
          width={168}
          height={108}
          className="h-[2.4rem] w-auto opacity-90"
        />
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-fg">{t.footer.tagline}</p>
          <p className="text-sm text-fg-muted">{t.footer.subtitle}</p>
        </div>
        <p className="text-xs text-fg-muted/70">
          © {year} Norah Abdullah Studio — {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
