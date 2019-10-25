
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
      ws.send("Could not parse instruction");
    }
  }));

  handleCommand.use(CommandRule("look", function() {
    engine.look({sender: player});
  }));

  handleCommand.use(CommandRule("go", function(cmd: GoCommand) {
    const location = engine.locationMap[player.currentLocationID];

    if(location) {
      const destinationID = location.exits[cmd.direction];
      if(destinationID) {
        const destination = engine.locationMap[destinationID];
        if(destination) {
          player.currentLocationID = destination.id;
          ws.send("You walk valiantly!");
        } else {
          ws.send(`Could not load Location with id = ${JSON.stringify(destinationID)}`);
        }
      } else {
        ws.send("There does not appear to be an exit in that direction");
      }
    } else {
      ws.send("Somehow, you appear to be floating in the void.  How fun!")
    }
  }));

  handleCommand.otherwise(()=> ws.send("Unrecognized command"));

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    handleCommand(command);
  });

});

console.log("Launched");
