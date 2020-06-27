
// http://nodejs.cn/learn 入门教程
const http = require('http');
const fs = require('fs');

const port = 6060;
const host = '127.0.0.1'

const server = http.createServer((req, res) => {
  const { url } = req;

  switch (url) {
    case '/scriptError.js':
      res.writeHead(200, {
        "Content-Type": "text/plain;charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      })
      // 可以直接执行 js 代码，因此防止xss攻击
      res.end('throw new Error("会有错误的代码块")')
      break;
    default:
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello nothing');
  }
})

server.listen(port, () => {
  console.log(`server listening ${host}:${port}`);
})