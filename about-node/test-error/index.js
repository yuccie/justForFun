// 在node里，很多事件都是异步，导致无法通过try catch捕获到错误，因此一般都用回调的方式，将错误返回过来

// 不能捕获的场景：因为函数体内是setTimeout，是另外一个时间循环
// try {
//     catchError(function(res) {
//         console.log('res')
//     })
// } catch(err) {
//     console.log('err', err)
// }

// function catchError(cb) {
//     const random = Math.random();
//     setTimeout(() => {
//         if (random < 0.8) {
//             throw new Error('执行错误')
//         }
//         cb('真棒');
//     }, 1000)
// }


// 可以捕获场景：
// try {
    catchError(function(err, res) {
        if (err instanceof Error) {
            console.log('不好意思，出错了', err)
            return
        }
        console.log('res', res)
    })
// } catch(err) {
//     console.log('err', err)
// }

function catchError(cb) {
    const random = Math.random();
    setTimeout(() => {
        if (random < 0.8) {
            // throw new Error('执行错误')
            // 使用cb将错误抛出去，因此参数一一般都是异常
            cb(Error('执行错误'))
        }
        cb('真棒');
    }, 1000)
}
