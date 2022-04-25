const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [
        './components/*.js',
        './components/**/*.js',
        './utils/*.js',
        './pages/*.js',
        './pages/**/*.js',
        './pages/**/**/*.js'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'sans': ['Inter', ...defaultTheme.fontFamily.sans],
            'serif': [...defaultTheme.fontFamily.serif],
            'mono': [...defaultTheme.fontFamily.mono],
            'logo': ['Staatliches']
        },
        minWidth: {
            'sidebar': '10rem',

            '0': '0',
            '1/4': '25%',
            '1/2': '50%',
            '3/4': '75%',
            'full': '100%',
        },
        extend: {
            width: {
                'ann-text': '37rem',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
