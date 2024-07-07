/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateColumns: {
        app: "minmax(18rem, 20rem) 1fr",
        form: "minmax(7.5rem, 17.5rem), minmax(25rem, 1fr), minmax(0, 15rem)",
      },
      colors: {
        // ターコイズブルー　#00B7CAをベース500にした色
        turqb: {
          50: "#f0f9fa",
          100: "#d9f2f5",
          200: "#b3e5eb",
          300: "#8dd8e1",
          400: "#33bce9",
          500: "#00b7ca",
          600: "#00a6b6",
          700: "#008f9e",
          800: "#007885",
          900: "#00616a",
        },
        primary: "#337baf",
      },
      fontSize: {
        "2xs": "0.625rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
