# Norah Studio

A one-page luxury photography & videography portfolio for **Norah Abdullah Studio** — Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion and Supabase, with a private single-admin dashboard to manage everything without touching code.

Design system: colors extracted directly from the studio's own logo (warm white / near-black / gold in light mode; the logo's exact deep greenish-black in dark mode). Typography: Geist Sans for Latin text, Noto Kufi Arabic for Arabic — both used with the same clean, tight-tracked hierarchy throughout hero, nav, buttons, cards, and the dashboard. The site defaults to Arabic (RTL) with an EN toggle in the nav, mirroring the Seven Store reference; testimonials and hero text auto-detect Arabic vs. English per entry and render with the correct font and direction regardless of which UI language is active.

The one signature visual motif is a pair of thin gold viewfinder corners — borrowed from the vocabulary of photography itself — that appear on hover over gallery images, category cards and around the lightbox.

## 1. Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- A free [Supabase](https://supabase.com) project

## 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com/dashboard).
2. Go to **SQL Editor → New query**, paste the entire contents of `supabase/schema.sql`, and run it. This creates all four tables, seeds the settings row, enables Row Level Security, and creates the public `media` storage bucket with the correct read/write policies.

   **Already set this up before?** If your project already existed before the "Auto" theme option was added, also run `supabase/migration_add_system_theme.sql` once — it updates the existing `default_theme` column to allow `'system'` as a value, which the original `schema.sql` didn't.
3. Go to **Authentication → Users → Add user** and create the single admin account (your email + a password). There is no public sign-up screen anywhere in the app — this is the only way in.
4. Go to **Project Settings → API** and copy the **Project URL** and **anon public** key.

## 3. Configure the app

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Install & run

```bash
npm install
npm run dev
```

- Public site → `http://localhost:3000`
- Dashboard login → `http://localhost:3000/admin/login`

Sign in with the admin account you created in step 2.3. From there:

| Tab | Controls |
|---|---|
| **Gallery** | Create/delete categories, upload/edit/delete/reorder images, move an image to another category |
| **Hero** | Hero title, subtitle/tagline, hero photo |
| **Testimonials** | Add/edit/delete client testimonials (paste real WhatsApp messages as-is) |
| **WhatsApp** | The phone number and default pre-filled message behind the "Book a Session" button |
| **Settings** | Default theme (Auto/Light/Dark) for first-time visitors — Auto follows the visitor's device preference and updates live |

Every change reflects on the public page within seconds.

## 5. Deploying

The app is a standard Next.js project — deploys cleanly to [Vercel](https://vercel.com) (recommended, zero config) or any Node host that supports Next.js 15. Set the same three environment variables in your host's dashboard before deploying, and update `NEXT_PUBLIC_SITE_URL` to your real domain.

## Project structure

```
src/
  app/
    page.tsx              the single public page
    layout.tsx             fonts, metadata, theme/language providers
    admin/login/            admin sign-in
    admin/dashboard/        protected dashboard (tabs live in components/dashboard)
  components/
    site/                  Hero, Portfolio/Gallery, Lightbox, Testimonials, WhatsApp, Nav, Footer
    dashboard/              the 5 management panels
    ui/                     Button, form fields, Dialog — shared primitives
    providers/               theme (next-themes) + language (AR/EN) context
  lib/
    supabase/               browser/server/middleware Supabase clients
    actions/                all Server Actions (auth + every mutation)
    data.ts                 read-side data fetching for the public page & dashboard
    i18n.ts                 AR/EN UI string dictionary
    types.ts, utils.ts
supabase/schema.sql          tables, RLS policies, storage bucket — run once
```

## Notes

- **One page, by design.** The public site has a single route. Category filtering happens client-side with no navigation, per the brief.
- **Images.** Uploads go straight to the Supabase `media` storage bucket via Server Actions (25MB request limit, configured in `next.config.ts` — raise it further there if you shoot very large files).
- **Empty states.** Until you add content from the dashboard, the gallery and testimonials sections show a quiet placeholder message instead of looking broken.
- **No demo photos are included.** The gallery is empty on first run by design — add your real portfolio images from the dashboard.
