var path = require('path'), webpack = require('webpack');

module.exports = {
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: {
        'app': './dev/main.ts'
    },
    output: {
        path: path.resolve(__dirname, "build"),
        publicPath: 'http://localhost:8080/',
        filename: 'main.js'
    },
    plugins: [
        new webpack.ProvidePlugin({
            Reflect: 'core-js/es7/reflect',
            Promise: 'core-js/es6/promise'
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['to-string-loader', 'css-loader']
            },

            /* Raw loader support for *.html
             * Returns file content as string
             *
             * See: https://github.com/webpack/raw-loader
             */
            {
                test: /\.html$/,
                use: ['raw-loader']
            },
            // Support for .ts files.
            {
                test: /\.ts$/,
                use: ['awesome-typescript-loader', 'angular2-template-loader', 
                {
                    loader: 'tslint-loader',
                    options: {
                        configFile: 'tslint.json'
                    }
                }],
                exclude: [/\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/, './index.ts']
            }
        ]
    }
};