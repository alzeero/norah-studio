"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/components/providers/providers";
import { isArabicText, textDir } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function Hero({ settings }: { settings: SiteSettings }) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const sequence = prefersReducedMotion
    ? {}
    : {
        initial: "hidden",
        animate: "show",
      };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {settings.hero_image_url ? (
          <Image
            src={settings.hero_image_url}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_20%,hsl(var(--gold)/0.16),transparent_55%),linear-gradient(180deg,hsl(133_18%_10%),hsl(133_20%_6%))]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/40" />
      </div>

      <motion.div
        {...sequence}
        variants={container}
        className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 text-center"
      >
        <motion.div variants={item}>
          <Image
            src="/logo/norah-monogram.png"
            alt="Norah Studio"
            width={220}
            height={140}
            priority
            className="h-16 w-auto sm:h-20"
          />
        </motion.div>

        <motion.h1
          variants={item}
          dir={textDir(settings.hero_title)}
          className={`mt-8 text-display-lg font-medium text-white ${
            isArabicText(settings.hero_title) ? "font-arabic" : "font-sans"
          }`}
        >
          {settings.hero_title}
        </motion.h1>

        <motion.div variants={item} className="mt-5 h-px w-16 rule-gold" />

        <motion.p
          variants={item}
          dir={textDir(settings.hero_subtitle)}
          className={`mt-5 text-balance text-lg text-white/85 sm:text-xl ${
            isArabicText(settings.hero_subtitle) ? "font-arabic" : "font-sans"
          }`}
        >
          {settings.hero_subtitle}
        </motion.p>

        <motion.a
          variants={item}
          href="#book"
          className="mt-10 inline-flex h-14 items-center justify-center rounded-full bg-gold px-10 text-base font-medium text-black transition-colors duration-300 hover:bg-white"
        >
          {t.hero.cta}
        </motion.a>
      </motion.div>

      {!prefersReducedMotion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/70"
        >
          <span className="text-eyebrow uppercase">{t.hero.scroll}</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-white/50"
          />
        </motion.div>
      )}
    </section>
  );
}
