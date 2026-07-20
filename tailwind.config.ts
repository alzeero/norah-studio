import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        "bg-elevated": "hsl(var(--bg-elevated) / <alpha-value>)",
        fg: "hsl(var(--fg) / <alpha-value>)",
        "fg-muted": "hsl(var(--fg-muted) / <alpha-value>)",
        gold: {
          DEFAULT: "hsl(var(--gold) / <alpha-value>)",
          deep: "hsl(var(--gold-deep) / <alpha-value>)",
          soft: "hsl(var(--gold-soft) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["clamp(2.75rem, 3rem + 3vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "hero-title": ["clamp(2rem, 1.4rem + 4vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        display: ["clamp(2.25rem, 2rem + 2.5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "heading-lg": ["clamp(1.75rem, 1.5rem + 1.5vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        heading: ["clamp(1.375rem, 1.25rem + 0.8vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        eyebrow: ["0.75rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        widest2: "0.22em",
      },
      maxWidth: {
        content: "1440px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        30: "7.5rem",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--fg) / 0.04), 0 12px 32px -16px hsl(var(--fg) / 0.14)",
        gold: "0 8px 30px -10px hsl(var(--gold) / 0.35)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.55" },
          "80%": { transform: "scale(1.9)", opacity: "0" },
          "100%": { transform: "scale(1.9)", opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "pulse-ring": "pulse-ring 2.8s cubic-bezier(0.22, 1, 0.36, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
