import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  // This file runs in the Node process that executes `next build`/`next dev`,
  // so this warning lands directly in the build log — a much earlier signal
  // than the runtime 500 that shows up later if this is missing when the
  // app actually runs.
  console.warn(
    "[next.config.ts] NEXT_PUBLIC_SUPABASE_URL is not set during this build. " +
      "Supabase-hosted images won't be allow-listed for next/image, and the " +
      "app will fail at runtime when it tries to create a Supabase client. " +
      "If this is a Vercel build, confirm the variable is enabled for this " +
      "deployment's environment and that this build isn't reusing a stale cache."
  );
}

const supabaseHostname = (() => {
  try {
    return supabaseUrl ? new URL(supabaseUrl).hostname : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      ...(supabaseHostname
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHostname,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      // Portfolio photography can be large; raise the default 1mb limit.
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
