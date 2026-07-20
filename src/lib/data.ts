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
  default_theme: "light",
  updated_at: new Date().toISOString(),
};

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
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

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const supabase = await createClient();
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

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
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

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("getSiteSettings failed:", error.message);
    return DEFAULT_SETTINGS;
  }
  return data;
}

export async function getSiteData(): Promise<SiteData> {
  const [categories, images, testimonials, settings] = await Promise.all([
    getCategories(),
    getGalleryImages(),
    getTestimonials(),
    getSiteSettings(),
  ]);
  return { categories, images, testimonials, settings };
}
