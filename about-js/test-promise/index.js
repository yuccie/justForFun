// 手写promise
// 参考：https://juejin.im/post/5c6ad98e6fb9a049d51a0f5e
// 参考：https://juejin.im/post/5b2f02cd5188252b937548ab
// 都是基于PromiseA+规范：https://promisesaplus.com/

// 结构一需满足
// 1. new Promise(executor)中参数executor(执行器)是函数，且自动执行，
// 2. 执行器可执行resolve或者reject，且都是函数
class Promise {
  // 构造器
  constructor(executor) {
    // 成功
    let resolve = () => {};
    // 失败
    let reject = () => {};
    // 立即执行
    executor(resolve, reject);
  }
}

// 结构二需满足
// 1. 三种状态(state)：pending、fulfilled、rejected
// 2. pending为初态，可转化为fulfilled（成功态）和rejected（失败态）
// 3. 成功后，不可再转为其他状态，且必须有一个不可改变的值（value）
// 4. 失败后，不可再转为其他状态，且必须有一个不可改变的原因（reason）
// 5. resolve为成功，接收参数value，状态改变为fulfilled，不可再次改变。
// 6. reject为失败，接收参数reason，状态改变为rejected，不可再次改变。
// 7. 若是executor函数报错 直接执行reject();
class Promise {
  constructor(executor) {
    // 初始态
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    let resolve = value => {
      // 只有pending可变为其他
      if (this.state === "pending") {
        // 修改状态
        this.state = "fulfilled";
        this.value = value;
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
      }
    };

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
}

// 结构三需满足
// 1. 具有then方法，且then方法有两个参数onFulfilled,onRejected
// 2. 当状态是fulfilled，执行onFulfilled，传入value
// 3. 当状态是rejected，执行onRejected，传入reason
// 4. 如果onFulfilled,onRejected是函数，分别在对应状态改变后执行，
//    value或reason依次作为他们的第一个参数
class Promise1 {
  constructor(executor) {
    // 初始态
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;

    let resolve = value => {
      // 只有pending可变为其他
      if (this.state === "pending") {
        // 修改状态
        this.state = "fulfilled";
        this.value = value;
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
      }
    };

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
  }
}

// 测试一把
var p = new Promise1((resolve, reject) => {
  console.log("start");
  resolve("msg");
});

p.then(
  val => {
    console.log(val);
  },
  reason => {
    console.log(reason);
  }
);

console.log("end");
// 顺序还有问题
// start msg end

// 结构四需满足
// 结构三对于同步代码没有问题，但是异步则不行
// 1. 若处在pendding时就调用then，需将对应的回调存到各自数组
// 2. 当状态改变后，再执行数组中存的回调(类似订阅发布模式)
// 3. 一个promise可以有多个并列的then(不是链式)
class Promise2 {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    // 成功存放的数组
    this.onResolvedCallbacks = [];
    // 失败存放法数组
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        // 一旦resolve执行，调用成功数组的函数
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    // 如果executor执行报错，直接执行reject
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }
    // 和非pending态比，只是没有执行的函数而已
    if (this.state === "pending") {
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

// 结构五需满足
// 1. 满足链式new Promise().then().then()
// 1-1. 第一个then可返回一个promise，并传递给下一个then
// 1-2. 第一个then还可返回一个普通值，并传递给下一个then

// 2. 判断第一个then的返回值(这里用x代替)
// 2-1. 首先，要看x是不是promise。
// 2-2. 如果是promise，则取它的结果，作为新的promise2成功的结果
// 2-3. 如果是普通值，直接作为promise2成功的结果
// 2-4. 所以要比较x和promise2
// 2-5. resolvePromise的参数有promise2（默认返回的promise）、x（我们自己return的对象）、resolve、reject
// 2-6. resolve和reject是promise2的
class Promise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }
  then(onFulfilled, onRejected) {
    // 声明返回的promise2
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        // 注意x来自这里
        let x = onFulfilled(this.value);
        // resolvePromise函数，处理x和默认的promise2
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === "rejected") {
        let x = onRejected(this.reason);
        resolvePromise(promise2, x, resolve, reject);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          let x = onFulfilled(this.value);
          resolvePromise(promise2, x, resolve, reject);
        });
        this.onRejectedCallbacks.push(() => {
          let x = onRejected(this.reason);
          resolvePromise(promise2, x, resolve, reject);
        });
      }
    });
    // 返回promise，完成链式
    return promise2;
  }
}

