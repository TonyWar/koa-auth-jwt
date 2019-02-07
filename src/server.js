import Koa from 'koa'

const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello world';
});


app.listen(3000, () => console.log('server started 3000'));

export default app;
