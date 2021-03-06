// 它是一个很特别的关键字，被自动定义在所有函数的作用域中。
// 那为什么要使用this呢？
function identify() {
  return this.name.toUpperCase();
}
function speak() {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}
var me = {
  name: "Kyle"
};
var you = {
  name: "Reader"
};
identify.call(me); // KYLE
identify.call(you); // READER
speak.call(me); // Hello, 我是KYLE
speak.call(you); // Hello, 我是 READER

// 这段代码可以在不同的上下文对象（me 和you）中重复使用函数identify() 和speak()，
// 不用针对每个对象编写不同版本的函数。
// 其实根据最佳实践来说，共享函数都是定义在原型上，所以并不是针对谁的函数，而是大家都可以调用

// 如果不使用this，那就需要给identify() 和speak() 显式传入一个上下文对象。
function identify(context) {
  return context.name.toUpperCase();
}
function speak(context) {
  var greeting = "Hello, I'm " + identify(context);
  console.log(greeting);
}
identify(you); // READER
speak(me); //hello, 我是KYLE
// 然而，this 提供了一种更优雅的方式来隐式“传递”一个对象引用，
// 因此可以将API 设计得更加简洁并且易于复用。

// this 永远指向最后调用它的那个对象
var name = "windowsName";
function a() {
  var name = "Cherry";
  console.log(this.name); // windowsName
  console.log("inner:" + this); // inner: Window
}
a();

var name = "windowsName";
var a = {
  name: "Cherry",
  fn: function() {
    // 在对象属性引用链调用模式下
    // 只有最顶层或者说最后一层会影响调用位置，也就是此处的a
    console.log(this.name); // Cherry
  }
};
window.a.fn();

// 因为this就是指向a，而a中没有定义name
var name = "windowsName";
var a = {
  // name: "Cherry",
  fn: function() {
    console.log(this.name); // undefined
  }
};
window.a.fn();

// 这是作用域链起作用，注意与上方的对比
// 此时a只是个对象，并不是一个块级作用域
var name = "windowsName";
var a = {
  name: "Cherry",
  fn: function() {
    console.log(name); // "windowsName"
  }
};
window.a.fn();

// 此时fn是个函数，组成了一个块级作用域
// 因此内部作用域屏蔽了全局作用域
var name = "windowsName";
function fn() {
  var name = "Cherry";

  innerFunction();
  function innerFunction() {
    console.log(name); // "Cherry"
  }
}
fn();

// 虽然innerFunction在函数内部执行的，
// 但并没有带任何修饰的函数引用进行调用的，因此只能使用默认绑定this规则
var name = "windowsName";
function fn() {
  var name = "Cherry";
  innerFunction();
  function innerFunction() {
    console.log(this.name); // windowsName
  }
}
fn();

// ---------默认绑定this规则-------------
// 注意：虽然this的绑定规则取决于调用位置
// 但对于默认绑定来说，决定this 绑定对象的并不是调用位置是否处于严格模式，
// 而是函数体是否处于严格模式。
// 如果函数体处于严格模式，this 会被绑定到undefined，
// 否则this 会被绑定到全局对象。
function foo() {
  "use strict";
  // 此时函数体处于严格模式下，会被绑定到undefined
  console.log(this.a);
}
var a = 2;
foo(); // TypeError: Cannot read property 'a' of undefined

// 如下，函数体在非严格模式，而执行在严格模式
function foo() {
  console.log(this.a);
}
var a = 2;
(function() {
  "use strict";
  foo(); // 2，正常打印
})();

// 然而如果你把null 或者undefined 作为this 的绑定对象传入call、apply 或者bind，
// 这些值在调用时会被忽略，实际应用的是默认绑定规则。
// 然而，总是使用null 来忽略this 绑定可能产生一些副作用。
// 如果某个函数确实使用了this（比如第三方库中的一个函数），
// 那默认绑定规则会把this 绑定到全局对象（在浏览器中这个对象是window），这将导致不可预计的后果（比如修改全局对象）。

// 如果实在是不在乎被谁调用的话
// 一种“更安全”的做法是传入一个特殊的对象，把this 绑定到这个对象不会对你的程序产生任何副作用
// 创建一个空对象最简单的方法就是Object.create(null)，
// 它和{} 很像， 但是并不会创建Object.prototype 这个委托，因此更加干净
function foo(a, b) {
  console.log("a:" + a + ", b:" + b);
}
// 创建一个很空很空的对象，这样既不会使用默认绑定规则，也不会产生副作用
var ø = Object.create(null);
// 把数组展开成参数
foo.apply(ø, [2, 3]); // a:2, b:3

