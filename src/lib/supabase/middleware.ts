import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseUrl, supabaseAnonKey } from "./env";

/**
 * Refreshes the Supabase auth session on every request and protects the
 * admin dashboard. Login page and the public site remain open to everyone.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const isDashboardRoute = request.nextUrl.pathname.startsWith("/admin/dashboard");

  let isAuthenticated = false;
  try {
    const result = await supabase.auth.getUser();
    isAuthenticated = result.data.user !== null;
    if (result.error) {
      console.error("[middleware] auth.getUser() returned an error:", result.error.message);
    }
  } catch (thrown) {
    console.error(
      "[middleware] auth.getUser() threw:",
      thrown instanceof Error ? thrown.message : thrown
    );
    // Fail closed on dashboard routes (send to login, don't crash the
    // middleware invocation) — visible via the redirect and the log line
    // above, not a silent pass-through.
    if (isDashboardRoute) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/admin/login";
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  if (isDashboardRoute && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
