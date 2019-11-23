module.exports = ({ file }) => ({
    parser: file.extname === ".sss" ? "sugarss" : false,
    plugins: {
        autoprefixer: {},
        "postcss-preset-env": {},
        cssnano: {},
        precss: {},
    },
});
