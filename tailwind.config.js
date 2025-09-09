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
          DEFAULT: '#2D5D3F',
          50: '#E8F5EB',
          100: '#C7E8CE',
          500: '#2D5D3F',
          600: '#245034',
          700: '#1A3C28',
          800: '#11281D',
          900: '#071511'
        },
        secondary: {
          DEFAULT: '#4A7C59',
          50: '#EDF7EF',
          100: '#D4EDD8',
          500: '#4A7C59',
          600: '#3E674A',
          700: '#31513B',
          800: '#253C2C',
          900: '#18261D'
        },
        accent: {
          DEFAULT: '#FFB300',
          50: '#FFF7E6',
          100: '#FFEAB3',
          500: '#FFB300',
          600: '#E69C00',
          700: '#CC8400',
          800: '#B36D00',
          900: '#994A00'
        },
        surface: '#FFFFFF',
        background: '#F8FFFE',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      boxShadow: {
        'card': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'elevation': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}