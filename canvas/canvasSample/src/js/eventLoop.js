setTimeout(function() {
	console.log(1)
	new Promise(function(resolve){
		console.log(3)
		setTimeout(function(){
			console.log(5)
		})
		resolve();
	}).then(function(){
		console.log(4)
	});	
});

Promise.resolve().then(function(){
  console.log(9)
  Promise.resolve().then(function(){
    console.log(11)
  })
	setTimeout(function(){
		console.log(10)
	})
})

setTimeout(function() {
	console.log(2)
	new Promise(function(resolve){
		console.log(6)
		setTimeout(function(){
			console.log(7)
		})
		resolve();
	}).then(function(){
		console.log(8)
	});			
});