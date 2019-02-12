import Router from 'koa-router'
import convert from 'koa-convert';
import KoaBody from 'koa-body';

const router = new Router({ prefix: '/collection' });
const koaBody = convert(KoaBody());

const collection = [];
for (let i = 0; i < 1000; i++) {
  collection.push({
    id: i,
    text: `this is ${i + 1} item of collection`
  });
}

const defaultPagination = {
  page: 1,
  per_page: 100,
}

function generateLinkHeaderOfCollection(defaultPagination) {
  return async function addLinkHeadersOfCollection (ctx, next) {
    const pagination = Object.assign({}, defaultPagination, ctx.query);
    pagination.page--;

    const linkPrefix = ctx.origin + ctx.path;
    const lastPage = Math.ceil(collection.length / pagination.per_page);

    const nextLink = pagination.page + 1 < lastPage ? `<${linkPrefix}/?page=${pagination.page + 2}&per_page=${pagination.per_page}>; rel="next",` : '';
    const lastLink = `<${linkPrefix}/?page=${lastPage}&per_page=${pagination.per_page}>; rel="last",`;
    const firstLink = `<${linkPrefix}/?page=${1}&per_page=${pagination.per_page}>; rel="first",`;
    const prevLink = pagination.page + 1 > 1 ? `<${linkPrefix}/?page=${pagination.page}&per_page=${pagination.per_page}>; rel="prev",` : '';

    ctx.set(`Link`, nextLink + lastLink + firstLink + prevLink);
    await next();
  }
}

function generateGetCollection(defaultPagination) {
  return async function getCollection(ctx, next) {
    const pagination = Object.assign({}, defaultPagination, ctx.query);
    pagination.page--;
    ctx.body = collection.slice(pagination.page * pagination.per_page, pagination.page * pagination.per_page + pagination.per_page);
  }
}

async function checkItemId(ctx, next) {
  const item = collection.find(item => item.id == ctx.params.id);
  if (!item) {
    ctx.status = 404;
    ctx.body = {
      message: 'Item not found'
    }
  } else {
    await next();
  }
}

router.get('/', generateLinkHeaderOfCollection(defaultPagination), generateGetCollection(defaultPagination));
router.get('/:id', checkItemId, async (ctx, next) => {
  const item = collection.find(item => item.id == ctx.params.id);
  ctx.body = item;
});
router.post('/', koaBody, async (ctx, next) => {
  if (collection.find(item => item.id == ctx.request.body.id)) {
    ctx.status = 409;
    ctx.body = {
      message: 'Item already exists'
    }
    return;
  }
  collection.push(ctx.request.body);
  ctx.status = 201;
  ctx.body = ctx.request.body;
})
router.put('/:id', koaBody, checkItemId, async (ctx, next) => {
  collection[collection.findIndex(item => item.id == ctx.params.id)] = ctx.request.body;
  ctx.status = 204;
  ctx.body = ctx.request.body;
})
router.delete('/:id', koaBody, checkItemId, async (ctx, next) => {
  collection.splice(ctx.params.id, 1);
  ctx.status = 204;
  ctx.body = {
    message: 'Successfull remove item'
  }
})

export default router;