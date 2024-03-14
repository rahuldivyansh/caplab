/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/**/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1170f8",
        secondary: "#e2e2e2",
        general: "#0d121d",
        dark_secondary: "#253141",
        background: {
          light:"#fff",
          dark:"#05050a"
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
