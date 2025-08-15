import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: '#646cff',
        pastel: {
          pink: '#fdf2f8',
          yellow: '#fefce8',
          blue: '#eff6ff',
        },
      },
      fontFamily: {
        'heading': ['Fredoka One', 'cursive'],
        'body': ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'lift': 'lift 0.2s ease-out',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-2px) scale(1.02)' },
        },
      },
      boxShadow: {
        'soft': '0 4px 14px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 20px 64px -4px rgba(0, 0, 0, 0.1)',
        'button': '0 8px 24px -2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [forms],
  safelist: [
    {
      pattern: /(bg|text|border)-(blue|green|purple|pink|yellow|red|orange|gray)-(50|100|200|300|400|500)/,
      variants: ['hover', 'focus'],
    }
  ]
}