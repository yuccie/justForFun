const fs = require('fs');
const path = require('path');
const { getAst, getDeps, transform } = require('./parser.js');

module.exports = class Compiler {
    // 构造函数，接受参数
    constructor(opts) {
        const { entry, output } = opts;

        this.entry = entry;
        this.output = output;
        // 将所有的模块都需要遍历出来
        this.modules = [];
    }

    // run
    run() {
        this.entryModule = this.buildModule(this.entry, true)

        this.modules.push(this.entryModule);

        // 递归所有模块，并将依赖放到modules数组里
        this.modules.map(_module => {
            _module.deps.map(dep => {
                this.modules.push(this.buildModule(dep))
            })
        })
        // 得到所有的构建文件以及源码，可以将这文件输出出来了
        this.emitFiles();
        // return this.modules;
    }

    // 
    buildModule(filename, isEntry) {
        let ast = '';
        if (isEntry) {
            ast = getAst(filename);
        } else {
            const absolutePath = path.join(process.cwd(), './src', filename);
            ast = getAst(absolutePath);
        }
        return {
            filename,
            deps: getDeps(ast),
            source: transform(ast)
        }
    }

    emitFiles() {
        const { path: url, filename } = this.output;
        const outputPath = path.join(url, filename)

        // 将数组中得到的所有依赖模块，都通过键值对放在字符串里
        let modules = '';
        this.modules.map(_module => {
            modules += `'${_module.filename}': function(require, module, exports) { ${_module.source} },`
        })

        // 自执行函数，传入解析出来的modules，modules是字符串，需要包裹一下
        const boundle = `(function(modules) {
            function require(filename) {
                const fn = modules[filename];

                const module = { exports: {} };

                fn(require, module, module.exports)

                return module.exports;
            }

            // 启动程序
            require('${this.entry}');
        })({${ modules }})`

        fs.writeFileSync(outputPath, boundle, 'utf-8')
    }
}