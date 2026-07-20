"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { updateHeroText, updateHeroImage } from "@/lib/actions/content";
import { Input, Label, FieldError, FieldSuccess } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function HeroManager({ settings }: { settings: SiteSettings }) {
  const router = useRouter();
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
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setBusy(false);
      }
    });
  }

  function handleTextSubmit(e: FormEvent) {
    e.preventDefault();
    run(() => updateHeroText({ hero_title: title, hero_subtitle: subtitle }), "Hero text updated.");
  }

  function handleImageSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    run(() => updateHeroImage(formData), "Hero image updated.");
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-heading font-medium">Hero text</h2>
        <p className="mt-1 text-sm text-fg-muted">
          Shown large over the hero photo. Arabic or English is detected automatically.
        </p>
        <form onSubmit={handleTextSubmit} className="mt-4 max-w-md space-y-4">
          <div>
            <Label htmlFor="hero-title">Title</Label>
            <Input id="hero-title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="hero-subtitle">Subtitle / tagline</Label>
            <Input id="hero-subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
          <Button type="submit" disabled={busy}>
            Save text
          </Button>
        </form>
      </section>

      <div className="h-px bg-border" />

      <section>
        <h2 className="text-heading font-medium">Hero photo</h2>
        <p className="mt-1 text-sm text-fg-muted">The large full-width photo behind the hero text.</p>

        {settings.hero_image_url && (
          <div className="relative mt-4 aspect-video max-w-md overflow-hidden rounded-lg border border-border">
            <Image src={settings.hero_image_url} alt="Current hero" fill className="object-cover" />
          </div>
        )}

        <form onSubmit={handleImageSubmit} className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            className="block text-sm text-fg-muted file:mr-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
          />
          <Button type="submit" disabled={busy}>
            {busy ? "Uploading…" : "Replace hero photo"}
          </Button>
        </form>
      </section>

      <FieldError>{error}</FieldError>
      <FieldSuccess>{success}</FieldSuccess>
    </div>
  );
}
