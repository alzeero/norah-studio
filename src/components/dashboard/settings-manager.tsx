"use client";

import { useState, useTransition } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { updateGeneralSettings } from "@/lib/actions/content";
import { FieldError, FieldSuccess } from "@/components/ui/form-fields";
import { cn } from "@/lib/utils";
import type { SiteSettings } from "@/lib/types";

const OPTIONS = [
  { value: "system" as const, label: "تلقائي (حسب الجهاز)", icon: Monitor },
  { value: "light" as const, label: "فاتح", icon: Sun },
  { value: "dark" as const, label: "داكن", icon: Moon },
];

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark" | "system">(settings.default_theme);

  function choose(value: "light" | "dark" | "system") {
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
          المظهر الافتراضي للزوار الجدد. الخيار "تلقائي" يتبع تفضيل النظام في جهاز الزائر ويتغيّر
          معه تلقائيًا. يحتفظ الزوار العائدون بآخر اختيار قاموا به يدويًا من الموقع.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            disabled={busy}
            onClick={() => choose(value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-xl2 border p-6 transition-colors",
              theme === value ? "border-gold bg-gold/10" : "border-border hover:border-gold/50"
            )}
          >
            <Icon size={20} className={theme === value ? "text-gold" : "text-fg-muted"} />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      <FieldError>{error}</FieldError>
      <FieldSuccess>{success}</FieldSuccess>
    </div>
  );
}
