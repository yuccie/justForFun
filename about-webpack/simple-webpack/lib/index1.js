
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core');
const fs = require('fs');
const webpackConf = require('../simple.config.js');

const { entry, output } = webpackConf;

// 同步读取源文件
const entrySource = fs.readFileSync(entry, 'utf-8');

// 将源文件转为AST
const entryAST = babylon.parse(entrySource, { sourceType: 'module' })

// 获取AST里的依赖
const deps = []
traverse(entryAST, {
    // 其实相当于traverse函数有个选项，这个选项相当于过滤器而已
    // 可以过滤出对应的类型，比如此处的import声明就是依赖
    ImportDeclaration: ({ node }) => {
        deps.push(node.source.value)
    }
})
// console.log(deps);

// 将ast转为es5
const { code: es5Code } = transformFromAst(entryAST, null, {
    // 因为语法很可能是ES6,7,8等，因此这里需要设置presets
    // 还需要安装babel-presets-env
    presets: ['env']
});
// console.log(es5Code);


