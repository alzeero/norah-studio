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

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}
