// export class {
//   getAST: path => {
//     console.log(path);
//   }
// }
const fs = require('fs');
const path = require('path');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

module.exports = {
  // 获取指定路径文件的ast
  getAST: url => {
    // babylon接受一个文件
    let ctx = fs.readFileSync(path.join(__dirname, url), 'utf-8')
    return babylon.parse(ctx, {
      sourceType: 'module'
    })
  },

      // // 接收一个ast，返回依赖
      // let deps = [];

      // traverse(ast, {
      //   ImportDeclaration: ({ node }) => {
      //     deps.push(node.source.value)
      //   }
      // });
  
      // return deps;
  // 获取文件的依赖，需要借助babel-traverse
  getDeps: ast => {
    // 数组对象，可以使用const
    const deps = [];

    traverse(ast, {
      // ImportDeclaration用来分析import语句的
      ImportDeclaration: ({ node }) => {
        deps.push(node.source.value)
      }
    });

    return deps;
  },

  // 将ast再转为源码，同时还需要解析里面的es6语法
  // 转换需要用到babel-core，环境需要用到babel-preset-env
  transform: ast => {
    const { code } = transformFromAst(ast, null, {
      presets: ['env']
    });

    return code;
  }
}