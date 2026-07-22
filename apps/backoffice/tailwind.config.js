import { designThemes } from "../../packages/constants";

const { COLOR_THEME, SCREEN_SIZES, ANIMATION_SET, ANIMATION_KEYFRAMES } =
  designThemes();

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../../packages/*/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      ...SCREEN_SIZES,
    },

    extend: {
      // custom app based color extensions
      colors: { ...COLOR_THEME },

      //  custom slide down animation
      keyframes: {
        ...ANIMATION_SET,
      },

      animation: {
        ...ANIMATION_KEYFRAMES,
      },
    },

    container: {
      center: true,
    },
  },
  plugins: [],
};
