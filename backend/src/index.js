
const WebSocket = require('ws');

const GameEngine = require('./GameEngine');
const Player = require('./Player');
const Location = require('./Location');


const engine = new GameEngine();


const townSquare = new Location({
  name: "Town Square",
  description: "It's really more of a Village Oval, if we're being honest.",
});

const inn = new Location({
  name: "The Inn",
  description: "It's okay.",
});



const player = new Player({
  engine,
  location: townSquare,
});




const wss = new WebSocket.Server({
  port: 3000,
});

wss.on('connection', function connection(ws) {

  engine.on('inform', function(msg) {
    ws.send(msg);
  });

  ws.on('message', function incoming(_cmd) {
    const cmd = JSON.parse(_cmd);

    player.dispatch(cmd);

  });

});
