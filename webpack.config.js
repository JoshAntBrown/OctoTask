const path = require('path')
const ExtensionReloader = require('webpack-extension-reloader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    content: './src/content.js',
    background: './src/background.js',
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'babel-plugin-styled-components',
                { fileName: false, displayName: true },
              ],
            ],
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    new ExtensionReloader({
      manifest: path.resolve(__dirname, 'src', 'manifest.json'),
    }),
    new CopyWebpackPlugin([{ from: './src/manifest.json' }]),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
}
