
const WebSocket = require('ws');


const wss = new WebSocket.Server({
  port: 3000,
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ws.send(`COMMAND WAS: ${message}`);
    console.log('received: %s', message);
  });

});
