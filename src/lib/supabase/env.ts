/**
 * Single source of truth for the two Supabase environment variables.
 * Every client (browser, server, middleware) imports from here instead of
 * reading `process.env` directly, so there is exactly one place that
 * validates them and exactly one error message if they're missing.
 *
 * Why throw here instead of letting `@supabase/ssr` fail on its own: its
 * error ("Your project's URL and Key are required...") doesn't say *which*
 * variable is missing or why. This does.
 *
 * If this throws in a deployment that supposedly already has both variables
 * set in Vercel, the almost-certain cause is that the *currently live build*
 * was produced before the variables were added. `NEXT_PUBLIC_*` values are
 * inlined into the bundle at build time, not read at request time — so:
 *   1. Confirm the variables are enabled for the environment this
 *      deployment belongs to (Production / Preview / Development each have
 *      their own toggles in Vercel's Environment Variables settings).
 *   2. Trigger a genuinely new build: push a commit, or use "Redeploy" with
 *      "Use existing Build Cache" UNCHECKED. A cached redeploy can reuse the
 *      old bundle and will not pick up a variable added after the last real
 *      build.
 * Locally, add the variable to `.env.local` and restart `npm run dev`.
 */
function requireEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing environment variable "${name}". Set it in Vercel → Project Settings ` +
        `→ Environment Variables for the environment this deployment targets, then ` +
        `trigger a new build (redeploying with an existing build cache will not pick ` +
        `up a variable added after the last real build). Locally, set it in ` +
        `.env.local and restart the dev server.`
    );
  }
  return value;
}

export const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = requireEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
