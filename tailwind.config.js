/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./views/*.ejs",
    "./views/partials/*.ejs"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function({ addVariant }) {
        addVariant('current', '&.active');
    })
  ],
}
