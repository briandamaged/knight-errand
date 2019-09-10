
const WebSocket = require('ws');

const GameEngine = require('./GameEngine');
const Player = require('./Player');
const Location = require('./Location');


const engine = new GameEngine();

const townSquare = new Location({
  name: "Town Square",
  description: "It's really more of a Village Oval, if we're being honest.",
});

const player = new Player({
  engine,
  location: townSquare,
});




const wss = new WebSocket.Server({
  port: 3000,
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    ws.send(`
${townSquare.name}
-------
${townSquare.description}
    `);
    console.log('received: %s', message);
  });

});
