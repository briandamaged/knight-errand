
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN, Handler, Rule, DO_NOTHING,
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
  const ctx = {
    raw: instruction,
    words: instruction.split(/\s+/),
  };

  return _parseInstruction(ctx);
}

interface ParsingContext {
  raw: string,
  words: string[],
}

const _parseInstruction = Dispatcher<[ParsingContext], Command | undefined>();

_parseInstruction.use(IF(
  (ctx)=> ctx.words[0] === "look",
  (ctx)=> ({
    name: "look",
  }),
));

_parseInstruction.use(IF(
  (ctx)=> ctx.words[0] === "go",
  (ctx)=> ({
    name: "go",
    direction: ctx.words[1],
  }),
));

for(const d of ["north", "south", "east", "west"]) {
  _parseInstruction.use(IF(
    (ctx)=> ctx.words[0] === d,
    (ctx)=> ({
      name: "go",
      direction: d,
    })
  ));
}

_parseInstruction.otherwise(RETURN(undefined));



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



wss.on('connection', function connection(ws) {

  const player = new Character({
    currentLocationID: "townSquare",
  });

  player.on('informed', function(message) {
    ws.send(message);
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
