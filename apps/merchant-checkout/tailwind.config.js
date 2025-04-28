import { colors } from "@packages/constants";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "../../packages/*/src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xxxl: { max: "1620px" },
      xxl: { max: "1440px" },
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      mdLg: { max: "872px" },
      md: { max: "768px" },
      sm: { max: "639px" },
      xs: { max: "440px" },
      xxs: { max: "390px" },
    },

    extend: {
      // custom app based color extensions
      colors: { ...colors },

      //  custom slide down animation
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", marginLeft: "-100%" },
          "100%": { opacity: "1", marginLeft: "0" },
        },

        "zoom-in": {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },

        "zoom-out": {
          "0%": {
            transform: "translateX(-50%) scale(0.9)",
          },
          "50%": {
            transform: "translateX(-50%) scale(1.025)",
          },
          "100%": {
            transform: "translateX(-50%) scale(1)",
          },
        },

        "slide-down": {
          "0%": {
            transform: "translateY(-14%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },

        "slide-left": {
          "0%": {
            transform: "translateX(-14%)",
            opacity: "0",
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1",
          },
        },

        "drift-right": {
          from: {
            marginRight: "-50%",
          },
          to: {
            marginRight: "0",
          },
        },

        "drift-left": {
          from: {
            marginLeft: "-50%",
          },
          to: {
            marginLeft: "0",
          },
        },

        "drift-down": {
          from: {
            marginBottom: "-50%",
          },
          to: {
            marginBottom: "0",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        "zoom-in": "zoom-in 0.5s ease-in-out",
        "zoom-out": "zoom-out 0.6s ease-in-out forwards",
        "drift-right": "drift-right 0.6s ease-in-out forwards",
        "drift-left": "drift-left 0.4s ease-in-out forwards",
        "drift-down": "drift-down 0.4s ease-in-out forwards",
        "slide-down": "slide-down 0.4s ease-in-out",
        "slide-left": "slide-left 0.4s ease-in-out",
      },
    },

    container: {
      center: true,
    },
  },
  plugins: [],
};
