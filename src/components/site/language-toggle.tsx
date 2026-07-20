"use client";

import { useLanguage } from "@/components/providers/providers";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, t, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={cn(
        "rounded-full border border-current/25 px-3 py-1.5 text-xs font-medium tracking-wide transition-colors hover:border-gold hover:text-gold",
        lang === "en" && "font-arabic",
        className
      )}
    >
      {t.lang.toggle}
    </button>
  );
}
