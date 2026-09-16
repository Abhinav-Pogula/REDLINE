import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e5342b',
          redDark: '#c9271f',
          redSoft: '#fdeaea',
          redBorder: '#f8b4b0',
          bg: '#faf9f9',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e5e5e5',
          dark: '#111111',
          grey: '#8a8a8a',
          subtle: '#f5f3f3',
        },
        redline: {
          red: '#e5342b',
          redHover: '#cc2920',
          redBg: '#fef2f2',
          redCard: '#fdeaea',
          redBorder: '#fca5a5',
          grayDark: '#0f1115',
          graySub: '#4b5563',
          grayLight: '#f8fafc',
          borderLight: '#e5e7eb',
          badgeGreen: '#10b981',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'IBM Plex Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-1': 'wave 0.9s ease-in-out infinite alternate',
        'wave-2': 'wave 1.2s ease-in-out infinite alternate 0.2s',
        'wave-3': 'wave 0.7s ease-in-out infinite alternate 0.4s',
      },
      keyframes: {
        wave: {
          '0%': { height: '8px' },
          '100%': { height: '48px' },
        },
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
