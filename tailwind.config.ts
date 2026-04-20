import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        "ink-light": "#111111",
        offwhite: "#E0E0E0",
        "offwhite-dim": "rgba(224, 224, 224, 0.6)",
        accent: "#00FF41",
        "accent-muted": "rgba(0, 255, 65, 0.15)",
        "border-subtle": "rgba(224, 224, 224, 0.2)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-lora)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
    letterSpacing: {
      binary: "1.75rem",
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
