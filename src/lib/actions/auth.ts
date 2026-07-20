"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SignInState = { error: string | null };

type SignInError = { message: string; status?: number };

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
    // A network-level failure (DNS, TLS, connection refused, timeout) throws
    // instead of returning a normal { error } result — this is what
    // "fetch failed" is: the request never reached Supabase at all.
    const message = thrown instanceof Error ? thrown.message : String(thrown);
    console.error("[auth/signIn] Network error reaching Supabase:", message);
    return {
      error:
        "تعذّر الاتصال بـ Supabase (خطأ في الشبكة). تحقّقي من أن مشروع Supabase ليس متوقفًا " +
        "مؤقتًا (Paused) في لوحة تحكم Supabase، ومن أن NEXT_PUBLIC_SUPABASE_URL في Vercel مطابق " +
        `تمامًا لقيمة Project URL في Supabase. (${message})`,
    };
  }

  if (error) {
    // Log the full, real reason server-side — visible in Vercel's function
    // logs — instead of only ever surfacing one generic message.
    console.error("[auth/signIn] Supabase returned an error:", {
      message: error.message,
      status: error.status,
      code: (error as { code?: string }).code,
    });

    const code = (error as { code?: string }).code;
    const message = error.message.toLowerCase();

    if (code === "email_not_confirmed" || message.includes("email not confirmed")) {
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

    if (message.includes("fetch failed") || message.includes("network")) {
      return {
        error:
          "تعذّر الاتصال بـ Supabase (خطأ في الشبكة). تحقّقي من أن المشروع ليس متوقفًا مؤقتًا، " +
          "ومن صحة NEXT_PUBLIC_SUPABASE_URL في Vercel.",
      };
    }

    if (code === "invalid_credentials" || message.includes("invalid login credentials")) {
      // Supabase intentionally returns this exact message both when the
      // password is wrong AND when no user with this email exists at all
      // (an anti-enumeration measure) — so this can also mean the account
      // was created in a different Supabase project than the one this app
      // is actually connected to. Worth checking NEXT_PUBLIC_SUPABASE_URL in
      // Vercel against the Project URL of the project the user actually
      // lives in.
      return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
    }

    // Anything else — wrong API key, rate limit, disabled project, etc. —
    // surface it directly instead of mislabeling it as a credentials issue.
    return { error: `فشل تسجيل الدخول: ${error.message}` };
  }

  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
