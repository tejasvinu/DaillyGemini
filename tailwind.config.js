/** @type {import('tailwindcss').Config} */
export default {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // Provides better form styles
    require('@tailwindcss/typography'), // Adds nice typography styles
    require('@tailwindcss/aspect-ratio'), // Helps with responsive media
    require('@tailwindcss/line-clamp'), // Adds text truncation utilities
  ],
}