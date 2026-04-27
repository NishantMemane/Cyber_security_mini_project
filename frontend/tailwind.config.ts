import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#6B46C1",
          "purple-hover": "#532AA8",
          "purple-light": "#E9DDFF",
          "purple-dim": "#D0BCFF",
        },
        secure: {
          DEFAULT: "#38A169",
          light: "#F0FDF4",
          dark: "#006D40",
        },
        vulnerable: {
          DEFAULT: "#E53E3E",
          light: "#FEF2F2",
          dark: "#BA1A1A",
        },
        surface: {
          DEFAULT: "#FEF7FF",
          dim: "#DED8E3",
          bright: "#FEF7FF",
          container: "#F2EBF7",
          "container-high": "#ECE6F1",
          "container-highest": "#E7E0EB",
          "container-low": "#F8F1FC",
          "container-lowest": "#FFFFFF",
        },
        "on-surface": {
          DEFAULT: "#1D1A22",
          variant: "#494453",
        },
        outline: {
          DEFAULT: "#7A7484",
          variant: "#CBC3D5",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-h1": [
          "40px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-h2": [
          "30px",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "display-h3": [
          "24px",
          { lineHeight: "1.4", fontWeight: "600" },
        ],
        "body-lg": [
          "18px",
          { lineHeight: "1.75", fontWeight: "400" },
        ],
        "body-md": [
          "16px",
          { lineHeight: "1.6", fontWeight: "400" },
        ],
        "label-caps": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" },
        ],
        badge: [
          "13px",
          { lineHeight: "1", fontWeight: "600" },
        ],
      },
      maxWidth: {
        container: "1120px",
      },
      spacing: {
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "section-gap": "80px",
        gutter: "24px",
        "margin-page": "40px",
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        "card-hover": "0px 8px 30px rgba(0, 0, 0, 0.08)",
        subtle: "0px 2px 8px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-left": "slideInLeft 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
