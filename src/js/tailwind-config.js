/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5ff',
          100: '#cceaff',
          200: '#99d6ff',
          300: '#66c1ff',
          400: '#33adff',
          500: '#0099ff', // Main primary color
          600: '#007acc',
          700: '#005c99',
          800: '#003d66',
          900: '#001f33',
        },
        secondary: {
          50: '#f0f9f9',
          100: '#e1f3f3',
          200: '#c2e8e8',
          300: '#a3dcdc',
          400: '#85d1d1',
          500: '#66c5c5', // Main secondary color
          600: '#529e9e',
          700: '#3d7676',
          800: '#294f4f',
          900: '#142727',
        },
        neutral: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        success: {
          500: '#48bb78', // Accessible green
        },
        warning: {
          500: '#ed8936', // Accessible orange
        },
        error: {
          500: '#e53e3e', // Accessible red
        },
      },
      fontSize: {
        // Larger text sizes for seniors
        'base': '1.125rem', // 18px as base
        'lg': '1.25rem',    // 20px
        'xl': '1.5rem',     // 24px
        '2xl': '1.75rem',   // 28px
        '3xl': '2rem',      // 32px
        '4xl': '2.5rem',    // 40px
      },
      spacing: {
        // Larger touch targets for seniors
        'touch-min': '2.75rem', // 44px (minimum touch target size)
      },
      borderRadius: {
        'lg': '1rem', // Larger, more visible rounded corners
      },
      boxShadow: {
        'focus': '0 0 0 3px rgba(0, 153, 255, 0.5)', // Prominent focus indicator
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Slower animations for seniors
      },
      transitionDuration: {
        '400': '400ms', // Slower transitions
        '600': '600ms',
      },
    },
  },
  plugins: [],
  // Enable additional variants for accessibility
  variants: {
    extend: {
      backgroundColor: ['active', 'focus-visible'],
      borderColor: ['active', 'focus-visible'],
      boxShadow: ['active', 'focus-visible'],
      opacity: ['disabled'],
      textColor: ['active', 'focus-visible'],
    },
  },
  // Enable theme switching with dark mode
  darkMode: 'class',
}
