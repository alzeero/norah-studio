"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseUrl } from "@/lib/supabase/env";

export type SignInState = { error: string | null };

type SignInError = { message: string; status?: number };

/**
 * Makes a raw, SDK-independent request to the Supabase project's own base
 * URL. This is what actually traces a network failure to a specific layer
 * instead of guessing at the cause:
 *
 *   - If this ALSO fails, the problem is the URL/DNS/the Supabase project
 *     itself (paused, deleted, wrong ref) — nothing in this codebase can
 *     fix that; it has to be corrected in Vercel/Supabase directly.
 *   - If this SUCCEEDS while signInWithPassword still fails, the problem is
 *     specific to the Supabase Auth client/library, not basic connectivity
 *     — a genuinely different, narrower bug to chase.
 */
async function probeSupabaseConnectivity(): Promise<string> {
  try {
    const res = await fetch(supabaseUrl, {
      method: "HEAD",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    return (
      `تم الوصول فعليًا إلى ${supabaseUrl} (رمز الاستجابة ${res.status}) — أي أن الرابط يعمل ` +
      `ويستجيب، فالمشكلة ليست في NEXT_PUBLIC_SUPABASE_URL نفسه ولا في كون المشروع متوقفًا، بل في ` +
      `طلب تسجيل الدخول تحديدًا.`
    );
  } catch (thrown) {
    const detail = thrown instanceof Error ? thrown.message : String(thrown);
    return (
      `تعذّر الوصول إلى ${supabaseUrl} مباشرة أيضًا (${detail}) — هذا يؤكد أن المشكلة هي الرابط نفسه ` +
      `(تحقّقي من تطابقه حرفيًا مع Project URL في Supabase) أو أن مشروع Supabase متوقف مؤقتًا ` +
      `(Paused)، وليست خللاً في الكود.`
    );
  }
}

/**
 * Signs the studio's single admin account in. There is no public sign-up —
 * the account is created once, directly in the Supabase dashboard (see
 * README.md), matching the "one admin only, no registration" requirement.
 */
export async function signIn(_prevState: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور." };
  }

  const supabase = await createClient();

  let error: SignInError | null;
  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    error = result.error;
  } catch (thrown) {
    // A genuinely thrown exception — the request never completed at all.
    const message = thrown instanceof Error ? thrown.message : String(thrown);
    console.error("[auth/signIn] signInWithPassword threw:", message);
    error = { message };
  }

  if (error) {
    console.error("[auth/signIn] Supabase returned an error:", {
      message: error.message,
      status: error.status,
    });

    const message = error.message.toLowerCase();

    if (message.includes("fetch failed") || message.includes("network") || message.includes("timeout")) {
      const probe = await probeSupabaseConnectivity();
      console.error("[auth/signIn] Connectivity probe result:", probe);
      return { error: `تعذّر الاتصال بـ Supabase أثناء تسجيل الدخول. ${probe}` };
    }

    if (message.includes("email not confirmed")) {
      return {
        error: "لم يتم تأكيد البريد الإلكتروني لهذا الحساب بعد. تحقّقي منه في Supabase ← Authentication ← Users.",
      };
    }

    if (message.includes("email logins are disabled") || message.includes("email provider")) {
      return {
        error:
          "تسجيل الدخول بالبريد الإلكتروني معطّل لهذا المشروع. فعّليه من Supabase ← Authentication ← Providers ← Email.",
      };
    }

    if (message.includes("invalid login credentials")) {
      // Supabase intentionally returns this exact message both when the
      // password is wrong AND when no user with this email exists at all
      // (an anti-enumeration measure) — so this can also mean the account
      // was created in a different Supabase project than the one this app
      // is actually connected to.
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    }

    return { error: `فشل تسجيل الدخول: ${error.message}` };
  }

  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
