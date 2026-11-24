const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = (isProduction) => ({
    entry: "./src/client/js/app.js",
    mode: isProduction ? 'production' : 'development',
    output: {
        library: "app",
        filename: "app.js"
    },
    devtool: false,
    module: {
        rules: getRules(isProduction)
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/client/thanks.html", to: "thanks.html" },
                { from: "public/_redirects", to: "_redirects" }
            ]
        })
    ]
});

function getRules(isProduction) {
    if (isProduction) {
        return [
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', { targets: "defaults" }]
                        ]
                    }
                }
            }
        ]
    }
    return [];
}
