"use client";

import { useLanguage } from "@/components/providers/providers";
import { cn } from "@/lib/utils";
import { LazyImage } from "./lazy-image";
import type { GalleryImage } from "@/lib/types";

const PATTERN: Array<"feature" | "tall" | "normal"> = [
  "tall",
  "normal",
  "normal",
  "feature",
  "normal",
  "tall",
  "normal",
  "normal",
];

export function Gallery({
  images,
  onOpen,
}: {
  images: GalleryImage[];
  onOpen: (index: number) => void;
}) {
  const { t } = useLanguage();

  if (images.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-xl2 border border-dashed border-border text-fg-muted">
        {t.gallery.empty}
      </div>
    );
  }

  return (
    <div className="grid auto-rows-[160px] grid-cols-2 gap-4 sm:auto-rows-[200px] sm:gap-5 md:grid-cols-3 md:auto-rows-[220px] md:gap-6">
      {images.map((image, index) => {
        const variant = PATTERN[index % PATTERN.length];
        return (
          <button
            key={image.id}
            type="button"
            onClick={() => onOpen(index)}
            aria-label={image.caption ?? "Open image"}
            className={cn(
              "frame-corners group relative overflow-hidden rounded-lg bg-bg-elevated",
              variant === "feature" && "col-span-2 row-span-2",
              variant === "tall" && "row-span-2"
            )}
          >
            <LazyImage
              src={image.url}
              alt={image.caption ?? ""}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>
        );
      })}
    </div>
  );
}
