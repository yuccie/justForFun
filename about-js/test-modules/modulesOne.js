export function sayHi(str = 'hello') {
  console.log(str)
}

export let one = 'oned';

setTimeout(() => one = 'two', 2000)

setTimeout(() => console.log(one, '5s'), 5000)

console.log(Object.getOwnPropertyDescriptors(one), 'aa', this)