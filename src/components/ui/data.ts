import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Category, GalleryImage, Testimonial, SiteSettings, SiteData } from "@/lib/types";

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
 * of creating its own. This is deliberate: constructing a client is cheap,
 * but each one independently evaluates whether the session needs refreshing
 * — and a real request-scoped Supabase session (via cookies) can only be
 * refreshed once safely. Multiple independent clients doing that
 * concurrently within the same request (as this file used to do — one
 * client per function, four functions run together via Promise.all) is a
 * known class of bug: the second concurrent refresh attempt uses a refresh
 * token the first one has already rotated out, and fails. Building exactly
 * one client per page render and passing it through removes that risk
 * entirely, and is simple enough to verify just by reading the code — no
 * framework-level memoization behavior to reason about.
 */

export async function getCategories(supabase: SupabaseClient): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    console.error("getCategories failed:", error.message);
    return [];
  }
  return data ?? [];
}

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
 * itself and passes it to all four reads above.
 */
export async function getSiteData(): Promise<SiteData> {
  const supabase = await createClient();
  const [categories, images, testimonials, settings] = await Promise.all([
    getCategories(supabase),
    getGalleryImages(supabase),
    getTestimonials(supabase),
    getSiteSettings(supabase),
  ]);
  return { categories, images, testimonials, settings };
}
