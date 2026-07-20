import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteData } from "@/lib/data";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Dashboard — Norah Studio",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this route; this is a defensive second check.
  if (!user) redirect("/admin/login");

  const { categories, images, testimonials, settings } = await getSiteData();

  return (
    <DashboardShell categories={categories} images={images} testimonials={testimonials} settings={settings} />
  );
}
