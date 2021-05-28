const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            'sans': ['Inter', ...defaultTheme.fontFamily.sans],
            'serif': [...defaultTheme.fontFamily.serif],
            'mono': [...defaultTheme.fontFamily.mono]
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
