"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

const BUCKET = "media";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("You must be signed in to do that.");
  }
  return supabase;
}

function revalidateAll() {
  revalidatePath("/");
  revalidatePath("/admin/dashboard");
}

async function nextSortOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  table: "categories" | "gallery_images" | "testimonials"
) {
  const { data } = await supabase
    .from(table)
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  return data && data.length > 0 ? data[0].sort_order + 1 : 0;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function createCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const supabase = await requireAdmin();
  const sort_order = await nextSortOrder(supabase, "categories");
  const { error } = await supabase
    .from("categories")
    .insert({ name: trimmed, slug: slugify(trimmed) || randomUUID().slice(0, 8), sort_order });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function renameCategory(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Category name is required.");
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("categories")
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ---------------------------------------------------------------------------
// Gallery images
// ---------------------------------------------------------------------------

export async function uploadGalleryImage(formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file") as File | null;
  const categoryId = (formData.get("category_id") as string) || null;
  const caption = (formData.get("caption") as string) || null;

  if (!file || file.size === 0) throw new Error("Please choose an image to upload.");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `gallery/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const sort_order = await nextSortOrder(supabase, "gallery_images");

  const { error: insertError } = await supabase.from("gallery_images").insert({
    category_id: categoryId,
    storage_path: path,
    url: urlData.publicUrl,
    caption,
    sort_order,
  });

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw new Error(insertError.message);
  }

  revalidateAll();
}

export async function updateGalleryImage(
  id: string,
  updates: { category_id?: string | null; caption?: string | null }
) {
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
  if (!name || !text) throw new Error("Name and comment are both required.");
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
  if (!name || !text) throw new Error("Name and comment are both required.");
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

export async function updateHeroImage(formData: FormData) {
  const supabase = await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) throw new Error("Please choose an image to upload.");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `hero/${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { error } = await supabase
    .from("site_settings")
    .update({
      hero_image_path: path,
      hero_image_url: urlData.publicUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateWhatsappSettings(data: { whatsapp_phone: string; whatsapp_message: string }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateGeneralSettings(data: { default_theme: "light" | "dark" }) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("site_settings")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);
  revalidateAll();
}
