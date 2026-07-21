"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Images, Home, Quote, MessageCircle, Settings, LogOut } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { GalleryManager } from "./gallery-manager";
import { HeroManager } from "./hero-manager";
import { TestimonialsManager } from "./testimonials-manager";
import { WhatsappManager } from "./whatsapp-manager";
import { SettingsManager } from "./settings-manager";
import type { Category, GalleryImage, SiteSettings, Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "gallery" | "hero" | "testimonials" | "whatsapp" | "settings";

const TABS: { id: Tab; label: string; icon: typeof Images }[] = [
  { id: "gallery", label: "المعرض", icon: Images },
  { id: "hero", label: "الرئيسية", icon: Home },
  { id: "testimonials", label: "آراء العملاء", icon: Quote },
  { id: "whatsapp", label: "واتساب", icon: MessageCircle },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

export function DashboardShell({
  categories,
  images,
  testimonials,
  settings,
}: {
  categories: Category[];
  images: GalleryImage[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}) {
  const [tab, setTab] = useState<Tab>("gallery");

  // Safety net: if someone reaches the dashboard via a client-side
  // navigation from a page where the language toggle had switched
  // <html> to English/LTR, force it back — the dashboard is Arabic/RTL
  // only, it has no language toggle of its own.
  useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
  }, []);

  return (
    <div dir="rtl" className="min-h-screen w-full overflow-x-hidden bg-bg text-fg">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg-elevated px-4 sm:h-16 sm:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src="/logo/norah-monogram.png"
            alt="Norah Studio"
            width={80}
            height={52}
            className="h-5 w-auto shrink-0 sm:h-6"
          />
          <span className="hidden truncate text-sm font-medium text-fg-muted sm:inline">لوحة تحكم الاستوديو</span>
        </div>
        <form action={signOut} className="shrink-0">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm text-fg-muted transition-colors hover:text-gold sm:px-3"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </form>
      </header>

      {/* Mobile tab bar — sticky just below the header, scrolls horizontally
          if needed instead of ever squeezing/overflowing the page itself. */}
      <div className="sticky top-14 z-20 border-b border-border bg-bg/95 backdrop-blur sm:hidden">
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                tab === id ? "border-gold bg-gold/15 text-gold" : "border-border text-fg-muted"
              )}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:gap-8 sm:px-8 sm:py-8">
        <nav className="hidden w-48 shrink-0 flex-col gap-1 sm:flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-start text-sm font-medium transition-colors",
                tab === id ? "bg-gold/15 text-gold" : "text-fg-muted hover:bg-gold/5 hover:text-fg"
              )}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        <main className="w-full min-w-0 flex-1">
          {tab === "gallery" && <GalleryManager categories={categories} images={images} />}
          {tab === "hero" && <HeroManager settings={settings} />}
          {tab === "testimonials" && <TestimonialsManager testimonials={testimonials} />}
          {tab === "whatsapp" && <WhatsappManager settings={settings} />}
          {tab === "settings" && <SettingsManager settings={settings} />}
        </main>
      </div>
    </div>
  );
}
