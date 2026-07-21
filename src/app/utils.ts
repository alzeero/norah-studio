import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_RANGE = /[\u0600-\u06FF]/;

/** Detects whether a free-text string (e.g. admin-entered testimonial) is Arabic,
 *  so it can be rendered with the correct font + text direction regardless of
 *  which UI language is currently active. */
export function isArabicText(text: string): boolean {
  return ARABIC_RANGE.test(text);
}

export function textDir(text: string): "rtl" | "ltr" {
  return isArabicText(text) ? "rtl" : "ltr";
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${digitsOnly}?${params.toString()}`;
}

/** Converts a stored international number (e.g. "966534101445") into a
 *  locally-readable display format (e.g. "0534101445"). Falls back to
 *  showing the digits as-is if they don't match the expected Saudi
 *  country-code pattern, so it never shows something broken. */
export function formatLocalPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("966") && digits.length === 12) {
    return "0" + digits.slice(3);
  }
  return digits;
}
