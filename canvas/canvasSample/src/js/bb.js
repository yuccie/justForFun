console.log('start')

setTimeout( function () {
  console.log('setTimeout')
}, 0 )

Promise.resolve().then(function() {
  console.log('promise1');
  return new Promise(function(resolve) {
    process.nextTick(resolve);
  })
}).then(function() {
  console.log('promise2');
  return process.nextTick(console.log)
}).then(function(){
  console.log('promise3');
});

console.log('end')