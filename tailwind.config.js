/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gbe: {
          blue: '#004ea2',
          green: '#009a44',
          orange: '#f05a28',
          'blue-light': '#e6f0fa',
          'green-light': '#e6f5ec',
          'orange-light': '#fef2ee',
        }
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
