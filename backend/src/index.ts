
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
  Command, RawCommand, GoCommand, Character, CommandContext, LookCommand, HelpCommand, AutoLookCommand, GetCommand, ItemsCommand, DropCommand, ResetCommand,
} from './models';
import { NavigationPlugin } from './plugins/navigation';



const engine = new GameEngine();

createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});


const parseInstruction = createParser();





function* ParserResolver(ctx: CommandContext<Command>) {
  if(ctx.command.name === "raw") {
    yield function(_ctx: CommandContext<Command>) {
      const rawCommand = _ctx.command as RawCommand;
      const newCommand = parseInstruction(rawCommand.content);
  
      if(newCommand) {
        engine.handleCommand({
          sender: ctx.sender,
          command: newCommand,
        })
      }
    }
  }
}

function* DescriptionResolver(ctx: CommandContext<Command>) {
  if(ctx.command.name === "look") {
    yield function(ctx: CommandContext<Command>) {
      engine.look({
        sender: ctx.sender
      })
    }
  }
}



engine.install(ParserResolver);
engine.install(DescriptionResolver);
engine.install(NavigationPlugin(engine));

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

    const commandContext: CommandContext<Command> = {
      sender: player,
      command: command,
    };

    engine.handleCommand(commandContext);
  });

});


console.log("Launched");
