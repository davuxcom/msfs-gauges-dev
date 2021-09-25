const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

const paths = require('./paths')

module.exports = {
  entry: {
    iesi: paths.src + '/IESI/IESI.js',
    // ADD MORE HERE
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'IESI',
      template: paths.src + '/IESI/IESI.ejs', 
      filename: 'iesi.html',
      chunks: ["iesi"],
      inject: false,
    }),
    // ADD MORE HERE
  ],
  module: {
    rules: [
      { test: /\.(?:js|mjs)$/, use: ['babel-loader'] }, // Transpile
      { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' }, // Copy
      { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' }, // Inline
    ],
  },
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.mjs', '.jsx'],
    alias: {
      '@': paths.src,
    },
  },
}
