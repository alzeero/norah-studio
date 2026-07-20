/**
 * Single source of truth for the two Supabase environment variables.
 * Every client (browser, server, middleware) imports from here instead of
 * reading `process.env` directly, so there is exactly one place that
 * validates them and exactly one error message if they're missing or
 * malformed.
 *
 * Two failure modes are handled, on purpose:
 *
 * 1. Missing entirely — throws immediately, naming the variable.
 * 2. Present but malformed (stray quotes from a copy-paste, missing
 *    "https://", a trailing slash) — these don't fail loudly on their own;
 *    they instead produce a working-looking client that fails the moment it
 *    tries to make a real network call, surfacing as a generic
 *    "fetch failed" deep inside @supabase/ssr with no indication of why.
 *    This validates and normalizes the URL up front so a malformed value
 *    fails here, clearly, instead of there.
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
  // Defensively strip characters that commonly sneak in from copy-pasting a
  // value that was displayed wrapped in quotes, plus surrounding whitespace.
  return value.trim().replace(/^['"]+|['"]+$/g, "");
}

function requireSupabaseUrl(name: string, value: string | undefined): string {
  const cleaned = requireEnv(name, value);

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error(
      `Environment variable "${name}" is set to "${cleaned}", which is not a valid URL. ` +
        `It must look exactly like https://<project-ref>.supabase.co — copy it fresh from ` +
        `Supabase → Project Settings → API → Project URL, with no surrounding quotes, no ` +
        `trailing slash, and no extra characters.`
    );
  }

  if (parsed.protocol !== "https:") {
    throw new Error(
      `Environment variable "${name}" is "${cleaned}" — it must start with "https://". ` +
        `Copy the Project URL again from Supabase → Project Settings → API.`
    );
  }

  // .origin normalizes to "protocol://host" with no trailing slash and no
  // path, which is exactly the form @supabase/ssr expects as the base URL.
  return parsed.origin;
}

export const supabaseUrl = requireSupabaseUrl("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);

export const supabaseAnonKey = requireEnv(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
