/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#ff385c',
          DEFAULT: '#ff385c',
          dark: '#e00b41',
        }
      }
    },
  },
  plugins: [],
}
