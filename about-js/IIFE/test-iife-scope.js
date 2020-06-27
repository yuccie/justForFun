
// 1、会打印5个5
// for(var i = 0; i < 5; i++){
//   setTimeout(function(){
//     console.log(i)
//   })
// }

// 1.1、利用闭包,虽然每次()()都新建一个作用域，但作用域内没有定义变量i
// 因此依然引用的是for循环的i，因此还是5个5
// for(var i = 0; i < 5; i++){
//   (function(){
//     setTimeout(function(){
//       console.log(i)
//     })
//   })()
// }


// 1.2、这里每次都会传入一个i，然后每次又都会重新建一个作用域
// 因此会打印：0，1，2，3，4
// for(var i = 0; i < 5; i++){
//   (function(i){
//     setTimeout(function(){
//       console.log(i)
//     })
//   })(i)
// }

// 1.2-1、当然还可以这样如下理解，相当于每次都去for循环里取值，
// 然后在自调用函数重新定义变量
// for(var i = 0; i < 5; i++){
//   (function(){
//     var j = i
//     setTimeout(function(){
//       console.log(j)
//     })
//   })()
// }

// 总结：上面运用的原理无非是通过自调用自调用函数，每次生成一个新的作用域
// 其实也就是每次迭代都需要一个块级作用域，因此可以利用let

for(let i = 0; i < 5; i++){
  // 既然let声明是块级，就不要自调用函数再声明了
  // (function(){
    setTimeout(function(){
      console.log(i)
    })
  // })()
}