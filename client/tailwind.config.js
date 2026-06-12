/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        forest: {
          50:  '#e8f5e9',
          100: '#c8e6c9',
          200: '#a5d6a7',
          300: '#81c784',
          400: '#66bb6a',
          500: '#4caf50',
          600: '#43a047',
          700: '#388e3c',
          800: '#2e7d32',
          900: '#1b5e20',
        },
        earth: {
          50:  '#efebe9',
          100: '#d7ccc8',
          200: '#bcaaa4',
          300: '#a1887f',
          400: '#8d6e63',
          500: '#795548',
          600: '#6d4c41',
          700: '#5d4037',
          800: '#4e342e',
          900: '#3e2723',
        },
        // New premium palette
        cream: {
          50:  '#fffef9',
          100: '#faf6ee',
          200: '#f5f0e8',
          300: '#ede4d4',
          400: '#ddd0bc',
          500: '#c8b89a',
        },
        charcoal: {
          800: '#111810',
          900: '#0D1B0E',
        },
        gold: {
          300: '#e8c96a',
          400: '#d4ad38',
          500: '#c9991a',
          600: '#b8870f',
          700: '#9a6e08',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in':   'fadeIn 0.6s ease-out forwards',
        'slide-up':  'slideUp 0.6s ease-out forwards',
        'float':     'float 3s ease-in-out infinite',
        'marquee':   'marquee 30s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
