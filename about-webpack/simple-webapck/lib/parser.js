// 读取源码，生成ast，然后转换e6语法

const fs = require('fs');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');


// 用commonjs的语法写
module.exports = {
  // 传入具体文件路径，解析出ast
  getAst: path => {
    const source = fs.readFileSync(path, 'utf-8')

    return babylon.parse(source, {
      sourceType: 'module'
    });
  },

  // 解析依赖
  getDependencies: ast => {
    // 接收一个ast，返回依赖
    let deps = [];

    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        deps.push(node.source.value)
      }
    });

    return deps;
  },

  // 将ast转换为源码，需要借助
  transform: ast => {
    const { code } = transformFromAst(ast, null,{
      presets: ['env']
    })
    return code;
  }
}