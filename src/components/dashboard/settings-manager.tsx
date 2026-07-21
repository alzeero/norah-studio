"use client";

import { useState, useTransition } from "react";
import { Moon, Sun } from "lucide-react";
import { updateGeneralSettings } from "@/lib/actions/content";
import { FieldError, FieldSuccess } from "@/components/ui/form-fields";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">(settings.default_theme);

  function choose(value: "light" | "dark") {
    setTheme(value);
    setError(null);
    setSuccess(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await updateGeneralSettings({ default_theme: value });
        setSuccess("تم تحديث المظهر الافتراضي بنجاح.");
      } catch (e) {
        setError(e instanceof Error ? e.message : "حدث خطأ ما.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-heading font-medium">الإعدادات العامة</h2>
        <p className="mt-1 text-sm text-fg-muted">
          المظهر الافتراضي للزوار الجدد. يحتفظ الزوار العائدون بآخر اختيار قاموا به.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          disabled={busy}
          onClick={() => choose("light")}
          className={cn(
            "flex flex-1 flex-col items-center gap-2 rounded-xl2 border p-6 transition-colors",
            theme === "light" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
          )}
        >
          <Sun size={20} className={theme === "light" ? "text-gold" : "text-fg-muted"} />
          <span className="text-sm font-medium">فاتح</span>
        </button>
        <button
          disabled={busy}
          onClick={() => choose("dark")}
          className={cn(
            "flex flex-1 flex-col items-center gap-2 rounded-xl2 border p-6 transition-colors",
            theme === "dark" ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
          )}
        >
          <Moon size={20} className={theme === "dark" ? "text-gold" : "text-fg-muted"} />
          <span className="text-sm font-medium">داكن</span>
        </button>
      </div>

      <FieldError>{error}</FieldError>
      <FieldSuccess>{success}</FieldSuccess>
    </div>
  );
}
