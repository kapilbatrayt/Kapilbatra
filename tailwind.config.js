/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './src/**/*.jsx'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
