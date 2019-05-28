var http = require('http');

var httpServer = http.createServer(function (req ,res){
  console.log('req', req)

  res.writeHead(200 , )
})

httpServer.listen(9898);