
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
  Command, RawCommand, GoCommand, Character,
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

function CommandRule<T extends Command>(name: string, handler: Handler<[T], void>) {
  function rule(cmd: Command): Handler<[Command], void> | undefined {
    if(cmd.name === name) {
      return function(_cmd: Command) {
        return handler(_cmd as T);
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

  const handleCommand = Dispatcher<[Command], void>();

  handleCommand.use(CommandRule("raw", function(cmd: RawCommand) {
    const newCommand = parseInstruction(cmd.content);
    if(newCommand) {
      return handleCommand(newCommand);
    } else {
      player.inform("Could not parse instruction");
    }
  }));

  handleCommand.use(CommandRule("look", function() {
    engine.look({sender: player});
  }));

  handleCommand.use(CommandRule("go", function(cmd: GoCommand) {
    engine.go({sender: player, direction: cmd.direction});
  }));

  handleCommand.otherwise(()=> player.inform("Unrecognized command"));

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    handleCommand(command);
  });

});

console.log("Launched");
