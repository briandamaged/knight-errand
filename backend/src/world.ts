
import {
  Location,
} from './models';

import GameEngine from './GameEngine';

// Town Hall
// Church
// Clinic
// 



export function createWorld({engine}: {engine: GameEngine}): void {

  const townSquare = {
    id: "townSquare",
    getDescription() {
      return "It's more of a Village Oval, if we're being perfectly honest.";
    }
  };

  engine.addLocation(townSquare);
}

