import Router from 'koa-router'
const router = new Router({ prefix: '/collection' });

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

async function getCollection (ctx, next) {
  const pagination = Object.assign({}, defaultPagination, ctx.query);
  pagination.page--;

  const linkPrefix = ctx.origin + ctx.path;
  const lastPage = Math.ceil(collection.length / pagination.per_page);

  const nextLink = pagination.page + 1 < lastPage ? `<${linkPrefix}/?page=${pagination.page + 2}&per_page=${pagination.per_page}>; rel="next",` : '';
  const lastLink = `<${linkPrefix}/?page=${lastPage}&per_page=${pagination.per_page}>; rel="last",`;
  const firstLink = `<${linkPrefix}/?page=${1}&per_page=${pagination.per_page}>; rel="first",`;
  const prevLink = pagination.page + 1 > 1 ? `<${linkPrefix}/?page=${pagination.page}&per_page=${pagination.per_page}>; rel="prev",` : '';

  ctx.set(`Link`, nextLink + lastLink + firstLink + prevLink);

  ctx.body = collection.slice(pagination.page * pagination.per_page, pagination.page * pagination.per_page + pagination.per_page);
}

router.get('/', getCollection);

export default router;