import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteData } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import type { Category, GalleryImage, Testimonial, SiteSettings } from "@/lib/types";

export const metadata: Metadata = {
  title: "Dashboard — Norah Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  // auth.getUser() makes a real network call to Supabase to validate the
  // session — it can itself throw (network hiccup, rate limit) rather than
  // cleanly returning { user: null }. Distinguishing "the check failed" from
  // "there's genuinely no session" matters: this route re-executes on the
  // server after every dashboard save (via revalidatePath + the client
  // calling router.refresh()), which means getUser() gets called here in
  // quick succession with the same call already made by middleware and by
  // the action's own requireAdmin() moments earlier — exactly the pattern
  // that would surface a transient failure here specifically, right after
  // saving, rather than on a first cold page load.
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
    // Logged in full, not silenced — this still results in a redirect below,
    // it just also leaves a clear trail of *why* in the server logs instead
    // of surfacing as an unexplained crash.
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
    const data = await getSiteData();
    categories = data.categories;
    images = data.images;
    testimonials = data.testimonials;
    settings = data.settings;
  } catch (thrown) {
    // getCategories/getGalleryImages/getTestimonials/getSiteSettings each
    // already catch their own Supabase errors and fall back to safe empty
    // values — so reaching this block means something failed *outside*
    // that per-table handling (createClient() itself, or a genuinely
    // unexpected exception). Log the full stack, then let it propagate to
    // the dashboard's error.tsx boundary instead of hiding it — this is
    // visibility, not suppression: nothing here returns a fake success.
    console.error(
      "[dashboard/page] getSiteData() threw:",
      thrown instanceof Error ? thrown.stack ?? thrown.message : thrown
    );
    throw thrown;
  }

  if (!settings) {
    // Unreachable in practice — the catch above always re-throws — but this
    // gives both TypeScript and a future reader a concrete guarantee here
    // instead of relying on try/catch control-flow inference.
    throw new Error("[dashboard/page] settings unexpectedly null after getSiteData() succeeded.");
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
