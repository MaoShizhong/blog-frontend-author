import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            jost: ['Jost', 'sans-serif', 'system-ui'],
        },
        extend: {
            maxWidth: {
                prose: '72ch',
            },
            width: {
                form: 'min(90vw,900px)',
                main: 'min(90vw,1100px)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: '72ch',
                        marginInline: 'auto',
                        color: '#111111',
                        overflowWrap: 'anywhere',
                    },
                },
            },
        },
    },
    plugins: [tailwindTypography],
};
