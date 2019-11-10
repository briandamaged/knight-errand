
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN, Handler, Rule, DO_NOTHING, DepthFirstResolver,
} from 'conditional-love';

import GameEngine from './GameEngine';

import {createParser} from './Parser';

import {
  createWorld,
} from './world';

import {
  Command, Character, CommandContext, HelpCommand, ResetCommand,
} from './models';

import { resolveNavigation } from './plugins/navigation';
import { resolveInventoryCommands } from './plugins/items';
import { resolveDescriptionCommands } from './plugins/description';
import { resolveInterpretCommand } from './plugins/interpreter';



const engine = new GameEngine({
  parseInstruction: createParser(),
});

createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});


engine.install(resolveInterpretCommand);
engine.install(resolveDescriptionCommands);
engine.install(resolveNavigation);
engine.install(resolveInventoryCommands);


wss.on('connection', function connection(ws) {

  // FIXME: Ability to instantiate a Character without a currentLocationID
  const player = new Character({
    currentLocationID: "townSquare",
  });

  player.on('informed', function(message) {
    ws.send(message);
  });

  player.on('entered', function(this: Character, location) {
    if(this.autolook) {
      engine.handleCommand({
        sender: player,
        command: {
          name: "look",
        }
      });
    }
  });

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    engine.handleCommand({
      sender: player,
      command: command,
    });
  });

});


console.log("Launched");
