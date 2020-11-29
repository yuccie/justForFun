const Compiler = require('./compiler');
// import { getAST, getDep } from './parser.js';
const webpackConfig = require('../webpack.config');

// Compiler编译的配置肯定来自webpack的配置
new Compiler(webpackConfig).run();