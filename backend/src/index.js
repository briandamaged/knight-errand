
const WebSocket = require('ws');

const GameEngine = require('./GameEngine');
const Player = require('./Player');
const Location = require('./Location');

const {look} = require('./commands/look');
const {eat} = require('./commands/eat');
const {inventory} = require('./commands/inventory');

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



function eatHandler({sender, cmd}) {
  if(cmd.name === 'eat') {
    return ()=> eat({
      sender: sender,
      target: cmd.target,
    });
  }
}


function inventoryHandler({sender, cmd}) {
  if(cmd.name === 'inventory') {
    return ()=> inventory({sender});
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

    case 'inventory':
    case 'items':
      return {
        name: 'inventory',
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

  player.inventory.push({
    name: "apple",
    beEatenBy(sender) {
      sender.blind = true;
      sender.inform("Oops.  It looks like the apple had already expired.  You're blind now.  Congrats.");

      setTimeout(function() {
        sender.blind = false;
        sender.inform("Phew -- you can see again!");
      }, 10000);
    }
  });


  player.inventory.push({
    name: "mushroom",
    beEatenBy(sender) {
      sender.hallucinating = true;
      sender.inform("That mushroom tasted like purple, but with dragonfly emeralds.")

      setTimeout(function() {
        sender.hallucinating = false;
        sender.inform("The world is boring again.");
      }, 10000);
    }
  })

  player.handlers.push(lookHandler);
  player.handlers.push(eatHandler);
  player.handlers.push(inventoryHandler);

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
