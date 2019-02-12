import Router from 'koa-router'
import convert from 'koa-convert';
import KoaBody from 'koa-body';
import generateRest from '../libs/rest-generator';
import testCrud from '../libs/test-crud'

const router = generateRest(testCrud, {
  prefix: '/collection',
  paginationConfig: {
    page: 1,
    per_page: 100
  }
})

export default router;