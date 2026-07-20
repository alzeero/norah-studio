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
    <div dir="rtl" className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-bg-elevated px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <Image src="/logo/norah-monogram.png" alt="Norah Studio" width={80} height={52} className="h-6 w-auto" />
          <span className="text-sm font-medium text-fg-muted">لوحة تحكم الاستوديو</span>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-fg-muted transition-colors hover:text-gold"
          >
            <LogOut size={15} /> تسجيل الخروج
          </button>
        </form>
      </header>

      <div className="mx-auto flex max-w-6xl gap-8 px-5 py-8 sm:px-8">
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

        <div className="mb-6 flex gap-2 overflow-x-auto sm:hidden">
          {TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium",
                tab === id ? "border-gold bg-gold/15 text-gold" : "border-border text-fg-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <main className="min-w-0 flex-1">
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
