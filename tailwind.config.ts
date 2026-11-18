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
        cyber: {
          darkest: "#04070D",
          dark: "#090D16",
          card: "#0D1524",
          cardBorder: "#1B2A4A",
          cyan: "#00F0FF",
          cyanMuted: "rgba(0, 240, 255, 0.15)",
          cyanGlow: "rgba(0, 240, 255, 0.4)",
          azure: "#38BDF8",
          blue: "#2563EB",
          emerald: "#10B981",
          amber: "#F59E0B",
          slate: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-space)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "pulse-subtle": "pulseSubtle 3s ease-in-out infinite",
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "radar-scan": "radarScan 4s linear infinite",
        "glow-breathe": "glowBreathe 4s ease-in-out infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        radarScan: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glowBreathe: {
          "0%, 100%": { filter: "drop-shadow(0 0 15px rgba(0, 240, 255, 0.2))" },
          "50%": { filter: "drop-shadow(0 0 30px rgba(0, 240, 255, 0.45))" },
        },
      },
      boxShadow: {
        "cyan-glow": "0 0 25px -5px rgba(0, 240, 255, 0.3)",
        "card-3d": "0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 240, 255, 0.1)",
        "card-active": "0 30px 60px -20px rgba(0, 240, 255, 0.25), 0 0 30px rgba(0, 240, 255, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
