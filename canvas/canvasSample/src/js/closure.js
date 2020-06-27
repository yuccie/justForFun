let a = () => {
  let time = new Date().getTime();
  let num = 0;
  return () => {
    console.log(num++);
  }
};

let b = a();

let c = a();

console.log( b === c );

console.log(typeof b);



//b();

//b();


let throttle = (func, wait) => {
  let startTime = 0;
  let timer;
  return () => {
    let durationTime = new Date() - startTime;
    let args = arguments;
    let context = this;
    if (durationTime > wait) {
      clearTimeout(timer);
      func.apply(this, args);
      startTime = new Date().getTime();
    } else {
      clearTimeout(timer);
      timer = setTimeout(func, wait - durationTime);
    }
  }
};

let resize = () => {

}

throttle(resize, 500);
