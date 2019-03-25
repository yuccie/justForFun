let count = 0;

let a = async function(time) {
  await new Promise(function(resolve){
    setTimeout(resolve, time);
  });
};

let b = async function(time) {
  await a(time);
  count++;
  console.log(count)
};

let f = function() {
  let t = setInterval(async function(){
    let start = new Date();
    await b(200);
    let duration = new Date() - start;
    console.log(duration);
    if (count > 0) {
      clearInterval(t);
    }
  }, 100);

};

f();


