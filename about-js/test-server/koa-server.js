const Koa = require('koa');
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();

const app = new Koa();

// app.use(async (ctx, next) => {
  // await next();
  // 参数ctx是由koa传入的封装了request和response的变量
  // next是koa传入的将要处理的下一个异步函数
  // ctx.response.type = 'text/html';
  // ctx.response.body = '<h1>hello koa2!</h1>'
// })


// 这种方式太蠢
app.use(async (ctx, next) => {
  if (ctx.request.path === '/index') {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.response.body = 'index page';
  } else {
      await next();
  }
});

// 使用koa-router
// add url-route:
router.get('/hello/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.set('Access-Control-Allow-Origin', '*');

  // 无法实现延时，也面报404错误
  // setTimeout(() => {
  //   ctx.response.body = `<h1>Hello,!</h1>`;
  //   next();
  // },2000)

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      ctx.response.body = `<h1>Hello,${name}!</h1>`;
      resolve(next())
    }, 2000)
  })
});

app.use(router.routes());

const port = 3010;
app.listen(port);
var uri = `http://localhost:${port}`;
console.log('Dev server listening at ' + uri + '\n')
