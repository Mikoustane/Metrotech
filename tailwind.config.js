/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
      },
      colors: {
        // Charte graphique METROTECH
        primary: {
          50: '#fff8f1',
          100: '#ffecde',
          200: '#ffd6bd',
          300: '#ffb891',
          400: '#ff8f63',
          500: '#F57C00', // Orange principal
          600: '#e8670a',
          700: '#c1530a',
          800: '#9a4510',
          900: '#7c3a10',
          950: '#431c05',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#1976D2', // Bleu principal
          600: '#0369a1',
          700: '#0284c7',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        light: '#FFFFFF', // Blanc
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'mobile': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '100% 50%' },
          '50%': { backgroundPosition: '0% 50%' },
        },
        slideInFromLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutToLeft: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease infinite',
        slideInFromLeft: 'slideInFromLeft 0.3s ease-out',
        slideOutToLeft: 'slideOutToLeft 0.3s ease-in',
        fadeInUp: 'fadeInUp 0.5s ease-out',
      },
    },
  },
  plugins: [],
};