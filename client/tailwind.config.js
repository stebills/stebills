/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './lib/ui/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        rmono: ['Roboto-Mono', 'sans-serif'],
      },
      colors: {
        green: {
          50: '#FBF2DF',
          100: '#F5E0B6',
          200: '#F0C878',
          300: '#EBB958',
          400: '#E7AF48',
          500: '#E7A93F',
          600: '#C98F2E',
          700: '#A97324',
          800: '#7D551A',
          900: '#5A3D12',
        },
      },
    },
  },
  plugins: [],
};
