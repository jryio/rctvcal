/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
