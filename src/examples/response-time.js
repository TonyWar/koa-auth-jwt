const debug = require('debug')('koa:test');

// x-response-time
export async function xResponseTime (ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
}

// logger

export async function logger (ctx, next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  debug(`${ctx.method} ${ctx.url} - ${ms}ms`);
  if (!debug.enabled) {
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
  }
}