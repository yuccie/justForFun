const Compiler = require('./compiler.js');
const webpackConf = require('../simple.config.js');

new Compiler(webpackConf).run();