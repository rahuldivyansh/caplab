/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "media",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1170f8",
        secondary: "#a7a7a7",
        general: "#0d121d",
        dark_secondary: "#253141",
      },
    },
  },
  plugins: [],
};
