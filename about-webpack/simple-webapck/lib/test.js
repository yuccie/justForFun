const { getAst, getDependencies } = require('./parser');
const path = require('path');

const ast = getAst(path.join(__dirname, '../src/index.js'))
const deps = getDependencies(ast);

console.log(deps);