// 还可用console.log
console.log.apply(ø, [1, 2, 3]); // 1 2 3
// 等价于
console.log(1, 2, 3);

// 使用bind(..) 进行柯里化
var bar = foo.bind(ø, 2);
bar(3); // a:2, b:3

// ---------改变this的指向-------------
// 1. 使用 ES6 的箭头函数
// 2. 在函数内部使用 _this = this
// 3. 使用 apply、call、bind
// 4. new 实例化一个对象

// 箭头函数的 this 始终指向函数定义时的 this，而非执行时。
// 根据当前的词法作用域来决定 this，具体来说，
// 箭头函数会继承最近一层外层非箭头函数调用的 this 绑定(无论 this 绑定到什么)
var name = "windowsName";

var a = {
  name: "Cherry",

  func1: function() {
    console.log(this.name);
  },
  func2: function() {
    // 修改为箭头函数即可消除错误
    // 因为最后调用setTimeout是window
    setTimeout(function() {
      this.func1();
    }, 100);
  }
};
// 此时func2的上下文就是a
a.func2(); // this.func1 is not a function

// ---------使用call,apply,bind-------------
var a = {
  // 省略
  func2: function() {
    // apply或call
    setTimeout(
      function() {
        this.func1();
      }.call(a),
      100
    );

    // bind，需要调用
    setTimeout(
      function() {
        this.func1();
      }.bind(a)(),
      100
    );
  }
};

// ---------apply语法-------------
// MDN：apply() 方法调用一个函数, 其具有一个指定的this值，
// 以及作为一个数组（或类似数组的对象）提供的参数
fun.apply(thisArg, [argsArray]);
// 其实就是thisArg对象调用fun函数。因此this指向thisArg
// 如果传入的是null,undefined，则会被忽略，其实还是应用的默认规则
// 如果传入原始类型，则会自动指向对应的包装类型
// argsArray为一个数组或类数组

// ---------call语法-------------
// 除了传参模式与apply不同，其他都相同
// fun.call(thisArg[, arg1[, arg2[, ...]]])

// ---------bind语法-------------
// thisArg调用绑定函数时作为this参数传递给目标函数的值
// arg1, arg2,...当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。
// function.bind(thisArg[, arg1[, arg2[, ...]]])

// 示例
var p = {};
function person(name, age) {
  console.log(this, name, age);
}
var fn = person.bind(p, "manster", "23");
fn(); // {} "manster" "23"

function add(x, y) {
  return x + y;
}
console.log(add(1, 2)); // 3

// 修改为柯理化
function add2(x) {
  return function(y) {
    return x + y;
  };
}
console.log(add2(1)(2)); // 3

// 手写bind函数:
// 此时定义的myBind是多个参数
Function.prototype.myBind = function(context, ...args) {
  return () => this.apply(context, args);
};
// 测试一下
let obj1 = { name: "test1" };
let func1 = function(p1, p2) {
  console.log(this.name); // 'test1'
  console.log(p1, p2); // 1 2
};

let fn = func1.myBind(obj1, 1, 2);
fn();

// 上面代码将func1的this指向了obj了，因此就可以打印出obj里的name属性。。。
// 另外，修改this指向时传入了参数1，2也同样打印出来了。。。
// 但fn()调用时没有传参，如果再继续传参又该如何处理呢？
Function.prototype.myBind = (context, ...args) => {
  // 要记住，返回的是一个函数，如果想执行的话，则需要调用
  return (...args2) => {
    this.apply(context, [args, ...args2]);
  };
};

// 测试一下
let obj2 = { name: "test2" };
let func2 = function(p1, p2, p3, p4) {
  console.log(this.name); // 'test2'
  console.log(p1, p2, p3, p4); // 1 2 3 4
};

let fn = func2.myBind(obj2, 1, 2);
fn(3, 4);

