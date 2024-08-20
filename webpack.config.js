const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/scripts/index.js'
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    devtool: "eval-source-map",
    devServer: {
      watchFiles: ["./src/index.html"],
    },
    module: {
        rules: [
            {
                test: /\.(css)$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            title: 'TODO List',
            inject: 'body',
        })
    ]
}