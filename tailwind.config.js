/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      animation: {
        'loading-bar': 'loadingBar 1s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out forwards'
      },
      keyframes: {
        loadingBar: {
          '50%': { width: '100%' },
          '100%': { width: '0', right: '0', left: 'unset' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' }
        },
        fadeOut: {
          from: { opacity: '1' },
          to: { opacity: '0' }
        }
      }
    }
  },
  plugins: [ flowbite.plugin(),],
};