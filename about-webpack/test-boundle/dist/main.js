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