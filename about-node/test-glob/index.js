const glob = require('glob')

// 测试同步io，比较耗时，同步为sync调用
console.time('glob sync')
// const result = glob.sync('./', '**/*')
result = glob.sync(__dirname, '/**/*') // 
// const result = glob.sync("**/*.js") // 上面二者打印不出来数据，因为参数而是选项，错，注意**globstar模式，前面是有/的，可以打印出路径来验证
console.timeEnd('glob sync')
console.log(result)


// 异步io，
console.time('glob')
console.log(__dirname + "/**/*")
glob(__dirname + "/**/*", function(err, data){
    console.log('data', data)
})
console.timeEnd('glob')
console.log('首先执行')
