import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme (default from mockups)
        primary: {
          DEFAULT: "#21f1a8",
          fixed: "#48ffb6",
          dim: "#00e29c",
          container: "#21f1a8",
        },
        surface: {
          DEFAULT: "#0d1510",
          dim: "#0d1510",
          bright: "#323b35",
          container: "rgba(25, 34, 28, 0.6)",
          "container-low": "#151d18",
          "container-lowest": "#08100b",
          "container-high": "#232c27",
          "container-highest": "#2e3731",
          variant: "#2e3731",
        },
        "on-surface": {
          DEFAULT: "#dbe5dd",
          variant: "#bacbbf",
        },
        background: "#08100b",
        outline: {
          DEFAULT: "#84958a",
          variant: "rgba(132, 149, 138, 0.2)",
        },
        // Light theme (activated via `.light` root class)
        // Handled via CSS variables in globals.css
      },
      borderRadius: {
        DEFAULT: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        full: "9999px",
      },
      fontFamily: {
        body: ["var(--font-body)", "Hanken Grotesk", "sans-serif"],
        mono: ["var(--font-mono)", "Fira Sans", "monospace"],
        display: ["var(--font-body)", "Hanken Grotesk", "sans-serif"],
      },
      animation: {
        "pulse-soft": "pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan": "scan 4s linear infinite",
        "blink": "blink 1s step-end infinite",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "0.8" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { top: "-2px" },
          "100%": { top: "100%" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
