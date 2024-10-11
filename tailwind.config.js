/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "custom-green-1": "#14B8A6",
        "custom-green-2": "#0D9485",
        "custom-green-3": "#bce0dd26",
        "custom-blue-1": "#F1F5F9",
        "custom-white-1": "#F2F2F2",
        "custom-white-2": "#F7F9Fa",
        "custom-black-1": "#23272E",
        "custom-error-1": "#fae8e8",
        "custom-error-2": "#de5757",
        "custom-success-1": "#ebf5ec",
        "custom-success-2": "#47a855",
        "custom-warning-1": "#fcf3eb",
        "custom-warning-2": "#e89241",
        "custom-info-1": "#e6f7ff",
        "custom-info-2": "#11acfa",
        "custom-indigo-1": "#faf0fa",
        "custom-indigo-2": "#ca6acc",
        "custom-green-opacity-1": "#0d948533",
        "custom-green-dark": "#041f1b",
        "custom-green-light": "#c5e0dd",
      },
    },
  },
  plugins: [
    require("daisyui"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none",
        },
        ".no-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      };

      addUtilities(newUtilities);
    },
  ],
  daisyui: {
    themes: ["light"],
  },
};
