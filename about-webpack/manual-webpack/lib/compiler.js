
const { getAST, getDeps, transform } = require('./parser');

module.exports = class Compiler{
  constructor(opts) {
    const { entry, output } = opts;

    this.entry = entry;
    this.output = output;
  }
  
  run() {
    this.entryModule = this.entryBuild(this.entry, true)
  }

  // 编译入口
  entryBuild(entry, isEntry) {
    let ast;
    console.log(process.cwd(), '1');
    if (isEntry) {
      ast = getAST(entry);
    } else {
      const absolutePath = path.join()
    }
  }
}