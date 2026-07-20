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
  categories: {
    eyebrow: string;
    heading: string;
    all: string;
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
    body: string;
    cta: string;
  };
  footer: {
    tagline: string;
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
    categories: {
      eyebrow: "المعرض",
      heading: "استكشفي أعمالنا",
      all: "الكل",
    },
    gallery: {
      empty: "سيتم إضافة الصور قريبًا",
    },
    testimonials: {
      eyebrow: "الشهادات",
      heading: "ماذا يقول عملاؤنا",
      empty: "لا توجد آراء بعد",
    },
    whatsapp: {
      eyebrow: "تواصلي معنا",
      heading: "لنوثّق لحظتكم القادمة",
      body: "أخبرينا عن مناسبتكم وسنعود إليكم لتأكيد الموعد المناسب.",
      cta: "تواصل عبر واتساب",
    },
    footer: {
      tagline: "تصوير فوتوغرافي وفيديو فاخر",
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
    categories: {
      eyebrow: "Portfolio",
      heading: "Explore Our Work",
      all: "All",
    },
    gallery: {
      empty: "Images coming soon",
    },
    testimonials: {
      eyebrow: "Testimonials",
      heading: "What Our Clients Say",
      empty: "No testimonials yet",
    },
    whatsapp: {
      eyebrow: "Get In Touch",
      heading: "Let's Capture Your Next Moment",
      body: "Tell us about your occasion and we'll follow up to confirm the perfect time.",
      cta: "Message Us on WhatsApp",
    },
    footer: {
      tagline: "Luxury Photography & Videography",
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
