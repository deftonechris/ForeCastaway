module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    theme: {},
    variants: {},
    plugins: [require('tailwindcss'), require('autoprefixer')],
  };
  