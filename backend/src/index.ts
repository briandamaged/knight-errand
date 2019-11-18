
import WebSocket from 'ws';

import GameEngine from './GameEngine';

import {
  createWorld,
} from './world';

import {
  Command, Character, CommandContext,
} from './models';

import { resolveNavigation, resolveNavigationInstructions } from './plugins/navigation';
import { resolveInventoryCommands, resolveInventoryInstructions } from './plugins/items';
import { resolveDescriptionCommands, resolveDescriptionInstructions } from './plugins/description';
import { resolveInterpretCommand } from './plugins/interpreter';
import { Chain } from './plugins/utils';
import { resolveConsumableInstructions, resolveConsumableCommands } from './plugins/consumables';



const engine = new GameEngine({
  _parseInstruction: Chain([
    resolveDescriptionInstructions,
    resolveNavigationInstructions,
    resolveInventoryInstructions,
    resolveConsumableInstructions,
  ]),
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
engine.install(resolveConsumableCommands);


wss.on('connection', function connection(ws) {

  // FIXME: Ability to instantiate a Character without a currentLocationID
  const player = engine.createCharacter({
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
