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
					50: '#EABDC5',
					100: '#DF97A4',
					200: '#D77D8D',
					300: '#F16D85',
					400: '#FA896B',
					500: '#B00020',
					600: '#98011C',
				},
        warning: {
					50: '#FFE9C5',
					100: '#FFDDA4',
					200: '#FFD58D',
					300: '#FFCB70',
					400: '#FFBE4C',
					500: '#FFAE1F',
					600: '#FFAE1F',
					700: '#CC8B19',
					800: '#A36F14',
					900: '#825910',
					950: '#68470D'
				},
				light: '#0000001F',
				dark: '#000000DE',
				disabled: '#00000061'
      }
    },
  },
  plugins: [
		require('@tailwindcss/forms')
	],
}

