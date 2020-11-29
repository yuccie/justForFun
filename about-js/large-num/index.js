// 具体项目中使用时，会有环境变量，根据用户的环境变量导出不同的包
if (process.env.NODE_ENV === 'production') { 
  module.exports = require('./dist/big-num.min.js');
} else {
  module.exports = require('./dist/big-num.js')
}