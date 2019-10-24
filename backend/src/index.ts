
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN, Handler, Rule,
} from 'conditional-love';

import GameEngine from './GameEngine';

import {
  createWorld,
} from './world';
import { Command, RawCommand } from './models';



const engine = new GameEngine();

createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});


function parseInstruction(instruction: string): Command {
  return {
    name: instruction,
  };
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

  const player = {
    currentLocation: engine.locationMap["townSquare"].id,
  };

  const handleCommand = Dispatcher<[Command], void>();

  handleCommand.use(CommandRule("raw", function(cmd: RawCommand) {
    handleCommand(parseInstruction(cmd.content));
  }));

  handleCommand.use(CommandRule("look", function() {
    ws.send(engine.locationMap[player.currentLocation].getDescription())
  }));

  handleCommand.otherwise(()=> ws.send("What?"));

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    handleCommand(command);
  });

});

console.log("Launched");
