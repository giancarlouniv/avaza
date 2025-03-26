/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Usa la modalità dark tramite la classe 'dark'
    theme: {
      extend: {},
    },
    plugins: [],
  }