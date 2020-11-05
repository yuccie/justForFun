const Utils = {
  // 如果expr是多级的，比如person.name
  getExprVal(vm, expr) {
    let data = vm.data;
    return expr.split('.').reduce((data, curData) => {
      return data[curData];
    }, data)

  },
  text(node, vm, expr) {
    let value = this.getExprVal(vm,expr);
    this.updater.getText(node, value);
  },
  model(node, vm, expr) {
    let value = this.getExprVal(vm,expr);
    new Watcher(vm, expr, value => {
      this.updater.getModel(node, value);
    })

    node.addEventListener('input', e => {
      this.updater.setModelVal(vm, expr, e.target.value);
    })
    
    this.updater.getModel(node, value);
  },
  html(node, vm, expr) {
    // console.log(expr, vm.data(), 'expr')
    // vm作为一个对象传过来，data还是一个函数
    // let value = vm.data().msg
    let value = this.getExprVal(vm,expr);
    console.log('initValue', value);
    // 将值交给watcher
    new Watcher(vm, expr, value => {
      console.log('value', value);
      this.updater.getHtml(node, value);
    })
    this.updater.getHtml(node, value);
  },

  // eventName为click，expr为handleClick
  // 相当于绑定事件
  on(node, vm, expr, eventName) {
    let fn = vm.methods[expr];
    // node.addEventListener(eventName, fn)
    node.addEventListener(eventName, fn.bind(vm))
  },
  updater: {
    getText(node, value) {
      node.textContent = value;
    },
    getHtml(node, value) {
      node.innerHTML = value;
    },
    // v-model其实就是填充的value特性
    getModel(node, value) {
      node.value = value
    },
    setModelVal(vm, expr, value) {
      expr.split('.').reduce((data, curData) => {
        data[curData] = value
      }, vm.data)
    }
  },
}

class Compile {
  // vm其实是不是实例，而是Vue构造函数的入参
  constructor(el, data, vm) {
    this.el = this.isNodeType(el) ? el : document.querySelector(el);
    this.data = data;
    this.vm = vm;

    // 遍历真实dom，获取文档片段
    this.fragment = this.getFragment(this.el)
    // console.log(this.fragment);
    // 解析文档片段
    this.compileFragment(this.fragment);
    
    // 把遍历的文档节点放在页面上，一次性的放到页面上去
    this.el.appendChild(this.fragment);
  }

  // 解析文档片段
  compileFragment(fragment) {
    // 文档片段，可以直接理解为dom节点，然后使用dom的一些方法
    // console.log('fragment', fragment.childNodes);
    let childNodes = Array.from(fragment.childNodes)
    childNodes.forEach(node => {
      // 解析出每个节点的属性、指令、值等
      // 每个节点可能类型不同
      if (this.isNodeType(node)) {
        // 解析元素节点
        this.compileNode(node)
      } else {
        this.compileText(node)
      }

      // 递归遍历深层嵌套的节点
      if (node.childNodes && node.childNodes.length) {
        this.compileFragment(node)
      }
      // console.log('node', node);
    })
  }

  // 解析元素节点
  compileNode(node) {
    // 获取属性
    let attrs = node.attributes;
    [...attrs].forEach(attr => {
      let {name, value} = attr;
      // @click handleClick,v-text msg, class nameclass, type text, v-model msg, v-on:click handleClick
      // console.log(name, value);

      // 根据不同的name类型，解析不同的指令
      if (this.isStartsWithV(name)) {
        let [, methods] = name.split('-'); // model, on:click, text, html
        let [methodName, eventName] = methods.split(":") // click
        
        // console.log(methodName, eventName);
        // 拿到了各个指令，则根据指令的意思，调用相应的操作dom的方法渲染到页面
        // 由于操作dom的方法很多，这里创建工具函数
        Utils[methodName](node, this.vm, value, eventName);

      } else if (this.isStartsWith2(name)) {
        let [, eventName] = name.split("@")
        Utils.on(node, this.vm, value, eventName);
      }
    }) 
  }

  // 解析文本节点
  compileText(node) {
    // 拿到文本内容
    let content = node.textContent;
    if (/{{.*?}}/.test(content)) {
      // 拿到{{}}内的key
      let expr = content.match(/{{(.*?)}}/)[1]
      // console.log(expr);
      Utils.text(node, this.vm, expr);
      // console.log(content);
    }
  }

  // v-开头的
  isStartsWithV(str) {
    return str.startsWith('v-');
  }

  // @开头的
  isStartsWith2(str) {
    return str.startsWith('@');
  }

  // 返回node节点：解析传入的el，需要判断是否为node节点，并返回node节点
  isNodeType(el) {
    return el.nodeType === 1;
  }

  // 返回根节点下所有的文档片段节点
  getFragment(el) {
    // 创建一个文档节点
    let fragment = document.createDocumentFragment()

    // 遍历根节点，拿到所有的节点，并放在文档片段里
    // 这段代码的逻辑是：将el下的真实元素挨个的挪到fragment里，因为一个元素不可能同时有两个父元素，即使这个父元素是文档片段
    let firstChild;
    while(firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }

    // 返回文档片段
    return fragment
  }
}

class Vue {
  // Vue构造函数传入一个对象，
  constructor(obj) {
    this.$el = obj.el;
    this.$data = obj.data;
    this.$obj = obj;

    if (this.$el) {
      // 观察data
      new Observe(this.$data);
      // 编译dom节点
      new Compile(this.$el, this.$data, this.$obj)
    }
  }
}