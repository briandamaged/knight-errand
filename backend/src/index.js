
const Koa = require('koa');

const app = new Koa();

app.use(function(ctx) {
  ctx.body = {
    status: "OK!",
  };
});


app.listen(3000, function() {
  console.log("Running on port 3000");
});
