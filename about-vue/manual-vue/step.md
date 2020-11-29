## vue 原理

1. 以上是利用框架直接渲染出来的，
2. 如果自己写vue的话，需要解析html标签里的属性、指令、变量等，最后替换
3. 所以首先要实现自己的Vue构造函数，构造函数里传入自己

### step1 Vue构造函数

```js
let vm = new Vue({
  el: '#app',
  data() {
    return {}
  },
  methods:{},
  // ...
})

// 定义Vue构造函数，并将根节点传入编译器
class Vue {
  constructor({el, data, methods}) {
    this.$el = el;
    this.$data = data;
    this.$methods = methods;

    if (el) {
      new Compile(el)
    }
  }
}
```

### step2 定义编译器

- 编译器的目的是解析传入Vue构造函数的参数，尤其要遍历页面的dom
- 框架遍历的dom节点不是真实的dom，而是文档片段`documentFragment`，然后一次性的放到页面上，减少重绘

```js
class Compile {
  constructor(el, data, obj) {
    // 返回node节点：解析传入的el，需要判断是否为node节点，并返回node节点
    this.el = this.isNodeType(el) ? el : document.querySelector(el);

    // 根据根节点创建文档片段
    this.fragment = this.getFragment(this.el)

    // 插入到页面
    this.el.appendChild(this.fragment)
  }

  // 是否为node节点
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

    return fragment
  }
}
```

### step4 解析文档片段

我们将真实的dom遍历出来，生成文档片段，然后直接就插入到页面了。。。

下一步需要解析文档片段里的指令、属性、值等。然后渲染到页面上，这时候就需要根据不同的节点类型解析文档片段了

```js
class Compile {
  constructor(el, data, obj) {
    this.el = this.isNodeType(el) ? el : document.querySelector(el);
    this.fragment = this.getFragment(this.el)

    // 解析文档片段
    this.compileFragment(this.fragment);

    this.el.appendChild(this.fragment)
  }

  // 解析文档片段
  compileFragment(fragment) {

  }

  // 是否为node节点
  isNodeType(el) {
    return el.nodeType === 1;
  }

  // 返回根节点下所有的文档片段节点
  getFragment(el) {
    let fragment = document.createDocumentFragment()

    let firstChild;
    while(firstChild = el.firstChild) {
      fragment.appendChild(firstChild)
    }

    return fragment
  }
}
```