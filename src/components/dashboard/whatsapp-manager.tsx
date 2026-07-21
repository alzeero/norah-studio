"use client";

import { useState, useTransition, type FormEvent } from "react";
import { updateWhatsappSettings } from "@/lib/actions/content";
import { buildWhatsAppUrl } from "@/lib/utils";
import { Input, Label, Textarea, FieldError, FieldSuccess } from "@/components/ui/form-fields";
import { Button } from "@/components/ui/button";
import type { SiteSettings } from "@/lib/types";

export function WhatsappManager({ settings }: { settings: SiteSettings }) {
  const [, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [phone, setPhone] = useState(settings.whatsapp_phone);
  const [message, setMessage] = useState(settings.whatsapp_message);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBusy(true);
    startTransition(async () => {
      try {
        await updateWhatsappSettings({ whatsapp_phone: phone, whatsapp_message: message });
        setSuccess("تم تحديث إعدادات واتساب بنجاح.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ ما.");
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h2 className="text-heading font-medium">واتساب</h2>
        <p className="mt-1 text-sm text-fg-muted">
          يشغّل زر "احجزي جلستك". أدخلي رمز الدولة بدون + أو مسافات (مثال: 9665XXXXXXXX).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="wa-phone">رقم الهاتف</Label>
          <Input
            id="wa-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9665XXXXXXXX"
            dir="ltr"
          />
        </div>
        <div>
          <Label htmlFor="wa-message">الرسالة الافتراضية</Label>
          <Textarea
            id="wa-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            dir="rtl"
            className="min-h-40 font-arabic"
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full sm:w-auto">
          حفظ إعدادات واتساب
        </Button>
        <FieldError>{error}</FieldError>
        <FieldSuccess>{success}</FieldSuccess>
      </form>

      {phone && (
        <a
          href={buildWhatsAppUrl(phone, message)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-gold underline underline-offset-4"
        >
          معاينة الرابط على واتساب
        </a>
      )}
    </div>
  );
}
