import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F97316",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D946EF",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#84CC16",
          foreground: "#000000",
        },
        background: "#FAFAFA",
        foreground: "#18181B",
        muted: {
          DEFAULT: "#A1A1AA",
          foreground: "#4B5563",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#18181B",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#18181B",
        },
        border: "#E4E4E7",
        input: "#E4E4E7",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;
