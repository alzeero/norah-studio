import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategories, getGalleryImages, getTestimonials, getSiteSettings } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { Category, GalleryImage, Testimonial, SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard — Norah Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Exactly one Supabase client for this entire render — used for the auth
  // check below AND passed directly into every data read that follows.
  // Previously each read built its own client independently; with several
  // running concurrently (Promise.all) that meant several clients each
  // capable of independently deciding the session needed refreshing at the
  // same time, which is a real, known way for the second concurrent
  // refresh to fail (it uses a refresh token the first one already
  // rotated out). One client removes that possibility outright.
  const supabase = await createClient();

  let user;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
    if (result.error) {
      console.error("[dashboard/page] auth.getUser() returned an error:", {
        message: result.error.message,
        status: result.error.status,
      });
    }
  } catch (thrown) {
    console.error(
      "[dashboard/page] auth.getUser() threw:",
      thrown instanceof Error ? thrown.stack ?? thrown.message : thrown
    );
    user = null;
  }

  // Middleware already guards this route; this is a defensive second check.
  if (!user) redirect("/admin/login");

  let categories: Category[] = [];
  let images: GalleryImage[] = [];
  let testimonials: Testimonial[] = [];
  let settings: SiteSettings | null = null;

  try {
    [categories, images, testimonials, settings] = await Promise.all([
      getCategories(supabase),
      getGalleryImages(supabase),
      getTestimonials(supabase),
      getSiteSettings(supabase),
    ]);
  } catch (thrown) {
    console.error(
      "[dashboard/page] data fetch threw:",
      thrown instanceof Error ? thrown.stack ?? thrown.message : thrown
    );
    throw thrown;
  }

  if (!settings) {
    throw new Error("[dashboard/page] settings unexpectedly null after data fetch succeeded.");
  }

  return (
    <DashboardShell
      categories={categories}
      images={images}
      testimonials={testimonials}
      settings={settings}
    />
  );
}
