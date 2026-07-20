"use client";

import { isArabicText } from "@/lib/utils";
import { useLanguage } from "@/components/providers/providers";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

type CategoryNavProps = {
  categories: Category[];
  active: string | "all";
  onSelect: (id: string | "all") => void;
};

export function CategoryNav({ categories, active, onSelect }: CategoryNavProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => onSelect("all")}
        className={cn(
          "rounded-full border px-5 py-2 text-sm font-medium tracking-tight transition-colors duration-300",
          active === "all"
            ? "border-gold bg-gold text-black"
            : "border-border text-fg-muted hover:border-gold hover:text-gold"
        )}
      >
        {t.categories.all}
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          dir={isArabicText(category.name) ? "rtl" : "ltr"}
          onClick={() => onSelect(category.id)}
          className={cn(
            "rounded-full border px-5 py-2 text-sm font-medium tracking-tight transition-colors duration-300",
            isArabicText(category.name) ? "font-arabic" : "font-sans",
            active === category.id
              ? "border-gold bg-gold text-black"
              : "border-border text-fg-muted hover:border-gold hover:text-gold"
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
