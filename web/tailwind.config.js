/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0066FF',
          'blue-hover': '#0052CC',
          'blue-light': '#38BDF8',
          primary: '#0066FF',
          'primary-hover': '#0052CC',
          orange: '#0066FF', // aliased for smooth migration
          'orange-hover': '#0052CC',
          dark: '#07090E',
          card: '#0E131F',
          border: '#1E293B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
