// 文件构建到最后的输出
const Compiler = require('./compiler');
const WebpackConfig = require('../simpleWebpack.config');
// 
new Compiler(WebpackConfig).run();