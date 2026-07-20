export type Lang = "ar" | "en";

export const dictionary = {
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
} as const;

export type Dictionary = (typeof dictionary)["ar"];
