
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN, Handler, Rule,
} from 'conditional-love';

import GameEngine from './GameEngine';

import {
  createWorld,
} from './world';

import {
  Command, RawCommand, GoCommand, Character, CommandContext, LookCommand,
} from './models';



const engine = new GameEngine();

createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});


function parseInstruction(instruction: string): Command | undefined {
  const words = instruction.split(/\s+/);

  const [first, ...rest] = words;

  switch(first) {
    case "look":
      return {
        name: "look",
      };

    case "go":
      // TODO: Figure out a way to declare a type on a temporary variable
      //       without having to provide the variable w/ a name.
      const cmd: GoCommand = {
        name: "go",
        direction: rest[0],
      };

      return cmd;
  }

}

interface CommandHandler<CMD extends Command> {
  (name: string, handler: Handler<[CMD], void>): void,
}

function CommandRule<T extends Command>(name: string, handler: Handler<[CommandContext<T>], void>) {
  function rule(cmdContext: CommandContext<Command>): Handler<[CommandContext<Command>], void> | undefined {
    if(cmdContext.command.name === name) {
      return function(_cmdContext: CommandContext<Command>) {
        return handler(_cmdContext as CommandContext<T>);
      }
    }
  }

  return rule;
}


wss.on('connection', function connection(ws) {

  const player = new Character({
    currentLocationID: "townSquare",
  });

  player.on('informed', function(message) {
    ws.send(message);
  });

  const handleCommand = Dispatcher<[CommandContext<Command>], void>();

  handleCommand.use(CommandRule("raw", function(ctx: CommandContext<RawCommand>) {
    const newCommand = parseInstruction(ctx.command.content);
    if(newCommand) {
      return handleCommand({
        sender: ctx.sender,
        command: newCommand,
      });

    } else {
      ctx.sender.inform("Could not parse instruction");
    }
  }));

  handleCommand.use(CommandRule("look", function(ctx: CommandContext<LookCommand>) {
    engine.look({
      sender: ctx.sender,
    });
  }));

  handleCommand.use(CommandRule("go", function(ctx: CommandContext<GoCommand>) {
    engine.go({
      sender: ctx.sender,
      direction: ctx.command.direction,
    });
  }));

  handleCommand.otherwise(function(ctx: CommandContext<Command>) {
    ctx.sender.inform("Unrecognized command");
  });

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    const commandContext: CommandContext<Command> = {
      sender: player,
      command: command,
    };

    handleCommand(commandContext);
  });

});

console.log("Launched");
