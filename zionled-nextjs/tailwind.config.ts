import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-void':    '#040810',
        'bg-deep':    '#060c1a',
        'bg-surface': '#0b1426',
        'bg-card':    '#0f1d35',
        'blue-core':  '#0d7fd4',
        'blue-bright':'#1a9fe8',
        'blue-glow':  '#38bdf8',
        'gold':       '#f0a500',
        'gold-light': '#fbbf24',
        'muted':      '#6b8db5',
      },
      fontFamily: {
        head: ['Rajdhani', 'sans-serif'],
        body: ['Exo 2', 'sans-serif'],
      },
      animation: {
        'float-y':  'floatY 4s ease-in-out infinite',
        'ticker':   'ticker 35s linear infinite',
        'pulse-dot':'pulseDot 2s ease-in-out infinite',
        'scan-line':'scanLine 8s linear infinite',
        'rise-in':  'riseIn 0.9s cubic-bezier(.22,1,.36,1) forwards',
      },
      keyframes: {
        floatY: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        ticker: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        pulseDot: { '0%,100%': { boxShadow: '0 0 0 0 rgba(56,189,248,0.7)' }, '50%': { boxShadow: '0 0 0 8px rgba(56,189,248,0)' } },
        riseIn: { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
