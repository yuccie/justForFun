const { getAST, getDeps, transform } = require('./parser');

let filePath = '../src/index.js';

const ast = getAST(filePath);
const deps = getDeps(ast)
const source = transform(ast);
console.log(source);