// resolvePromise函数
// 规范规定一段代码，让不同的promise代码互相套用，这就是resolvePromise
// 1. 如果 x === promise2，则是会造成循环引用，自己等待自己完成，则报“循环引用”错误
// 2. 判断x
// 2-1. x 不能是null
// 2-2. x 是普通值 直接resolve(x)
// 2-3. x 是对象或者函数（包括promise），let then = x.then
// 2-4. 如果取then报错，则走reject()
// 2-5. 如果then是个函数，则用call执行then，第一个参数是this，后面是成功的回调和失败的回调
// 2-6. 如果成功的回调还是pormise，就递归继续解析
// 2-7. 成功和失败只能调用一个 所以设定一个called来防止多次调用
function resolvePromise(promise2, x, resolve, reject) {
  // 循环引用报错
  if (x === promise2) {
    // reject报错
    return reject(new TypeError("Chaining cycle detected for promise"));
  }
  // 防止多次调用
  let called;
  // x不是null 且x是对象或者函数
  if (x != null && (typeof x === "object" || typeof x === "function")) {
    try {
      // A+规定，声明then = x的then方法
      let then = x.then;
      // 如果then是函数，就默认是promise了
      if (typeof then === "function") {
        // 就让then执行 第一个参数是this 后面是成功的回调 和 失败的回调
        then.call(
          x,
          y => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            // resolve的结果依旧是promise 那就继续解析
            resolvePromise(promise2, y, resolve, reject);
          },
          err => {
            // 成功和失败只能调用一个
            if (called) return;
            called = true;
            reject(err); // 失败了就失败了
          }
        );
      } else {
        resolve(x); // 直接成功即可
      }
    } catch (e) {
      // 也属于失败
      if (called) return;
      called = true;
      // 取then出错了那就不要在继续执行了
      reject(e);
    }
  } else {
    resolve(x);
  }
}

// 结构六，其他问题
// 1. 规范规定onFulfilled,onRejected都是可选参数，如果他们不是函数，必须被忽略
// 1-1. onFulfilled返回一个普通的值，成功时直接等于 value => value
// 1-2. onRejected返回一个普通的值，失败时如果直接等于 value => value，
//      则会跑到下一个then中的onFulfilled中，所以直接扔出一个错误reason => throw err
// 2. 规范规定onFulfilled或onRejected不能同步被调用，必须异步调用。
// 2-1. 我们就用setTimeout解决异步问题
// 2-2. 如果onFulfilled或onRejected报错，则直接返回reject()
class Promise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    let resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };
    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    // onFulfilled如果不是函数，就忽略onFulfilled，直接返回value
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : value => value;
    // onRejected如果不是函数，就忽略onRejected，直接扔出错误
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : err => {
            throw err;
          };
    let promise2 = new Promise((resolve, reject) => {
      if (this.state === "fulfilled") {
        // 异步
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "rejected") {
        // 异步
        setTimeout(() => {
          // 如果报错
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        }, 0);
      }
      if (this.state === "pending") {
        this.onResolvedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
        this.onRejectedCallbacks.push(() => {
          // 异步
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (e) {
              reject(e);
            }
          }, 0);
        });
      }
    });
    // 返回promise，完成链式
    return promise2;
  }
}

// Promise.resolve方法
Promise.resolve = function(val) {
  return new Promise((resolve, reject) => {
    resolve(val);
  });
};
// Promise.reject方法
Promise.reject = function(val) {
  return new Promise((resolve, reject) => {
    reject(val);
  });
};
// Promise.race方法
Promise.race = function(promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(resolve, reject);
    }
  });
};
// Promise.all方法(获取所有的promise，都执行then，把结果放到数组，一起返回)
Promise.all = function(promises) {
  let arr = [];
  let i = 0;
  function processData(index, data) {
    arr[index] = data;
    i++;
    if (i == promises.length) {
      resolve(arr);
    }
  }
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(data => {
        processData(i, data);
      }, reject);
    }
  });
};

// 可以用promises-aplus-tests包测试
