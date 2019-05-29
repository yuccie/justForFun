function A() {}
function B() {
  A.call(this);
}
function Temp() {}

Temp.prototype = A.prototype;

B.prototype = new Temp();
// 是否与下面相同。。。这特么有什么意义？
// 这不是让另外两个的原型都继承自A.prototype
B.prototype = new A();
