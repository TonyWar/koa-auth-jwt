import combineRouters from '../libs/combine-routers';
import helloRouter from './hello'
import collectionRouter from './collection'

const router = combineRouters(
  helloRouter,
  collectionRouter
);

export default router;