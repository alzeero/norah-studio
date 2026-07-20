import { cache } from "react";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Supabase client for Server Components, Server Actions, and the dashboard
 * page. Wrapped in React's `cache()` so that within a single request every
 * caller — getCategories, getGalleryImages, getTestimonials,
 * getSiteSettings, every Server Action, the dashboard page — shares one
 * client and one cookie read instead of each constructing its own. That's
 * what removes the duplicate-client fan-out that existed before.
 */
export const createClient = cache(async () => {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // `setAll` is called from a Server Component that can't set cookies.
          // Safe to ignore here because middleware refreshes the session on
          // every request that matters (see src/middleware.ts).
        }
      },
    },
  });
});
