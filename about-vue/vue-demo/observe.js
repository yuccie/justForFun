// 遍历data，然后设置响应式
class Observe {
  constructor(data) {
    this.data = data;

    this.observe(this.data);
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
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 设置响应式时，添加依赖
        console.log('get',Dep.target)
        Dep.target && dep.addWatcher(Dep.target)
        return value;
      },
      set(newVal) {
        if (newVal !== value) {
          value = newVal;
        }
        // 设置值后，触发更新
        dep.notify()
      }
    })

    // 递归
    this.observe(value)
  }
}

// 依赖搜集器
class Dep {
  constructor() {
    this.subs = [];
  }
  addWatcher(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update())
  }
}

// watcher
class Watcher {
  constructor(expr, vm, callback) {
    this.vm = vm;
    this.expr = expr;
    this.callback = callback;
    this.oldVal = this.getOldVal()
  }
  update() {
    // 如果值发生变化，就触发回调
    let newVal = this.getNewVal();
    if (newVal !== this.oldVal) {
      this.callback(newVal);
    }
  }
  getOldVal() {
    Dep.target = this;
    return Utils.getVal(this.expr, this.vm)
  }
  getNewVal() {
    return Utils.getVal(this.expr, this.vm)
  }
}