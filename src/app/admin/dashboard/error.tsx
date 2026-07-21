"use client";

import { useEffect } from "react";

/**
 * Next.js App Router error boundary for /admin/dashboard and everything
 * under it. Next.js deliberately strips the real error message before it
 * reaches the client in production builds — this component receives the
 * same generic message a default error page would, plus a `digest`, no
 * matter how it's written. That's a Next.js security behavior, not
 * something a component here can override.
 *
 * To see the *real* error:
 *   - Locally: run `npm run dev` and read the terminal — full messages and
 *     stack traces are never hidden in development.
 *   - On Vercel: open the project → Logs (or `vercel logs`) right after
 *     reproducing the error, and search for the digest shown below. The
 *     full server-side console output, including this one's `console.error`
 *     call and the underlying stack trace, is there.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin/dashboard/error.tsx] Server Component error:", error);
  }, [error]);

  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-fg"
    >
      <p className="text-heading font-medium">حدث خطأ غير متوقع في لوحة التحكم</p>
      <p className="max-w-md text-sm text-fg-muted">
        {error.message || "لم يتم إرفاق رسالة من الخادم — هذا متوقع في بيئة الإنتاج."}
      </p>
      {error.digest && (
        <p dir="ltr" className="rounded-full border border-border px-4 py-1.5 font-mono text-xs text-fg-muted">
          digest: {error.digest}
        </p>
      )}
      <p className="max-w-md text-xs text-fg-muted">
        ابحثي عن الـ digest أعلاه في Vercel ← مشروعك ← Logs لرؤية تفاصيل الخطأ الكاملة.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-black transition-colors hover:bg-gold-deep"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
