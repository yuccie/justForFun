class Vue {
  constructor(obj) {
    this.el = obj.el;
    this.data = obj.data;
    this.vm = obj;

    if (this.el) {
      // 观察数据
      new Observe(this.data);
      // 编译模板
      new Compile(this.el, this.data, obj);
    }
  }
}

class Compile {
  constructor(el, data, vm) {
    this.data = data;
    this.vm = vm;
    // 获取根节点
    this.el = this.isNodeType(el) ? el : document.querySelector(el);

    // 获取根节点下的所有节点的文档片段
    this.fragment = this.getFragment(this.el);

    // 解析文档片段
    this.compileFragment(this.fragment);

    // 插入文档片段
    this.el.appendChild(this.fragment)
  }

  // 是否为node节点
  isNodeType(el) {
    return el.nodeType === 1;
  }

  // 获取文档片段
  getFragment(el) {
    let fragment = document.createDocumentFragment();

    // 循环遍历，将根节点下的节点挨个挪到文档片段里
    let firstChild;
    while(firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }
    return fragment;
  }

  // 遍历各个节点，拿到属性，
  compileFragment(fragment) {
    [...fragment.childNodes].forEach(node => {
      if (this.isNodeType(node)) {
        this.compileNode(node);
      } else {
        this.compileText(node);
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileFragment(node);
      }
    })
  }

  // 解析node节点
  compileNode(node) {
    // 获取节点的属性，伪数组
    let attrs = node.attributes;
    [...attrs].forEach(attr => {
      let {name, value} = attr;
      // "v-text" "msg", "@click" "handleClick"
      if (this.startsWithV(name)) {
        let [, methods] = name.split('-'); // on:click, html
        let [methodName, eventName] = methods.split(":");
        // 根据不同的methodName，调用不同的函数
        Utils[methodName](node, this.vm, value, eventName)
      } else if (this.startsWith2(name)) {
        let [, eventName] = name.split("@");
        Utils.on(node, this.vm, value, eventName)
      } 
    })
  }

  // 解析文本节点
  compileText(node) {
    let content = node.textContent;
    // 如果是{{}}
    if (/{{.*?}}/.test(content)) {
      // 获取expr
      let expr = content.match(/{{(.*?)}}/)[1]
      // console.log('expr', expr);
      Utils.text(node, this.vm, expr)
    }
  }

  startsWithV(str) {
    return str.startsWith('v-');
  }
  startsWith2(str) {
    return str.startsWith('@');
  }
}

// console.log('Utils', Utils); // 但这样会报错

// 在这里定义的，也可以在上面使用。。。
const Utils = {
  // expr可以有多级，比如person.name
  getVal(expr, vm) {
    return expr.split('.').reduce((data, curData) => {
      return data[curData];
    }, vm.data)
  },
  text(node, vm, expr) {
    let value = this.getVal(expr, vm);
    new Watcher(expr, vm, newVal => {
      this.setText(node, newVal);
    })
    this.setText(node, value);
  },
  html(node, vm, expr) {
    // 获取value，并调用dom方法操作dom
    let val = this.getVal(expr, vm);
    new Watcher(expr, vm, val => this.setHtml(node, val))
    this.setHtml(node, val);
  },
  model(node, vm, expr) {
    let value = this.getVal(expr, vm);
    new Watcher(expr, vm, newVal => {
      this.setModel(node, newVal);
    })
    // 双向数据绑定，指数级添加watcher，需要优化
    node.addEventListener('input', e => {
      this.setVmodel(vm, expr, e.target.value);
    })
    this.setModel(node, value);
  },
  on(node, vm, expr, eventName) {
    // 其实就是绑定事件
    let fn = vm.methods && vm.methods[expr]
    node.addEventListener(eventName, fn.bind(vm))
  },
  // 设置双数据绑定
  setVmodel(vm, expr, value) {
    expr.split('.').reduce((data, curData) => {
      // console.log('data', data, curData);
      data[curData] = value;
    }, vm.data)
  },
  setHtml(node, value) {
    node.innerHTML = value;
  },
  setText(node, value) {
    node.textContent = value;
  },
  setModel(node, value) {
    node.value = value;
  },
}