// {
//   title: "hello",
//   person: {
//     name: "hello",
//     age: 18,
//     fav: "嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻寻寻寻",
//   },
//   msg: "我是一个msg",
//   htmlStr: "<strong>我是加粗的strong</strong>",
// }
class Text {
  constructor() {
    this.title = 'text'
  }
}
Text.target = { a:1 }
let test1 = new Text();
let test2 = new Text();
// console.log(test1.target, test2.target, Text.target, '1111');

class Watcher {
  constructor(vm, expr, callback) {
    this.vm = vm;
    this.expr = expr;
    this.oldVal = this.getOldVal();
    this.callback = callback;
  }
  // 获取旧值
  getOldVal() {
    // 如果有来获取值的，就设置一个标志位
    Dep.target = this;
    return Utils.getExprVal(this.vm,this.expr);
  }
  // watcher会根据值是否变化，触发回调
  updater() {
    let newVal = Utils.getExprVal(this.vm,this.expr);
    console.log(newVal, 'newVal', this.oldVal);
    // 如果新值和旧值不同，则触发回调
    if (newVal !== this.oldVal) {
      this.callback(newVal);
    }
  }
}

// 依赖搜集
class Dep {
  constructor() {
    this.subs = [];
  }
  // 添加watcher
  addWatcher(watcher) {
    this.subs.push(watcher);
  }
  // 通知所有watcher
  notify() {
    this.subs.forEach(watcher => {
      watcher.updater();
    })
  }
}


// 观察数据
class Observe {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    if (typeof data === 'object') {
      Object.keys(data).forEach(key => {
        this.proxy(data, key, data[key])
      })
    }
  }
  proxy(data, key, value) {
    let dep = new Dep();
    // 递归遍历深层次的对象
    this.observe(value)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 获取每个值时，就添加watcher，Dep.target不会覆盖吗？
        Dep.target && dep.addWatcher(Dep.target);
        return value;
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal;
        }
        // 触发更新
        dep.notify()
      }
    })
    console.log(dep);
  }
}