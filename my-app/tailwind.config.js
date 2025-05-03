/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      primary : '#030014',
      secondary : '#151312',
      tertiary : '#9CA4AB',
      light : {
        100 : '#D6C6FF',
        200 : '#ABB5DB',
        300 : '#8A9BCA',
      },
      dark : {
        100 : '#221f3d',
        200 : '#0f0d23',
        300 : '#353646',
      }
    },
  },
  plugins: [],
}