// ---------this指向规则判断优先级(完结)-------------
// 1. 函数是否在new 中调用（new 绑定）？如果是的话this 绑定的是新创建的对象。
var bar = new foo();
// 2. 函数是否通过call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。
var bar = foo.call(obj2);
// 3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。
var bar = obj1.foo();
// 4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到undefined，否则绑定到全局对象。
var bar = foo();
// 注意：对于正常的函数调用来说，理解了这些知识你就可以明白this 的绑定原理了。不过……凡事总有例外。
// 也就是如果把null 或者undefined 作为this 的绑定对象传入call、apply 或者bind，
// 这些值在调用时会被忽略，实际应用的是默认绑定规则

// ---------柯力化-------------
// 柯里化，可以理解为提前接收部分参数，延迟执行，不立即输出结果，而是返回一个接受剩余参数的函数。
// 思考一个场景，设计一个算法记录一个月的加班时间？
// 常规方法是首先记录每天加班时间，然后再将每天的时间相加。。。
var monthTime = 0;

function overtime(time) {
  return (monthTime += time);
}

overtime(3.5); // 第一天
overtime(4.5); // 第二天
overtime(2.1); // 第三天
//...

console.log(monthTime); // 10.1
// 缺点：浪费性能，没有必要每天都计算，尤其数据量大的时候

// 因此我们可以只保存每天的加班时间，到月底只计算一次就好。。。
function currying(fn) {
  var allArgs = [];

  // 利用闭包，将allArgs一直保存在内存中
  return function next() {
    var args = [].slice.call(arguments);

    if (args.length > 0) {
      // 收集参数，进行缓存
      allArgs = allArgs.concat(args);
      return next;
    } else {
      // 符合执行条件，执行计算
      return fn.apply(null, allArgs);
    }
  };
}
var add = currying(function() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
});

// 因为是根据有无参数来决定是否执行计算，最后传空表示可以计算
// 参考下面方法四更简单
add(3.5)(4.5)(2.1)(); // 10.1

// 扩展：
// 实现 add(1)(2, 3)(4)(5) === 15 的效果。
// 此时怎么知道执行的时机呢？
// 其实，这里有个忍者技艺：valueOf和toString。
// js在获取当前变量值的时候，会根据语境，隐式调用valueOf和toString方法进行获取需要的值。
// 因此，代码如下(弊端是覆盖原型上的toString和valueOf，设计到隐式转换的都会触发)
function currying(fn) {
  var allArgs = [];

  function next() {
    var args = [].slice.call(arguments);
    allArgs = allArgs.concat(args);
    return next;
  }
  // 字符类型
  next.toString = function() {
    return fn.apply(null, allArgs);
  };
  // 数值类型
  next.valueOf = function() {
    return fn.apply(null, allArgs);
  };

  return next;
}
var add = currying(function() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
});

// 以下是几种柯力化方法，
// 方法一
let currying = (fn, length, ...args) =>
  args.length === length
    ? fn(...args)
    : currying.bind(null, fn, args.length, ...args);

// 方法二
const curry = (fn, arr = []) => (...args) =>
  (arg => (arg.length === fn.length ? fn(...arg) : curry(fn, arg)))([
    ...arr,
    ...args
  ]);

// 方法三
// 参考：https://juejin.im/post/5bf9bb7ff265da616916e816
const curry = fn => {
  if (fn.length <= 1) return fn;
  const generator = args =>
    args.length === fn.length ? fn(...args) : arg => generator([...args, arg]);

  return generator([], fn.length);
};
// 测试
const sum = (a, b, c) => a + b + c;
const curriedSum = curry(sum);
const res = curriedSum(1)(2)(3);
console.log(res); // 6

const log = (a, b, c) => {
  console.log(a, b, c);
};
const curriedLog = curry(log);
curriedLog("a")("b")("c"); // a b c

// 方法四
// 参考：https://juejin.im/post/5bf18715e51d45244939acc5
function curry(fn, ...args) {
  return (..._arg) => {
    return fn(...args, ..._arg);
  };
}
function sum() {
  let mySum = 0;
  for (let i = 0; i < arguments.length; i++) {
    mySum += arguments[i];
  }
  return mySum;
}
curry(sum, 1, 2)(); // 3
curry(sum, 1, 2, 3)(); // 6

// ---------反柯力化-------------
// 反柯里化的作用是，当我们调用某个方法，不用考虑这个对象在被设计时，
// 是否拥有这个方法，只要这个方法适用于它，我们就可以对这个对象使用它。
