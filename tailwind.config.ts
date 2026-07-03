import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class', '.dark'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './contexts/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        bg2: 'var(--bg2)',
        surface: 'var(--surface-solid)',
        panel: 'var(--surface)',
        border: 'var(--border)',
        text: 'var(--text)',
        muted: 'var(--text-dim)',
        primary: 'var(--primary)',
        primaryBright: 'var(--primary-bright)',
        cyan: 'var(--cyan)',
        emerald: 'var(--emerald)',
        amber: 'var(--amber)',
        rose: 'var(--rose)',
        violet: 'var(--violet)',
      },
      fontFamily: {
        fa: ['Vazirmatn', 'system-ui', 'sans-serif'],
        en: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: { glow: 'var(--shadow)' },
      borderRadius: { os: '1.25rem' },
      keyframes: {
        scan: { '0%': { transform: 'translateY(-120%)' }, '100%': { transform: 'translateY(520%)' } },
        pulseSoft: { '0%,100%': { opacity: '.72' }, '50%': { opacity: '1' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: { scan: 'scan 4.5s linear infinite', pulseSoft: 'pulseSoft 1.8s ease-in-out infinite', float: 'float 8s ease-in-out infinite' },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;
