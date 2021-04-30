(function(modules) {
            function require(filename) {
                const fn = modules[filename];

                const module = { exports: {} };
                console.log(fn)
                fn(require, module, module.exports)

                return module.exports;
            }

            require('./src/index.js');
        })({'./src/index.js': function(require, module, exports) { "use strict";

var _hello = require("./hello.js");

console.log((0, _hello.hello)('hhha'));
console.log(1); },'./hello.js': function(require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hello = hello;

function hello() {
  var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '陌生人';
  return "hello " + name;
} },})