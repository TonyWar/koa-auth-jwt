app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = {
      message: err.message
    };
  }
})

router.use('/fetch', function (ctx, next) {
  return next().then(function () {
    console.log('Middleware done'); 
  }); 
});

router.get('/fetch', function (ctx, next) {
  models.Book.findById(parseInt(ctx.query.id)).then(function (book) {
    ctx.body = book;
    console.log('Body set');
  });
});