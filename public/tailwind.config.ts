import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#21F1A8",
          foreground: "#171717",
        },
        secondary: {
          DEFAULT: "#004741",
          foreground: "#21F1A8",
        },
        sand: "#F0EDE4",
        charcoal: "#171717",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        pixel: ["Press Start 2P", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;
