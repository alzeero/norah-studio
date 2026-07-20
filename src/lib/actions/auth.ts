"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error: string | null };

/**
 * Signs the studio's single admin account in. There is no public sign-up —
 * the account is created once, directly in the Supabase dashboard (see
 * README.md), matching the "one admin only, no registration" requirement.
 */
export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Log the full, real reason server-side — visible in Vercel's function
    // logs — instead of only ever surfacing one generic message. This is
    // what actually lets the exact cause be diagnosed instead of guessed.
    console.error("[auth/signIn] Supabase returned an error:", {
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code,
    });

    const code = (error as { code?: string }).code;
    const message = error.message.toLowerCase();

    if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
      return {
        error: "This account's email isn't confirmed. Check it in Supabase → Authentication → Users.",
      };
    }

    if (message.includes("email logins are disabled") || message.includes("email provider")) {
      return {
        error:
          "Email sign-in is disabled for this Supabase project. Enable it under Authentication → Providers → Email.",
      };
    }

    if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
      // Supabase intentionally returns this exact message both when the
      // password is wrong AND when no user with this email exists at all
      // (an anti-enumeration measure) — so this can also mean the account
      // was created in a different Supabase project than the one this app
      // is actually connected to. Double-check that NEXT_PUBLIC_SUPABASE_URL
      // in Vercel matches the Project URL of the Supabase project the user
      // was created in.
      return { error: "Incorrect email or password." };
    }

    // Anything else — wrong API key, rate limit, network error, disabled
    // project, etc. — surface it directly instead of mislabeling it as a
    // credentials problem.
    return { error: `Sign-in failed: ${error.message}` };
  }

  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
