
const WebSocket = require('ws');

const GameEngine = require('./GameEngine');
const Player = require('./Player');
const Location = require('./Location');

const {look} = require('./commands/look');

const engine = new GameEngine();


const townSquare = new Location({
  name: "Town Square",
  description: "It's really more of a Village Oval, if we're being honest.",
});

const inn = new Location({
  name: "The Inn",
  description: "It's okay.",
});







function lookHandler({sender, cmd}) {
  if(cmd.name === 'look') {
    return ()=> look({
      sender,
      target: cmd.target,
    });
  }
}




function eat({sender, target}) {
  if(!sender.blind) {
    sender.blind = true;
    sender.inform("You have gone blind.  Sorry!");

    setTimeout(function() {
      sender.blind = false;
      sender.inform("You can see again!");
    }, 5000);
  } else {
    sender.inform("Well, maybe you would if YOU COULD SEE!!!!")
  }
}


function eatHandler({sender, cmd}) {
  if(cmd.name === 'eat') {
    return ()=> eat({
      sender: sender,
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

    case 'eat':
      return {
        name: 'eat',
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
  player.handlers.push(eatHandler);

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
