/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      screens: {
        showMenu: "858px",
        showPicture:"974px",
        showFooter:"990px",
        showCarousel:"1250PX"
      },
    },  
  },
  plugins: [],
};
