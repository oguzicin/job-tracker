/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        "custom-m": { max: "1500px" },
        "custom-sm": { max: "1250px" },
        "custom-xm": { max: "800px" },
        "custom-xs": { max: "500px" },
      },
    },
  },
  plugins: [],
};
