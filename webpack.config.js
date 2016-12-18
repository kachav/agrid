var path = require('path'), webpack = require('webpack');

module.exports = function makeWebpackConfig() {
    var config = {
        devtool: 'inline-source-map',
        resolve: {
            extensions: ['.ts', '.js']
        },
        plugins: [
            new webpack.ProvidePlugin({
                Reflect: 'core-js/es7/reflect',
                Promise:'core-js/es6/promise'
            })
        ],
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loaders: ['to-string-loader', 'css-loader']
                },

                /*        { test: /\.css$/, loader: "raw-loader" },*/

                /* Raw loader support for *.html
                 * Returns file content as string
                 *
                 * See: https://github.com/webpack/raw-loader
                 */
                {
                    test: /\.html$/,
                    loader: 'raw-loader'
                },
                // Support for .ts files.
                {
                    test: /\.ts$/,
                    loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
                    exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
                }
            ]
        }
    };

    config.entry = {
        'app': './dev/main.ts'
    };

    config.output = {
        path: path.resolve(__dirname, "build"),
        publicPath: 'http://localhost:8080/',
        filename: 'main.js'
    };

    return config;
} ();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}