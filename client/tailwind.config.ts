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
          DEFAULT: '#4f46e5',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        background: {
          DEFAULT: '#0a0a0a',
          lighter: '#111111',
          card: '#1a1a2e',
          deep: '#16213e'
        },
        surface: {
          DEFAULT: '#1e1e2e',
          light: '#252540',
          lighter: '#2a2a3e'
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb'
        },
        success: {
          DEFAULT: '#22c55e',
          hover: '#16a34a'
        },
        warning: {
          DEFAULT: '#f59e0b',
          hover: '#d97706'
        },
        danger: {
          DEFAULT: '#ef4444',
          hover: '#dc2626'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
