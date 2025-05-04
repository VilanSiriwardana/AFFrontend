/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        primary: "#06C167", // Uber Eats green
        secondary: "#262626", // Dark UI
        accent: "#ff5a5f", // Optional
        primaryDark: "#049B4A", // Hover green
        darkBg: "#1D1D1D",
        lightText: "#F0F0F0",
        muted: "#9E9E9E",
      },
    },
  },
  plugins: [],
};
