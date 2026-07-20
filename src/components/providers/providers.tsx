"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { dictionary, type Dictionary, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  dir: "rtl" | "ltr";
  t: Dictionary;
  toggleLang: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within <Providers>");
  return ctx;
}

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ar");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  return (
    <LanguageContext.Provider
      value={{ lang, dir: lang === "ar" ? "rtl" : "ltr", t: dictionary[lang], toggleLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function Providers({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme: "light" | "dark";
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme} enableSystem={false}>
      <LanguageProvider>{children}</LanguageProvider>
    </NextThemesProvider>
  );
}
