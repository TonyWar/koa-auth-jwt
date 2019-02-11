import Koa from 'koa'
import router from './routes'

import errorHandler from './middlewares/basic-error-handler'

const app = new Koa();

app.use(errorHandler);
app.use(router());

app.listen(3000, () => console.log('server started 3000'));

export default app;
