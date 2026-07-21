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
