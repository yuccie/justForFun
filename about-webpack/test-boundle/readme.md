
## webapck在不同devtool下的构建产物

### devtool是eval模式

```js
// index.js
console.log(111);

// node_modules/.bin/webpack ./index.js --mode development
// 构建完生成的代码结构，默认devtool是eval模式。
(() => {
    var __webpack_modules__ = ({
        "./index.js":
            (() => {
                eval("console.log(111);\n\n//# sourceURL=webpack://test-boundle/./index.js?");
            })

    });
    var __webpack_exports__ = {};
    __webpack_modules__["./index.js"]();
})();
```

### devtool是source-map模式

```js
// index.js
console.log(111);

// node_modules/.bin/webpack ./index.js --mode development -d source-map
(() => {
    var __webpack_exports__ = {};
    console.log(111);
})();
//# sourceMappingURL=main.js.map
```

### devtool是cheap-source-map模式

```js
// index.js
module.exports = function add(a, b) {
    return a + b;
};

// node_modules/.bin/webpack ./index.js --mode development -d cheap-source-map
(() => {
  // 根据路径定义模块map
  var __webpack_modules__ = ({

    "./index.js": ((module) => {
      module.exports = function add(a, b) {
        return a + b;
      };
    })

  });

  // 模块缓存
  var __webpack_module_cache__ = {};

  // webpack自定义的require函数
  function __webpack_require__(moduleId) {

    // 检查是否缓存
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }

    // 如果没有缓存，则创建一个module，并放进缓存里
    var module = __webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {}
    };

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  // startup
  // Load entry module and return exports
  // This entry module is referenced by other modules so it can't be inlined
  // 首先执行这一行
  var __webpack_exports__ = __webpack_require__("./index.js");

})();
//# sourceMappingURL=main.js.map
```

### 使用webpack构建commonjs模块

```js
// cmd.js
module.exports = function add(a, b) {
    return a + b;
};
// index.js
const lib = require('./cmd');
console.log(lib(1, 2), 'cmd');

// node_modules/.bin/webpack ./index.js --mode development -d cheap-source-map
(() => { // webpackBootstrap
  var __webpack_modules__ = ({

    "./lib.js": ((module) => {
      module.exports = function add(a, b) {
        return a + b;
      };
    })

  });

  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // Create a new module (and put it into the cache)
    var module = __webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {}
    };

    // Execute the module function
    // 执行是，其实就相当于将上面定义的module指向了对应的模块
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  var __webpack_exports__ = {};

  // 如果引入的模块，有执行，则在下面直接执行；而且用IIFE生成对应的作用域
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const lib = __webpack_require__(/*! ./lib */ "./lib.js");
    console.log(lib(1, 2), 'lib');
  })();

})();
//# sourceMappingURL=main.js.map
```

### 使用webapck构建es模块

```js
// es.js
module.exports = function sum(a, b) {
    return a + b;
};
// index.js
// es，模块这种加载会报错：SyntaxError: Unexpected token 'export'
// 意思就是，使用require导入的模块，不能使用export
// const lib = require('./sum');

// es模块导入，需要用import，而且这里需要文件后缀
// 另外如果直接在一个空项目里调用es模块，会报错：Cannot use import statement outside a module
// 使用es模块，需要在es环境下，可以在package.json里增加："type": "module",
// 正常项目中，可以使用es6模块，那是因为我们配置了babel，其会转换es6语法至es模块。
import { sum } from './es.js'
console.log(sum(1, 2), 'es');

// node_modules/.bin/webpack ./index.js --mode development -d cheap-source-map
(() => {
  "use strict";
  
  // 默认是严格模式
  var __webpack_modules__ = ({

    "./es.js": ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

      __webpack_require__.r(__webpack_exports__);

      /* harmony export */ // harmony是es6模块的标识
      __webpack_require__.d(__webpack_exports__, {
        // 这是一个对象，key： value，只是value每次都返回同一个对象。
        "sum": () => (/* binding */ sum)
      });

      function sum(a, b) {
        return a + b;
      }
    })

  });
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }

    // Create a new module (and put it into the cache)
    var module = __webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {}
    };

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    // 其实就是将export导出的方法，通过getter方式挂载在exports对象上，然后就可以直接exports[key]获取了
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
        }
      }
    };
  })();

  // hasOwnProperty的简短模式
  /* webpack/runtime/hasOwnProperty shorthand */
  (() => {
    __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      // Symbol.toStringTag 自定义 toString 方法的行为。我们使用({}).toString(8, -1)获取的类型，就是他定义的
      if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      }
      // es模块的__esModule属性值为true
      Object.defineProperty(exports, '__esModule', { value: true });
    };
  })();


  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {

    __webpack_require__.r(__webpack_exports__);
    /* harmony import */
    var _es_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./es.js */ "./es.js");

    console.log((0, _es_js__WEBPACK_IMPORTED_MODULE_0__.sum)(1, 2), 'es');
  })();

})();
//# sourceMappingURL=main.js.map
```

总结：
- 不管是common.js还是es模块，webpack都会处理成exports模式，
- 只是在es模块上会增加__esModule属性，以及Symbol.toStringTag的行为
- 构建完的形式，之所以在浏览器可以执行，是因为webpack自定义了require的行为

### babel转换es6模块

看如下文件就知道了，webpack的转换规则，和这个差不多。。。

```js
// es6模块
export function sum(a, b) {
    return a + b;
}

// babel转义
"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sum = sum;
function sum(a, b) {
  return a + b;
}
```

### UMD模块

所谓UMD (Universal Module Definition)，就是一种javascript通用模块定义规范，让你的模块能在javascript所有运行环境中发挥作用。

实现一个UMD模块，就要考虑现有的主流javascript模块规范了，如CommonJS, AMD, CMD等。那么如何才能同时满足这几种规范呢？

首先要想到，模块最终是要导出一个对象，函数，或者变量。

而不同的模块规范，关于模块导出这部分的定义是完全不一样的。

因此，我们需要一种过渡机制。

首先，我们需要一个factory，也就是工厂函数，它只负责返回你需要导出的内容（对象，函数，变量等）。
我们从导出一个简单的对象开始。

```js
function factory() {
    return {
        name: 'umd模块'
    }
}
```

假设不考虑CommonJS, AMD, CMD，仅仅将这个模块作为全局对象的一个属性应该怎么写呢？

```js
// 其实就是将factory()的结果放在root上
(function(root, factory) {
    console.log('没有模块环境，直接挂载在全局对象上')
    root.umdModule = factory();
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

如果要兼容AMD规范呢？

```js
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // 如果环境中有define函数，并且define函数具备amd属性，则可以判断当前环境满足AMD规范
        console.log('是AMD模块规范，如require.js')
        define(factory)
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```

同理，接着判断当前环境是否满足CommonJS或CMD规范，分别使用相应的模块定义方法进行模块定义。

```js
(function(root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        console.log('是commonjs模块规范，nodejs环境')
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        console.log('是AMD模块规范，如require.js')
        define(factory)
    } else if (typeof define === 'function' && define.cmd) {
        console.log('是CMD模块规范，如sea.js')
        define(function(require, exports, module) {
            module.exports = factory()
        })
    } else {
        console.log('没有模块环境，直接挂载在全局对象上')
        root.umdModule = factory();
    }
}(this, function() {
    return {
        name: '我是一个umd模块'
    }
}))
```


