const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'big-num': './src/index.js',
    'big-num.min': './src/index.js',
  },
  output: {
    filename: '[name].js',
    library: 'bigNumer',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  mode: 'none',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js/
      })
    ]
  }
}