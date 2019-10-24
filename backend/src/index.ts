
import WebSocket from 'ws';

import {
  Dispatcher,
  IF, RETURN,
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


wss.on('connection', function connection(ws) {

  const player = {
    currentLocation: engine.locationMap["townSquare"].id,
  };

  const handleCommand = Dispatcher<[Command], void>();

  handleCommand.use(IF(
    (cmd)=> cmd.name === "raw",
    (cmd)=> handleCommand(parseInstruction((cmd as RawCommand).content)),
  ));

  handleCommand.use(IF(
    (cmd)=> cmd.name === "look",
    (cmd)=> ws.send(engine.locationMap[player.currentLocation].getDescription())
  ));

  handleCommand.otherwise(()=> ws.send("What?"));

  ws.on('message', function incoming(serializedCommand) {
    // TODO: Error handling
    // TODO: This might explode if serializedCommand is a Buffer[]
    const command = JSON.parse(serializedCommand.toString());

    handleCommand(command);
  });

});

console.log("Launched");
