import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Supabase client for Server Components, Server Actions, and the dashboard
 * page.
 *
 * This used to be wrapped in React's `cache()` to dedupe repeated calls
 * within one request. That's reverted here: `cache()`'s memoization is
 * scoped to a React render pass, and Server Actions run as a separate
 * invocation from the render they trigger afterward (via revalidatePath /
 * router.refresh()) — mixing the two is a plausible, hard-to-verify-without-
 * running-it source of the exact "Server Components render" errors that
 * were showing up specifically after saving. A fresh client per call is the
 * simpler, unambiguous, well-established pattern; the cost is a few extra
 * (cheap) client constructions per request, not a functional difference.
 */
export async function createClient() {
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
}
