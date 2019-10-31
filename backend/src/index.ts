
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN, Handler, Rule, DO_NOTHING,
} from 'conditional-love';

import GameEngine from './GameEngine';

import {createParser} from './Parser';

import {
  createWorld,
} from './world';

import {
  Command, RawCommand, GoCommand, Character, CommandContext, LookCommand, HelpCommand, AutoLookCommand, GetCommand,
} from './models';



const engine = new GameEngine();

createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});


const parseInstruction = createParser();


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

handleCommand.use(CommandRule("help", function(ctx: CommandContext<HelpCommand>) {
  ctx.sender.inform(`Here are some things you can try:
  - look
  - go north
  `);
}));

handleCommand.use(CommandRule("autolook", function(ctx: CommandContext<AutoLookCommand>) {
  ctx.sender.autolook = ctx.command.enabled;
  const state = (
    (ctx.command.enabled)
      ? "enabled"
      : "disabled"
  );

  ctx.sender.inform(`autolook ${state}`);
}));

handleCommand.use(CommandRule("get", function(ctx: CommandContext<GetCommand>) {
  engine.get({
    sender: ctx.sender,
    target: ctx.command.target,
  });
}));

handleCommand.otherwise(function(ctx: CommandContext<Command>) {
  ctx.sender.inform("Unrecognized command");
});



wss.on('connection', function connection(ws) {

  // FIXME: Ability to instantiate a Character without a currentLocationID
  const player = new Character({
    currentLocationID: "",
  });

  player.on('informed', function(message) {
    ws.send(message);
  });

  player.on('entered', function(this: Character, location) {
    if(this.autolook) {
      handleCommand({
        sender: player,
        command: {
          name: "look",
        }
      });
    }
  });

  engine.teleport({
    sender: player,
    locationID: "townSquare",
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
