import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F5',
        ink: '#15140F',
        brand: {
          DEFAULT: '#1B5E43',
          dark: '#134A35',
          light: '#EAF3EE',
        },
        accent: {
          DEFAULT: '#C8791A',
          light: '#FBF0DF',
        },
        border: '#E4E1D6',
        danger: '#B3261E',
        muted: '#6B6A62',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-inter-tight)', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
};

export default config;