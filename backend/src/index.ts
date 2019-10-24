
import WebSocket from 'ws';

import GameEngine from './GameEngine';

import {
  createWorld,
} from './world';



const engine = new GameEngine();


createWorld({
  engine: engine,
});

const wss = new WebSocket.Server({
  port: 3000,
});

wss.on('connection', function connection(ws) {

  ws.on('message', function incoming(instruction) {
    ws.send(engine.locationMap["townSquare"].getDescription());
  });

});

console.log("Launched");
