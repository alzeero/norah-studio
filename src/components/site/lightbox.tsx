"use client";

import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

type LightboxProps = {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
};

const SWIPE_THRESHOLD = 60;

export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const current = index !== null ? images[index] : null;

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + images.length) % images.length);
  }, [index, images.length, onNavigate]);

  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % images.length);
  }, [index, images.length, onNavigate]);

  function handleDragEnd(_event: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      goNext();
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose, goPrev, goNext]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-2xl sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <div
            className="flex h-full max-h-[94vh] w-full max-w-5xl flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="إغلاق"
              onClick={onClose}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-gold hover:text-black"
            >
              <X size={26} />
            </button>

            <motion.div
              key={current.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative min-h-0 w-full flex-1 touch-pan-y"
            >
              <Image
                src={current.url}
                alt={current.caption ?? ""}
                fill
                sizes="96vw"
                priority
                unoptimized
                draggable={false}
                className="pointer-events-none select-none object-contain"
              />
            </motion.div>

            {current.caption && (
              <p className="max-w-full shrink-0 px-6 text-center text-sm text-white/80">
                {current.caption}
              </p>
            )}

            {images.length > 1 && (
              <div dir="ltr" className="flex shrink-0 items-center gap-4">
                <button
                  aria-label="السابق"
                  onClick={goPrev}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-gold hover:text-black"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  aria-label="التالي"
                  onClick={goNext}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-gold hover:text-black"
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
