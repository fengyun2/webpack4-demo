module.exports = {
  plugins: {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-write-svg": { utf8: false },
    "postcss-cssnext": {},
    cssnano: {
      preset: "advanced",
      autoprefixer: false,
      "postcss-zindex": false
    }
  }
};
