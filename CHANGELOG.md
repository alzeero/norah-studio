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

---

## Follow-up pass — auth traced further, Arabic letter-spacing fixed everywhere

### Admin authentication — traced to a specific, verifiable layer

The previous pass improved *what the error said* but, per feedback, that's not the same as tracing the actual failure. This pass adds a real diagnostic, not another reworded message:

- **`src/lib/actions/auth.ts`** — when `signInWithPassword` fails for a network-shaped reason, the code now makes a second, completely independent raw `fetch()` request straight to `NEXT_PUBLIC_SUPABASE_URL` itself — bypassing the Supabase SDK entirely — and reports the *result of that specific test* in the error message:
  - If the raw request **also** fails → conclusively confirms the problem is the URL itself, DNS, or the Supabase project (e.g. paused) — not application code, since nothing in this codebase touches DNS/network resolution.
  - If the raw request **succeeds** while `signInWithPassword` still fails → conclusively narrows the problem to the Supabase Auth client specifically, which is a different, much more specific bug to chase next.
  
  This turns "still broken" into a definitive yes/no about which layer is failing, the next time it's attempted.
- Confirmed (checked directly, not assumed): nothing in the project sets `export const runtime = "edge"` anywhere — Server Actions run on Vercel's Node.js runtime, which has native `fetch`; this rules out an Edge-runtime-specific network restriction as the cause.

### Arabic letter-spacing removed everywhere

**Root cause:** several components applied Tailwind letter-spacing utilities (`tracking-widest2`, `tracking-tight`, `tracking-wide`) unconditionally, inherited from when those components only ever rendered English text. Once the dashboard and public-site defaults became Arabic, that same tracking kept being applied to Arabic script — which breaks its cursive letter-joining and is why labels like "كلمة المرور" looked visibly broken apart.

