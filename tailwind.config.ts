import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        primary: {
          DEFAULT: "var(--primary)",
          ink: "var(--primary-ink)",
        },
        secondary: "var(--secondary)",
        text: {
          DEFAULT: "var(--text)",
          muted: "var(--text-muted)",
        },
        danger: "var(--danger)",
      },
      fontFamily: {
        headline: ["var(--font-headline)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Geist", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
