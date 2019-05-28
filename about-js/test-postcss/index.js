var postcss = require('postcss');
var autoprefixer = require('autoprefixer');
var fs = require('fs');

var css = '* { transition: all .1s; }';

postcss([autoprefixer])
  .process(css)
  .then(function(result) {
      // 这一行是学习的时候需要的，看一下到底对象里面包含什么
      console.log(result);
      if (result.css) {
          fs.writeFileSync('index.css', result.css);
      }
      if (result.map) {
          fs.writeFileSync('index.css.map', result.map);
      }
  });