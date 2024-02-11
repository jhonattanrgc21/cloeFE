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
      },
			fontFamily: {
        'poppins-black': ['Poppins-Black', 'sans-serif'],
        'poppins-extrabold': ['Poppins-ExtraBold', 'sans-serif'],
        'poppins-italic': ['Poppins-Italic', 'sans-serif'],
        'poppins-mediumitalic': ['Poppins-MediumItalic', 'sans-serif'],
        'poppins-thin': ['Poppins-Thin', 'sans-serif'],
        'poppins-blackitalic': ['Poppins-BlackItalic', 'sans-serif'],
        'poppins-extrabolditalic': ['Poppins-ExtraBoldItalic', 'sans-serif'],
        'poppins-light': ['Poppins-Light', 'sans-serif'],
        'poppins-regular': ['Poppins-Regular', 'sans-serif'],
        'poppins-thinitalic': ['Poppins-ThinItalic', 'sans-serif'],
        'poppins-bold': ['Poppins-Bold', 'sans-serif'],
        'poppins-extralight': ['Poppins-ExtraLight', 'sans-serif'],
        'poppins-lightitalic': ['Poppins-LightItalic', 'sans-serif'],
        'poppins-semibold': ['Poppins-SemiBold', 'sans-serif'],
        'poppins-bolditalic': ['Poppins-BoldItalic', 'sans-serif'],
        'poppins-extralightitalic': ['Poppins-ExtraLightItalic', 'sans-serif'],
        'poppins-medium': ['Poppins-Medium', 'sans-serif'],
        'poppins-semibolditalic': ['Poppins-SemiBoldItalic', 'sans-serif'],
      },
    },
  },
  plugins: [
		require('@tailwindcss/forms')
	],
}

