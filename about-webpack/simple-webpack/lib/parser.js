// 定义一些列方法，用来转换ast，获取依赖等
const fs = require('fs');
const path = require('path')

// 将源码解析为ast
const babylon = require('babylon');

// 转为ast的目的就是要分析依赖
const traverse = require('babel-traverse').default;

// 将ast转为es5源码
const { transformFromAst } = require('babel-core')

// 导出对象

module.exports = {
    // 获取AST
    getAst(path) {
        // 读取源文件，并解析为ast
        const content = fs.readFileSync(path, 'utf-8');

        return babylon.parse(content, {
            sourceType: 'module'
        })
    },
    
    // 获取依赖
    getDeps(ast) {
        const deps = [];

        traverse(ast, {
            ImportDeclaration({ node }) {
                deps.push(node.source.value)
            }
        })
        
        return deps;
    },

    // 将ast转为源码
    transform(ast) {
        const { code } = transformFromAst(ast, null, {
            presets: ['env']
        })
        return code;
    }
}