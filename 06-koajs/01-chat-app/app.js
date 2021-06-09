const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const Router = require('koa-router');

const app = new Koa();

app.use(static(path.join(__dirname, 'public')));
app.use(bodyParser());

const router = new Router();

let resolvers = [];

router.get('/subscribe', async (ctx, next) => {
  ctx.set('Content-Type', 'text/plain;charset=utf-8');
  ctx.response.status = 200;
  ctx.response.body = await new Promise((r) => resolvers.push(r));
  next();
});

router.post('/publish', async (ctx) => {
  const message = ctx.request.body.message;

  if (message) {
    resolvers.forEach((resolve) => resolve(message));
    resolvers = [];
  }

  ctx.response.status = 200;
});

app.use(router.routes());

module.exports = app;
