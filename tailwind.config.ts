import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          solid: "var(--color-primary-solid)",
          accent: "var(--color-accent)",
          emerald: "var(--color-emerald)",
          amber: "var(--color-amber)",
          rose: "var(--color-rose)",
          violet: "var(--color-violet)",
        },
        bg: {
          DEFAULT: "var(--color-bg)",
          alt: "var(--color-bg-alt)",
          card: "var(--color-bg-card)",
        },
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          subtle: "var(--color-text-subtle)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
