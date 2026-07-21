"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FloatingWhatsApp({ phone, message }: { phone: string; message: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  // Hide once the contact section (which has its own large WhatsApp CTA)
  // scrolls into view, so the floating button isn't redundant right next
  // to it.
  useEffect(() => {
    const target = document.getElementById("book");
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  if (!phone) return null;

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.a
          href={buildWhatsAppUrl(phone, message)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="تواصل عبر واتساب"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform duration-300 ease-premium hover:scale-105 sm:bottom-8 sm:right-8"
        >
          {!prefersReducedMotion && (
            <span className="absolute inset-0 -z-10 rounded-full bg-whatsapp/60 [animation:pulse-ring_2.8s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
          )}
          <WhatsAppIcon className="h-7 w-7" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
