/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f5ff",
          100: "#f0ebff",
          200: "#e1d7ff",
          300: "#d2c3ff",
          400: "#c3afff",
          500: "#b49bff",
          600: "#a082ff",
          700: "#8c69ff",
          800: "#7850e6",
          900: "#5c3dd6",
        },
        beige: {
          50: "#fef9f3",
          100: "#fdf2e9",
          200: "#fbe5d3",
          300: "#f8d7bc",
          400: "#f5c9a6",
          500: "#f2bb90",
          600: "#e8ad7a",
          700: "#de9f64",
          800: "#d4914e",
          900: "#ca8338",
        },
        dark: "#1a1a1a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        128: "32rem",
      },
    },
  },
  plugins: [],
};
