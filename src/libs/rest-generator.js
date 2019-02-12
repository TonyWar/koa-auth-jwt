import Router from 'koa-router'
import convert from 'koa-convert';
import KoaBody from 'koa-body';

function generateLinkHeaderOfCollection(collectionCrud, paginationConfig) {
  return async function addLinkHeadersOfCollection(ctx, next) {
    const pagination = Object.assign({}, paginationConfig, ctx.query);
    pagination.page--;

    const collection = await collectionCrud.getAll();

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

function generateIsItemExist(collectionCrud) {
  return async function isItemExist(ctx, next) {
    const item = await collectionCrud.get(ctx.params.id);
    if (!item) {
      ctx.status = 404;
      ctx.body = {
        message: 'Item not found'
      }
      return;
    }
    await next();
  }
}

function generateIsItemNotExist(collectionCrud) {
  return async function isItemNotExist(ctx, next) {
    const item = await collectionCrud.get(ctx.params.id);
    if (item) {
      ctx.status = 409;
      ctx.body = {
        message: 'Item already exist'
      }
      return;
    }
    await next();
  }
}

function generateGetAllMethod(collectionCrud, paginationConfig) {
  return async function getCollection(ctx, next) {
    const pagination = Object.assign({}, paginationConfig, ctx.query);
    pagination.page--;
    const startItem = pagination.page * pagination.per_page;
    const lastItem = startItem + pagination.per_page
    const collection = await collectionCrud.getAll();
    ctx.body = collection.slice(startItem, lastItem);
  }
}

function generateGetItem(collectionCrud) {
  return async (ctx, next) => {
    const item = await collectionCrud.get(ctx.params.id);
    ctx.body = item;
  }
}

function generateCreateItem(collectionCrud) {
  return async (ctx, next) => {
    const item = await collectionCrud.create(ctx.request.body)
    ctx.status = 201;
    ctx.body = item;
  }
}

function generateUpdateItem(collectionCrud) {
  return async (ctx, next) => {
    const item = await collectionCrud.update(ctx.params.id, ctx.request.body)
    ctx.status = 204;
  }
}

function genereteDeleteItem(collectionCrud) {
  return async (ctx, next) => {
    const removedItem = await collectionCrud.delete(ctx.params.id);
    ctx.status = 204;
  }
}

const generateRest = (
  collectionCrud,
  config = {
    prefix: '/collection',
    paginationConfig: {
      page: 1,
      per_page: 100,
    }
  }
) => {
  const { prefix, paginationConfig } = config;
  const router = new Router({ prefix });
  const koaBody = convert(KoaBody());

  const checkIsItemExist = generateIsItemExist(collectionCrud);

  router.get('/', generateLinkHeaderOfCollection(collectionCrud, paginationConfig), generateGetAllMethod(collectionCrud, paginationConfig));
  router.get('/:id', checkIsItemExist, generateGetItem(collectionCrud));
  router.post('/', koaBody, generateCreateItem(collectionCrud));
  router.put('/:id', koaBody,  checkIsItemExist, generateUpdateItem(collectionCrud));
  router.delete('/:id', koaBody, checkIsItemExist, genereteDeleteItem(collectionCrud));

  return router;
}

export default generateRest;