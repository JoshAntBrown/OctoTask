const path = require('path')
const ExtensionReloader = require('webpack-extension-reloader')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = env => {
  if (!env || !env.NODE_ENV)
    throw new Error('NODE_ENV must be set using --env.NODE_ENV=production')

  if (env.NODE_ENV !== 'production' && env.NODE_ENV !== 'development')
    throw new Error(
      'Webpack configuration only supports production or development as NODE_ENV',
    )

  const developmentPlugins =
    env.NODE_ENV === 'development'
      ? [
          new ExtensionReloader({
            manifest: path.resolve(__dirname, 'src', 'manifest.json'),
          }),
        ]
      : []

  return {
    entry: {
      content: './src/content.js',
      background: './src/background.js',
    },
    mode: env.NODE_ENV,
    watch: env.NODE_ENV === 'development',
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
      ...developmentPlugins,
      new CopyWebpackPlugin([{ from: './src/manifest.json' }]),
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
    },
  }
}
