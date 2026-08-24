import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        tenadam: {
          green: {
            50: "#f0fdf6",
            100: "#dcfceb",
            200: "#bbf7d6",
            300: "#86efac",
            400: "#4ade80",
            500: "#22c55e",
            600: "#16a34a",
            700: "#15803d",
            800: "#166534",
            900: "#14532d",
          },
          blue: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#bae6fd",
            300: "#7dd3fc",
            400: "#38bdf8",
            500: "#0ea5e9",
            600: "#0284c7",
            700: "#0369a1",
          },
          neutral: {
            50: "#fafaf9",
            100: "#f5f5f4",
            200: "#e7e5e4",
            300: "#d6d3d1",
            400: "#a8a29e",
            500: "#78716c",
            600: "#57534e",
            700: "#44403c",
            800: "#292524",
            900: "#1c1917",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(14,165,233,0.06) 50%, rgba(250,250,249,0) 100%)",
        "hero-gradient-dark":
          "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(14,165,233,0.08) 50%, rgba(28,25,23,0) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.08)",
        "glass-dark": "0 8px 32px rgba(0, 0, 0, 0.3)",
        glow: "0 0 60px rgba(34, 197, 94, 0.15)",
        "glow-blue": "0 0 60px rgba(14, 165, 233, 0.15)",
        "glow-intense": "0 0 80px rgba(34, 197, 94, 0.25)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.12)",
        "card-hover-dark": "0 20px 60px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "shimmer-slow": "shimmer 3s linear infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(34, 197, 94, 0.6)" },
          "70%": { transform: "scale(1)", boxShadow: "0 0 0 12px rgba(34, 197, 94, 0)" },
          "100%": { transform: "scale(0.95)", boxShadow: "0 0 0 0 rgba(34, 197, 94, 0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
