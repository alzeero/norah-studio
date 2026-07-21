"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/components/providers/providers";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#portfolio", label: t.nav.portfolio },
    { href: "#testimonials", label: t.nav.testimonials },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-premium",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-content items-center justify-between px-5 sm:px-8">
        <a href="#top" aria-label="Norah Studio" className="flex items-center gap-3">
          <Image
            src="/logo/norah-monogram.png"
            alt="Norah Studio"
            width={36}
            height={24}
            className="h-6 w-auto"
            priority
          />
        </a>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-fg transition-colors hover:text-gold"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageToggle />
          <ThemeToggle />
          <a
            href="#book"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-black shadow-gold transition-colors hover:bg-gold-deep hover:text-bg"
          >
            {t.nav.book}
          </a>
        </div>

        <button
          type="button"
          className="p-2 text-fg md:hidden"
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-bg px-5 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-base font-medium text-fg"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-gold px-5 py-3 text-center text-sm font-medium text-black"
            >
              {t.nav.book}
            </a>
            <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
