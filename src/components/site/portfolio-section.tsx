"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/providers/providers";
import { SectionHeading } from "./section-heading";
import { CategoryNav } from "./category-nav";
import { Gallery } from "./gallery";
import { Lightbox } from "./lightbox";
import type { Category, GalleryImage } from "@/lib/types";

export function PortfolioSection({
  categories,
  images,
}: {
  categories: Category[];
  images: GalleryImage[];
}) {
  const { t } = useLanguage();
  const [active, setActive] = useState<string | "all">("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(
    () => (active === "all" ? images : images.filter((img) => img.category_id === active)),
    [active, images]
  );

  return (
    <section id="portfolio" className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-30">
      <SectionHeading eyebrow={t.categories.eyebrow} heading={t.categories.heading} />

      {categories.length > 0 && (
        <div className="mt-10">
          <CategoryNav categories={categories} active={active} onSelect={setActive} />
        </div>
      )}

      <div className="mt-12">
        <Gallery images={filtered} onOpen={setLightboxIndex} />
      </div>

      <Lightbox
        images={filtered}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
