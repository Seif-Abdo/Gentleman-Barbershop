import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./config/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0B",
        surface: "#141414",
        "surface-dark": "#141414",
        "surface-2": "#1C1C1C",
        "surface-3": "#242424",
        border: "#2A2418",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#E8CB6E",
          dark: "#9C7A1E",
          hover: "#DFC057",
          dim: "rgba(212, 175, 55, 0.15)",
        },
        ivory: {
          DEFAULT: "#F5F0E1",
          muted: "#A39E8F",
          dark: "#6E6859",
        },
        status: {
          ok: "#6FA06B",
          danger: "#C2554D",
          warning: "#E8A838",
        },
        age: {
          young: "#E8CB6E",
          youths: "#D4AF37",
          elderly: "#8C6D1F",
          unknown: "#525252",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-cairo)", "var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #9C7A1E 0%, #E8CB6E 50%, #D4AF37 100%)",
        "gold-shimmer": "linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)",
        "surface-gradient": "linear-gradient(180deg, rgba(28, 28, 28, 0.8) 0%, rgba(20, 20, 20, 0.95) 100%)",
      },
      boxShadow: {
        "gold-glow": "0 0 20px -5px rgba(212, 175, 55, 0.3)",
        "gold-glow-lg": "0 0 35px -5px rgba(212, 175, 55, 0.45)",
      },
    },
  },
  plugins: [],
};

export default config;
