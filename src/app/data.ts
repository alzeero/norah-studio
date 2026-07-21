import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { GalleryImage, Testimonial, SiteSettings, SiteData } from "@/lib/types";

const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  hero_title: "NORAH STUDIO",
  hero_subtitle: "Photography & Videography",
  hero_image_path: null,
  hero_image_url: null,
  whatsapp_phone: "",
  whatsapp_message:
    "مرحبًا بك في NORAH | STUDIO 🤍\n\nحيث تتحول اللحظات إلى صور تُحكى.\n\nشكرًا لتواصلك معنا، ونتشرف بتوثيق أجمل لحظاتكم.\n\nأرغب في حجز جلسة تصوير.",
  default_theme: "system",
  updated_at: new Date().toISOString(),
};

/**
 * Every function below takes an already-constructed Supabase client instead
 * of creating its own — see git history / CHANGELOG for why: multiple
 * independent clients built concurrently within one request risk racing on
 * session/token refresh. One client, built once per render, passed through.
 */

export async function getGalleryImages(supabase: SupabaseClient): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getGalleryImages failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getTestimonials(supabase: SupabaseClient): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getTestimonials failed:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getSiteSettings(supabase: SupabaseClient): Promise<SiteSettings> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("getSiteSettings failed:", error.message);
    return DEFAULT_SETTINGS;
  }
  return data;
}

/**
 * Convenience wrapper for callers that just want everything and don't
 * already have a client (e.g. the public page). Builds exactly one client
 * itself and passes it to all reads below.
 */
export async function getSiteData(): Promise<SiteData> {
  const supabase = await createClient();
  const [images, testimonials, settings] = await Promise.all([
    getGalleryImages(supabase),
    getTestimonials(supabase),
    getSiteSettings(supabase),
  ]);
  return { images, testimonials, settings };
}
