import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      textColor: {
        DEFAULT: '#000000' // or your preferred default color
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    forms, // Provides better form styles
    typography, // Adds nice typography styles
    aspectRatio, // Helps with responsive media
  ],
};