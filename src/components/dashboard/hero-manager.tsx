"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import Image from "next/image";
import { updateHeroText, updateHeroImage } from "@/lib/actions/content";
import { Input, Label, FieldError, FieldSuccess } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function HeroManager({ settings }: { settings: SiteSettings }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState(settings.hero_title);
  const [subtitle, setSubtitle] = useState(settings.hero_subtitle);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function run(action: () => Promise<void>, message: string) {
    setError(null);
    setSuccess(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await action();
        setSuccess(message);
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ ما.");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleTextSubmit(e: FormEvent) {
    e.preventDefault();
    run(() => updateHeroText({ hero_title: title, hero_subtitle: subtitle }), "تم تحديث النص بنجاح.");
  }

  function handleImageSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("يرجى اختيار صورة أولاً.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    run(() => updateHeroImage(formData), "تم تحديث الصورة بنجاح.");
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-heading font-medium">نص الواجهة الرئيسية</h2>
        <p className="mt-1 text-sm text-fg-muted">
          يظهر بشكل كبير فوق صورة الواجهة الرئيسية. يتم اكتشاف اللغة (عربي أو إنجليزي) تلقائيًا.
        </p>
        <form onSubmit={handleTextSubmit} className="mt-4 max-w-md space-y-4">
          <div>
            <Label htmlFor="hero-title">العنوان</Label>
            <Input id="hero-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">العنوان الفرعي / الشعار</Label>
            <Input id="hero-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy} className="w-full sm:w-auto">
            حفظ النص
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h2 className="text-heading font-medium">صورة الواجهة الرئيسية</h2>
        <p className="mt-1 text-sm text-fg-muted">الصورة الكبيرة بعرض الشاشة خلف نص الواجهة الرئيسية.</p>

        {settings.hero_image_url && (
          <div className="relative mt-4 aspect-video max-w-md overflow-hidden rounded-lg border border-border">
            <Image src={settings.hero_image_url} alt="الصورة الحالية" fill className="object-cover" />
          </div>
        )}

        <form onSubmit={handleImageSubmit} className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            className="block w-full text-sm text-fg-muted file:me-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
          />
          <Button type="submit" disabled={busy} className="w-full sm:w-auto">
            {busy ? "جارٍ الرفع…" : "استبدال صورة الواجهة الرئيسية"}
          </Button>
        </form>
      </section>

      <FieldError>{error}</FieldError>
      <FieldSuccess>{success}</FieldSuccess>
    </div>
  );
}