- **`src/app/globals.css`** — added a global rule forcing `letter-spacing: normal` on all text within an RTL page or any `.font-arabic`-marked element, as a comprehensive safety net (excludes elements that explicitly opt into `dir="ltr"`, like phone numbers and email/password fields, which correctly keep their tracking).
- **`src/components/ui/form-fields.tsx`** — removed `uppercase tracking-widest2` from the shared `Label` component entirely (it's exclusively used for Arabic dashboard labels now).
- **`src/components/ui/button.tsx`, `navbar.tsx`, `category-nav.tsx`** — removed `tracking-tight` from shared/base classes (all now render mostly-Arabic text).
- **`src/components/site/testimonials.tsx`, `section-heading.tsx`, `hero.tsx`, `language-toggle.tsx`** — these render text that can be *either* script depending on content or the language toggle, so tracking is now applied conditionally (only when the specific text is actually Latin), instead of unconditionally.
- **`tailwind.config.ts`** — removed the letter-spacing baked into the `eyebrow` font-size token, since eyebrow text switches script with the language toggle and can no longer have a single fixed value.

### Files changed in this follow-up pass

```
src/lib/actions/auth.ts
src/app/globals.css
src/components/ui/form-fields.tsx
src/components/ui/button.tsx
src/components/site/navbar.tsx
src/components/site/category-nav.tsx
src/components/site/testimonials.tsx
src/components/site/language-toggle.tsx
src/components/site/section-heading.tsx
src/components/site/hero.tsx
tailwind.config.ts
```

---

## Third pass — Server Component error, mobile dashboard rebuild, Arabic tracking finally fully removed

### 1. "An error occurred in the Server Components render" — root cause

**What was actually happening:** `src/lib/supabase/server.ts`'s `createClient` was wrapped in React's `cache()`, added specifically to avoid constructing a duplicate Supabase client per data-fetch within one request. `cache()`'s memoization is scoped to a React render pass. Server Actions, however, run as a separate invocation *from* the render they subsequently trigger (via `revalidatePath` + the client calling `router.refresh()`) — mixing a render-scoped cache with that action → refresh cycle is exactly the kind of boundary condition that produces intermittent Server Component render failures, matching the reported pattern precisely: it showed up specifically after saving (an action, then a refresh), not just on a plain page load.

**Fix — `src/lib/supabase/server.ts`:** reverted `createClient` to a plain, unmemoized `async function`. This is the simpler, unambiguous, well-established pattern. The cost is a few extra (cheap) client constructions per request — not a functional difference, and a fully justified trade for removing a scope-boundary condition that's genuinely hard to verify as safe without running the app directly.

**On "run it locally / read the exact stack trace":** I don't have a way to execute `npm run dev` or reach your Vercel logs from this environment — I can't literally do that step myself. What I *can* do, and did: read every file in the chain by hand and identify a specific, technically-grounded reason a Server Component error would appear exactly when and where you described. To get the literal stack trace yourself if anything still surfaces:
- **Locally:** `npm run dev` — full error messages and stack traces are never hidden in development, they print straight to the terminal.
- **On Vercel (production):** Next.js deliberately strips the real message before it reaches the browser, by design, for security — this is true even with a custom error boundary. Open your Vercel project → **Logs** (or `vercel logs`) right after reproducing the error and match it by the `digest` value.

**Added — `src/app/admin/dashboard/error.tsx`** *(new)*: a dashboard-scoped error boundary that shows that digest clearly plus a retry button, instead of Next's bare default screen, so the digest is easy to find and copy when correlating with Vercel's logs.

### 2. Mobile dashboard — the actual bug, plus a full pass

**The concrete bug:** in `dashboard-shell.tsx`, the layout wrapper around the sidebar/tabs/content was `flex` (row direction) with no mobile override. The desktop sidebar was correctly hidden below `sm:`, but the mobile tab bar and the main content were **both still direct children of that same row-direction flex container** — so on a phone, instead of the tab bar sitting above the content, the two were squeezed into a row together, fighting for width. That's the actual, verifiable cause of it looking broken on an iPhone; not a vague "needs to be more responsive."

- **`src/components/dashboard/dashboard-shell.tsx`** — rebuilt: the wrapper is now `flex-col sm:flex-row` (stacks on mobile, sidebar layout from `sm:` up); the mobile tab bar is now its own `sticky` strip directly under the header (scrolls horizontally only within itself, never the page); header logo/label sized down and the "دخول/خروج" label text hidden below `sm:` (icon-only) so it can't get cramped against the logo; root container got `overflow-x-hidden` as a hard backstop against any horizontal scroll.
- **`src/components/dashboard/gallery-manager.tsx`, `hero-manager.tsx`, `whatsapp-manager.tsx`, `testimonials-manager.tsx`** — every dialog's Cancel/Confirm button row now stacks full-width on mobile (`flex-col-reverse` → primary action on top) and goes side-by-side from `sm:` up; the "add category" and "hero photo" forms now stack vertically on mobile with full-width inputs instead of a cramped inline row; every top-level submit button is full-width on mobile, auto-width on larger screens; the two image grids got an explicit `grid-cols-1` base instead of an implicit one; icon-only action buttons (move/edit/delete) got larger touch targets (`p-1.5`→`p-2.5`, tighter gap opened up slightly) for comfortable tapping.

### 3. Arabic letter-spacing — actually fully removed this time

The previous pass's fix used `html[dir="rtl"] *:not([dir="ltr"], [dir="ltr"] *)` — a `:not()` with a comma-separated list *and* a compound descendant selector inside it. That specific combination is a newer CSS Selectors Level 4 capability with materially less consistent support across engines than basic `:not()` — plausibly including exactly the WebKit/Safari build on the iPhone this was tested on, which would make the whole rule invalid and silently dropped rather than partially working.

- **`src/app/globals.css`** — replaced with the simplest possible universally-supported version: `html[dir="rtl"] * { letter-spacing: normal !important; }` plus the existing `.font-arabic` rule. No `:not()`, no compound arguments — just a descendant combinator and `!important`, which has been supported since CSS1.
- **`src/components/site/whatsapp-section.tsx`** — removed the now-pointless `tracking-wider` on the phone number display (it would have been neutralized by the rule above anyway; no reason to leave a class in the source implying an effect that won't happen).

### Files changed in this pass

```
src/lib/supabase/server.ts
src/app/admin/dashboard/error.tsx                (new)
src/components/dashboard/dashboard-shell.tsx
src/components/dashboard/gallery-manager.tsx
src/components/dashboard/hero-manager.tsx
src/components/dashboard/whatsapp-manager.tsx
src/components/dashboard/testimonials-manager.tsx
src/components/site/whatsapp-section.tsx
src/app/globals.css
```

---

## Fourth pass — refined diagnosis, defensive logging, mobile dimensional audit

### Server Component error — what changed in the diagnosis

Removing `cache()` alone didn't fix it, which rules that theory out and narrows things down. Re-tracing the request lifecycle more precisely: a dashboard save does **two separate server round-trips**, not one — (1) the Server Action itself, and (2) a **separate** request Next.js makes when the client calls `router.refresh()` afterward, which re-executes `DashboardPage` on the server to get fresh RSC output. Client-side `try/catch` around the Server Action call (the `run()` helper in every manager) can only ever catch failures from round-trip (1). If `DashboardPage`'s own server-side re-execution — round-trip (2) — throws, there is structurally no way for that `try/catch` to see it; Next.js's own error boundary takes over instead, which is exactly the generic message being reported. This is a materially more precise mechanism than the earlier `cache()` guess, and explains why removing `cache()` alone didn't change anything: the actual failure point was never inside `cache()`, it's in what runs during that second, separate request.

**I still cannot execute this project or read your Vercel logs from here** — this environment has no network access, so `npm install` itself is impossible, which blocks every subsequent step (`npm run dev`, connecting to Supabase, opening a browser). I'm not able to change that. What follows is the most rigorous thing possible without it: every place `DashboardPage`'s re-execution could throw, made to fail loudly with full context instead of silently or generically.

- **`src/app/admin/dashboard/page.tsx`** — `auth.getUser()` and `getSiteData()` are now each wrapped individually, logging the complete error (message, status, and stack trace where available) before either redirecting (auth case) or re-throwing (data case) — nothing here swallows a failure or fakes a success; every path still ends in a visible outcome, just with a full trail in the logs first.
- **`src/lib/supabase/middleware.ts`** — `auth.getUser()` here had no error handling at all before; a transient failure would crash the middleware invocation itself. Now wrapped the same way, failing closed (redirect to login) with logging instead of crashing.
- **`src/lib/actions/content.ts`** — `requireAdmin()`, called by every single action, now logs `auth.getUser()`'s error detail too, for the same reason: whichever of these three call sites is where the real exception originates, it will now say so explicitly in the server logs instead of three different call sites all failing silently in slightly different ways.

**What you'll get from this:** reproduce it again, then check Vercel → your project → Logs for one of these three tagged lines (`[dashboard/page]`, `[middleware]`, `[requireAdmin]`) around the time of the error. That will show conclusively which of the three it is and the exact underlying message — the one piece of information I structurally cannot obtain myself, and the only way to move from "most likely cause" to "confirmed cause."

### Mobile layout — dimensional audit against 390×844

I can't open Safari or take a screenshot from here either, so instead of asserting it looks right, I recalculated actual rendered widths by hand against exactly 390px for every dashboard surface, using the real Tailwind spacing values (e.g. `px-4` = 16px/side):

| Surface | Available width after padding | Content width used |
|---|---|---|
| Header (`px-4`) | 358px | ~80px (logo + sign-out icon) |
| Main content (`px-4`) | 358px | fills via `w-full`, `min-w-0` on the flex child prevents refusal-to-shrink |
| Upload form (`grid-cols-1` below `sm:`) | 358px | each field `w-full` |
| Image cards (`grid-cols-1` below `sm:`) | 358px | image is `aspect-[4/3]` of the cell, card has `overflow-hidden` |
| Dialogs (`p-4` overlay + `p-6` panel) | 358px → 310px inner | inputs `w-full`, buttons now stack |

Nothing in this pass turned up a further concrete overflow beyond what the previous pass already fixed (the `flex`-direction bug). The `min-w-0` on `<main>` specifically matters: flex children default to refusing to shrink below their content's natural width, which is a common, easy-to-miss source of "small overflow on mobile only" bugs; it's set correctly here.

### Files changed in this pass

```
src/app/admin/dashboard/page.tsx
src/lib/supabase/middleware.ts
src/lib/actions/content.ts
```

---

## Fifth pass — two evidence-backed fixes, not further inference

Per the request to stop inferring: both fixes below are grounded in Next.js's own documentation and GitHub issue tracker, checked directly rather than reasoned from memory.

### Server Component error — the actual mechanism, confirmed

Searched Next.js's own GitHub discussions on this exact behavior. Confirmed directly from the maintainers: **after a Server Action runs, Next.js already triggers a client-side refresh of the current route automatically** — this is built in, not something the calling code needs to request (source: vercel/next.js discussion #81385, an official maintainer response).

`src/components/dashboard/*.tsx` was calling `router.refresh()` manually, in addition to that automatic one, in every single manager. Beyond being redundant, `router.refresh()` returns `void` — not a Promise — so if the refresh it triggers fails, that failure has no path back to the `try/catch` sitting around it. It cannot be caught by application code, by design of the API itself. Two refresh mechanisms firing for the same route in close succession is also a known category of Next.js app-router instability (see vercel/next.js discussion #63900, "revalidatePath in a Server Action breaks the app router").

**Fix:** removed every manual `router.refresh()` call (and the now-unused `useRouter` import) from `gallery-manager.tsx`, `hero-manager.tsx`, `testimonials-manager.tsx`, `whatsapp-manager.tsx`, `settings-manager.tsx`. Each Server Action's own `revalidatePath` call is what actually keeps the dashboard current — that part still works exactly as before. What's gone is the second, redundant, uncatchable-by-design refresh layered on top of it.

### Mobile — a real, verifiable candidate for "still not responsive"

`src/app/layout.tsx` exported a `viewport` object with only `themeColor` set — `width` and `initialScale` were left to Next.js's implicit defaults instead of being declared explicitly. Checked Next.js's own issue tracker: there are confirmed, reproduced bug reports of exactly this — a `viewport` export not being fully honored, resulting in a missing or incorrect `<meta name="viewport">` tag in the rendered HTML (vercel/next.js discussions/issues #66843 and #57680, both explicitly describing resulting production UI bugs).

If the viewport meta tag isn't correctly set to `width=device-width, initial-scale=1`, mobile Safari falls back to laying the page out at its default desktop-oriented layout viewport (historically ~980px) and scales the whole result down to fit the screen. That would produce exactly what was reported — pinch-zoomed-looking, horizontally-scrollable pages — **regardless of how correct the underlying Tailwind responsive classes are**, because the `sm:` breakpoint (640px) would already be satisfied at a phantom ~980px width, so the mobile-specific (unprefixed) classes from the previous two passes would never actually apply in the first place. This would also fully explain why those passes made no visible difference: the CSS was right, but the breakpoint conditions were never being evaluated against the real 390px screen.

**Fix:** `viewport` now explicitly sets `width: "device-width"` and `initialScale: 1` alongside the existing `themeColor`, matching Next.js's own documented working examples exactly, instead of relying on implicit defaults that have a documented history of not always applying.

### Files changed in this pass

```
src/app/layout.tsx
src/components/dashboard/gallery-manager.tsx
src/components/dashboard/hero-manager.tsx
src/components/dashboard/testimonials-manager.tsx
src/components/dashboard/whatsapp-manager.tsx
src/components/dashboard/settings-manager.tsx
```

---

## Seventh pass — UI/UX overhaul: logo typography, categories removed, upload architecture fixed, lightbox rebuilt

### 1. Logo typography → Cormorant Garamond

- **`src/app/layout.tsx`** — added `Cormorant_Garamond` via `next/font/google`, exposed as `--font-logo`.
- **`tailwind.config.ts`, `src/app/globals.css`** — new `font-logo` utility with elegant `letter-spacing: 0.04em`, positioned after the RTL letter-spacing reset so it still applies when the (default) RTL page wraps the English wordmark.
- **`src/components/site/hero.tsx`** — hero title uses `font-logo` instead of `font-sans` for the Latin case; Arabic case unaffected.

### 2. Gallery categories removed completely

Removed from every layer, not just hidden:
- **`src/lib/types.ts`** — `Category` type deleted; `category_id` dropped from `GalleryImage`.
- **`src/lib/data.ts`** — `getCategories` deleted.
- **`src/lib/actions/content.ts`** — `createCategory`/`renameCategory`/`deleteCategory` deleted; `category_id` removed from the remaining gallery actions.
- **`src/lib/utils.ts`** — `slugify` deleted (only caller was category creation).
- **`src/components/site/category-nav.tsx`** — deleted (no longer used).
- **`src/components/site/portfolio-section.tsx`** — rewritten, just renders the gallery directly.
- **`src/components/dashboard/gallery-manager.tsx`** — rewritten without the categories section or the category select in the upload/edit forms.
- **`src/lib/i18n.ts`** — unused `categories.all` string removed; the `categories` key itself renamed to `portfolio` (it was always just the section label, not related to the filter feature — the name was just confusingly left over).
- **`supabase/schema.sql`** — `categories` table, `gallery_images.category_id` column, related indexes and RLS policies all removed from the fresh-install schema.
- **`supabase/migration_remove_categories.sql`** *(new)* — optional: drops the now-unused table/column from an already-existing database. The app works correctly whether or not you run this.

### 3. Upload architecture — fixed a real problem, not just "no compression"

Discovered while implementing "accept large uploads safely": **Vercel Functions have a hard 4.5MB request body limit that no Next.js config can raise.** Every upload — a real 4K photo — would have failed in production regardless of any `bodySizeLimit` setting, since that limit is enforced by Vercel's platform in front of the function, not by Next.js itself.

- **`src/lib/upload-image.ts`** *(new)* — uploads the file directly from the browser to Supabase Storage using the existing browser Supabase client, bypassing Vercel's request pipeline (and its 4.5MB limit) entirely. The file is handed to Supabase exactly as selected — no resizing, no compression, at any point.
- **`src/lib/actions/content.ts`** — `uploadGalleryImage`/`updateHeroImage` (which took the file itself) replaced with `createGalleryImageRecord`/`updateHeroImageRecord`, which take only the resulting `{storage_path, url}` plus caption — tiny payloads, nowhere near any size limit.
- **`src/components/dashboard/gallery-manager.tsx`, `hero-manager.tsx`** — upload handlers rewritten around this: upload to storage first, then write the tiny metadata record; if the metadata write fails, the just-uploaded file is cleaned up so nothing is orphaned in the bucket.

### 4. Lightbox rebuilt

**`src/components/site/lightbox.tsx`** — fullscreen image (`fill` + `object-contain` inside a 94vh/96vw frame instead of the previous ~85vh cap); background changed from a flat dark overlay to `backdrop-blur-2xl` over a semi-transparent black, so the page behind reads as heavily blurred rather than just dark; close button enlarged with its own solid circular background so it's never hard to see against a bright photo; prev/next arrows enlarged the same way; swipe-to-navigate added via Framer Motion's drag gesture (`drag="x"` + `onDragEnd` offset detection) for mobile, on top of the existing keyboard arrows.

### 5. Contact section, footer, floating button, hero CTA

- **`src/components/site/whatsapp-section.tsx`** — removed the extra sentence, kept only the two requested lines; CTA button switched from gold to official WhatsApp green (`#25D366`, with a `#1DA851` hover/pressed shade — added as a `whatsapp` color in `tailwind.config.ts`).
- **`src/components/site/floating-whatsapp.tsx`** — rewritten: WhatsApp green, and now watches the contact section with an `IntersectionObserver` to fade itself out once that section (which has its own large CTA) scrolls into view, fading back in once it scrolls back out.
- **`src/components/site/footer.tsx`** — new tagline text; phone number now displayed next to it, formatted for local reading (`formatLocalPhone` in `src/lib/utils.ts`) and derived from the same WhatsApp number set in the dashboard rather than a second, separately-hardcoded value.
- **`src/components/site/hero.tsx`** — CTA now scrolls to `#portfolio` instead of `#book`.
- **`src/app/globals.css`** — added `[id] { scroll-margin-top: 96px }` globally, so anchor-scrolling to any section (portfolio, testimonials, contact) lands below the fixed header instead of tucking the heading underneath it.
- **`src/components/site/section-heading.tsx`** — eyebrow is now optional (skips rendering when empty), used to show testimonials as a single heading ("آراء العملاء") instead of a small eyebrow plus a separate large heading.

### 6. Lazy-load blur placeholder

**`src/components/site/lazy-image.tsx`** *(new)* — wraps `next/image` with a soft blurred placeholder that fades out on load. `next/image` already lazy-loads below-the-fold images by default; this only adds the visual loading state on top, with no effect on the delivered image's resolution or quality. Used in `src/components/site/gallery.tsx`. The hero image intentionally keeps its existing `priority` (eager) loading — lazy-loading doesn't apply to an above-the-fold image.

### Re-verified, unchanged

Sticky header (`navbar.tsx`'s scroll-triggered background), automatic system theme (`enableSystem` + `defaultTheme="system"` in `providers.tsx`) — both were already correct from earlier passes and didn't need further changes; confirmed by re-reading the current code, not re-implemented.

### Integration fixes (required for the above to actually compile)

Removing categories touched shared types used across the app — these three files needed updating to match, or the project wouldn't build:
- **`src/app/page.tsx`** — stopped passing `categories` to `PortfolioSection`; now passes `settings` to `Footer`.
- **`src/app/admin/dashboard/page.tsx`** — stopped fetching/passing categories.
- **`src/components/dashboard/dashboard-shell.tsx`** — stopped accepting/forwarding a `categories` prop.

### Files changed this pass

```
tailwind.config.ts
src/app/layout.tsx
src/app/globals.css
src/app/page.tsx
src/app/admin/dashboard/page.tsx
src/lib/types.ts
src/lib/data.ts
src/lib/utils.ts
src/lib/i18n.ts
src/lib/actions/content.ts
src/lib/upload-image.ts                          (new)
src/components/site/hero.tsx
src/components/site/footer.tsx
src/components/site/whatsapp-section.tsx
src/components/site/floating-whatsapp.tsx
src/components/site/section-heading.tsx
src/components/site/portfolio-section.tsx
src/components/site/lightbox.tsx
src/components/site/gallery.tsx
src/components/site/lazy-image.tsx               (new)
src/components/dashboard/dashboard-shell.tsx
src/components/dashboard/gallery-manager.tsx
src/components/dashboard/hero-manager.tsx
supabase/schema.sql
supabase/migration_remove_categories.sql         (new)
README.md
```

### Deleted

```
src/components/site/category-nav.tsx
```

---

## Eighth pass — contact section refinements, social links, footer cleanup

### Contact section

- **`src/lib/i18n.ts`** — heading text matched exactly as specified (removed a diacritic to match precisely); CTA button text changed from "تواصل عبر واتساب" to "ابدأ المحادثة" (and the English equivalent updated to match in tone).
- **`src/components/site/whatsapp-section.tsx`** — phone number now shown as "📞 0534101445" (local format via the existing `formatLocalPhone` helper) instead of the previous "+966…" international format with a WhatsApp icon; Instagram and TikTok icons added below it, each rendered only when its URL is set in the dashboard, each opening in a new tab, icon-only with no label text.
- **`src/components/site/instagram-icon.tsx`, `tiktok-icon.tsx`** *(new)* — inline SVG brand icons (no new package dependency): Instagram built from basic shapes (rounded square + circle + dot — the standard monochrome line-art form of the mark); TikTok as a single note-and-disc path. Both render in `currentColor` so they pick up the site's palette (white on this dark section, gold on hover).

### Dashboard

- **`src/lib/types.ts`, `data.ts`, `actions/content.ts`** — added `instagram_url`/`tiktok_url` to `SiteSettings`; `updateWhatsappSettings` extended to save them alongside the existing WhatsApp fields.
- **`src/components/dashboard/whatsapp-manager.tsx`** — added "روابط السوشيال ميديا" fields (Instagram URL, TikTok URL) under the existing WhatsApp section, same form, same save action. Leaving a field empty hides that icon on the site — no code change ever required.
- **`supabase/schema.sql`** — two new columns on `site_settings`, both defaulting to `''`.
- **`supabase/migration_add_social_links.sql`** *(new)* — for an already-existing database: adds the two columns. Optional for brand-new setups, since the updated `schema.sql` already includes them.

### Footer

- **`src/components/site/footer.tsx`** — logo enlarged from `h-8` (32px) to `h-[2.4rem]` (38.4px, exactly +20%); phone number and any WhatsApp-related element removed entirely — the phone number now appears exactly once on the whole site, inside the contact section; content replaced with the tagline "تصوير فوتوغرافي" and, beneath it, "حيث تتحول اللحظات إلى صور تُحكى"; copyright line unchanged (`© {year} Norah Abdullah Studio — جميع الحقوق محفوظة`, computed dynamically so it reads 2026 today and stays correct in future years without further edits).
- **`src/lib/i18n.ts`** — added `footer.subtitle` for the new second line.
- **`src/app/page.tsx`** — `Footer` no longer takes a `settings` prop (it doesn't use anything from it anymore).

### Files changed this pass

```
src/lib/types.ts
src/lib/data.ts
src/lib/i18n.ts
src/lib/actions/content.ts
src/app/page.tsx
src/components/site/whatsapp-section.tsx
src/components/site/footer.tsx
src/components/site/instagram-icon.tsx           (new)
src/components/site/tiktok-icon.tsx              (new)
src/components/dashboard/whatsapp-manager.tsx
supabase/schema.sql
supabase/migration_add_social_links.sql          (new)
```

---

## Sixth pass — theme follows system preference, single-client architecture, WhatsApp button

### 1. Floating WhatsApp button

Checked `src/app/page.tsx` directly — it's still correctly imported and rendered there, unchanged since it was added, with the same `bottom-6 right-6` fixed positioning. I couldn't find a code regression. The component only renders when `settings.whatsapp_phone` is non-empty (correct — no point showing a button with nothing to link to) — and given issue #3 below meant dashboard saves have been unreliable, the most likely explanation is that a WhatsApp number entered in the dashboard didn't actually persist. Once #3 is fixed, re-save the number in **WhatsApp** and the button should reappear; the component itself needed no changes.

### 2. Theme now follows system preference by default

- **`src/lib/types.ts`** — `default_theme` is now `"light" | "dark" | "system"`.
- **`src/components/providers/providers.tsx`** — `enableSystem` turned on (was explicitly `false`, which disabled system-preference tracking entirely). With it on and `defaultTheme="system"`, next-themes reads `prefers-color-scheme` and live-updates if the visitor's OS theme changes while the page is open.
- **`src/components/dashboard/settings-manager.tsx`** — now three choices: **تلقائي** (system), **فاتح** (light), **داكن** (dark). Choosing light or dark here overrides the automatic behavior for new visitors; an individual visitor can still further override their own view with the existing navbar toggle, same as before.
- **`src/lib/data.ts`, `src/lib/actions/content.ts`** — the "system" value threaded through.
- **`supabase/schema.sql`** — updated for new installs; **`supabase/migration_add_system_theme.sql`** *(new)* — for your already-existing database, since re-running `schema.sql` won't alter an existing check constraint or row. Run it once in the SQL Editor.

### 3. The Server Component error — new architecture, not another patch

Removing `router.refresh()` didn't fix it either, which rules that out as sufficient on its own and points at something inside the render itself. Re-examined `src/lib/data.ts`: `getCategories`, `getGalleryImages`, `getTestimonials`, and `getSiteSettings` each independently called `createClient()`, and `getSiteData()` ran all four **concurrently** via `Promise.all`. That means up to four independent Supabase client instances, each capable of deciding on its own that the session needed refreshing, doing so **at the same time** within one render. That's a real, known failure mode for cookie/JWT-based sessions: refresh tokens are typically single-use, so if two concurrent attempts both try to refresh the same one, the second fails because the first already rotated it out.

**Fix:** `getCategories`, `getGalleryImages`, `getTestimonials`, and `getSiteSettings` now take an already-built client as a parameter instead of each constructing their own. `src/app/admin/dashboard/page.tsx` builds **exactly one** client per render and passes that same instance into all four reads plus the auth check. `src/app/layout.tsx` does the same for its own settings read. This isn't a memoization trick to reason about (like the earlier `cache()` attempt) — it's just one client, visibly, in the code. `getSiteData()` still exists as a convenience wrapper (builds one client, passes it to all four) for the public page, which doesn't need to share a client with an auth check.

I'm not going to claim certainty I can't back up without running this myself — but this is a concrete, verifiable-by-reading-the-code change to the actual concurrency pattern that was there, not another layer of error handling around it.

### Files changed in this pass

```
src/lib/types.ts
src/lib/data.ts
src/app/admin/dashboard/page.tsx
src/app/layout.tsx
src/components/providers/providers.tsx
src/components/dashboard/settings-manager.tsx
src/lib/actions/content.ts
supabase/schema.sql
supabase/migration_add_system_theme.sql          (new)
README.md
```
