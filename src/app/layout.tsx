import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Noto_Kufi_Arabic } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { getSiteSettings } from "@/lib/data";
import "./globals.css";

const notoKufiArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-kufi-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: "Norah Studio | Photography & Videography",
  description:
    "Norah Studio — luxury photography and videography. Weddings, portraits, family, products and events, documented with timeless elegance.",
  icons: {
    icon: "/logo/norah-monogram.png",
    apple: "/logo/norah-monogram.png",
  },
  openGraph: {
    title: "Norah Studio | Photography & Videography",
    description: "Luxury photography and videography studio.",
    images: ["/logo/og-image.jpg"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF7F1" },
    { media: "(prefers-color-scheme: dark)", color: "#141D16" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="ar"
      dir="rtl"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${notoKufiArabic.variable}`}
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
          "--font-arabic": "var(--font-noto-kufi-arabic)",
        } as React.CSSProperties
      }
    >
      <body className="antialiased">
        <Providers defaultTheme={settings.default_theme}>{children}</Providers>
      </body>
    </html>
  );
}
