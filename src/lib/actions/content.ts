"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "media";

async function requireAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("[requireAdmin] auth.getUser() returned an error:", {
      message: error.message,
      status: error.status,
    });
  }
  if (!data.user) {
    throw new Error("يجب تسجيل الدخول للقيام بذلك.");
  }
  return supabase;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "gallery_images" | "testimonials"
) {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return data && data.length > 0 ? data[0].sort_order + 1 : 0;
}

// ---------------------------------------------------------------------------
// Gallery images
//
// The file itself is uploaded directly from the browser straight to
// Supabase Storage (see src/lib/upload-image.ts) — Vercel Functions have a
// hard 4.5MB request body limit that no Next.js config can raise, so
// routing full-resolution photography through a Server Action would fail
// for any real photo. These actions only ever receive the resulting
// metadata (path + URL), never the file, keeping every request tiny.
// ---------------------------------------------------------------------------

export async function createGalleryImageRecord(data: {
  storage_path: string;
  url: string;
  caption: string | null;
}) {
  const supabase = await requireAdmin();
  const sort_order = await nextSortOrder(supabase, "gallery_images");
  const { error } = await supabase.from("gallery_images").insert({ ...data, sort_order });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateGalleryImage(id: string, updates: { caption?: string | null }) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("gallery_images").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteGalleryImage(id: string, storagePath: string) {
  const supabase = await requireAdmin();
  await supabase.storage.from(BUCKET).remove([storagePath]);
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function reorderGalleryImage(id: string, direction: "up" | "down", currentOrder: number) {
  const supabase = await requireAdmin();
  const targetOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

  const { data: neighbor } = await supabase
    .from("gallery_images")
    .select("id, sort_order")
    .eq("sort_order", targetOrder)
    .maybeSingle();

  if (neighbor) {
    await supabase.from("gallery_images").update({ sort_order: currentOrder }).eq("id", neighbor.id);
  }
  const { error } = await supabase.from("gallery_images").update({ sort_order: targetOrder }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------

export async function createTestimonial(customerName: string, comment: string) {
  const name = customerName.trim();
  const text = comment.trim();
  if (!name || !text) throw new Error("الاسم والتعليق مطلوبان.");
  const supabase = await requireAdmin();
  const sort_order = await nextSortOrder(supabase, "testimonials");
  const { error } = await supabase
    .from("testimonials")
    .insert({ customer_name: name, comment: text, sort_order });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateTestimonial(id: string, customerName: string, comment: string) {
  const name = customerName.trim();
  const text = comment.trim();
  if (!name || !text) throw new Error("الاسم والتعليق مطلوبان.");
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("testimonials")
    .update({ customer_name: name, comment: text })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteTestimonial(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ---------------------------------------------------------------------------
// Site settings — hero, WhatsApp, general
// ---------------------------------------------------------------------------

export async function updateHeroText(data: { hero_title: string; hero_subtitle: string }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateHeroImageRecord(data: { storage_path: string; url: string }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_image_path: data.storage_path,
      hero_image_url: data.url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateWhatsappSettings(data: {
  whatsapp_phone: string;
  whatsapp_message: string;
  instagram_url: string;
  tiktok_url: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateGeneralSettings(data: { default_theme: "light" | "dark" | "system" }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}
