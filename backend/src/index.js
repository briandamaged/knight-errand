
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



function look({sender, target}) {
  sender.inform(sender.location.description);
}



function lookHandler({sender, cmd}) {
  if(cmd.name === 'look') {
    return ()=> look({
      sender,
      target: cmd.target,
    });
  }
}




/**
 * Converts a raw input into a command
 * @param {string} raw 
 */
function decipher(raw) {
  const words = raw.toLowerCase().split(/\s+/);
  const first = words[0];
  const rest = words.slice(1);

  switch(first) {
    case 'look':
      return {
        name: 'look',
        target: rest,
      };
  }
}


const wss = new WebSocket.Server({
  port: 3000,
});

wss.on('connection', function connection(ws) {

  const player = new Player({
    engine,
    location: townSquare,
  });

  player.handlers.push(lookHandler);

  player.on('informed', function(development) {
    ws.send(development);
  });

  ws.on('message', function incoming(instruction) {
    const cmd = decipher(instruction);

    if(cmd) {
      player.dispatch(cmd);
    } else {
      player.inform("I didn't understand your instruction");
    }
  });

});
