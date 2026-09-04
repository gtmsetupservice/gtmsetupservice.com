/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './_posts/**/*.md',
    './*.html',
    './*.md',
    './blog/**/*.html',
    './about/**/*.html',
    './services/**/*.md',
    './services/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Local-service ICP palette. Grounded in the trades: fresh sealcoat,
        // weathered concrete, striping paint. Replaces the old blue-600 default.
        asphalt: '#23262B',
        ink: '#14181C',
        slate: {
          DEFAULT: '#565E66',
          light: '#7C848C',
        },
        concrete: '#E9E7E2',
        paper: '#F7F6F3',
        rule: {
          DEFAULT: '#CFCCC5',
          soft: '#E0DDD6',
        },
        stripe: {
          DEFAULT: '#F0BE24',
          hover: '#FFD34D',
        },
        booked: '#2E6B4F',
        leak: '#A83A1C',
      },
      boxShadow: {
        ticket: '6px 6px 0 #E9E7E2',
        flag: '6px 6px 0 #F0BE24',
      },
      maxWidth: {
        prose: '62ch',
        measure: '76ch',
      },
    },
  },
  plugins: [],
}
