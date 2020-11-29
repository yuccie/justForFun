
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  // 因为要导出压缩与不压缩的包，所以entry是对象
  entry: {
    'big-num': './src/index.js',
    'big-num.min': './src/index.js'
  },

  output: {
    filename: '[name].js',
    library: 'bigNumer', // 打包出来的包的名字
    libraryTarget: 'umd',
    libraryExport: 'default', // 默认导出的是defalut
  },
  mode: 'none',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js/,
      })
    ]
  }
}