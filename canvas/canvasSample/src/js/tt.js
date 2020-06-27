Promise.resolve().then(function(){
  setTimeout(function(){
    console.log(1)
  })
});

new Promise(function(resolve){
  setTimeout(function(){
    console.log(3)
  })
  resolve()
}).then(function(){
  console.log(4)
})

setTimeout(function(){
  console.log(2)
})