var fs = require("fs");

// node服务的进程
console.log("process.cwd()", process.cwd());

// 读取文件，并转换为utf-8编码格式，不区分大小写
// fs.readFile('./justForFun/about-js/use-vscode-debug/a.text', 'UTF-8', (err ,data) => {
//   if(err){
//     console.log('typeof err' ,typeof err);
//     console.log(err ,'err');
//   }else{
//     console.log('data' ,data);
//   }
// })

// Buffer二进制格式与String格式相互转化
// fs.readFile('./justForFun/about-js/use-vscode-debug/a.text', (err ,data) => {
//   if(err){
//     console.log('typeof err' ,typeof err);
//     console.log(err ,'err');
//   }else{
//     console.log('data' ,data.toString('utf8'));
//     console.log('butter' ,Buffer.from(data ,'utf8') );
//   }
// })

// 写入文件，是全部替换
// fs.writeFile('./justForFun/about-js/use-vscode-debug/a.text' , 'writeFile' ,(err ,msg) => {
//   if(err){
//     console.log('writeFile err' ,err);
//   }else{
//     console.log('writeFile ok' ,msg);
//   }
// })

// 判断是否文件及文件夹
// fs.stat('./justForFun/about-js/use-vscode-debug/a.text', function (err, stat) {
//   if (err) {
//       console.log(err);
//   } else {
//       // 是否是文件:
//       console.log('isFile: ' + stat.isFile());
//       // 是否是目录:
//       console.log('isDirectory: ' + stat.isDirectory());
//       if (stat.isFile()) {
//           // 文件大小:
//           console.log('size: ' + stat.size);
//           // 创建时间, Date对象:
//           console.log('birth time: ' + stat.birthtime);
//           // 修改时间, Date对象:
//           console.log('modified time: ' + stat.mtime);
//       }
//   }
// });

// 数据流
// var rs = fs.createReadStream('./aa.md', 'utf-8');

// rs.on('data', function (chunk) {
//     console.log('DATA:')
//     console.log(chunk);
// });

// rs.on('end', function () {
//     console.log('END');
// });

// rs.on('error', function (err) {
//     console.log('ERROR: ' + err);
// });

// var ws1 = fs.createWriteStream('./aa.md', 'utf-8');
// ws1.write('使用Stream写入文本数据...\n');
// ws1.write('END.');
// ws1.end();

// var ws2 = fs.createWriteStream('./aa.md');
// ws2.write(new Buffer('使用Stream写入二进制数据...\n', 'utf-8'));
// ws2.write(new Buffer('END.', 'utf-8'));
// ws2.end();

// // ---------读完文件再写到另外一个文件里
// var rs = fs.createReadStream("./aa.md");
// var ws = fs.createWriteStream("./bb.md");

// rs.pipe(ws);

// // 写入的比较慢，因此延时打印
// setTimeout(() => {
//   var readF = fs.createReadStream("./bb.md", "utf-8");
//   readF.on("data", function(chunk) {
//     console.log("DATA:");
//     console.log(chunk);
//   });

//   readF.on("end", function() {
//     console.log("END");
//   });
// }, 1000);


// ---------http服务
// var http = require('http');

// var server = http.createServer((req ,res) => {
//   // 获得http请求的method和url
//   console.log('req.method' , req.method);
//   console.log('req.url' , req.url);

//   fs.writeFile('./req.text' , req ,(err ,msg) => {
//   if(err){
//     console.log('writeFile err' ,err);
//   }else{
//     console.log('writeFile ok' ,msg);
//   }
// })

//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.end('hello world');
// })

// server.listen(9898);
// console.log('Server is running at http://127.0.0.1:9898/')


// ---------crypto数据加密
const crypto = require('crypto');

const hash = crypto.createHash('md5');

hash.update('Hello, world!');
hash.update('Hello, nodejs!');
console.log('Hello, world!' , hash.update('Hello, world!'))
console.log('Hello, nodejs!' , hash.update('Hello, nodejs!'))

console.log(hash.digest('hex'));