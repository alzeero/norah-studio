export type Lang = "ar" | "en";

/**
 * Explicit structural type for the UI dictionary. Leaves are `string`, not
 * string literals — the ar/en objects intentionally hold different text, so
 * pinning them to each other's exact literal values (which is what
 * `as const` + `typeof dictionary["ar"]` used to do) is wrong and breaks
 * the build. Both dictionaries are checked against this same shape instead.
 */
export type Dictionary = {
  nav: {
    portfolio: string;
    testimonials: string;
    book: string;
  };
  hero: {
    role: string;
    cta: string;
    scroll: string;
  };
  portfolio: {
    eyebrow: string;
    heading: string;
  };
  gallery: {
    empty: string;
  };
  testimonials: {
    eyebrow: string;
    heading: string;
    empty: string;
  };
  whatsapp: {
    eyebrow: string;
    heading: string;
    cta: string;
  };
  footer: {
    tagline: string;
    subtitle: string;
    rights: string;
  };
  theme: {
    toggle: string;
  };
  lang: {
    toggle: string;
  };
};

export const dictionary: Record<Lang, Dictionary> = {
  ar: {
    nav: {
      portfolio: "الأعمال",
      testimonials: "آراء العملاء",
      book: "احجزي جلستك",
    },
    hero: {
      role: "تصوير فوتوغرافي وفيديو",
      cta: "احجزي جلستك",
      scroll: "مرري لأسفل",
    },
    portfolio: {
      eyebrow: "المعرض",
      heading: "استكشفي أعمالنا",
    },
    gallery: {
      empty: "سيتم إضافة الصور قريبًا",
    },
    testimonials: {
      eyebrow: "",
      heading: "آراء العملاء",
      empty: "لا توجد آراء بعد",
    },
    whatsapp: {
      eyebrow: "تواصلي معنا",
      heading: "لنوثق لحظتكم القادمة",
      cta: "ابدأ المحادثة",
    },
    footer: {
      tagline: "تصوير فوتوغرافي",
      subtitle: "حيث تتحول اللحظات إلى صور تُحكى",
      rights: "جميع الحقوق محفوظة",
    },
    theme: {
      toggle: "تبديل المظهر",
    },
    lang: {
      toggle: "EN",
    },
  },
  en: {
    nav: {
      portfolio: "Portfolio",
      testimonials: "Testimonials",
      book: "Book a Session",
    },
    hero: {
      role: "Photography & Videography",
      cta: "Book a Session",
      scroll: "Scroll",
    },
    portfolio: {
      eyebrow: "Portfolio",
      heading: "Explore Our Work",
    },
    gallery: {
      empty: "Images coming soon",
    },
    testimonials: {
      eyebrow: "",
      heading: "Testimonials",
      empty: "No testimonials yet",
    },
    whatsapp: {
      eyebrow: "Get In Touch",
      heading: "Let's Capture Your Next Moment",
      cta: "Start the Conversation",
    },
    footer: {
      tagline: "Photography",
      subtitle: "Where fleeting moments become timeless stories",
      rights: "All rights reserved",
    },
    theme: {
      toggle: "Toggle theme",
    },
    lang: {
      toggle: "عربي",
    },
  },
};
