/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magenta: {
          DEFAULT: '#e6007e',
          hover: '#ff4da6',
          light: '#ff99cc',
          100: '#fdf2f8',
          200: '#fce7f3',
          600: '#db2777',
          700: '#be185d',
        },
        ice: {
          light: '#f0f9ff',
          DEFAULT: '#e0f2fe',
          dark: '#bae6fd',
        },
        dark: {
          DEFAULT: '#111111',
          card: '#1a1a1a',
          bg: '#161618',
        },
        grey: {
          bg: '#f6f6f8',
          text: '#6b7280',
          border: 'rgba(17, 17, 17, 0.06)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 24px 60px -20px rgba(17, 17, 17, 0.08)',
        subtle: '0 8px 24px -10px rgba(17, 17, 17, 0.06)',
      }
    },
  },
  plugins: [],
}
