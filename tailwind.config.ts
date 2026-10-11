import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forge: {
          950: "#07060f",
          900: "#0d0b1a",
          850: "#121026",
          800: "#181533",
          700: "#241f47",
          600: "#332c63",
          500: "#4a4285",
          400: "#7a72b8",
          300: "#a9a2dc",
          200: "#d4d0f0",
        },
        neon: {
          pink: "#ff4fd8",
          cyan: "#3ee7ff",
          violet: "#9b6bff",
          amber: "#ffb547",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px -4px rgba(255, 79, 216, 0.45)",
        "glow-cyan": "0 0 24px -4px rgba(62, 231, 255, 0.45)",
      },
      keyframes: {
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.08)" },
        },
        breathe: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        talk: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.35)" },
        },
        bar: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        blink: "blink 4.5s infinite",
        breathe: "breathe 4s ease-in-out infinite",
        talk: "talk 0.22s ease-in-out infinite",
        bar: "bar 0.9s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
