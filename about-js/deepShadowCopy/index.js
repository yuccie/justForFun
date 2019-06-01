// 其实Object.create()作为ES5的api只是规范化了原型式继承的方式
// 如下是原型式继承的模式
function object(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

// Object.create()还有一个参数，与Object.defineProperties()的参数二相同
var person = {
  name: "Nicholas",
  friends: ["Shelby", "Court", "Van"]
};

var anotherPerson = Object.create(person, {
  name: {
    value: "Greg"
  }
});

alert(anotherPerson.name); //"Greg"

// 浅拷贝
function shadowCopy(obj) {
  // 必须有一个参数（对象或null），作为新建对象的原型
  let dest = Object.create(null);
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      dest[prop] = obj[prop];
    }
  }
  return dest;
}

// 有缺陷的深拷贝方案一
function deepClone1(obj) {
  let dest = Object.create(null);

  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      typeof obj[prop] === "object"
        ? (dest[prop] = deepClone1(obj[prop]))
        : (dest[prop] = obj[prop]);
    }
  }

  return dest;
}

var obj = {
  name: "joan",
  arr: [{ prop: "arr1" }],
  a: {
    aa: "aaa"
  }
};

var objCopy = deepClone1(obj);
objCopy.arr[0].prop = "数组属性改变";
objCopy.a.aa = "bbb";

console.log(objCopy);
// a: {aa: "bbb"}
// arr:[{prop: "数组属性改变"}]
// name: "joan"
console.log(obj);
// a: {aa: "aaa"}
// arr:[{prop: "arr1"}]
// name: "joan"

// 方案一的问题点
// 无法复制不可枚举的属性及Symbol类型
// 只针对了Object类型的做了迭代，但Array,Date,RegExp,Error,Function无法拷贝
// 对象有循环引用的问题 (如：obj.a = obj)
var obj = {
  num: 0,
  str: "",
  boolean: true,
  unf: undefined,
  nul: null,
  obj: {
    name: "我是一个对象",
    id: 1
  },
  arr: [0, 1, 2],
  func: function() {
    console.log("我是一个函数");
  },
  date: new Date(0),
  reg: new RegExp("/我是一个正则/ig"),
  [Symbol("1")]: 1
};

Object.defineProperty(obj, "innumerable", {
  enumerable: false,
  value: "不可枚举属性"
});

// 有何意义？
obj = Object.create(obj, Object.getOwnPropertyDescriptors(obj));

obj.loop = obj;

function deepCopy(target) {
  let copyed_objs = []; //此数组解决了循环引用和相同引用的问题，它存放已经递归到的目标对象
  return function _deepCopy(target) {
    if (typeof target !== "object" || !target) {
      return target;
    }
    for (let i = 0; i < copyed_objs.length; i++) {
      // 如果当前对象与数组中的对象相同，则不对其递归
      if (copyed_objs[i].target === target) {
        return copyed_objs[i].copyTarget;
      }
    }
    let obj = {};
    if (Array.isArray(target)) {
      obj = []; //处理target是数组的情况
    }
    copyed_objs.push({ target: target, copyTarget: obj });
    Object.keys(target).forEach(key => {
      if (obj[key]) {
        return;
      }
      obj[key] = _deepCopy(target[key]);
    });
    return obj;
  };
}

var cloneObj = deepCopy(obj);

console.log("obj", obj);
console.log("cloneObj", cloneObj);

for (let key of Object.keys(cloneObj)) {
  if (
    typeof cloneObj[key] === "object" ||
    typeof cloneObj[key] === "function"
  ) {
    console.log(`${key}相同吗？ `, cloneObj[key] === obj[key]);
  }
}
