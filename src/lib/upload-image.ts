import { createClient } from "@/lib/supabase/client";

const BUCKET = "media";

/**
 * Uploads a file directly from the browser to Supabase Storage — not
 * through a Server Action. Vercel Functions have a hard 4.5MB request body
 * limit that no Next.js config (`bodySizeLimit`, etc.) can raise, so a
 * full-resolution photo sent through a Server Action would fail before it
 * ever reached this code. Uploading straight from the browser to Supabase
 * bypasses Vercel's request pipeline entirely, so there's no such limit
 * here — and the file is handed to Supabase exactly as selected, with no
 * client-side compression or resizing.
 *
 * Relies on the same Storage RLS policies already in place (authenticated
 * users can write to the `media` bucket) — the browser client shares the
 * same session cookies as the server, so this only works when the admin is
 * actually signed in, same as every other write in the app.
 */
export async function uploadImageToStorage(
  file: File,
  folder: "gallery" | "hero"
): Promise<{ path: string; url: string }> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

/** Cleans up a storage object — used when the upload itself succeeds but
 *  the follow-up database write fails, so an orphaned file isn't left
 *  behind in the bucket. */
export async function removeImageFromStorage(path: string): Promise<void> {
  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
