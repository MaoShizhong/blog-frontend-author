/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            jost: ['Jost', 'sans-serif', 'system-ui'],
        },
        extend: {
            width: {
                form: 'min(90vw,900px)',
            },
        },
    },
    plugins: [],
};
