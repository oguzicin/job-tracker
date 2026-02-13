/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

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
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.custom-scrollbar': {
          'scrollbar-width': 'bold',
          'scrollbar-color': 'rgba(255,255,255,0.4) transparent',
        },
        '.custom-scrollbar::-webkit-scrollbar': {
          'width': '6px',

        },
        '.custom-scrollbar::-webkit-scrollbar-track': {
          'background': 'transparent',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb': {
          'background-color': 'rgba(255,255,255,0.4)',
          'border-radius': '9999px',
          'border': '2px solid transparent',
          'background-clip': 'padding-box',
        },
        '.custom-scrollbar::-webkit-scrollbar-thumb:hover': {
          'background-color': 'rgba(255,255,255,0.75)',
        },
                '.fade-bottom': {
          'mask-image': 'linear-gradient(to bottom, black 90%, transparent 100%)',
          '-webkit-mask-image': 'linear-gradient(to bottom, black 90%, transparent 100%)',
        },
      })
    }),
  ],
};
