/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "selector",
  safelist: ["text-gradient"],
  theme: {
    colors: {
      beige: "#faf7f0",
      lightblue: "#778DA9",
      lightpink: "#FFCBCB",
      darkblue: "#1f2430",
      white: "#FFFFFF",
      black: "#000000",
      red: "#8C271E",
      yellow: "#FFB100",
      gray: "#4F6272",
      green: "#9CB380",
      purple: "#7B506F",
      transparent: "transparent",
    },
    extend: {},
  },
  plugins: [],
};
