/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arena: {
          bg:          'var(--arena-bg)',
          bgDeep:      'var(--arena-bgDeep)',
          bgElevated:  'var(--arena-bgElevated)',
          card:        'var(--arena-card)',
          cardGlow:    'var(--arena-cardGlow)',
          border:      'var(--arena-border)',
          primary:     'var(--arena-primary)',
          primaryHover:'var(--arena-primaryHover)',
          success:     'var(--arena-success)',
          danger:      'var(--arena-danger)',
          warning:     'var(--arena-warning)',
          text:        'var(--arena-text)',
          muted:       'var(--arena-muted)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-primary': '0 0 20px -5px color-mix(in srgb, var(--arena-primary) 30%, transparent)',
      }
    },
  },
  plugins: [],
};
