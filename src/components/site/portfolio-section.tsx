"use client";

import { useState } from "react";
import { useLanguage } from "@/components/providers/providers";
import { SectionHeading } from "./section-heading";
import { Gallery } from "./gallery";
import { Lightbox } from "./lightbox";
import type { GalleryImage } from "@/lib/types";

export function PortfolioSection({ images }: { images: GalleryImage[] }) {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="portfolio" className="mx-auto max-w-content px-5 py-24 sm:px-8 sm:py-30">
      <SectionHeading eyebrow={t.portfolio.eyebrow} heading={t.portfolio.heading} />

      <div className="mt-12">
        <Gallery images={images} onOpen={setLightboxIndex} />
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </section>
  );
}
