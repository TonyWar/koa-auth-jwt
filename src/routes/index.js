import combineRouters from '../libs/combine-routers';
import helloRouter from './hello'

const router = combineRouters(
  helloRouter
);

export default router;