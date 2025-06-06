/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF5FF',
          100: '#E1EFFE',
          200: '#C3DDFD',
          300: '#A4CAFE',
          400: '#76A9FA',
          500: '#4F88E8',
          600: '#3F77D4',
          700: '#2D5EB8',
          800: '#254996',
          900: '#1C3A75',
        },
        secondary: {
          50: '#F5F7FA',
          100: '#E4E7EB',
          200: '#CBD2D9',
          300: '#9AA5B1',
          400: '#7B8794',
          500: '#616E7C',
          600: '#52606D',
          700: '#3E4C59',
          800: '#323F4B',
          900: '#1F2933',
        },
        accent: {
          50: '#FFE3E3',
          100: '#FFC9C9',
          200: '#FFA8A8',
          300: '#FF8787',
          400: '#FF6B6B',
          500: '#FA5252',
          600: '#F03E3E',
          700: '#E03131',
          800: '#C92A2A',
          900: '#B02525',
        },
        warning: {
          50: '#FFF9DB',
          100: '#FFF3BF',
          200: '#FFEC99',
          300: '#FFE066',
          400: '#FFD43B',
          500: '#FCC419',
          600: '#FAB005',
          700: '#F59F00',
          800: '#F08C00',
          900: '#E67700',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        'safe-top': 'var(--sat)',
        'safe-right': 'var(--sar)',
        'safe-bottom': 'var(--sab)',
        'safe-left': 'var(--sal)',
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
      fontSize: {
        'base-scaled': 'calc(16px * var(--font-scale))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-blue-50',
    'bg-green-50',
    'bg-purple-50',
    'bg-red-50',
    'bg-yellow-50',
    'text-blue-700',
    'text-green-700',
    'text-purple-700',
    'text-red-700',
    'text-yellow-700',
    'bg-primary-50',
    'bg-primary-100',
    'text-primary-700',
    'text-primary-800',
  ],
}
