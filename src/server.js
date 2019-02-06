import Koa from 'koa'
import {xResponseTime, logger} from './examples/response-time';

const app = new Koa();

app.use(xResponseTime);
app.use(logger);
app.use(async ctx => {
  ctx.body = 'Hello world';
});


app.listen(3000, () => console.log('server started 3000'));

export default app;
