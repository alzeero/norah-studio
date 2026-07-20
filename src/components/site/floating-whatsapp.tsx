"use client";

import { useReducedMotion } from "framer-motion";
import { buildWhatsAppUrl } from "@/lib/utils";
import { WhatsAppIcon } from "./whatsapp-icon";

export function FloatingWhatsApp({ phone, message }: { phone: string; message: string }) {
  const prefersReducedMotion = useReducedMotion();

  if (!phone) return null;

  return (
    <a
      href={buildWhatsAppUrl(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black shadow-gold transition-transform duration-300 ease-premium hover:scale-105 sm:bottom-8 sm:right-8"
    >
      {!prefersReducedMotion && (
        <span className="absolute inset-0 -z-10 rounded-full bg-gold/60 [animation:pulse-ring_2.8s_cubic-bezier(0.22,1,0.36,1)_infinite]" />
      )}
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
