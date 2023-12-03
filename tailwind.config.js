/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        success: {
          50: '#E0F2F1',
          100: '#B2DFDB',
          200: '#80CBC4',
          300: '#4DB6AC',
          400: '#26A69A',
          500: '#009688',
          600: '#00897B',
          700: '#00796B',
          800: '#00695C',
          900: '#004D40',
        },
        danger: {
					50: '#FEF0ED',
					500: '#B00020'
				},
        warning: {
					50: '#FFAE1F1A',
					500: '#FFAE1F'
				} ,
				light: '#0000001F',
				dark: '#000000DE'
      }
    },
  },
  plugins: [
		require('@tailwindcss/forms')
	],
}
