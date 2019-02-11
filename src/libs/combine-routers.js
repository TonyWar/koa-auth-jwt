import compose from 'koa-compose';

export default function combineRouters(routers) {
  return () => {
    if (!Array.isArray(routers)) {
      routers = [...arguments];
    }
    const middleware = [];

    routers.forEach(router => {
      middleware.push(router.routes());
      middleware.push(router.allowedMethods());
    });

    return compose(middleware);
  }
}