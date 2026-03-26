import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono:    ["var(--font-mono)", "monospace"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        ink:   "#0A0A0F",
        paper: "#F4F1EA",
        acid:  "#C8FF00",
        rust:  "#E85D26",
        fog:   "#8B8B99",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "blink":     "blink 1.1s step-end infinite",
        "scan":      "scan 3s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        scan: {
          "0%":   { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
