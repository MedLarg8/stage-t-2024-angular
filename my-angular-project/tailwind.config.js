
module.exports = {
  // Other Tailwind configuration options...
  content: [
    './src/**/*.{html,ts}', // Add paths to your source files
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        palanquin: ['Palanquin', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
