const path = require('path');
const fs = require('fs');
const { getAst, getDependencies, transform } = require('./parser');

module.exports = class Compiler {
  constructor(opts) {
    const { entry, output } = opts;
    this.entry = entry;
    this.output = output;
    this.modules = [];
  }

  // 编译器首先运行run方法
  run() {
    // 将入口的文件push进去
    const entryModule = this.buildModule(this.entry, true);
    this.modules.push(entryModule);

    // 从入口文件递归遍历
    this.modules.map(_module => {
      _module.dependencies.map(dependency => {
        this.modules.push(this.buildModule(dependency))
      })
    })

    // 将最后结果emit出去
    this.emitFiles();
  }

  buildModule(filename, isEntry) {
    let ast;

    if (isEntry) {
      ast = getAst(filename);
    } else {
      let absolutePath = path.join(process.cwd(), './src', filename);
      ast = getAst(absolutePath);
    }

    return {
      filename,
      dependecies: getDependencies(ast),
      transformCode: transform(ast),
    }
  }

  emitFiles() {
    const { path, filename} = this.output;
    const outputPath = path.join(path, filename);
    let modules = '';

    this.modules.map(_module => {
      modules += `'${_module.filename}': function(require, module, exports) { ${_module.transformCode} },`
    })

    const bundle = `(function(modules) {
      function require(filename) {
        const fn = modules[fileName];

        const module = { exports: {} };

        fn(require, module, module.exports);

        return module.exports;
      }

      require('${this.entry}');
    })({${modules}})`

    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}