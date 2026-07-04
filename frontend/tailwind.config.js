/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#714B67',
          50: '#f5f0f4',
          100: '#ede3ea',
          200: '#dcc8d8',
          300: '#c4a3bc',
          400: '#a67a9d',
          500: '#8a5e81',
          600: '#714B67',
          700: '#5d3d55',
          800: '#4d3347',
          900: '#412c3d',
        },
        brand: '#714B67',
        surface: '#FFFFFF',
        background: '#F8F9FA',
        border: '#E8EBEF',
        text: {
          primary: '#121C28',
          secondary: '#4E444A',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Manrope', 'sans-serif'],
        handwritten: ['Caveat', 'cursive'],
      },
      borderRadius: {
        card: '14px',
        button: '10px',
        input: '10px',
        modal: '16px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0,0,0,0.04)',
        modal: '0 20px 48px rgba(0,0,0,0.08)',
        dropdown: '0 8px 24px rgba(0,0,0,0.06)',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
    },
  },
  plugins: [],
};
