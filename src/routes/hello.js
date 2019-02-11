import Router from 'koa-router'
const router = new Router({ prefix: '/hello' });

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello world'
})

export default router;