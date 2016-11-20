var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/build',
        filename: 'form-checker.min.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: path.join(__dirname, 'src'),
            query: {
                presets: 'es2015'
            }
        }]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })

    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
};
