import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        primary: '#646cff',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
      }
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