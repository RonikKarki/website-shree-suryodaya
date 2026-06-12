/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Admin-compat (unchanged) ──────────────────────────────────
        brand: {
          50: '#fff8e1', 100: '#ffecb3', 200: '#ffe082', 300: '#ffd54f',
          400: '#ffca28', 500: '#ffc107', 600: '#ffb300', 700: '#ffa000',
          800: '#ff8f00', 900: '#ff6f00',
        },
        forest: {
          50: '#e8f5e9', 100: '#c8e6c9', 200: '#a5d6a7', 300: '#81c784',
          400: '#66bb6a', 500: '#4caf50', 600: '#43a047', 700: '#388e3c',
          800: '#2e7d32', 900: '#1b5e20',
        },
        earth: {
          50: '#efebe9', 100: '#d7ccc8', 200: '#bcaaa4', 300: '#a1887f',
          400: '#8d6e63', 500: '#795548', 600: '#6d4c41', 700: '#5d4037',
          800: '#4e342e', 900: '#3e2723',
        },
        charcoal: { 800: '#111810', 900: '#0D1B0E' },
        cream: {
          50: '#fffef9', 100: '#faf6ee', 200: '#f5f0e8',
          300: '#ede4d4', 400: '#ddd0bc', 500: '#c8b89a',
        },

        // ── New premium design system ─────────────────────────────────
        sand: {
          50:  '#FDFCF8',
          100: '#F8F6F1',   // main background
          200: '#F1EEE8',   // section alternate bg
          300: '#E4DED3',   // borders
          400: '#D4CDB8',
          500: '#B8AC96',
          900: '#1A1A1A',
        },
        gold: {
          100: '#FDF8EE',
          200: '#F0E0B0',
          300: '#E5C97D',   // rice / light gold
          400: '#D4B56A',
          500: '#C8A86B',   // primary gold accent
          600: '#B89058',
          700: '#9A7540',
          800: '#7A5C2E',
        },
        sage: {
          50:  '#F2F6F1',
          100: '#E2EBE0',
          200: '#C0D1BC',
          300: '#96B390',
          400: '#70956A',
          500: '#5A7D54',
          600: '#4F6D4A',   // primary CTA / success green
          700: '#3D5538',
          800: '#2D4028',
          900: '#1E2E1A',
        },
        ink: {
          300: '#B0B0B0',
          400: '#8A8A8A',
          500: '#5D5D5D',   // secondary text
          600: '#3D3D3D',
          700: '#2A2A2A',
          800: '#1F1F1F',
          900: '#1A1A1A',   // primary text
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'hero': ['4.5rem', { lineHeight: '1.05', fontWeight: '800' }],
        'display': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
      },
      animation: {
        'fade-in':       'fadeIn 0.7s ease-out forwards',
        'slide-up':      'slideUp 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-right':   'slideRight 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-left':    'slideLeft 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':         'float 4s ease-in-out infinite',
        'float-slow':    'float 7s ease-in-out infinite',
        'marquee':       'marquee 32s linear infinite',
        'marquee-slow':  'marquee 55s linear infinite',
        'spin-slow':     'spin 14s linear infinite',
        'scale-in':      'scaleIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(40px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        slideLeft: {
          from: { opacity: '0', transform: 'translateX(40px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
};
