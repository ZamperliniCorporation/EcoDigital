// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    presets: [require('nativewind/preset')],
    content: [
      "./App.{js,jsx,ts,tsx}",
      "./src/**/*.{js,jsx,ts,tsx}" // <- Adicione esta linha
    ],
    theme: {
      extend: {
        colors: {
          'ecodigital-green': '#10B981',
          'ecodigital-green-dark': '#059669',
          'ecodigital-gray': '#6B7280',
          'ecodigital-gray-light': '#F3F4F6',
          // Adicionando tons escuros para a nossa UI
          'brand-dark': '#111827',
          'brand-dark-secondary': '#1F2937',
        }
      },
    },
    plugins: [],
  };