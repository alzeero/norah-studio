# Changelog

## Admin authentication — root-cause fix

**Symptom:** `signInWithPassword` failed with `"Sign-in failed: fetch failed"` — a network-level failure (DNS/TLS/connection), meaning the request never reached Supabase at all, as opposed to Supabase rejecting bad credentials.

- **`src/lib/supabase/env.ts`** — `NEXT_PUBLIC_SUPABASE_URL` is now validated and normalized instead of used as-is: strips accidental wrapping quotes from copy-paste, confirms it's a real `https://` URL via the `URL` constructor, and normalizes to `protocol://host` with no trailing slash. A malformed value now throws a specific, actionable error immediately instead of silently producing a client that fails deep inside `@supabase/ssr` as a generic "fetch failed".
- **`src/lib/actions/auth.ts`** — `signInWithPassword` is now wrapped in `try/catch` so a genuine network failure (a *thrown* exception) is caught and reported distinctly from a normal Supabase-returned `{ error }` (a credentials/config rejection) — previously both were conflated. The real error (message/status/code) is now logged server-side via `console.error` for Vercel's function logs, and every failure branch (unconfirmed email, disabled email provider, network failure, bad credentials, anything else) returns its own specific, Arabic, actionable message instead of one generic string. Also: `"Invalid login credentials"` is the same message Supabase returns both for a wrong password *and* for no matching user existing at all (anti-enumeration by design) — worth checking `NEXT_PUBLIC_SUPABASE_URL` in Vercel against the exact Project URL of the Supabase project the admin user was created in if that specific message reappears.

This is a code-level fix for everything code can fix. It cannot fix a paused Supabase project or a genuinely wrong pasted value in Vercel — if `fetch failed` persists, the new error message will now name the specific problem rather than hiding it.

## 1. Homepage title — single line, guaranteed

- **`tailwind.config.ts`** — added a new `text-hero-title` size, a smaller, more conservative `clamp()` than the previous `display-lg`, sized to fit "NORAH STUDIO" on one line down to ~320px-wide phones.
- **`src/components/site/hero.tsx`** — hero `<h1>` switched to `text-hero-title` and given `whitespace-nowrap`, which makes wrapping structurally impossible regardless of viewport.

## 2. Homepage logo — ~50% larger

- **`src/components/site/hero.tsx`** — logo image sized up from `h-16 sm:h-20` (64px/80px) to `h-24 sm:h-[7.5rem]` (96px/120px), exactly +50% at both breakpoints. Scoped to the hero only — nav, footer, and dashboard logos are untouched.

## 3. Testimonials label renamed

- **`src/lib/i18n.ts`** — the testimonials section eyebrow changed from "الشهادات" to "آراء العملاء" (which also now matches the nav link label, which already used that wording — an inconsistency this fixes). No functional changes.

## 4. Typography / RTL pass

- **`src/app/globals.css`** — added an explicit base `line-height: 1.55` on `html`. Previously body text relied on the browser's own default, which is tighter than ideal for comfortable Arabic reading.
- **`src/components/dashboard/{hero,gallery}-manager.tsx`** — file-input button spacing changed from physical `file:mr-4` to logical `file:me-4`, so it stays correctly positioned when mirrored in RTL instead of collapsing spacing on the wrong side.
- **`src/components/dashboard/login-form.tsx`** — email/password fields explicitly set `dir="ltr"` inside the otherwise-RTL form, since both are inherently Latin/alphanumeric values that read more naturally left-to-right even in an Arabic layout.
- **`src/components/site/whatsapp-section.tsx`** — the displayed phone number is explicitly `dir="ltr"`, for the same reason: digit sequences read left-to-right universally.
- Reviewed the lightbox's prev/next/close button positioning (currently physical `left-*`/`right-*`, not logical) and deliberately left it as-is: it matches the physical Left/Right arrow keys already wired to the same actions, and flipping only the on-screen buttons in RTL would make them inconsistent with the keyboard.

## 5. Contact section visibility

- **`src/components/site/whatsapp-icon.tsx`** *(new)* — an inline SVG of the actual WhatsApp glyph (speech bubble + handset), replacing the generic `lucide-react` chat-bubble icon that was there before. Renders in the site's own gold via `currentColor`, not WhatsApp's brand green.
- **`src/components/site/whatsapp-section.tsx`** — now also displays the actual phone number as visible, readable text (large, bold, gold icon, LTR) beneath the CTA button, not just embedded invisibly inside the button's link. The "no number configured yet" fallback message was also fixed — it was in English on an Arabic-default site.

## 6. Floating WhatsApp button

- **`src/components/site/floating-whatsapp.tsx`** *(new)* — fixed to the bottom-right corner of the screen (stays physically on the right in both Arabic and English, matching every other floating WhatsApp button convention), using the same `WhatsAppIcon` and the site's gold, with the same subtle pulse used on the main CTA. Opens the configured WhatsApp chat in a new tab. Hidden automatically if no phone number is configured yet.
- **`src/app/page.tsx`** — wired in, rendered on the public page only (not the admin dashboard/login, where it wouldn't make sense).

## 7. Admin dashboard — full Arabic / RTL translation

Every dashboard-related file was rewritten with Arabic copy; no functionality changed.

- **`src/components/dashboard/dashboard-shell.tsx`** — tab labels, header, sign-out button; root now forces `dir="rtl"`/`lang="ar"` on mount as a safety net in case the public site's language toggle had left `<html>` in English/LTR before navigating here (the dashboard has no language toggle of its own — it's Arabic-only by design, per the request).
- **`src/components/dashboard/gallery-manager.tsx`**, **`hero-manager.tsx`**, **`testimonials-manager.tsx`**, **`whatsapp-manager.tsx`**, **`settings-manager.tsx`** — every heading, label, placeholder, button, empty-state message, and confirm-dialog string translated.
- **`src/components/dashboard/login-form.tsx`**, **`src/app/admin/login/page.tsx`** — translated for consistency with the rest of the admin experience.
- **`src/components/ui/dialog.tsx`** — the close button's `aria-label` translated.
- **`src/lib/actions/content.ts`** — the four validation messages this app itself throws ("category name is required", "please choose an image", "name and comment are required", "you must be signed in") translated. Error strings that pass through Supabase's own `error.message` verbatim were left as-is — those are dynamic, come from the database/API, and aren't practical to localize.

## Files changed in this pass

```
src/lib/supabase/env.ts
src/lib/actions/auth.ts
src/lib/actions/content.ts
src/lib/i18n.ts
tailwind.config.ts
src/app/globals.css
src/app/page.tsx
src/components/site/hero.tsx
src/components/site/whatsapp-section.tsx
src/components/site/whatsapp-icon.tsx          (new)
src/components/site/floating-whatsapp.tsx      (new)
src/components/dashboard/dashboard-shell.tsx
src/components/dashboard/gallery-manager.tsx
src/components/dashboard/hero-manager.tsx
src/components/dashboard/testimonials-manager.tsx
src/components/dashboard/whatsapp-manager.tsx
src/components/dashboard/settings-manager.tsx
src/components/dashboard/login-form.tsx
src/app/admin/login/page.tsx
src/components/ui/dialog.tsx
```

Nothing else in the project was touched — no redesign, no restructuring.
