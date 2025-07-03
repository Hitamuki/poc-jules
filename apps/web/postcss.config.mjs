/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "tailwindcss/nesting": {}, // Recommended for nesting CSS, can be 'postcss-nesting' or 'tailwindcss/nesting'
    tailwindcss: {},
    autoprefixer: {},
    // Example of conditional plugin for production builds:
    // ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {})
  },
};

export default config;
