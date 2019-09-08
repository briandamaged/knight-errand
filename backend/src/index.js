
const http = require('http');

const WebSocket = require('ws');
const Koa = require('koa');

const app = new Koa();

app.use(function(ctx) {
  ctx.body = {
    status: "OK!",
  };
});

const wss = new WebSocket.Server({
  noServer: true,
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  let i = 0;
  setInterval(function() {
    ws.send(`${++i}`);
  }, 1000);

});


const server = http.createServer(app.callback());

server.on('upgrade', function(request, socket, head) {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    wss.emit('connection', ws, request);
  });
});



server.listen(3000, function() {
  console.log("Listening");
});


