function sayHi(user) {
  alert(`Hello, ${user}!`);
}
module.exports = ccc;

// 就像我们在函数之前添加了 "export default" 一样
export {sayHi as default};