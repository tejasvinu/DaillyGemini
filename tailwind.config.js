/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
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
  ],
}