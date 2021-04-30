const { getOptions } = require('loader-utils')

module.exports = function(source) {

    let opts = getOptions(this)
    console.log(opts, 'opts')
    // { name: 'rawLoader' } opts
    // 这个编码为2028的字符为行分隔符，会被浏览器理解为换行，
    // 而在Javascript的字符串表达式中是不允许换行的，从而可能导致错误。
    // 2029是段落分隔符
    let res = JSON.stringify(source)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
    
    // return `export default ${res}`
    this.callback(null, res, 1, 2)
}