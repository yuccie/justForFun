var http = require('http');

var server = http.createServer((req, res) => {
  res.setHeader('Set-Cookie', ['haveExpires=du;expires=50000;Max-Age=60','noExpires=test;']);
  if(req.url === '/'){
    res.end('hello world')
  }else if(req.url === '/test'){
    res.end('this is test')
  }else{
    res.end('this is default')
  }
})

server.listen(9898);
console.log('server listening 9898');